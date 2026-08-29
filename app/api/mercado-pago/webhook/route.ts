import { NextResponse } from "next/server";
import { handleMercadoPagoPayment } from "@/app/server/handle-payment";
import { getMercadoPagoPayment, verifyMercadoPagoSignature } from "@/lib/mercado-pago";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_WEBHOOK_BYTES = 32_768;

export async function POST(request: Request) {
  const signatureError = verifyMercadoPagoSignature(request);
  if (signatureError) return signatureError;

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_WEBHOOK_BYTES) {
    return NextResponse.json({ received: false, error: "Payload too large" }, { status: 413 });
  }

  try {
    const body: unknown = await request.json();

    if (!isRecord(body) || typeof body.type !== "string" || !isRecord(body.data)) {
      return NextResponse.json({ received: false, error: "Invalid payload" }, { status: 400 });
    }

    if (body.type !== "payment") {
      console.info("[MP Webhook] Event ignored", { eventType: body.type });
      return NextResponse.json({ received: true, ignored: true });
    }

    const paymentId = normalizePaymentId(body.data.id);
    if (!paymentId) {
      return NextResponse.json({ received: false, error: "Invalid payment id" }, { status: 400 });
    }

    const signedPaymentId = new URL(request.url).searchParams.get("data.id")?.toLowerCase();
    if (signedPaymentId && signedPaymentId !== paymentId.toLowerCase()) {
      console.warn("[MP Webhook] Signed payment id does not match payload", { paymentId });
      return NextResponse.json({ received: false, error: "Payment id mismatch" }, { status: 400 });
    }

    console.info("[MP Webhook] Payment event received", {
      paymentId,
      action: typeof body.action === "string" ? body.action : null,
    });

    const paymentData = await getMercadoPagoPayment(paymentId);
    const result = await handleMercadoPagoPayment(paymentData, {
      throwOnPurchaseEmailError: false,
    });

    if (!result.handled) {
      console.warn("[MP Webhook] Payment event was acknowledged without an order update", {
        paymentId,
        orderId: result.orderId,
        reason: result.reason,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[MP Webhook] Error handling webhook", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

function normalizePaymentId(value: unknown): string | null {
  if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) return String(value);
  if (typeof value === "string" && /^\d+$/.test(value)) return value;
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
