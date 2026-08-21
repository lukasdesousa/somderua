export const digitalProduct = {
  id: "pack-som-de-rua-16gb",
  name: "Pack Som de Rua 2026",
  checkoutName: "Pack Som de Rua 2026",
  description: "Packs de músicas organizadas e atualizadas em 2026, com opções de 16 GB e mais de 28 GB.",
  deliveryFile: "16gb-musicas-somderua.zip",
  currency: "BRL",
  categoryId: "5805",
  benefits: [
    "Músicas organizadas e atualizadas em 2026",
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
    description: "16 GB de bons repertórios atualizados para quem busca variedade e economia.",
    cta: "QUERO O BÁSICO",
    recommended: false,
    productId: digitalProduct.id,
    checkoutTitle: "Pack Básico 16 GB",
    checkoutDescription: "16 GB de músicas e repertórios atualizados, sem os hits lançados entre maio e agosto de 2026.",
  },
  completo: {
    id: "completo",
    analyticsName: "completo",
    name: "Pack Premium",
    price: 19.9,
    priceCents: 1990,
    priceLabel: "R$19,90",
    description: "Mais de 28 GB com hits do momento, virais e repertório atualizado para paredão.",
    cta: "QUERO O PREMIUM",
    recommended: true,
    badge: "⭐ MAIS ESCOLHIDO",
    productId: digitalProduct.id,
    checkoutTitle: "Pack Premium +28 GB",
    checkoutDescription: "Mais de 28 GB de músicas atualizadas em 2026, com hits do momento, virais e repertório para paredão.",
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
