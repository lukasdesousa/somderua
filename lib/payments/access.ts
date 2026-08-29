import "server-only";

import { SignJWT, jwtVerify } from "jose";

const TOKEN_ISSUER = "som-de-rua";
const TOKEN_AUDIENCE = "order-access";

export function getOrderAccessCookieName(reference: string): string {
  return `order_access_${reference.replace(/[^a-z0-9]/gi, "").slice(0, 40)}`;
}

export async function createOrderAccessToken(reference: string): Promise<string> {
  return new SignJWT({ reference, purpose: "order_access" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(TOKEN_ISSUER)
    .setAudience(TOKEN_AUDIENCE)
    .sign(getJwtSecret());
}

export async function verifyOrderAccessToken(token: string | null, expectedReference: string): Promise<boolean> {
  if (!token || token.length > 2048) return false;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    });

    return payload.purpose === "order_access" && payload.reference === expectedReference;
  } catch {
    return false;
  }
}

function getJwtSecret(): Uint8Array {
  const value = process.env.JWT_SECRET?.trim();

  if (!value || value.length < 32) {
    throw new Error("JWT_SECRET nao configurado com seguranca suficiente");
  }

  return new TextEncoder().encode(value);
}
