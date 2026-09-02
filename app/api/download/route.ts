import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPrismaClient } from "@/lib/prisma";
import { getPackDownloadObject } from "@/lib/pack-downloads";
import { getOrderAccessCookieName, verifyOrderAccessToken } from "@/lib/payments/access";
import { requiresSignedOrderAccess } from "@/lib/payments/access-policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma = createPrismaClient();
const privateResponseHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
};
const signedUrlExpirationSeconds = 60 * 60;

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

    const downloadObject = getPackDownloadObject(payment.offerId);

    if (!downloadObject) {
      console.error("[Download] Approved order has an invalid offer", {
        orderId: reference,
        offerId: payment.offerId,
      });
      return NextResponse.json(
        { error: "Não foi possível identificar o arquivo deste pedido" },
        { status: 500, headers: privateResponseHeaders },
      );
    }

    const r2Config = getR2Config();
    const r2 = new S3Client({
      region: "auto",
      endpoint: r2Config.endpoint,
      credentials: {
        accessKeyId: r2Config.accessKeyId,
        secretAccessKey: r2Config.secretAccessKey,
      },
    });
    const command = new GetObjectCommand({
      Bucket: r2Config.bucket,
      Key: downloadObject.key,
      ResponseContentDisposition: `attachment; filename="${downloadObject.filename}"`,
      ResponseContentType: "application/zip",
    });
    const downloadUrl = await getSignedUrl(r2, command, {
      expiresIn: signedUrlExpirationSeconds,
    });

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

function getR2Config(): {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
} {
  const endpoint = process.env.R2_ENDPOINT?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET?.trim();

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error("Missing R2 download configuration");
  }

  const endpointUrl = new URL(endpoint);

  if (endpointUrl.protocol !== "https:") {
    throw new Error("R2 endpoint must use HTTPS");
  }

  return {
    endpoint: endpointUrl.toString(),
    accessKeyId,
    secretAccessKey,
    bucket,
  };
}
