import "server-only";
import { PrismaClient } from "@prisma/client";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { abandonedCartLogger } from "@/lib/abandoned-cart/logger";
import { cancelAbandonedCartRecoveryEmail } from "@/lib/abandoned-cart/mailer";
import { sendPurchaseEmail } from "@/lib/sendEmail";

const prisma = new PrismaClient();
const PURCHASE_EMAIL_PROCESSING_TIMEOUT_MS = 10 * 60 * 1000;

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  try {
    const metadata = paymentData.metadata;
    const paymentStatus = paymentData.status;
    const internalId = metadata?.id ?? paymentData.external_reference;

    if (!internalId) {
      console.warn("[MP Handler] Metadata id is missing:", paymentData);
      return;
    }

    console.log("[MP Handler] Handling payment for id:", internalId, "Status:", paymentStatus);

    if (paymentStatus !== "approved") {
      console.log(`[MP Handler] Payment ${internalId} is not approved yet: ${paymentStatus}`);
      return;
    }

    const payment = await prisma.user_payment.update({
      where: { id: internalId },
      data: {
        approved: true,
        payment_method: paymentData.payment_method_id || null,
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

    console.log(`[MP Handler] Payment ${internalId} marked as approved`);

    if (
      payment.abandonedCartEmailId &&
      payment.abandonedCartEmailScheduledAt &&
      !payment.abandonedCartEmailCanceledAt &&
      !payment.abandonedCartEmailSentAt
    ) {
      await cancelScheduledAbandonedCartEmail(payment.id, payment.abandonedCartEmailId);
    }

    await sendApprovedPurchaseEmailIfNeeded(payment.id, payment.email);
  } catch (error) {
    console.error("[MP Handler] Error handling payment:", (error as Error).message);
    throw error;
  }
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
    console.log(`[MP Handler] Purchase email already sent or being processed for payment ${paymentId}`);
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

    console.log(`[MP Handler] Purchase email sent for payment ${paymentId}`);
  } catch (error) {
    await resetPurchaseEmailProcessing(paymentId);
    console.error("[MP Handler] Error sending purchase email:", (error as Error).message);
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
    console.error("[MP Handler] Error resetting purchase email processing:", (error as Error).message);
  }
}

async function cancelScheduledAbandonedCartEmail(paymentId: string, messageId: string): Promise<void> {
  try {
    await cancelAbandonedCartRecoveryEmail(messageId);
    await prisma.user_payment.update({
      where: { id: paymentId },
      data: {
        abandonedCartEmailCanceledAt: new Date(),
      },
    });

    abandonedCartLogger.info("email.canceled_after_payment", {
      paymentId,
      messageId,
    });
  } catch (error) {
    abandonedCartLogger.error("email.cancel_after_payment_failed", error, {
      paymentId,
      messageId,
    });
  }
}
