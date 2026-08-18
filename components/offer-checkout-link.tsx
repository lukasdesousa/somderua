"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackOfferEvent } from "@/lib/analytics";
import { getPackOfferCheckoutPath, type PackOffer } from "@/lib/pricing";

type OfferCheckoutLinkProps = {
  offer: PackOffer;
  children: ReactNode;
  className?: string;
  source?: string;
  ariaLabel?: string;
};

export default function OfferCheckoutLink({
  offer,
  children,
  className,
  source,
  ariaLabel,
}: OfferCheckoutLinkProps) {
  const context = source ? { source } : {};

  return (
    <Link
      href={getPackOfferCheckoutPath(offer.id)}
      className={className}
      aria-label={ariaLabel ?? `${offer.cta} por ${offer.priceLabel}`}
      onClick={() => {
        trackOfferEvent("select_offer", offer, context);
        trackOfferEvent("add_to_cart", offer, context);
      }}
    >
      {children}
    </Link>
  );
}
