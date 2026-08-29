import { NextResponse } from "next/server";
import { handleMercadoPagoPayment } from "@/app/server/handle-payment";
import { getMercadoPagoPayment } from "@/lib/mercado-pago";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("payment_id");
    const externalReference = searchParams.get("external_reference");

    if (!paymentId || !/^\d+$/.test(paymentId) || !externalReference) {
      return NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 });
    }

    const paymentData = await getMercadoPagoPayment(paymentId);
    const result = await handleMercadoPagoPayment(paymentData, {
      throwOnPurchaseEmailError: false,
    });

    if (!result.handled || result.orderId !== externalReference || !result.status) {
      console.warn("[MP Pending] Payment reconciliation failed", {
        expectedReference: externalReference,
        paymentId,
        reason: result.reason,
      });
      return redirectTo(request, "/pagamento-recusado", {
        status: "reference_mismatch",
        external_reference: externalReference,
      });
    }

    if (result.status === "APPROVED") {
      return redirectTo(request, "/download", {
        reference: externalReference,
        payment_id: paymentId,
      });
    }

    if (isRejectedPaymentStatus(result.status)) {
      return redirectTo(request, "/pagamento-recusado", {
        external_reference: externalReference,
        payment_id: paymentId,
        status: result.status.toLowerCase(),
      });
    }

    return redirectTo(request, "/pagamento-pendente", {
      external_reference: externalReference,
      payment_id: paymentId,
      status: result.status.toLowerCase(),
    });
  } catch (error) {
    console.error("[MP Pending] Failed to reconcile payment", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json({ error: "Failed to check payment status" }, { status: 500 });
  }
}

function redirectTo(request: Request, pathname: string, params: Record<string, string>) {
  const url = new URL(pathname, request.url);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return NextResponse.redirect(url);
}

function isRejectedPaymentStatus(status: string): boolean {
  return ["CANCELLED", "REJECTED", "EXPIRED", "REFUNDED", "CHARGEBACK"].includes(status);
}
