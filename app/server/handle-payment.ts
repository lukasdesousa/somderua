import "server-only";

import type { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { abandonedCartLogger } from "@/lib/abandoned-cart/logger";
import { cancelAbandonedCartRecoveryEmail } from "@/lib/abandoned-cart/mailer";
import {
  isTerminalPaymentStatus,
  mapMercadoPagoStatus,
  resolvePaymentStatus,
  validatePaymentIntegrity,
  type InternalPaymentStatus,
} from "@/lib/payments/core";
import { createPrismaClient } from "@/lib/prisma";
import { sendPurchaseEmail } from "@/lib/sendEmail";

const prisma = createPrismaClient();
const PURCHASE_EMAIL_PROCESSING_TIMEOUT_MS = 10 * 60 * 1000;

type HandleMercadoPagoPaymentOptions = {
  throwOnPurchaseEmailError?: boolean;
};

export type PaymentHandlingResult = {
  handled: boolean;
  orderId: string | null;
  status: InternalPaymentStatus | null;
  reason?: "missing_reference" | "order_not_found" | "integrity_violation" | "payment_id_conflict";
  violations?: string[];
};

export async function handleMercadoPagoPayment(
  paymentData: PaymentResponse,
  options: HandleMercadoPagoPaymentOptions = {},
): Promise<PaymentHandlingResult> {
  const { throwOnPurchaseEmailError = true } = options;
  const internalId = paymentData.external_reference;
  const providerPaymentId = paymentData.id === undefined ? null : String(paymentData.id);

  if (!internalId || !providerPaymentId) {
    console.warn("[MP Handler] Payment ignored because its reference or provider id is missing");
    return { handled: false, orderId: internalId ?? null, status: null, reason: "missing_reference" };
  }

  const payment = await prisma.user_payment.findUnique({
    where: { id: internalId },
    select: {
      id: true,
      email: true,
      approved: true,
      status: true,
      provider: true,
      checkoutMode: true,
      currency: true,
      amountCents: true,
      offerPriceCents: true,
      offerId: true,
      digitalProductId: true,
      mpPaymentId: true,
      pixExpiresAt: true,
      paidAt: true,
      fulfilledAt: true,
      abandonedCartEmailId: true,
      abandonedCartEmailScheduledAt: true,
      abandonedCartEmailCanceledAt: true,
      abandonedCartEmailSentAt: true,
    },
  });

  if (!payment || payment.provider !== "MERCADO_PAGO") {
    console.warn("[MP Handler] Payment reference does not belong to a Mercado Pago order", {
      orderId: internalId,
      paymentId: providerPaymentId,
    });
    return { handled: false, orderId: internalId, status: null, reason: "order_not_found" };
  }

  const orderEmail = payment.email?.trim().toLowerCase();
  const providerPayerEmail = paymentData.payer?.email?.trim().toLowerCase();

  // Mercado Pago requires payer.email when creating a Pix, but the value
  // returned by the provider is not a stable payment identity. Keep this as a
  // sanitized diagnostic only; financial integrity is verified below.
  if (
    payment.checkoutMode === "PIX"
    && orderEmail
    && providerPayerEmail
    && providerPayerEmail !== orderEmail
  ) {
    console.warn("[MP Handler] Provider payer email differs from checkout email", {
      orderId: internalId,
      paymentId: providerPaymentId,
    });
  }

  const violations = validatePaymentIntegrity(paymentData, {
    orderId: payment.id,
    paymentId: payment.mpPaymentId,
    amountCents: payment.amountCents ?? payment.offerPriceCents,
    currency: payment.currency,
    offerId: payment.offerId,
    productId: payment.digitalProductId,
    checkoutMode: payment.checkoutMode,
    requireLiveMode: process.env.NODE_ENV === "production",
  });

  if (violations.length > 0) {
    console.error("[MP Handler] Payment integrity validation failed", {
      orderId: internalId,
      paymentId: providerPaymentId,
      violations: violations.join(","),
    });
    return {
      handled: false,
      orderId: internalId,
      status: null,
      reason: "integrity_violation",
      violations,
    };
  }

  const paymentIdOwner = await prisma.user_payment.findUnique({
    where: { mpPaymentId: providerPaymentId },
    select: { id: true },
  });

  if (paymentIdOwner && paymentIdOwner.id !== internalId) {
    console.error("[MP Handler] Provider payment id is already linked to another order", {
      orderId: internalId,
      paymentId: providerPaymentId,
    });
    return { handled: false, orderId: internalId, status: null, reason: "payment_id_conflict" };
  }

  const incomingStatus = mapMercadoPagoStatus(paymentData.status, paymentData.status_detail);
  const finalStatus = resolvePaymentStatus(payment.status, payment.approved, incomingStatus);
  const now = new Date();
  const approved = finalStatus === "APPROVED";
  const paidAt = approved
    ? payment.paidAt ?? parseProviderDate(paymentData.date_approved) ?? now
    : payment.paidAt;

  const updatedPayment = await prisma.user_payment.update({
    where: { id: internalId },
    data: {
      mpPaymentId: providerPaymentId,
      status: finalStatus,
      statusDetail: paymentData.status_detail ?? null,
      approved,
      payment_method: paymentData.payment_method_id ?? null,
      pixExpiresAt: parseProviderDate(paymentData.date_of_expiration) ?? payment.pixExpiresAt,
      paidAt,
      fulfilledAt: approved ? payment.fulfilledAt ?? now : payment.fulfilledAt,
      lastProviderSyncAt: now,
      ...(isTerminalPaymentStatus(finalStatus) ? { activeCheckoutKey: null } : {}),
    },
    select: {
      id: true,
      email: true,
      abandonedCartEmailId: true,
      abandonedCartEmailScheduledAt: true,
      abandonedCartEmailCanceledAt: true,
      abandonedCartEmailSentAt: true,
    },
  });

  console.info("[MP Handler] Payment state reconciled", {
    orderId: internalId,
    paymentId: providerPaymentId,
    status: finalStatus,
  });

  if (approved) {
    if (
      updatedPayment.abandonedCartEmailId
      && updatedPayment.abandonedCartEmailScheduledAt
      && !updatedPayment.abandonedCartEmailCanceledAt
      && !updatedPayment.abandonedCartEmailSentAt
    ) {
      await cancelScheduledAbandonedCartEmail(updatedPayment.id, updatedPayment.abandonedCartEmailId);
    }

    try {
      await sendApprovedPurchaseEmailIfNeeded(updatedPayment.id, updatedPayment.email);
    } catch (emailError) {
      console.error("[MP Handler] Approved payment saved, but purchase email failed", {
        orderId: internalId,
        errorName: emailError instanceof Error ? emailError.name : "UnknownError",
      });

      if (throwOnPurchaseEmailError) throw emailError;
    }
  }

  return { handled: true, orderId: internalId, status: finalStatus };
}

function parseProviderDate(value?: string): Date | null {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function sendApprovedPurchaseEmailIfNeeded(paymentId: string, email: string | null): Promise<void> {
  const recipient = email?.trim().toLowerCase();

  if (!recipient) {
    console.warn(`[MP Handler] Payment ${paymentId} approved without customer email; purchase email skipped`);
    return;
  }

  const processingCutoff = new Date(Date.now() - PURCHASE_EMAIL_PROCESSING_TIMEOUT_MS);
  const claim = await prisma.user_payment.updateMany({
    where: {
      id: paymentId,
      purchaseEmailSentAt: null,
      OR: [
        { purchaseEmailProcessingAt: null },
        { purchaseEmailProcessingAt: { lt: processingCutoff } },
      ],
    },
    data: {
      purchaseEmailProcessingAt: new Date(),
    },
  });

  if (claim.count === 0) {
    console.info(`[MP Handler] Purchase email already sent or being processed for payment ${paymentId}`);
    return;
  }

  try {
    const delivery = await sendPurchaseEmail(recipient, paymentId);

    await prisma.user_payment.update({
      where: { id: paymentId },
      data: {
        purchaseEmailId: delivery.messageId,
        purchaseEmailSentAt: new Date(),
        purchaseEmailProcessingAt: null,
      },
    });

    console.info(`[MP Handler] Purchase email sent for payment ${paymentId}`);
  } catch (error) {
    await resetPurchaseEmailProcessing(paymentId);
    console.error("[MP Handler] Error sending purchase email", {
      orderId: paymentId,
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    throw error;
  }
}

async function resetPurchaseEmailProcessing(paymentId: string): Promise<void> {
  try {
    await prisma.user_payment.update({
      where: { id: paymentId },
      data: {
        purchaseEmailProcessingAt: null,
      },
    });
  } catch (error) {
    console.error("[MP Handler] Error resetting purchase email processing", {
      orderId: paymentId,
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
  }
}

async function cancelScheduledAbandonedCartEmail(paymentId: string, messageId: string): Promise<void> {
  const claim = await prisma.user_payment.updateMany({
    where: {
      id: paymentId,
      abandonedCartEmailId: messageId,
      abandonedCartEmailCanceledAt: null,
      abandonedCartEmailSentAt: null,
      abandonedCartEmailProcessingAt: null,
    },
    data: { abandonedCartEmailProcessingAt: new Date() },
  });

  if (claim.count === 0) return;

  try {
    await cancelAbandonedCartRecoveryEmail(messageId);
    await prisma.user_payment.update({
      where: { id: paymentId },
      data: {
        abandonedCartEmailCanceledAt: new Date(),
        abandonedCartEmailProcessingAt: null,
      },
    });

    abandonedCartLogger.info("email.canceled_after_payment", {
      paymentId,
      messageId,
    });
  } catch (error) {
    try {
      await prisma.user_payment.updateMany({
        where: { id: paymentId, abandonedCartEmailCanceledAt: null },
        data: { abandonedCartEmailProcessingAt: null },
      });
    } catch (resetError) {
      abandonedCartLogger.error("email.cancel_claim_reset_failed", resetError, {
        paymentId,
        messageId,
      });
    }
    abandonedCartLogger.error("email.cancel_after_payment_failed", error, {
      paymentId,
      messageId,
    });
  }
}
