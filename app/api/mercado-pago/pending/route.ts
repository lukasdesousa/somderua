// app/api/mercado-pago/pending/route.ts
import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient from "@/lib/mercado-pago";
import { handleMercadoPagoPayment } from "@/app/server/handle-payment";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // IDs necessários
    const paymentId = searchParams.get("payment_id");
    const externalRef = searchParams.get("external_reference");

    if (!paymentId || !externalRef) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Obtém o status real do pagamento via SDK
    const payment = new Payment(mpClient);
    const paymentData = await payment.get({ id: paymentId });

    if (!paymentData || !paymentData.status) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const paymentReference = paymentData.metadata?.id ?? paymentData.external_reference;

    if (paymentReference !== externalRef) {
      console.warn("[MP Pending] Payment reference mismatch", {
        expectedReference: externalRef,
        paymentReference,
      });
      return NextResponse.redirect(new URL(`/pagamento-recusado?status=reference_mismatch&external_reference=${externalRef}`, request.url));
    }

    if (paymentData.status === "approved" || paymentData.date_approved) {
      await handleMercadoPagoPayment(paymentData, { throwOnPurchaseEmailError: false });
      return NextResponse.redirect(new URL(`/download?reference=${externalRef}&payment_id=${paymentId}`, request.url));
    }

    if (isRejectedPaymentStatus(paymentData.status)) {
      return NextResponse.redirect(
        new URL(
          `/pagamento-recusado?external_reference=${externalRef}&payment_id=${paymentId}&status=${paymentData.status}`,
          request.url
        )
      );
    }

    return NextResponse.redirect(
      new URL(
        `/pagamento-pendente?external_reference=${externalRef}&payment_id=${paymentId}&status=${paymentData.status}`,
        request.url
      )
    );
  } catch (error) {
    console.error("Erro ao processar rota /pending:", error);
    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}

function isRejectedPaymentStatus(status: string): boolean {
  return ["cancelled", "rejected", "refunded", "charged_back"].includes(status);
}
