import { createHmac, timingSafeEqual } from "node:crypto";

const MAX_WEBHOOK_SIGNATURE_AGE_MS = 5 * 60 * 1000;

export type WebhookSignatureValidation =
  | "VALID"
  | "MISSING_HEADERS"
  | "INVALID_FORMAT"
  | "EXPIRED"
  | "INVALID_SIGNATURE";

export function validateMercadoPagoWebhookSignature(input: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
  secret: string;
  now?: number;
}): WebhookSignatureValidation {
  if (!input.xSignature || !input.xRequestId) return "MISSING_HEADERS";

  const signatureParts = input.xSignature.split(",");
  let timestamp = "";
  let signature = "";

  signatureParts.forEach((part) => {
    const separatorIndex = part.indexOf("=");
    if (separatorIndex < 1) return;

    const key = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();
    if (key === "ts") timestamp = value;
    if (key === "v1") signature = value;
  });

  if (!/^\d{10,13}$/.test(timestamp) || !/^[a-f0-9]{64}$/i.test(signature)) {
    return "INVALID_FORMAT";
  }

  if (!isFreshWebhookTimestamp(timestamp, input.now ?? Date.now())) return "EXPIRED";

  let manifest = "";
  if (input.dataId) manifest += `id:${input.dataId.toLowerCase()};`;
  manifest += `request-id:${input.xRequestId};ts:${timestamp};`;

  const generatedHash = createHmac("sha256", input.secret).update(manifest).digest();
  const receivedHash = Buffer.from(signature, "hex");

  if (generatedHash.length !== receivedHash.length || !timingSafeEqual(generatedHash, receivedHash)) {
    return "INVALID_SIGNATURE";
  }

  return "VALID";
}

function isFreshWebhookTimestamp(timestamp: string, now: number): boolean {
  const numericTimestamp = Number(timestamp);
  const timestampMs = numericTimestamp > 10_000_000_000 ? numericTimestamp : numericTimestamp * 1000;
  const ageMs = now - timestampMs;

  return ageMs >= -60_000 && ageMs <= MAX_WEBHOOK_SIGNATURE_AGE_MS;
}
