import type { PackOfferId } from "@/lib/pricing";

const mediaFireUrls = {
  essencial:
    "https://www.mediafire.com/file_premium/cm5fbfv3z9dfnpy/16gb-somderua-2026.zip/file",
  completo:
    "https://www.mediafire.com/file_premium/21bz4vvd25zm6ca/27gb-atualizacao2026-.zip/file",
} satisfies Record<PackOfferId, string>;

export function getPackDownloadUrl(offerId: string | null): string | null {
  if (offerId === "essencial") {
    return validateMediaFireUrl(mediaFireUrls.essencial);
  }

  // Approved legacy orders predate offer IDs and use the Premium delivery.
  if (offerId === "completo" || offerId === null) {
    return validateMediaFireUrl(mediaFireUrls.completo);
  }

  return null;
}

function validateMediaFireUrl(value: string): string {
  const url = new URL(value);
  const isTrustedHost =
    url.hostname === "mediafire.com" || url.hostname === "www.mediafire.com";

  if (
    url.protocol !== "https:" ||
    !isTrustedHost ||
    !/^\/file_premium\/[^/]+\/[^/]+\/file$/.test(url.pathname)
  ) {
    throw new Error("Invalid MediaFire pack URL");
  }

  return url.toString();
}
