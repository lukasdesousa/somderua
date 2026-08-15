// app/api/payment-status/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Payment } from "mercadopago";
import { handleMercadoPagoPayment } from "@/app/server/handle-payment";
import mpClient from "@/lib/mercado-pago";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  const mercadoPagoPaymentId = searchParams.get("payment_id") ?? searchParams.get("collection_id");

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  let payment = await prisma.user_payment.findUnique({
    where: { id: reference },
  });

  if (!payment) {
    return NextResponse.json({ status: "not_found" });
  }

  if (!payment.approved && isMercadoPagoPaymentId(mercadoPagoPaymentId)) {
    await reconcileMercadoPagoApproval(mercadoPagoPaymentId, reference);

    payment = await prisma.user_payment.findUnique({
      where: { id: reference },
    });
  }

  return NextResponse.json({ status: payment?.approved ?? false });
}

async function reconcileMercadoPagoApproval(paymentId: string, expectedReference: string): Promise<void> {
  try {
    const mercadoPagoPayment = new Payment(mpClient);
    const paymentData = await mercadoPagoPayment.get({ id: paymentId });

    if (!paymentData || (paymentData.status !== "approved" && !paymentData.date_approved)) {
      return;
    }

    const paymentReference = paymentData.metadata?.id ?? paymentData.external_reference;

    if (paymentReference !== expectedReference) {
      console.warn("[MP Status] Payment reference mismatch; approval reconciliation skipped", {
        expectedReference,
        paymentReference,
      });
      return;
    }

    await handleMercadoPagoPayment(paymentData);
  } catch (error) {
    console.error("[MP Status] Error reconciling Mercado Pago approval:", error);
  }
}

function isMercadoPagoPaymentId(paymentId: string | null): paymentId is string {
  return Boolean(paymentId && /^\d+$/.test(paymentId));
}
