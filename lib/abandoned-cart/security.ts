import { createHash, timingSafeEqual } from "node:crypto";

export function hashForLog(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex").slice(0, 16);
}

export function safeCompare(secret: string, candidate: string): boolean {
  const secretHash = createHash("sha256").update(secret).digest();
  const candidateHash = createHash("sha256").update(candidate).digest();

  return timingSafeEqual(secretHash, candidateHash);
}

export function createEmailIdempotencyKey(input: {
  email: string;
  checkoutUrl: string;
  productName: string;
}): string {
  const digest = createHash("sha256")
    .update(`${input.email.toLowerCase()}|${input.checkoutUrl}|${input.productName}`)
    .digest("hex")
    .slice(0, 32);

  return `abandoned-cart-${digest}`;
}
