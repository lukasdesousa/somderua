import { NextRequest, NextResponse } from "next/server";
import { createPrismaClient } from "@/lib/prisma";
import { getPackDownloadUrl } from "@/lib/pack-downloads";
import { getOrderAccessCookieName, verifyOrderAccessToken } from "@/lib/payments/access";
import { requiresSignedOrderAccess } from "@/lib/payments/access-policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma = createPrismaClient();
const privateResponseHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Pedido não informado" }, { status: 400 });
  }

  try {
    const payment = await prisma.user_payment.findUnique({
      where: { id: reference },
      select: {
        approved: true,
        offerId: true,
        checkoutMode: true,
        orderAccessVersion: true,
      },
    });

    if (
      payment
      && requiresSignedOrderAccess(payment)
      && !await verifyOrderAccessToken(
        searchParams.get("access_token")
          ?? req.cookies.get(getOrderAccessCookieName(reference))?.value
          ?? null,
        reference,
      )
    ) {
      return NextResponse.json(
        { error: "Acesso não autorizado" },
        { status: 403, headers: privateResponseHeaders },
      );
    }

    if (!payment?.approved) {
      return NextResponse.json(
        { error: "Pagamento não aprovado" },
        { status: 403, headers: privateResponseHeaders },
      );
    }

    const downloadUrl = getPackDownloadUrl(payment.offerId);

    if (!downloadUrl) {
      console.error("[Download] Approved order has an invalid offer", {
        orderId: reference,
        offerId: payment.offerId,
      });
      return NextResponse.json(
        { error: "Não foi possível identificar o arquivo deste pedido" },
        { status: 500, headers: privateResponseHeaders },
      );
    }

    return NextResponse.json(
      { url: downloadUrl },
      { headers: privateResponseHeaders },
    );
  } catch (err) {
    console.error("[Download] Failed to generate download URL", {
      orderId: reference,
      errorName: err instanceof Error ? err.name : "UnknownError",
    });
    return NextResponse.json(
      { error: "Erro ao gerar URL de download" },
      { status: 500, headers: privateResponseHeaders },
    );
  }
}
