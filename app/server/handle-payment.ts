import "server-only";
import { PrismaClient } from "@prisma/client";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { abandonedCartLogger } from "@/lib/abandoned-cart/logger";
import { cancelAbandonedCartRecoveryEmail } from "@/lib/abandoned-cart/mailer";

const prisma = new PrismaClient();

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  try {
    const metadata = paymentData.metadata;
    const paymentStatus = paymentData.status;
    const internalId = metadata?.id;

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
        abandonedCartEmailId: true,
        abandonedCartEmailCanceledAt: true,
      },
    });

    console.log(`[MP Handler] Payment ${internalId} marked as approved`);

    if (payment.abandonedCartEmailId && !payment.abandonedCartEmailCanceledAt) {
      await cancelScheduledAbandonedCartEmail(payment.id, payment.abandonedCartEmailId);
    }
  } catch (error) {
    console.error("[MP Handler] Error handling payment:", (error as Error).message);
    throw error;
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
