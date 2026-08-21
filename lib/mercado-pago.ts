import type { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { NextResponse } from "next/server";
import crypto from "crypto";

// Instância do cliente Mercado Pago
const MERCADO_PAGO_API_URL = "https://api.mercadopago.com";

export type MercadoPagoPreferenceResponse = {
  id?: string | null;
  init_point?: string | null;
  sandbox_init_point?: string | null;
};

export async function createMercadoPagoPreference(
  body: Record<string, unknown>,
  idempotencyKey: string,
): Promise<MercadoPagoPreferenceResponse> {
  return mercadoPagoRequest<MercadoPagoPreferenceResponse>("/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(body),
  });
}

export async function getMercadoPagoPayment(paymentId: string | number): Promise<PaymentResponse> {
  return mercadoPagoRequest<PaymentResponse>(`/v1/payments/${encodeURIComponent(String(paymentId))}`, {
    method: "GET",
  });
}

async function mercadoPagoRequest<T>(path: string, init: RequestInit): Promise<T> {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();

  if (!accessToken) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN nao configurado");
  }

  if (/[\u0000-\u001F\u007F]/.test(accessToken)) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN contem caracteres invalidos");
  }

  const response = await fetch(`${MERCADO_PAGO_API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...init.headers,
    },
  });

  const responseText = await response.text();
  const responseBody = parseJsonResponse(responseText);

  if (!response.ok) {
    const message = getMercadoPagoErrorMessage(responseBody);
    throw new Error(`Mercado Pago respondeu HTTP ${response.status}${message ? `: ${message}` : ""}`);
  }

  return responseBody as T;
}

function parseJsonResponse(body: string): unknown {
  if (!body) return {};

  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}

function getMercadoPagoErrorMessage(body: unknown): string {
  if (typeof body !== "object" || body === null) return "";

  const errorBody = body as { message?: unknown; error?: unknown };
  if (typeof errorBody.message === "string") return errorBody.message;
  if (typeof errorBody.error === "string") return errorBody.error;
  return "";
}

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
