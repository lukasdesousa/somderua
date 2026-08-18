import { digitalProduct, type PackOffer } from "@/lib/pricing";

export type OfferAnalyticsEvent =
  | "select_offer"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase";

type OfferAnalyticsInput = Pick<PackOffer, "analyticsName" | "price" | "priceCents" | "productId">;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function buildOfferAnalyticsPayload(
  offer: OfferAnalyticsInput,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    offer_name: offer.analyticsName,
    offer_price: offer.price,
    offer_price_cents: offer.priceCents,
    product_id: offer.productId,
    value: offer.price,
    currency: digitalProduct.currency,
    ...extra,
  };
}

export function trackOfferEvent(
  eventName: OfferAnalyticsEvent,
  offer: OfferAnalyticsInput,
  extra: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload = buildOfferAnalyticsPayload(offer, extra);

  window.dataLayer?.push({
    event: eventName,
    ...payload,
  });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }
}
