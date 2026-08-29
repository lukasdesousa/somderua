import { createHash } from "node:crypto";

export const internalPaymentStatuses = [
  "CREATED",
  "PENDING",
  "IN_PROCESS",
  "IN_MEDIATION",
  "AUTHORIZED",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "EXPIRED",
  "REFUNDED",
  "CHARGEBACK",
] as const;

export type InternalPaymentStatus = (typeof internalPaymentStatuses)[number];

export type PaymentIntegrityExpectation = {
  orderId: string;
  paymentId: string | null;
  amountCents: number | null;
  currency: string;
  offerId: string | null;
  productId: string | null;
  checkoutMode: string;
  requireLiveMode: boolean;
};

export type MercadoPagoPaymentSnapshot = {
  id?: string | number;
  status?: string;
  status_detail?: string;
  external_reference?: string;
  transaction_amount?: number;
  currency_id?: string;
  payment_method_id?: string;
  live_mode?: boolean;
  payer?: {
    email?: string;
  };
  metadata?: unknown;
};

const TERMINAL_PAYMENT_STATUSES = new Set<InternalPaymentStatus>([
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "EXPIRED",
  "REFUNDED",
  "CHARGEBACK",
]);

export function normalizeCustomerEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const email = value.trim().toLowerCase();
  if (email.length < 3 || email.length > 254 || /[\u0000-\u001F\u007F]/.test(email)) return null;

  const atIndex = email.lastIndexOf("@");
  if (atIndex <= 0 || atIndex === email.length - 1) return null;

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);

  if (local.length > 64 || !domain.includes(".") || domain.startsWith(".") || domain.endsWith(".")) return null;
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local)) return null;
  if (!/^[a-z0-9.-]+$/i.test(domain) || domain.includes("..")) return null;

  return email;
}

export function normalizeCustomerName(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return "Cliente Som de Rua";
  if (typeof value !== "string") return null;

  const name = value.trim().replace(/\s+/g, " ");
  if (!name || name.length > 120 || /[\u0000-\u001F\u007F]/.test(name)) return null;

  return name;
}

export function normalizeCpf(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const cpf = value.replace(/\D/g, "");
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return null;

  const calculateDigit = (length: number): number => {
    let total = 0;
    for (let index = 0; index < length; index += 1) {
      total += Number(cpf[index]) * (length + 1 - index);
    }
    const remainder = (total * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  if (calculateDigit(9) !== Number(cpf[9]) || calculateDigit(10) !== Number(cpf[10])) return null;

  return cpf;
}

export function isUuid(value: unknown): value is string {
  return typeof value === "string"
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function createActiveCheckoutKey(email: string, offerId: string, productId: string): string {
  return createHash("sha256")
    .update(`${email.trim().toLowerCase()}|${offerId}|${productId}`)
    .digest("hex");
}

export function mapMercadoPagoStatus(status?: string, statusDetail?: string): InternalPaymentStatus {
  if (statusDetail?.toLowerCase().includes("expir")) return "EXPIRED";

  switch (status?.toLowerCase()) {
    case "approved":
      return "APPROVED";
    case "authorized":
      return "AUTHORIZED";
    case "pending":
      return "PENDING";
    case "in_process":
      return "IN_PROCESS";
    case "in_mediation":
      return "IN_MEDIATION";
    case "rejected":
      return "REJECTED";
    case "cancelled":
      return "CANCELLED";
    case "refunded":
      return "REFUNDED";
    case "charged_back":
      return "CHARGEBACK";
    default:
      return "PENDING";
  }
}

export function isTerminalPaymentStatus(status: string): boolean {
  return TERMINAL_PAYMENT_STATUSES.has(status as InternalPaymentStatus);
}

export function resolvePaymentStatus(
  currentStatus: string,
  currentlyApproved: boolean,
  incomingStatus: InternalPaymentStatus,
): InternalPaymentStatus {
  if (currentlyApproved && !["REFUNDED", "CHARGEBACK"].includes(incomingStatus)) {
    return "APPROVED";
  }

  if (["REFUNDED", "CHARGEBACK"].includes(currentStatus) && incomingStatus !== "APPROVED") {
    return currentStatus as InternalPaymentStatus;
  }

  return incomingStatus;
}

export function validatePaymentIntegrity(
  payment: MercadoPagoPaymentSnapshot,
  expected: PaymentIntegrityExpectation,
): string[] {
  const violations: string[] = [];
  const paymentId = payment.id === undefined ? null : String(payment.id);
  const metadata = asRecord(payment.metadata);

  if (!paymentId || (expected.paymentId && paymentId !== expected.paymentId)) {
    violations.push("payment_id_mismatch");
  }

  if (payment.external_reference !== expected.orderId) {
    violations.push("external_reference_mismatch");
  }

  if (
    expected.amountCents === null
    || !Number.isFinite(payment.transaction_amount)
    || Math.round((payment.transaction_amount ?? Number.NaN) * 100) !== expected.amountCents
  ) {
    violations.push("amount_mismatch");
  }

  if (payment.currency_id !== expected.currency) {
    violations.push("currency_mismatch");
  }

  if (expected.checkoutMode === "PIX" && payment.payment_method_id !== "pix") {
    violations.push("payment_method_mismatch");
  }

  if (expected.requireLiveMode && payment.live_mode !== true) {
    violations.push("test_payment_not_allowed");
  }

  if (expected.offerId && metadata?.offer_id !== expected.offerId) {
    violations.push("offer_mismatch");
  }

  if (expected.productId && metadata?.product_id !== expected.productId) {
    violations.push("product_mismatch");
  }

  if (metadata?.id !== undefined && metadata.id !== expected.orderId) {
    violations.push("metadata_reference_mismatch");
  }

  return violations;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}
