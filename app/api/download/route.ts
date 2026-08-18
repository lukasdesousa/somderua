import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaClient } from "@prisma/client";
import { digitalProduct } from "@/lib/pricing";

const prisma = new PrismaClient();
const allowedDownloadFiles = new Set<string>([digitalProduct.deliveryFile]);

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
    if (
      !process.env.R2_ENDPOINT?.trim() ||
      !process.env.R2_ACCESS_KEY_ID?.trim() ||
      !process.env.R2_SECRET_ACCESS_KEY?.trim() ||
      !process.env.R2_BUCKET?.trim()
    ) {
      console.error("[Download] Missing R2 environment variables");
      return NextResponse.json({ error: "Configuração de download indisponível" }, { status: 500 });
    }

    const payment = await prisma.user_payment.findUnique({
      where: { id: reference },
      select: { approved: true },
    });

    if (!payment?.approved) {
      return NextResponse.json({ error: "Pagamento não aprovado" }, { status: 403 });
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

    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao gerar URL assinada" }, { status: 500 });
  }
}
