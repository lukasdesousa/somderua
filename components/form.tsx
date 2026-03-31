'use client'

import { useEffect, useState } from "react";
import useMercadoPago from "@/hooks/useMercadoPago";

type PriceVariant = "A" | "B";

const getVariant = (): PriceVariant => {
  const storageKey = "somderua_price_variant";
  const stored = localStorage.getItem(storageKey);
  if (stored === "A" || stored === "B") return stored;
  const variant: PriceVariant = Math.random() < 0.5 ? "A" : "B";
  localStorage.setItem(storageKey, variant);
  return variant;
};

export default function Form() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [variant, setVariant] = useState<PriceVariant>("A");
  const { createMercadoPagoCheckout } = useMercadoPago();

  const onFinish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)

    localStorage.setItem('user_name', name);
    localStorage.setItem('user_email', email);

    await createMercadoPagoCheckout({ userEmail: email, name: name || "Cliente Som de Rua" });
    setLoading(false)
  }

  useEffect(() => {
    const cachedEmail = localStorage.getItem('user_email');
    const cachedName = localStorage.getItem('user_name');

    if(cachedEmail || cachedName) {
      setEmail(cachedEmail || '');
      setName(cachedName || '');
    }

    setVariant(getVariant());
  }, [])

  const priceLabel = variant === "A" ? "R$5,00" : "R$9,90";

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="pb-10 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Finalize seu acesso imediato
            </h1>
            {variant === "B" && <p className="mt-3 text-sm text-orange-300">De R$49,00 por R$9,90</p>}
            <p className="mt-1 text-2xl font-semibold text-indigo-200">{priceLabel}</p>
          </div>

          <form className="mx-auto max-w-[420px] rounded-2xl border border-gray-800 bg-gray-900/40 p-5" onSubmit={onFinish}>
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
                />
              </div>
            </div>

            <div className="mt-5 space-y-2 rounded-xl border border-gray-800 bg-gray-950/60 p-4 text-sm text-indigo-100/80">
              <p>💳 Pagamento 100% seguro</p>
              <p>⚡ Entrega automática imediata</p>
              <p>✅ Acesso liberado na hora</p>
            </div>

            <div className="mt-6">
              <button disabled={loading} className="btn w-full bg-linear-to-t from-indigo-600 to-indigo-500 text-white disabled:opacity-60">
                {loading ? "Redirecionando..." : "Ir para o checkout"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
