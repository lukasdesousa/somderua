export type AbandonedCartApiPayload = {
  customerName: string;
  customerEmail: string;
  productName: string;
  productImageUrl: string;
  price: number | string;
  checkoutUrl: string;
  offerExpiresIn: string;
  satisfiedCustomersCount: number;
  benefits?: string[];
  discountLabel?: string;
};

export type ValidatedAbandonedCartPayload = {
  customer: {
    name: string;
    firstName: string;
    email: string;
  };
  product: {
    name: string;
    imageUrl: string;
    priceLabel: string;
    checkoutUrl: string;
  };
  offer: {
    expiresIn: string;
    discountLabel: string;
  };
  socialProof: {
    satisfiedCustomersCount: number;
    satisfiedCustomersLabel: string;
  };
  benefits: readonly string[];
};

export type EmailDeliveryResult = {
  provider: "resend";
  messageId: string | null;
  scheduledAt?: Date;
};

export type EmailCancellationResult = {
  provider: "resend";
  messageId: string;
};
