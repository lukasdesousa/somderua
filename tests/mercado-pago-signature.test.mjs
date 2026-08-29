import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

const SECRET = "test-webhook-secret-with-enough-entropy";
const { validateMercadoPagoWebhookSignature } = await import("../lib/payments/webhook-signature.ts");

test("aceita uma assinatura oficial válida vinculada ao data.id", () => {
  const input = createSignedInput({ paymentId: "ABC123" });
  assert.equal(validateMercadoPagoWebhookSignature(input), "VALID");
});

test("rejeita assinatura forjada e assinatura expirada", () => {
  const forged = createSignedInput({ paymentId: "123", signature: "0".repeat(64) });
  assert.equal(validateMercadoPagoWebhookSignature(forged), "INVALID_SIGNATURE");

  const expiredTimestamp = String(Math.floor((Date.now() - 10 * 60 * 1000) / 1000));
  const expired = createSignedInput({ paymentId: "123", timestamp: expiredTimestamp });
  assert.equal(validateMercadoPagoWebhookSignature(expired), "EXPIRED");
});

test("rejeita headers ausentes ou malformados", () => {
  assert.equal(validateMercadoPagoWebhookSignature({
    xRequestId: null,
    xSignature: null,
    dataId: "123",
    secret: SECRET,
  }), "MISSING_HEADERS");
  assert.equal(validateMercadoPagoWebhookSignature({
    xRequestId: "request-1",
    xSignature: "ts=invalid,v1=invalid",
    dataId: "123",
    secret: SECRET,
  }), "INVALID_FORMAT");
});

function createSignedInput({
  paymentId,
  timestamp = String(Math.floor(Date.now() / 1000)),
  signature,
}) {
  const requestId = "request-123";
  const normalizedPaymentId = paymentId.toLowerCase();
  const manifest = `id:${normalizedPaymentId};request-id:${requestId};ts:${timestamp};`;
  const validSignature = createHmac("sha256", SECRET)
    .update(manifest)
    .digest("hex");
  return {
    xRequestId: requestId,
    xSignature: `ts=${timestamp},v1=${signature ?? validSignature}`,
    dataId: paymentId,
    secret: SECRET,
  };
}
