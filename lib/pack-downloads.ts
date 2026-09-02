import type { PackOfferId } from "@/lib/pricing";

export type PackDownloadObject = {
  key: string;
  filename: string;
};

const packDownloadObjects = {
  essencial: {
    key: "pack/16gb-somderua-2026.zip",
    filename: "16gb-somderua-2026.zip",
  },
  completo: {
    key: "pack/27gb-atualizacao2026-.zip",
    filename: "27gb-atualizacao2026-.zip",
  },
} as const satisfies Record<PackOfferId, PackDownloadObject>;

export function getPackDownloadObject(offerId: string | null): PackDownloadObject | null {
  if (offerId === "essencial") {
    return packDownloadObjects.essencial;
  }

  // Approved legacy orders predate offer IDs and use the Premium delivery.
  if (offerId === "completo" || offerId === null) {
    return packDownloadObjects.completo;
  }

  return null;
}
