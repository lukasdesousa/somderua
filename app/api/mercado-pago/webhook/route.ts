// app/api/mercadopago-webhook/route.ts
import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient, { verifyMercadoPagoSignature } from "@/lib/mercado-pago";
import { handleMercadoPagoPayment } from "@/app/server/handle-payment";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Valida assinatura (segurança)
    verifyMercadoPagoSignature(request);

    const body = await request.json();
    const { type, data } = body;

    console.log("[MP Webhook] Event received:", type, data);

    if (type === "payment") {
      // Busca dados completos do pagamento
      const payment = new Payment(mpClient);
      const paymentData = await payment.get({ id: data.id });

      if (!paymentData) {
        console.warn(`[MP Webhook] Payment ${data.id} not found`);
        return NextResponse.json({ received: false, error: "Payment not found" }, { status: 404 });
      }

      // Se aprovado (cartão) ou PIX já confirmado
      if (paymentData.status === "approved" || paymentData.date_approved) {
        await handleMercadoPagoPayment(paymentData);
        console.log(`[MP Webhook] Payment ${data.id} approved, handled successfully`);
      } else {
        console.log(`[MP Webhook] Payment ${data.id} is in status: ${paymentData.status}`);
      }
    } else {
      console.log(`[MP Webhook] Unhandled event type: ${type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[MP Webhook] Error handling webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
