// app/api/mercadopago-webhook/route.ts
import { NextResponse } from "next/server";
import { getMercadoPagoPayment, verifyMercadoPagoSignature } from "@/lib/mercado-pago";
import { handleMercadoPagoPayment } from "@/app/server/handle-payment";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const signatureError = verifyMercadoPagoSignature(request);

    if (signatureError) {
      return signatureError;
    }

    const body = await request.json();
    const { type, data } = body;
    const paymentId = data?.id;

    console.log("[MP Webhook] Event received:", type, data);

    if (type === "payment") {
      if (!paymentId) {
        return NextResponse.json({ received: false, error: "Missing payment id" }, { status: 400 });
      }

      const paymentData = await getMercadoPagoPayment(paymentId);

      if (!paymentData) {
        console.warn(`[MP Webhook] Payment ${paymentId} not found`);
        return NextResponse.json({ received: false, error: "Payment not found" }, { status: 404 });
      }

      if (paymentData.status === "approved" || paymentData.date_approved) {
        await handleMercadoPagoPayment(paymentData);
        console.log(`[MP Webhook] Payment ${paymentId} approved, handled successfully`);
      } else {
        console.log(`[MP Webhook] Payment ${paymentId} is in status: ${paymentData.status}`);
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
