import { ConfigurationError, UnauthorizedRequestError } from "./errors";
import { abandonedCartLogger } from "./logger";
import { safeCompare } from "./security";

const AUTH_HEADER_PREFIX = "Bearer ";

export function assertAbandonedCartRequestIsAuthorized(request: Request): void {
  const configuredSecret = process.env.ABANDONED_CART_API_SECRET;

  if (!configuredSecret) {
    if (process.env.NODE_ENV === "production") {
      throw new ConfigurationError("Missing ABANDONED_CART_API_SECRET");
    }

    abandonedCartLogger.warn("auth.secret_missing_development");
    return;
  }

  const authorization = request.headers.get("authorization");
  const bearerToken = authorization?.startsWith(AUTH_HEADER_PREFIX)
    ? authorization.slice(AUTH_HEADER_PREFIX.length).trim()
    : null;
  const headerToken = request.headers.get("x-abandoned-cart-secret")?.trim();
  const token = bearerToken || headerToken;

  if (!token || !safeCompare(configuredSecret, token)) {
    throw new UnauthorizedRequestError();
  }
}
