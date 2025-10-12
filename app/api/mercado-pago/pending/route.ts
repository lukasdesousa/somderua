// app/api/mercado-pago/pending/route.ts
import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient from "@/lib/mercado-pago";

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

    // Se o pagamento foi aprovado (por PIX instantâneo, por ex.), redireciona para o download
    if (paymentData.status === "approved" || paymentData.date_approved) {
      return NextResponse.redirect(new URL(`/download?payment_id=${paymentId}`, request.url));
    }

    // Caso contrário, envia para a página de pagamento pendente
    return NextResponse.redirect(
      new URL(
        `/pagamento-pendente?external_reference=${externalRef}&status=${paymentData.status}`,
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
