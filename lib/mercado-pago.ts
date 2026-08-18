import { MercadoPagoConfig } from "mercadopago";
import { NextResponse } from "next/server";
import crypto from "crypto";

// Instância do cliente Mercado Pago
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
});

export default mpClient;

// Função auxiliar para verificar a assinatura do Mercado Pago - Protege sua rota de acessos maliciosos
// Disponível na própria documentação do Mercado Pago
export function verifyMercadoPagoSignature(request: Request): NextResponse | null {
  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");
  if (!xSignature || !xRequestId) {
    return NextResponse.json(
      { error: "Missing x-signature or x-request-id header" },
      { status: 400 }
    );
  }

  const signatureParts = xSignature.split(",");
  let ts = "";
  let v1 = "";
  signatureParts.forEach((part) => {
    const [key, value] = part.split("=");
    if (key.trim() === "ts") {
      ts = value.trim();
    } else if (key.trim() === "v1") {
      v1 = value.trim();
    }
  });

  if (!ts || !v1) {
    return NextResponse.json(
      { error: "Invalid x-signature header format" },
      { status: 400 }
    );
  }

  const url = new URL(request.url);
  const dataId = url.searchParams.get("data.id");

  let manifest = "";
  if (dataId) {
    manifest += `id:${dataId};`;
  }
  if (xRequestId) {
    manifest += `request-id:${xRequestId};`;
  }
  manifest += `ts:${ts};`;

  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET?.trim();

  if (!secret) {
    console.error("[MP Webhook] Missing MERCADO_PAGO_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook signature configuration unavailable" },
      { status: 500 }
    );
  }

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(manifest);
  const generatedHash = hmac.digest("hex");

  if (generatedHash !== v1) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  return null;
}
