import { NextRequest, NextResponse } from "next/server";
import { handleMercadoPagoPayment } from "@/app/server/handle-payment";
import { getMercadoPagoPayment } from "@/lib/mercado-pago";
import { getOrderAccessCookieName, verifyOrderAccessToken } from "@/lib/payments/access";
import { requiresSignedOrderAccess } from "@/lib/payments/access-policy";
import { isTerminalPaymentStatus } from "@/lib/payments/core";
import { extractMercadoPagoPixData, type PixDisplayData } from "@/lib/payments/pix";
import { createPrismaClient } from "@/lib/prisma";
import { isPackOfferId, packOffers } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma = createPrismaClient();
const PROVIDER_SYNC_INTERVAL_MS = 15_000;
const PRIVATE_HEADERS = { "Cache-Control": "private, no-store, max-age=0" };

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");
    const requestedPaymentId = searchParams.get("payment_id") ?? searchParams.get("collection_id");
    const includePix = searchParams.get("include_pix") === "1";

    if (!reference) {
      return NextResponse.json(
        { status: "missing_reference", error: "Missing reference" },
        { status: 400, headers: PRIVATE_HEADERS },
      );
    }

    let payment = await findPayment(reference);

    if (!payment) {
      return NextResponse.json({ status: "not_found" }, { headers: PRIVATE_HEADERS });
    }

    if (
      requiresSignedOrderAccess(payment)
      && !await verifyOrderAccessToken(
        searchParams.get("access_token")
          ?? request.cookies.get(getOrderAccessCookieName(reference))?.value
          ?? null,
        reference,
      )
    ) {
      return NextResponse.json(
        { error: "Acesso não autorizado" },
        { status: 403, headers: PRIVATE_HEADERS },
      );
    }

    // The old schema used `approved` as the source of truth. Heal any row
    // caught between that representation and the newer status state machine
    // without delaying an already entitled customer on a provider request.
    if (payment.approved && !isTerminalPaymentStatus(payment.status)) {
      await prisma.user_payment.updateMany({
        where: {
          id: payment.id,
          approved: true,
          status: payment.status,
        },
        data: {
          status: "APPROVED",
          activeCheckoutKey: null,
        },
      });
      payment = await findPayment(reference) ?? payment;
    }

    let pix: PixDisplayData | null = null;
    const providerPaymentId = getProviderPaymentId(payment, requestedPaymentId);
    const shouldSync = providerPaymentId
      && !payment.approved
      && !isTerminalPaymentStatus(payment.status)
      && (includePix || await claimProviderSync(payment.id, payment.lastProviderSyncAt));

    if (shouldSync && providerPaymentId) {
      try {
        const providerPayment = await getMercadoPagoPayment(providerPaymentId);
        const result = await handleMercadoPagoPayment(providerPayment, {
          throwOnPurchaseEmailError: false,
        });

        if (result.handled && includePix) {
          pix = extractMercadoPagoPixData(providerPayment);
        }
      } catch (error) {
        console.error("[MP Status] Provider reconciliation failed", {
          orderId: reference,
          paymentId: providerPaymentId,
          errorName: error instanceof Error ? error.name : "UnknownError",
        });
      }

      payment = await findPayment(reference) ?? payment;
    }

    const selectedOffer = payment.approved && isPackOfferId(payment.offerId)
      ? packOffers[payment.offerId]
      : null;

    return NextResponse.json(
      {
        status: payment.approved,
        orderStatus: payment.status,
        paymentStatus: payment.status.toLowerCase(),
        statusDetail: payment.statusDetail,
        expiresAt: pix?.expiresAt ?? payment.pixExpiresAt?.toISOString() ?? null,
        pix: includePix && pix?.qrCode && pix.qrCodeBase64
          ? {
              qrCode: pix.qrCode,
              qrCodeBase64: pix.qrCodeBase64,
            }
          : null,
        offer: selectedOffer
          ? {
              id: selectedOffer.id,
              name: selectedOffer.analyticsName,
              price: selectedOffer.price,
              priceCents: selectedOffer.priceCents,
              productId: selectedOffer.productId,
            }
          : null,
      },
      { headers: PRIVATE_HEADERS },
    );
  } catch (error) {
    console.error("[MP Status] Unhandled status error", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json(
      { status: false, error: "STATUS_CHECK_FAILED" },
      { status: 500, headers: PRIVATE_HEADERS },
    );
  }
}

async function findPayment(reference: string) {
  return prisma.user_payment.findUnique({
    where: { id: reference },
    select: {
      id: true,
      approved: true,
      status: true,
      statusDetail: true,
      checkoutMode: true,
      orderAccessVersion: true,
      mpPaymentId: true,
      offerId: true,
      pixExpiresAt: true,
      lastProviderSyncAt: true,
    },
  });
}

function getProviderPaymentId(
  payment: Awaited<ReturnType<typeof findPayment>>,
  requestedPaymentId: string | null,
): string | null {
  if (!payment) return null;
  if (payment.mpPaymentId && /^\d+$/.test(payment.mpPaymentId)) return payment.mpPaymentId;

  // Checkout Pro only learns the real payment id after redirect or webhook.
  // The reconciliation handler still requires the provider's external_reference,
  // amount and currency to match this exact order before it can approve anything.
  if (payment.checkoutMode === "HOSTED" && requestedPaymentId && /^\d+$/.test(requestedPaymentId)) {
    return requestedPaymentId;
  }

  return null;
}

async function claimProviderSync(orderId: string, lastProviderSyncAt: Date | null): Promise<boolean> {
  const cutoff = new Date(Date.now() - PROVIDER_SYNC_INTERVAL_MS);
  if (lastProviderSyncAt && lastProviderSyncAt > cutoff) return false;

  const claim = await prisma.user_payment.updateMany({
    where: {
      id: orderId,
      OR: [
        { lastProviderSyncAt: null },
        { lastProviderSyncAt: { lt: cutoff } },
      ],
    },
    data: { lastProviderSyncAt: new Date() },
  });

  return claim.count === 1;
}
