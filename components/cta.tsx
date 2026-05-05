"use client";

import Image from "next/image";
import BlurredShape from "@/public/images/blurred-shape.svg";
import { offerPriceLabels } from "@/lib/pricing";

const conversionHooks = [
  "Liberação automática após o pagamento",
  `Economia de ${offerPriceLabels.savings} hoje`,
  "Mais de 4.500 músicas para carro, pen drive e paredão",
];

export default function Cta() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="cta-title">
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-24 ml-20 -translate-x-1/2" aria-hidden="true">
        <Image className="max-w-none" src={BlurredShape} width={760} height={668} alt="" loading="lazy" />
      </div>
      <div className="max-w6xl mx-auto px-4 sm:px-6">
        <div className="bg-linear-to-r from-transparent via-gray-800/50 py-12 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
              {offerPriceLabels.discount} por tempo limitado
            </p>
            <h2 id="cta-title" className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Garanta seu pack completo com acesso imediato
            </h2>

            <div className="mx-auto mb-6 max-w-md rounded-3xl border border-indigo-500/25 bg-gray-950/70 p-5 shadow-[0_0_34px_rgba(99,102,241,0.22)]">
              <p className="text-sm text-gray-400 line-through">De {offerPriceLabels.original}</p>
              <p className="font-nacelle text-5xl font-semibold text-indigo-100">Por {offerPriceLabels.current}</p>
              <p className="mt-2 text-sm font-medium text-emerald-300">{offerPriceLabels.installment} • download liberado na hora</p>
              <ul className="mt-4 grid gap-2 text-left text-sm text-indigo-100/80" aria-label="Vantagens da oferta">
                {conversionHooks.map((hook) => (
                  <li key={hook} className="flex gap-2">
                    <span aria-hidden="true">✅</span>
                    <span>{hook}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
              <a className="btn group mb-4 w-full bg-linear-to-t from-indigo-600 to-indigo-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] sm:mb-0 sm:w-auto" href="/formulario" aria-label={`Comprar Pack Som de Rua por ${offerPriceLabels.current}`}>
                <span className="relative inline-flex items-center font-semibold">
                  Quero economizar agora
                  <span className="ml-1 tracking-normal text-white/70 transition-transform group-hover:translate-x-0.5">-&gt;</span>
                </span>
              </a>
            </div>
            <p className="mt-3 text-xs text-indigo-100/70">Compra segura, acesso vitalício e garantia de 7 dias.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
