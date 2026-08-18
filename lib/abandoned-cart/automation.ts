import { digitalProduct, getPackOffer, type PackOfferId } from "@/lib/pricing";
import type { ValidatedAbandonedCartPayload } from "./types";

export const ABANDONED_CART_DELAY_MINUTES = 20;
export const ABANDONED_CART_OFFER_NOTE = "O link abre o mesmo checkout que você escolheu.";
export const ABANDONED_CART_SATISFIED_CUSTOMERS_COUNT = 3247;

const DEFAULT_CUSTOMER_NAME = "Cliente Som de Rua";
const PRODUCT_IMAGE_PATH = "/images/pack-16gb-5000.png";

const AUTOMATED_BENEFITS = [
  "Mais de 5.000 faixas atualizadas para carro, pen drive e paredão.",
  "Download liberado rapidamente após a confirmação do pagamento.",
  "Repertório organizado para tocar hoje sem perder tempo procurando música.",
  "Compra segura e garantia de 7 dias para testar com tranquilidade.",
] as const;

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function getAbandonedCartScheduleDate(now = new Date()): Date {
  return new Date(now.getTime() + ABANDONED_CART_DELAY_MINUTES * 60 * 1000);
}

export function buildAutomatedAbandonedCartPayload(input: {
  customerName?: string | null;
  customerEmail: string;
  checkoutUrl: string;
  origin: string;
  offerId?: PackOfferId;
}): ValidatedAbandonedCartPayload {
  const customerName = normalizeCustomerName(input.customerName);
  const firstName = customerName.split(" ")[0] || DEFAULT_CUSTOMER_NAME;
  const satisfiedCustomersLabel = numberFormatter.format(ABANDONED_CART_SATISFIED_CUSTOMERS_COUNT);
  const selectedOffer = getPackOffer(input.offerId);

  return {
    customer: {
      name: customerName,
      firstName,
      email: input.customerEmail.trim().toLowerCase(),
    },
    product: {
      name: digitalProduct.name,
      imageUrl: new URL(PRODUCT_IMAGE_PATH, input.origin).toString(),
      priceLabel: selectedOffer.priceLabel,
      checkoutUrl: input.checkoutUrl,
    },
    offer: {
      expiresIn: ABANDONED_CART_OFFER_NOTE,
      discountLabel: `Oferta escolhida: ${selectedOffer.name}`,
    },
    socialProof: {
      satisfiedCustomersCount: ABANDONED_CART_SATISFIED_CUSTOMERS_COUNT,
      satisfiedCustomersLabel,
    },
    benefits: AUTOMATED_BENEFITS,
  };
}

function normalizeCustomerName(name?: string | null): string {
  const normalized = name?.trim().replace(/\s+/g, " ");

  return normalized || DEFAULT_CUSTOMER_NAME;
}
