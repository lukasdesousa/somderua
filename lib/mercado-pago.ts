import type { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { NextResponse } from "next/server";
import { validateMercadoPagoWebhookSignature } from "@/lib/payments/webhook-signature";

// Instância do cliente Mercado Pago
const MERCADO_PAGO_API_URL = "https://api.mercadopago.com";
const MERCADO_PAGO_TIMEOUT_MS = 15_000;

export type MercadoPagoPreferenceResponse = {
  id?: string | null;
  init_point?: string | null;
  sandbox_init_point?: string | null;
};

export type MercadoPagoPixPaymentRequest = {
  transaction_amount: number;
  description: string;
  payment_method_id: "pix";
  external_reference: string;
  notification_url: string;
  metadata: {
    id: string;
    offer_id: string;
    offer_name: string;
    offer_price_cents: number;
    product_id: string;
  };
  payer: {
    email: string;
    first_name: string;
    identification: {
      type: "CPF";
      number: string;
    };
  };
  additional_info: {
    items: Array<{
      id: string;
      title: string;
      description: string;
      category_id: string;
      quantity: number;
      unit_price: number;
    }>;
  };
};

export class MercadoPagoRequestError extends Error {
  readonly status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);
    this.name = "MercadoPagoRequestError";
    this.status = status;
  }
}

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

export async function createMercadoPagoPixPayment(
  body: MercadoPagoPixPaymentRequest,
  idempotencyKey: string,
): Promise<PaymentResponse> {
  return mercadoPagoRequest<PaymentResponse>("/v1/payments", {
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

  let response: Response;

  try {
    response = await fetch(`${MERCADO_PAGO_API_URL}${path}`, {
      ...init,
      cache: "no-store",
      signal: init.signal ?? AbortSignal.timeout(MERCADO_PAGO_TIMEOUT_MS),
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...init.headers,
      },
    });
  } catch {
    throw new MercadoPagoRequestError("Falha de rede ou timeout ao consultar o Mercado Pago", 0);
  }

  const responseText = await response.text();
  const responseBody = parseJsonResponse(responseText);

  if (!response.ok) {
    const message = getMercadoPagoErrorMessage(responseBody);
    throw new MercadoPagoRequestError(
      `Mercado Pago respondeu HTTP ${response.status}${message ? `: ${message}` : ""}`,
      response.status,
    );
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
  const url = new URL(request.url);
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET?.trim();

  if (!secret) {
    console.error("[MP Webhook] Missing MERCADO_PAGO_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook signature configuration unavailable" },
      { status: 500 }
    );
  }

  const validation = validateMercadoPagoWebhookSignature({
    xSignature,
    xRequestId,
    dataId: url.searchParams.get("data.id"),
    secret,
  });

  if (validation === "MISSING_HEADERS" || validation === "INVALID_FORMAT") {
    return NextResponse.json({ error: "Invalid webhook signature headers" }, { status: 400 });
  }

  if (validation === "EXPIRED" || validation === "INVALID_SIGNATURE") {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  return null;
}
