"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import useMercadoPago from "@/hooks/useMercadoPago";
import { trackOfferEvent } from "@/lib/analytics";
import { digitalProduct, getPackOffer } from "@/lib/pricing";

const checkoutTrustHooks = [
  "Pagamento seguro via Mercado Pago",
  "Entrega automatica assim que o pagamento for aprovado",
  "Conteudo digital liberado de acordo com a oferta escolhida",
  "Suporte por e-mail para duvidas de acesso",
];

export default function Form() {
  const searchParams = useSearchParams();
  const selectedOffer = getPackOffer(searchParams.get("offer"));
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { createMercadoPagoCheckout } = useMercadoPago();

  const onFinish = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    localStorage.setItem("user_name", name);
    localStorage.setItem("user_email", email);

    trackOfferEvent("begin_checkout", selectedOffer, { source: "checkout_form" });

    await createMercadoPagoCheckout({
      userEmail: email,
      name: name || "Cliente Som de Rua",
      offerId: selectedOffer.id,
    });

    setLoading(false);
  };

  useEffect(() => {
    const cachedEmail = localStorage.getItem("user_email");
    const cachedName = localStorage.getItem("user_name");

    if (cachedEmail || cachedName) {
      setEmail(cachedEmail || "");
      setName(cachedName || "");
    }
  }, []);

  return (
    <section aria-labelledby="checkout-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="pb-10 text-center">
            <p className="mb-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
              Oferta escolhida: {selectedOffer.name}
            </p>
            <h1 id="checkout-title" className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Finalize seu acesso imediato
            </h1>
            <div className="mt-4" aria-label="Resumo da oferta escolhida">
              {selectedOffer.originalPriceLabel ? (
                <p className="text-sm text-indigo-100/55">
                  De <span className="line-through">{selectedOffer.originalPriceLabel}</span> por
                </p>
              ) : null}
              <p className="text-3xl font-semibold text-indigo-100">{selectedOffer.priceLabel}</p>
              {selectedOffer.promotionLabel ? (
                <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.14em] text-amber-300">
                  🔥 {selectedOffer.promotionLabel} · {selectedOffer.discountLabel}
                </p>
              ) : null}
              <p className="mt-1 text-sm text-indigo-100/70">
                {selectedOffer.description}
              </p>
            </div>
          </div>

          <form className="mx-auto max-w-[460px] rounded-2xl border border-gray-800 bg-gray-900/40 p-5 shadow-[0_0_30px_rgba(99,102,241,0.12)]" onSubmit={onFinish}>
            <div className="mb-5 rounded-xl border border-indigo-500/20 bg-gray-950/70 p-4">
              <h2 className="text-base font-semibold text-gray-100">Resumo do pedido</h2>
              <div className="mt-3 flex items-start justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium text-indigo-100">{selectedOffer.name}</p>
                  <p className="text-indigo-100/65">{digitalProduct.checkoutName}</p>
                  <p className="mt-1 text-indigo-100/65">Conteudo digital liberado conforme a oferta escolhida.</p>
                </div>
                <div className="shrink-0 text-right">
                  {selectedOffer.originalPriceLabel ? (
                    <p className="text-xs text-indigo-100/45 line-through">{selectedOffer.originalPriceLabel}</p>
                  ) : null}
                  <p className="font-semibold text-emerald-300">{selectedOffer.priceLabel}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-indigo-100/80" htmlFor="email">
                  Seu melhor e-mail <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input w-full"
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  value={email}
                  placeholder="voce@email.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-indigo-100/80" htmlFor="name">
                  Nome (opcional)
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-input w-full"
                  placeholder="Como quer ser chamado"
                  onChange={(e) => setName(e.currentTarget.value)}
                  value={name}
                  autoComplete="name"
                />
              </div>
            </div>

            <ul className="mt-5 space-y-2 rounded-xl border border-gray-800 bg-gray-950/60 p-4 text-sm text-indigo-100/80" aria-label="Seguranca e entrega do checkout">
              {checkoutTrustHooks.map((hook) => (
                <li key={hook} className="flex gap-2">
                  <span aria-hidden="true">✓</span>
                  <span>{hook}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <button disabled={loading} className="btn w-full bg-linear-to-t from-indigo-600 to-indigo-500 text-white disabled:opacity-60" aria-label={`Pagar ${selectedOffer.priceLabel} e liberar download`}>
                {loading ? "Redirecionando..." : `Pagar ${selectedOffer.priceLabel} agora`}
              </button>
              <p className="mt-3 text-center text-xs text-indigo-100/60">Voce sera direcionado para o checkout seguro do Mercado Pago.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
