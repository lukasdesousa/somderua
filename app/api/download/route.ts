import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPrismaClient } from "@/lib/prisma";
import { getOrderAccessCookieName, verifyOrderAccessToken } from "@/lib/payments/access";
import { digitalProduct } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma = createPrismaClient();
const allowedDownloadFiles = new Set<string>([digitalProduct.deliveryFile]);
const ESSENTIAL_PACK_DOWNLOAD_URL = new URL(
  "https://drive.google.com/drive/folders/1NoE9C7L7VwGNDFTDmF4iDuS4y9uG8Sg8?usp=drive_link",
).toString();
const privateResponseHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  const key = searchParams.get("file") ?? digitalProduct.deliveryFile;

  if (!reference) {
    return NextResponse.json({ error: "Pedido não informado" }, { status: 400 });
  }

  if (!allowedDownloadFiles.has(key)) {
    return NextResponse.json({ error: "Arquivo não autorizado" }, { status: 403 });
  }

  try {
    const payment = await prisma.user_payment.findUnique({
      where: { id: reference },
      select: {
        approved: true,
        offerId: true,
        checkoutMode: true,
      },
    });

    if (
      payment?.checkoutMode === "PIX"
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

    // The delivery is chosen only from the offer stored with the approved payment.
    // Complete and legacy payments keep the existing R2 delivery below.
    if (payment.offerId === "essencial") {
      return NextResponse.json(
        { url: ESSENTIAL_PACK_DOWNLOAD_URL },
        { headers: privateResponseHeaders },
      );
    }

    if (
      !process.env.R2_ENDPOINT?.trim() ||
      !process.env.R2_ACCESS_KEY_ID?.trim() ||
      !process.env.R2_SECRET_ACCESS_KEY?.trim() ||
      !process.env.R2_BUCKET?.trim()
    ) {
      console.error("[Download] Missing R2 environment variables");
      return NextResponse.json(
        { error: "Configuração de download indisponível" },
        { status: 500, headers: privateResponseHeaders },
      );
    }

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
    });

    const r2 = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });

    const url = await getSignedUrl(r2, command, { expiresIn: 3600 });

    return NextResponse.json({ url }, { headers: privateResponseHeaders });
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
