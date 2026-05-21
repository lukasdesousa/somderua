import { Resend } from "resend";
import { ConfigurationError, EmailDeliveryError } from "./errors";
import { buildAbandonedCartRecoveryEmail } from "./template";
import type {
  EmailCancellationResult,
  EmailDeliveryResult,
  ValidatedAbandonedCartPayload,
} from "./types";
import { createEmailIdempotencyKey } from "./security";

const DEFAULT_FROM_EMAIL = "Som de Rua <pack@somderua.com.br>";

let resendClient: Resend | null = null;

export async function sendAbandonedCartRecoveryEmail(
  payload: ValidatedAbandonedCartPayload,
  options: { scheduledAt?: Date } = {},
): Promise<EmailDeliveryResult> {
  const resend = getResendClient();
  const email = buildAbandonedCartRecoveryEmail(payload);
  const replyTo = process.env.ABANDONED_CART_REPLY_TO?.trim();
  const idempotencyKey = createEmailIdempotencyKey({
    email: payload.customer.email,
    checkoutUrl: payload.product.checkoutUrl,
    productName: payload.product.name,
  });

  const response = await resend.emails.send(
    {
      from: getFromEmail(),
      to: payload.customer.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
      scheduledAt: options.scheduledAt?.toISOString(),
      replyTo: replyTo || undefined,
      tags: [
        { name: "flow", value: "abandoned-cart" },
        { name: "product", value: "som-de-rua" },
      ],
    },
    { idempotencyKey },
  );

  if (response.error) {
    throw new EmailDeliveryError(response.error.message, "resend");
  }

  return {
    provider: "resend",
    messageId: response.data?.id ?? null,
    scheduledAt: options.scheduledAt,
  };
}

export async function cancelAbandonedCartRecoveryEmail(
  messageId: string,
): Promise<EmailCancellationResult> {
  const response = await getResendClient().emails.cancel(messageId);

  if (response.error) {
    throw new EmailDeliveryError(response.error.message, "resend");
  }

  return {
    provider: "resend",
    messageId: response.data.id,
  };
}

export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    throw new ConfigurationError("Missing RESEND_API_KEY");
  }

  resendClient ??= new Resend(apiKey);
  return resendClient;
}

function getFromEmail(): string {
  return process.env.ABANDONED_CART_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
}
