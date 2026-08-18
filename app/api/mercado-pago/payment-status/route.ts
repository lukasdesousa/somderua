// app/api/payment-status/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Payment } from "mercadopago";
import { handleMercadoPagoPayment } from "@/app/server/handle-payment";
import mpClient from "@/lib/mercado-pago";
import { isPackOfferId, packOffers } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");
    const mercadoPagoPaymentId = searchParams.get("payment_id") ?? searchParams.get("collection_id");

    if (!reference) {
      return NextResponse.json({ status: "missing_reference", error: "Missing reference" }, { status: 400 });
    }

    let payment = await findPaymentApproval(reference);

    if (!payment) {
      return NextResponse.json({ status: "not_found" });
    }

    let gatewayStatus: string | null = null;

    if (!payment.approved && isMercadoPagoPaymentId(mercadoPagoPaymentId)) {
      gatewayStatus = await reconcileMercadoPagoApproval(mercadoPagoPaymentId, reference);
      payment = await findPaymentApproval(reference);
    }

    const selectedOffer = payment?.approved ? await findPaymentOffer(reference) : null;

    return NextResponse.json({
      status: payment?.approved ?? false,
      paymentStatus: payment?.approved ? "approved" : gatewayStatus,
      offer: payment?.approved && selectedOffer
        ? {
            id: selectedOffer.id,
            name: selectedOffer.analyticsName,
            price: selectedOffer.price,
            priceCents: selectedOffer.priceCents,
            productId: selectedOffer.productId,
          }
        : null,
    });
  } catch (error) {
    console.error("[MP Status] Unhandled status error:", error);
    return NextResponse.json(
      { status: false, error: "STATUS_CHECK_FAILED" },
      { status: 500 },
    );
  }
}

async function findPaymentApproval(reference: string): Promise<{ approved: boolean } | null> {
  return prisma.user_payment.findUnique({
    where: { id: reference },
    select: {
      approved: true,
    },
  });
}

async function findPaymentOffer(reference: string) {
  try {
    const payment = await prisma.user_payment.findUnique({
      where: { id: reference },
      select: {
        offerId: true,
      },
    });
    const offerId = payment?.offerId;

    return isPackOfferId(offerId) ? packOffers[offerId] : null;
  } catch (error) {
    console.warn("[MP Status] Offer fields unavailable; returning approval without offer analytics", error);
    return null;
  }
}

async function reconcileMercadoPagoApproval(paymentId: string, expectedReference: string): Promise<string | null> {
  try {
    const mercadoPagoPayment = new Payment(mpClient);
    const paymentData = await mercadoPagoPayment.get({ id: paymentId });

    if (!paymentData || (paymentData.status !== "approved" && !paymentData.date_approved)) {
      return paymentData?.status ?? null;
    }

    const paymentReference = paymentData.metadata?.id ?? paymentData.external_reference;

    if (paymentReference !== expectedReference) {
      console.warn("[MP Status] Payment reference mismatch; approval reconciliation skipped", {
        expectedReference,
        paymentReference,
      });
      return paymentData.status ?? null;
    }

    await handleMercadoPagoPayment(paymentData, { throwOnPurchaseEmailError: false });
    return "approved";
  } catch (error) {
    console.error("[MP Status] Error reconciling Mercado Pago approval:", error);
    return null;
  }
}

function isMercadoPagoPaymentId(paymentId: string | null): paymentId is string {
  return Boolean(paymentId && /^\d+$/.test(paymentId));
}
