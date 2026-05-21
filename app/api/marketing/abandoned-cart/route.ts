import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { assertAbandonedCartRequestIsAuthorized } from "@/lib/abandoned-cart/auth";
import {
  ConfigurationError,
  EmailDeliveryError,
  MalformedJsonError,
  UnauthorizedRequestError,
  UnsupportedMediaTypeError,
  ValidationError,
} from "@/lib/abandoned-cart/errors";
import { abandonedCartLogger } from "@/lib/abandoned-cart/logger";
import { sendAbandonedCartRecoveryEmail } from "@/lib/abandoned-cart/mailer";
import { hashForLog } from "@/lib/abandoned-cart/security";
import { validateAbandonedCartPayload } from "@/lib/abandoned-cart/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ErrorResponse = {
  success: false;
  requestId: string;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
};

export async function POST(request: Request) {
  const requestId = randomUUID();
  const startedAt = Date.now();

  try {
    assertJsonRequest(request);
    assertAbandonedCartRequestIsAuthorized(request);

    const body = await readJsonBody(request);
    const payload = validateAbandonedCartPayload(body);
    const customerHash = hashForLog(payload.customer.email);

    abandonedCartLogger.info("request.validated", {
      requestId,
      customerHash,
      productName: payload.product.name,
      satisfiedCustomersCount: payload.socialProof.satisfiedCustomersCount,
    });

    const delivery = await sendAbandonedCartRecoveryEmail(payload);

    abandonedCartLogger.info("email.sent", {
      requestId,
      customerHash,
      provider: delivery.provider,
      messageId: delivery.messageId,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json(
      {
        success: true,
        requestId,
        data: {
          provider: delivery.provider,
          messageId: delivery.messageId,
        },
      },
      { status: 202 },
    );
  } catch (error) {
    return handleRouteError(error, requestId, startedAt);
  }
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "POST, OPTIONS",
    },
  });
}

function assertJsonRequest(request: Request): void {
  const contentType = request.headers.get("content-type");

  if (!contentType?.toLowerCase().includes("application/json")) {
    throw new UnsupportedMediaTypeError();
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new MalformedJsonError();
  }
}

function handleRouteError(error: unknown, requestId: string, startedAt: number) {
  const durationMs = Date.now() - startedAt;

  if (error instanceof ValidationError) {
    abandonedCartLogger.warn("request.validation_failed", {
      requestId,
      durationMs,
      invalidFields: Object.keys(error.details).join(","),
    });

    return errorResponse(requestId, 422, "VALIDATION_ERROR", "Dados inválidos para recuperação de carrinho.", error.details);
  }

  if (error instanceof UnauthorizedRequestError) {
    abandonedCartLogger.warn("request.unauthorized", { requestId, durationMs });

    return errorResponse(requestId, 401, "UNAUTHORIZED", "Requisição não autorizada.");
  }

  if (error instanceof UnsupportedMediaTypeError) {
    abandonedCartLogger.warn("request.unsupported_media_type", { requestId, durationMs });

    return errorResponse(requestId, 415, "UNSUPPORTED_MEDIA_TYPE", "Envie a requisição como application/json.");
  }

  if (error instanceof MalformedJsonError) {
    abandonedCartLogger.warn("request.malformed_json", { requestId, durationMs });

    return errorResponse(requestId, 400, "MALFORMED_JSON", "O corpo da requisição precisa ser um JSON válido.");
  }

  if (error instanceof ConfigurationError) {
    abandonedCartLogger.error("email.configuration_error", error, { requestId, durationMs });

    return errorResponse(requestId, 500, "EMAIL_CONFIGURATION_ERROR", "Configuração de envio indisponível.");
  }

  if (error instanceof EmailDeliveryError) {
    abandonedCartLogger.error("email.delivery_failed", error, {
      requestId,
      durationMs,
      provider: error.provider,
    });

    return errorResponse(requestId, 502, "EMAIL_DELIVERY_FAILED", "Não foi possível enviar o e-mail agora.");
  }

  abandonedCartLogger.error("request.unhandled_error", error, { requestId, durationMs });

  return errorResponse(requestId, 500, "INTERNAL_SERVER_ERROR", "Erro interno ao processar a recuperação de carrinho.");
}

function errorResponse(
  requestId: string,
  status: number,
  code: string,
  message: string,
  details?: Record<string, string[]>,
) {
  const body: ErrorResponse = {
    success: false,
    requestId,
    error: {
      code,
      message,
      details,
    },
  };

  return NextResponse.json(body, { status });
}
