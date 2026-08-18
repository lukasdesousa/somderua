export const digitalProduct = {
  id: "pack-som-de-rua-16gb",
  name: "Pack Som de Rua",
  checkoutName: "Pack Som de Rua 16GB",
  description: "Pack com mais de 5.000 faixas atualizadas para carro, pen drive e paredão.",
  deliveryFile: "16gb-musicas-somderua.zip",
  currency: "BRL",
  categoryId: "5805",
  benefits: [
    "Mesmo pack digital Som de Rua",
    "Conteúdo completo do pack atual",
    "Acesso digital liberado após aprovação",
    "Download para usar em dispositivos compatíveis",
    "Garantia de 7 dias e suporte por e-mail",
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
    name: "Pack Essencial",
    price: 9.9,
    priceCents: 990,
    priceLabel: "R$9,90",
    description: "Para quem quer garantir o acesso ao pack pelo menor investimento.",
    cta: "QUERO O ESSENCIAL",
    recommended: false,
    productId: digitalProduct.id,
    checkoutTitle: "Pack Essencial",
    checkoutDescription: "Mesmo pack digital Som de Rua com acesso completo ao conteúdo atual.",
  },
  completo: {
    id: "completo",
    analyticsName: "completo",
    name: "Pack Completo",
    price: 19.9,
    priceCents: 1990,
    priceLabel: "R$19,90",
    description: "Para quem quer aproveitar a oferta recomendada e garantir o mesmo pack completo.",
    cta: "QUERO O COMPLETO",
    recommended: true,
    badge: "⭐ MAIS VENDIDO",
    productId: digitalProduct.id,
    checkoutTitle: "Pack Completo",
    checkoutDescription: "Mesmo pack digital Som de Rua com acesso completo ao conteúdo atual.",
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
