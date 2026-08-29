import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { handleMercadoPagoPayment } from "@/app/server/handle-payment";
import { buildAutomatedAbandonedCartPayload, getAbandonedCartScheduleDate } from "@/lib/abandoned-cart/automation";
import { abandonedCartLogger } from "@/lib/abandoned-cart/logger";
import { sendAbandonedCartRecoveryEmail } from "@/lib/abandoned-cart/mailer";
import { hashForLog } from "@/lib/abandoned-cart/security";
import {
  createMercadoPagoPixPayment,
  getMercadoPagoPayment,
  MercadoPagoRequestError,
  type MercadoPagoPixPaymentRequest,
} from "@/lib/mercado-pago";
import { createOrderAccessToken, getOrderAccessCookieName } from "@/lib/payments/access";
import {
  createActiveCheckoutKey,
  isTerminalPaymentStatus,
  isUuid,
  normalizeCpf,
  normalizeCustomerEmail,
  normalizeCustomerName,
} from "@/lib/payments/core";
import { extractMercadoPagoPixData } from "@/lib/payments/pix";
import { createPrismaClient } from "@/lib/prisma";
import { digitalProduct, isPackOfferId, packOffers, type PackOfferId } from "@/lib/pricing";
import { siteConfig } from "@/lib/seo/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma = createPrismaClient();
const MAX_REQUEST_BYTES = 16_384;
const PRIVATE_HEADERS = { "Cache-Control": "private, no-store, max-age=0" };

type ValidatedPixCheckout = {
  checkoutId: string;
  customerEmail: string;
  customerName: string;
  cpf: string;
  offerId: PackOfferId;
};

class CheckoutConflictError extends Error {}

export async function POST(request: Request) {
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim() || !process.env.JWT_SECRET?.trim()) {
    console.error("[Pix Checkout] Missing payment environment variables");
    return jsonError(500, "PAYMENT_CONFIGURATION_ERROR", "Pagamento indisponível no momento.");
  }

  try {
    const input = await validateRequest(request);
    const selectedOffer = packOffers[input.offerId];
    const activeCheckoutKey = createActiveCheckoutKey(
      input.customerEmail,
      selectedOffer.id,
      selectedOffer.productId,
    );
    const checkoutUrl = new URL(`/formulario?offer=${selectedOffer.id}`, siteConfig.url).toString();
    const order = await getOrCreatePixOrder({
      ...input,
      activeCheckoutKey,
      checkoutUrl,
    });

    const paymentData = order.mpPaymentId
      ? await getMercadoPagoPayment(order.mpPaymentId)
      : await createMercadoPagoPixPayment(
          buildPixPaymentRequest(order.id, input, selectedOffer),
          order.id,
        );

    const handlingResult = await handleMercadoPagoPayment(paymentData, {
      throwOnPurchaseEmailError: false,
    });

    if (!handlingResult.handled || !handlingResult.status) {
      console.error("[Pix Checkout] Provider response failed reconciliation", {
        orderId: order.id,
        paymentId: paymentData.id === undefined ? null : String(paymentData.id),
        reason: handlingResult.reason,
      });
      return jsonError(502, "PAYMENT_RECONCILIATION_FAILED", "Não foi possível validar a cobrança Pix.");
    }

    const pix = extractMercadoPagoPixData(paymentData);
    if (!isTerminalPaymentStatus(handlingResult.status) && (!pix.qrCode || !pix.qrCodeBase64)) {
      console.error("[Pix Checkout] Mercado Pago response did not contain Pix QR data", {
        orderId: order.id,
        paymentId: paymentData.id === undefined ? null : String(paymentData.id),
      });
      return jsonError(502, "PIX_DATA_MISSING", "O Pix foi criado sem os dados necessários. Tente novamente.");
    }

    if (!isTerminalPaymentStatus(handlingResult.status)) {
      await scheduleAbandonedCartRecovery({
        orderId: order.id,
        customerName: order.user_name ?? input.customerName,
        customerEmail: order.email ?? input.customerEmail,
        checkoutUrl,
        offerId: selectedOffer.id,
      });
    }

    const accessToken = await createOrderAccessToken(order.id);

    const response = NextResponse.json(
      {
        orderId: order.id,
        paymentId: paymentData.id === undefined ? null : String(paymentData.id),
        status: handlingResult.status,
        statusDetail: paymentData.status_detail ?? null,
        expiresAt: pix.expiresAt,
        qrCode: pix.qrCode,
        qrCodeBase64: pix.qrCodeBase64,
        offer: {
          id: selectedOffer.id,
          name: selectedOffer.name,
          price: selectedOffer.price,
          priceCents: selectedOffer.priceCents,
          priceLabel: selectedOffer.priceLabel,
          productId: selectedOffer.productId,
        },
      },
      { headers: PRIVATE_HEADERS },
    );
    response.cookies.set(getOrderAccessCookieName(order.id), accessToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch (error) {
    if (error instanceof CheckoutConflictError) {
      return jsonError(409, "CHECKOUT_CONFLICT", "Este identificador de checkout já está em uso.");
    }

    if (error instanceof MercadoPagoRequestError) {
      console.error("[Pix Checkout] Mercado Pago request failed", {
        providerStatus: error.status,
        errorName: error.name,
      });
      return jsonError(502, "PAYMENT_PROVIDER_UNAVAILABLE", "O Mercado Pago está indisponível. Tente novamente.");
    }

    if (error instanceof RequestValidationError) {
      return jsonError(error.status, error.code, error.message);
    }

    console.error("[Pix Checkout] Unhandled checkout error", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return jsonError(500, "PIX_CHECKOUT_FAILED", "Não foi possível gerar o Pix agora.");
  }
}

class RequestValidationError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

async function validateRequest(request: Request): Promise<ValidatedPixCheckout> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (!contentType.includes("application/json")) {
    throw new RequestValidationError(415, "UNSUPPORTED_MEDIA_TYPE", "Envie os dados no formato JSON.");
  }

  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    throw new RequestValidationError(413, "PAYLOAD_TOO_LARGE", "Os dados enviados excedem o limite permitido.");
  }

  let body: unknown;
  try {
    const requestBody = await request.text();
    if (requestBody.length > MAX_REQUEST_BYTES) {
      throw new RequestValidationError(413, "PAYLOAD_TOO_LARGE", "Os dados enviados excedem o limite permitido.");
    }
    body = JSON.parse(requestBody);
  } catch (error) {
    if (error instanceof RequestValidationError) throw error;
    throw new RequestValidationError(400, "INVALID_JSON", "Os dados enviados não são válidos.");
  }

  if (!isRecord(body)) {
    throw new RequestValidationError(400, "INVALID_BODY", "Os dados enviados não são válidos.");
  }

  const customerEmail = normalizeCustomerEmail(body.userEmail);
  const customerName = normalizeCustomerName(body.name);
  const cpf = normalizeCpf(body.cpf);

  if (!isUuid(body.checkoutId)) {
    throw new RequestValidationError(422, "INVALID_CHECKOUT_ID", "Identificador de checkout inválido.");
  }
  if (!customerEmail) {
    throw new RequestValidationError(422, "INVALID_EMAIL", "Informe um e-mail válido.");
  }
  if (!customerName) {
    throw new RequestValidationError(422, "INVALID_NAME", "Informe um nome válido.");
  }
  if (!cpf) {
    throw new RequestValidationError(422, "INVALID_CPF", "Informe um CPF válido.");
  }
  if (!isPackOfferId(body.offerId)) {
    throw new RequestValidationError(422, "INVALID_OFFER", "Oferta inválida.");
  }

  return {
    checkoutId: body.checkoutId,
    customerEmail,
    customerName,
    cpf,
    offerId: body.offerId,
  };
}

async function getOrCreatePixOrder(input: ValidatedPixCheckout & {
  activeCheckoutKey: string;
  checkoutUrl: string;
}) {
  const activeOrder = await prisma.user_payment.findUnique({
    where: { activeCheckoutKey: input.activeCheckoutKey },
  });

  if (activeOrder) return activeOrder;

  const orderWithRequestedId = await prisma.user_payment.findUnique({
    where: { id: input.checkoutId },
  });

  if (orderWithRequestedId) {
    if (
      orderWithRequestedId.checkoutMode === "PIX"
      && orderWithRequestedId.email === input.customerEmail
      && orderWithRequestedId.offerId === input.offerId
    ) {
      return orderWithRequestedId;
    }
    throw new CheckoutConflictError();
  }

  const selectedOffer = packOffers[input.offerId];

  try {
    return await prisma.user_payment.create({
      data: {
        id: input.checkoutId,
        user_name: input.customerName,
        email: input.customerEmail,
        approved: false,
        status: "CREATED",
        provider: "MERCADO_PAGO",
        checkoutMode: "PIX",
        currency: digitalProduct.currency,
        amountCents: selectedOffer.priceCents,
        activeCheckoutKey: input.activeCheckoutKey,
        payment_method: "pix",
        offerId: selectedOffer.id,
        offerName: selectedOffer.name,
        offerPriceCents: selectedOffer.priceCents,
        digitalProductId: selectedOffer.productId,
        checkoutUrl: input.checkoutUrl,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const winningOrder = await prisma.user_payment.findUnique({
        where: { activeCheckoutKey: input.activeCheckoutKey },
      });
      if (winningOrder) return winningOrder;
    }
    throw error;
  }
}

function buildPixPaymentRequest(
  orderId: string,
  input: ValidatedPixCheckout,
  selectedOffer: (typeof packOffers)[PackOfferId],
): MercadoPagoPixPaymentRequest {
  return {
    transaction_amount: selectedOffer.price,
    description: `${selectedOffer.checkoutTitle} - ${digitalProduct.checkoutName}`,
    payment_method_id: "pix",
    external_reference: orderId,
    notification_url: new URL("/api/mercado-pago/webhook", siteConfig.url).toString(),
    metadata: {
      id: orderId,
      offer_id: selectedOffer.id,
      offer_name: selectedOffer.analyticsName,
      offer_price_cents: selectedOffer.priceCents,
      product_id: selectedOffer.productId,
    },
    payer: {
      email: input.customerEmail,
      first_name: input.customerName.split(" ")[0] || "Cliente",
      identification: {
        type: "CPF",
        number: input.cpf,
      },
    },
    additional_info: {
      items: [
        {
          id: digitalProduct.id,
          title: selectedOffer.checkoutTitle,
          description: selectedOffer.checkoutDescription,
          category_id: digitalProduct.categoryId,
          quantity: 1,
          unit_price: selectedOffer.price,
        },
      ],
    },
  };
}

async function scheduleAbandonedCartRecovery(input: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  checkoutUrl: string;
  offerId: PackOfferId;
}): Promise<void> {
  const claim = await prisma.user_payment.updateMany({
    where: {
      id: input.orderId,
      approved: false,
      abandonedCartEmailId: null,
      abandonedCartEmailProcessingAt: null,
    },
    data: { abandonedCartEmailProcessingAt: new Date() },
  });

  if (claim.count === 0) return;

  const scheduledAt = getAbandonedCartScheduleDate();

  try {
    const payload = buildAutomatedAbandonedCartPayload({
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      checkoutUrl: input.checkoutUrl,
      origin: new URL(siteConfig.url).origin,
      offerId: input.offerId,
    });
    const delivery = await sendAbandonedCartRecoveryEmail(payload, { scheduledAt });

    await prisma.user_payment.update({
      where: { id: input.orderId },
      data: {
        abandonedCartEmailId: delivery.messageId,
        abandonedCartEmailScheduledAt: scheduledAt,
        abandonedCartEmailProcessingAt: null,
      },
    });

    abandonedCartLogger.info("email.scheduled", {
      paymentId: input.orderId,
      customerHash: hashForLog(input.customerEmail),
      messageId: delivery.messageId,
      scheduledAt: scheduledAt.toISOString(),
    });
  } catch (error) {
    try {
      await prisma.user_payment.updateMany({
        where: { id: input.orderId, abandonedCartEmailId: null },
        data: { abandonedCartEmailProcessingAt: null },
      });
    } catch (resetError) {
      abandonedCartLogger.error("email.schedule_claim_reset_failed", resetError, {
        paymentId: input.orderId,
      });
    }
    abandonedCartLogger.error("email.schedule_failed", error, {
      paymentId: input.orderId,
      customerHash: hashForLog(input.customerEmail),
    });
  }
}

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json(
    { error: { code, message } },
    { status, headers: PRIVATE_HEADERS },
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
