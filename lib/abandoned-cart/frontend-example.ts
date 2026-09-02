"use client";

import type { AbandonedCartApiPayload } from "./types";

// Exemplo para wiring de UI; em produção, dispare por uma camada confiável quando ABANDONED_CART_API_SECRET estiver ativo.
type AbandonedCartRecoveryApiResponse =
  | {
      success: true;
      requestId: string;
      data: {
        provider: "resend";
        messageId: string | null;
      };
    }
  | {
      success: false;
      requestId: string;
      error: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
      };
    };

export async function requestAbandonedCartRecoveryEmail(
  payload: AbandonedCartApiPayload,
): Promise<AbandonedCartRecoveryApiResponse> {
  const response = await fetch("/api/marketing/abandoned-cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as AbandonedCartRecoveryApiResponse;

  if (!response.ok) {
    throw new Error(data.success ? "Falha ao enviar recuperação de carrinho." : data.error.message);
  }

  return data;
}

export async function sendSomDeRuaAbandonedCartExample(input: {
  customerName: string;
  customerEmail: string;
  checkoutUrl: string;
}) {
  return requestAbandonedCartRecoveryEmail({
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    productName: "Pack Som de Rua",
    productImageUrl: new URL("/images/pack-16gb-5000.png", window.location.origin).toString(),
    price: 5.9,
    checkoutUrl: input.checkoutUrl,
    offerExpiresIn: "15 minutos",
    satisfiedCustomersCount: 3247,
    discountLabel: "Oferta escolhida no checkout",
    benefits: [
      "Básico: mais de 13 GB e mais de 5 mil faixas; Premium: mais de 26 GB e mais de 8 mil faixas.",
      "Básico atualizado até maio/2026; Premium até setembro/2026, mais atual e com mais hits do momento.",
      "Download liberado rapidamente após a confirmação do pagamento.",
      "Repertório organizado para tocar hoje sem perder tempo procurando música.",
      "Reembolso integral se uma falha técnica impedir o acesso e não puder ser solucionada.",
    ],
  });
}
