export const digitalProduct = {
  id: "pack-som-de-rua-16gb",
  name: "Pack Som de Rua 2026",
  checkoutName: "Pack Som de Rua 2026",
  description: "Packs digitais de músicas organizadas. O Básico tem mais de 13 GB, mais de 5 mil faixas e atualização até maio de 2026; o Premium tem mais de 26 GB, mais de 8 mil faixas e atualização até setembro de 2026, com repertório mais atual e mais hits do momento.",
  currency: "BRL",
  categoryId: "5805",
  benefits: [
    "Básico atualizado até maio de 2026 e Premium até setembro de 2026",
    "Conteúdo de acordo com o plano escolhido",
    "Acesso digital liberado após aprovação",
    "Download para usar em dispositivos compatíveis",
    "Reembolso integral em caso de falha técnica não solucionada",
  ],
} as const;

export const packOfferIds = ["essencial", "completo"] as const;

export type PackOfferId = (typeof packOfferIds)[number];

export type PackOffer = {
  id: PackOfferId;
  analyticsName: PackOfferId;
  name: string;
  price: number;
  priceCents: number;
  priceLabel: string;
  originalPrice?: number;
  originalPriceCents?: number;
  originalPriceLabel?: string;
  promotionLabel?: string;
  discountLabel?: string;
  description: string;
  cta: string;
  recommended: boolean;
  badge?: string;
  productId: typeof digitalProduct.id;
  checkoutTitle: string;
  checkoutDescription: string;
};

export const packOffers = {
  essencial: {
    id: "essencial",
    analyticsName: "essencial",
    name: "Pack Básico",
    price: 9.9,
    priceCents: 990,
    priceLabel: "R$9,90",
    originalPrice: 15,
    originalPriceCents: 1500,
    originalPriceLabel: "R$15,00",
    promotionLabel: "POR TEMPO LIMITADO",
    discountLabel: "34% OFF",
    description: "Mais de 13 GB e mais de 5 mil faixas atualizadas até maio de 2026.",
    cta: "QUERO POR R$9,90",
    recommended: false,
    productId: digitalProduct.id,
    checkoutTitle: "Pack Básico +13 GB",
    checkoutDescription: "Mais de 5 mil faixas em mais de 13 GB, com repertório atualizado até maio de 2026.",
  },
  completo: {
    id: "completo",
    analyticsName: "completo",
    name: "Pack Premium",
    price: 19.9,
    priceCents: 1990,
    priceLabel: "R$19,90",
    description: "Mais de 26 GB e mais de 8 mil faixas atualizadas até setembro de 2026, com repertório mais atual e mais hits do momento.",
    cta: "QUERO O PREMIUM",
    recommended: true,
    badge: "⭐ MAIS ESCOLHIDO",
    productId: digitalProduct.id,
    checkoutTitle: "Pack Premium +26 GB",
    checkoutDescription: "Mais de 8 mil faixas em mais de 26 GB, atualizadas até setembro de 2026, com repertório mais atual e mais hits do momento.",
  },
} satisfies Record<PackOfferId, PackOffer>;

export const packOfferList: readonly PackOffer[] = [packOffers.essencial, packOffers.completo];
export const defaultPackOfferId: PackOfferId = "completo";
export const defaultPackOffer = packOffers[defaultPackOfferId];
export const entryPackOffer = packOffers.essencial;
export const recommendedPackOffer = packOffers.completo;

export function isPackOfferId(value: unknown): value is PackOfferId {
  return typeof value === "string" && packOfferIds.includes(value as PackOfferId);
}

export function getPackOffer(value: unknown): PackOffer {
  return isPackOfferId(value) ? packOffers[value] : defaultPackOffer;
}

export function getPackOfferCheckoutPath(offerId: PackOfferId): string {
  return `/formulario?offer=${offerId}`;
}

export const offerPricing = {
  productId: digitalProduct.id,
  productName: digitalProduct.name,
  productDescription: digitalProduct.description,
  currentPrice: defaultPackOffer.price,
  currency: digitalProduct.currency,
  categoryId: digitalProduct.categoryId,
};

export const offerPriceLabels = {
  current: defaultPackOffer.priceLabel,
  entry: entryPackOffer.priceLabel,
  recommended: recommendedPackOffer.priceLabel,
  installment: "pagamento único",
};
