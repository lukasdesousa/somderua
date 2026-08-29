type MercadoPagoCheckoutData = {
  userEmail: string;
  name: string;
  offerId: string;
};

export type MercadoPagoPixCheckoutData = MercadoPagoCheckoutData & {
  checkoutId: string;
  cpf: string;
};

export type MercadoPagoPixCheckoutResponse = {
  orderId: string;
  paymentId: string | null;
  status: string;
  statusDetail: string | null;
  expiresAt: string | null;
  qrCode: string | null;
  qrCodeBase64: string | null;
  offer: {
    id: string;
    name: string;
    price: number;
    priceCents: number;
    priceLabel: string;
    productId: string;
  };
};

export class CheckoutApiError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "CheckoutApiError";
  }
}

const useMercadoPago = () => {
  async function createMercadoPagoPix(
    checkoutData: MercadoPagoPixCheckoutData,
  ): Promise<MercadoPagoPixCheckoutResponse> {
    const response = await fetch("/api/mercado-pago/create-pix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checkoutData),
    });

    return readApiResponse<MercadoPagoPixCheckoutResponse>(response);
  }

  // Kept as a rollback/fallback path while the internal Pix checkout is rolled out.
  async function createMercadoPagoCheckout(checkoutData: MercadoPagoCheckoutData): Promise<void> {
    const response = await fetch("/api/mercado-pago/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checkoutData),
    });
    const data = await readApiResponse<{ init_point?: string; initPoint?: string }>(response);
    const url = data.init_point || data.initPoint;

    if (!url) {
      throw new CheckoutApiError("URL de checkout não retornada.", "CHECKOUT_URL_MISSING", 502);
    }

    window.location.assign(url);
  }

  return { createMercadoPagoPix, createMercadoPagoCheckout };
};

async function readApiResponse<T>(response: Response): Promise<T> {
  const responseText = await response.text();
  let data: unknown = null;

  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const apiError = getApiError(data);
    throw new CheckoutApiError(
      apiError.message ?? "Não foi possível processar o pagamento.",
      apiError.code ?? "PAYMENT_REQUEST_FAILED",
      response.status,
    );
  }

  return data as T;
}

function getApiError(value: unknown): { code?: string; message?: string } {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};

  const error = (value as Record<string, unknown>).error;
  if (typeof error === "string") return { message: error };
  if (typeof error !== "object" || error === null || Array.isArray(error)) return {};

  const errorRecord = error as Record<string, unknown>;
  return {
    code: typeof errorRecord.code === "string" ? errorRecord.code : undefined,
    message: typeof errorRecord.message === "string" ? errorRecord.message : undefined,
  };
}

export default useMercadoPago;
