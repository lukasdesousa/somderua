import type { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

export type PixDisplayData = {
  qrCode: string | null;
  qrCodeBase64: string | null;
  expiresAt: string | null;
};

export function extractMercadoPagoPixData(paymentData: PaymentResponse): PixDisplayData {
  const transactionData = paymentData.point_of_interaction?.transaction_data;
  const qrCode = typeof transactionData?.qr_code === "string"
    && transactionData.qr_code.length >= 10
    && transactionData.qr_code.length <= 8192
    ? transactionData.qr_code
    : null;
  const qrCodeBase64 = typeof transactionData?.qr_code_base64 === "string"
    && transactionData.qr_code_base64.length >= 20
    && transactionData.qr_code_base64.length <= 2_000_000
    && /^[a-z0-9+/]+={0,2}$/i.test(transactionData.qr_code_base64)
    ? transactionData.qr_code_base64
    : null;
  const expiration = paymentData.date_of_expiration ? new Date(paymentData.date_of_expiration) : null;

  return {
    qrCode,
    qrCodeBase64,
    expiresAt: expiration && !Number.isNaN(expiration.getTime()) ? expiration.toISOString() : null,
  };
}
