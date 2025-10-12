// app/server/handle-payment.ts
import "server-only";
import { PrismaClient } from "@prisma/client";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

const prisma = new PrismaClient();

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  try {
    const metadata = paymentData.metadata;
    const paymentStatus = paymentData.status;

    // O id do pagamento no seu sistema
    const internalId = metadata?.id;

    if (!internalId) {
      console.warn("[MP Handler] Metadata id is missing:", paymentData);
      return;
    }

    console.log("[MP Handler] Handling payment for id:", internalId, "Status:", paymentStatus);

    if (paymentStatus === "approved") {
      // Atualiza status do pagamento no banco
      await prisma.user_payment.update({
        where: { id: internalId },
        data: {
          approved: true,
          payment_method: paymentData.payment_method_id || null,
        },
      });
      console.log(`[MP Handler] Payment ${internalId} marked as approved`);
    } else {
      console.log(`[MP Handler] Payment ${internalId} is not approved yet: ${paymentStatus}`);
    }
  } catch (error) {
    console.error("[MP Handler] Error handling payment:", (error as Error).message);
    throw error; // opcional: pode lançar para o webhook logar
  }
}
