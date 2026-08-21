import { ValidationError } from "./errors";
import type { ValidatedAbandonedCartPayload } from "./types";

const DEFAULT_BENEFITS = [
  "Mais de 10 mil faixas selecionadas para carro, pen drive e paredão.",
  "Download liberado rapidamente após a confirmação do pagamento.",
  "Repertório organizado para tocar sem perder tempo procurando música.",
  "Reembolso integral se uma falha técnica impedir o acesso e não puder ser solucionada.",
] as const;

const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001F\u007F]/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const numberFormatter = new Intl.NumberFormat("pt-BR");

type ValidationDetails = Record<string, string[]>;

type StringValidationOptions = {
  minLength?: number;
  maxLength: number;
};

export function validateAbandonedCartPayload(input: unknown): ValidatedAbandonedCartPayload {
  const details: ValidationDetails = {};

  if (!isRecord(input)) {
    throw new ValidationError("Request body must be a JSON object.", {
      body: ["Envie um objeto JSON válido."],
    });
  }

  const customerName = readRequiredText(input, "customerName", details, {
    minLength: 2,
    maxLength: 80,
  });
  const customerEmail = readEmail(input, "customerEmail", details);
  const productName = readRequiredText(input, "productName", details, {
    minLength: 2,
    maxLength: 120,
  });
  const productImageUrl = readUrl(input, "productImageUrl", details);
  const checkoutUrl = readUrl(input, "checkoutUrl", details);
  const priceLabel = readPrice(input, "price", details);
  const offerExpiresIn = readRequiredText(input, "offerExpiresIn", details, {
    minLength: 2,
    maxLength: 48,
  });
  const satisfiedCustomersCount = readPositiveInteger(input, "satisfiedCustomersCount", details);
  const benefits = readBenefits(input, details);
  const discountLabel = readOptionalText(input, "discountLabel", details, {
    maxLength: 48,
  }) ?? "Oferta escolhida no checkout";

  if (Object.keys(details).length > 0) {
    throw new ValidationError("Invalid abandoned-cart payload.", details);
  }

  const firstName = customerName.split(" ")[0] || customerName;

  return {
    customer: {
      name: customerName,
      firstName,
      email: customerEmail,
    },
    product: {
      name: productName,
      imageUrl: productImageUrl,
      priceLabel,
      checkoutUrl,
    },
    offer: {
      expiresIn: offerExpiresIn,
      discountLabel,
    },
    socialProof: {
      satisfiedCustomersCount,
      satisfiedCustomersLabel: numberFormatter.format(satisfiedCustomersCount),
    },
    benefits,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readRequiredText(
  input: Record<string, unknown>,
  field: string,
  details: ValidationDetails,
  options: StringValidationOptions,
): string {
  const value = normalizeText(input[field]);

  if (!value) {
    addValidationError(details, field, "Campo obrigatório.");
    return "";
  }

  validateTextShape(value, field, details, options);
  return value;
}

function readOptionalText(
  input: Record<string, unknown>,
  field: string,
  details: ValidationDetails,
  options: StringValidationOptions,
): string | null {
  if (input[field] === undefined || input[field] === null) {
    return null;
  }

  const value = normalizeText(input[field]);

  if (!value) {
    addValidationError(details, field, "Informe um texto válido.");
    return null;
  }

  validateTextShape(value, field, details, options);
  return value;
}

function normalizeText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ");
}

function validateTextShape(
  value: string,
  field: string,
  details: ValidationDetails,
  options: StringValidationOptions,
): void {
  if (CONTROL_CHARACTER_PATTERN.test(value)) {
    addValidationError(details, field, "Não use caracteres de controle.");
  }

  if (options.minLength && value.length < options.minLength) {
    addValidationError(details, field, `Use pelo menos ${options.minLength} caracteres.`);
  }

  if (value.length > options.maxLength) {
    addValidationError(details, field, `Use no máximo ${options.maxLength} caracteres.`);
  }
}

function readEmail(input: Record<string, unknown>, field: string, details: ValidationDetails): string {
  const value = readRequiredText(input, field, details, {
    minLength: 5,
    maxLength: 254,
  }).toLowerCase();

  if (value && !EMAIL_PATTERN.test(value)) {
    addValidationError(details, field, "Informe um e-mail válido.");
  }

  return value;
}

function readUrl(input: Record<string, unknown>, field: string, details: ValidationDetails): string {
  const value = readRequiredText(input, field, details, {
    minLength: 8,
    maxLength: 2048,
  });

  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      addValidationError(details, field, "A URL deve usar http ou https.");
    }

    return url.toString();
  } catch {
    addValidationError(details, field, "Informe uma URL válida.");
    return "";
  }
}

function readPrice(input: Record<string, unknown>, field: string, details: ValidationDetails): string {
  const value = input[field];

  if (typeof value === "number") {
    if (!Number.isFinite(value) || value <= 0 || value > 100000) {
      addValidationError(details, field, "Informe um preço numérico maior que zero.");
      return "";
    }

    return currencyFormatter.format(value);
  }

  if (typeof value !== "string") {
    addValidationError(details, field, "Informe o preço como número ou texto.");
    return "";
  }

  const cleanedValue = normalizeText(value);
  const amount = parseBrazilianCurrency(cleanedValue);

  if (!amount || amount <= 0 || amount > 100000) {
    addValidationError(details, field, "Informe um preço válido em reais.");
    return "";
  }

  return currencyFormatter.format(amount);
}

function parseBrazilianCurrency(value: string): number | null {
  if (value.length > 32 || CONTROL_CHARACTER_PATTERN.test(value)) {
    return null;
  }

  const withoutCurrency = value.replace(/R\$/i, "").replace(/\s/g, "");

  if (!/^\d+(?:[.,]\d{1,2})?$|^\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?$/.test(withoutCurrency)) {
    return null;
  }

  const normalized = withoutCurrency.includes(",")
    ? withoutCurrency.replace(/\./g, "").replace(",", ".")
    : withoutCurrency;
  const amount = Number(normalized);

  return Number.isFinite(amount) ? amount : null;
}

function readPositiveInteger(
  input: Record<string, unknown>,
  field: string,
  details: ValidationDetails,
): number {
  const value = input[field];

  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 1000000) {
    addValidationError(details, field, "Informe um número inteiro entre 1 e 1.000.000.");
    return 0;
  }

  return value;
}

function readBenefits(input: Record<string, unknown>, details: ValidationDetails): readonly string[] {
  const value = input.benefits;

  if (value === undefined || value === null) {
    return DEFAULT_BENEFITS;
  }

  if (!Array.isArray(value) || value.length < 2 || value.length > 6) {
    addValidationError(details, "benefits", "Informe entre 2 e 6 benefícios.");
    return DEFAULT_BENEFITS;
  }

  return value.map((benefit, index) => {
    const normalized = normalizeText(benefit);

    if (!normalized) {
      addValidationError(details, `benefits.${index}`, "Benefício inválido.");
      return "";
    }

    validateTextShape(normalized, `benefits.${index}`, details, {
      minLength: 8,
      maxLength: 120,
    });

    return normalized;
  });
}

function addValidationError(details: ValidationDetails, field: string, message: string): void {
  details[field] = [...(details[field] ?? []), message];
}
