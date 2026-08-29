import test from "node:test";
import assert from "node:assert/strict";
import {
  createActiveCheckoutKey,
  isTerminalPaymentStatus,
  mapMercadoPagoStatus,
  normalizeCpf,
  normalizeCustomerEmail,
  resolvePaymentStatus,
  validatePaymentIntegrity,
} from "../lib/payments/core.ts";

const expectedOrder = {
  orderId: "4b497500-9425-4c41-bb45-83e7f9c47b55",
  paymentId: "123456789",
  amountCents: 1990,
  currency: "BRL",
  offerId: "completo",
  productId: "pack-som-de-rua-16gb",
  checkoutMode: "PIX",
  requireLiveMode: true,
};

const validPayment = {
  id: 123456789,
  status: "approved",
  status_detail: "accredited",
  external_reference: expectedOrder.orderId,
  transaction_amount: 19.9,
  currency_id: "BRL",
  payment_method_id: "pix",
  live_mode: true,
  payer: { email: "cliente@example.com" },
  metadata: {
    id: expectedOrder.orderId,
    offer_id: "completo",
    product_id: "pack-som-de-rua-16gb",
  },
};

test("normaliza e valida e-mail sem aceitar entradas malformadas", () => {
  assert.equal(normalizeCustomerEmail(" Cliente@Example.com "), "cliente@example.com");
  assert.equal(normalizeCustomerEmail("sem-dominio"), null);
  assert.equal(normalizeCustomerEmail("a@dominio"), null);
});

test("valida CPF pelo checksum e rejeita sequências repetidas", () => {
  assert.equal(normalizeCpf("529.982.247-25"), "52998224725");
  assert.equal(normalizeCpf("529.982.247-24"), null);
  assert.equal(normalizeCpf("111.111.111-11"), null);
});

test("a chave do carrinho ativo é determinística para retries e muda por oferta", () => {
  const first = createActiveCheckoutKey("CLIENTE@example.com", "completo", "produto");
  const retry = createActiveCheckoutKey("cliente@example.com", "completo", "produto");
  const otherOffer = createActiveCheckoutKey("cliente@example.com", "essencial", "produto");

  assert.equal(first, retry);
  assert.notEqual(first, otherOffer);
});

test("aceita somente um pagamento que corresponde integralmente ao pedido", () => {
  assert.deepEqual(validatePaymentIntegrity(validPayment, expectedOrder), []);
});

test("não usa o e-mail retornado pelo provedor como identidade financeira", () => {
  assert.deepEqual(validatePaymentIntegrity({
    ...validPayment,
    payer: { email: "email-da-conta-no-provedor@example.com" },
  }, expectedOrder), []);

  const { payer: _payer, ...paymentWithoutPayer } = validPayment;
  assert.deepEqual(validatePaymentIntegrity(paymentWithoutPayer, expectedOrder), []);
});

test("rejeita preço, moeda, pedido, payment id, oferta, produto e método adulterados", () => {
  const violations = validatePaymentIntegrity({
    ...validPayment,
    id: 999,
    external_reference: "outro-pedido",
    transaction_amount: 0.01,
    currency_id: "USD",
    payment_method_id: "account_money",
    live_mode: false,
    payer: { email: "invasor@example.com" },
    metadata: {
      id: "outro-pedido",
      offer_id: "essencial",
      product_id: "outro-produto",
    },
  }, expectedOrder);

  assert.deepEqual(violations.sort(), [
    "amount_mismatch",
    "currency_mismatch",
    "external_reference_mismatch",
    "metadata_reference_mismatch",
    "offer_mismatch",
    "payment_id_mismatch",
    "payment_method_mismatch",
    "product_mismatch",
    "test_payment_not_allowed",
  ]);
});

test("mapeia estados do provedor e identifica todos os estados terminais", () => {
  assert.equal(mapMercadoPagoStatus("pending"), "PENDING");
  assert.equal(mapMercadoPagoStatus("approved"), "APPROVED");
  assert.equal(mapMercadoPagoStatus("cancelled", "expired"), "EXPIRED");
  assert.equal(mapMercadoPagoStatus("charged_back"), "CHARGEBACK");
  assert.equal(isTerminalPaymentStatus("APPROVED"), true);
  assert.equal(isTerminalPaymentStatus("PENDING"), false);
});

test("eventos duplicados ou fora de ordem não rebaixam uma aprovação", () => {
  assert.equal(resolvePaymentStatus("APPROVED", true, "PENDING"), "APPROVED");
  assert.equal(resolvePaymentStatus("APPROVED", true, "APPROVED"), "APPROVED");
  assert.equal(resolvePaymentStatus("APPROVED", true, "REFUNDED"), "REFUNDED");
  assert.equal(resolvePaymentStatus("CHARGEBACK", false, "PENDING"), "CHARGEBACK");
});
