"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import BlurredShape from "@/public/images/blurred-shape.svg";

type PriceVariant = "A" | "B";

function getVariant(): PriceVariant {
  const key = "somderua_price_variant";
  const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  if (stored === "A" || stored === "B") return stored;
  const variant: PriceVariant = Math.random() < 0.5 ? "A" : "B";
  localStorage.setItem(key, variant);
  return variant;
}

export default function Cta() {
  const [variant, setVariant] = useState<PriceVariant>("A");

  useEffect(() => {
    setVariant(getVariant());
  }, []);

  const price = variant === "A" ? "R$5,00" : "R$9,90";

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-24 ml-20 -translate-x-1/2" aria-hidden="true">
        <Image className="max-w-none" src={BlurredShape} width={760} height={668} alt="Blurred shape" loading="lazy" />
      </div>
      <div className="max-w6xl mx-auto px-4 sm:px-6">
        <div className="bg-linear-to-r from-transparent via-gray-800/50 py-12 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Aproveite agora com acesso imediato
            </h2>
            {variant === "B" && <p className="mb-2 text-sm text-orange-300">De R$49 por R$9,90</p>}
            <p className="pb-6 font-nacelle text-4xl font-semibold text-indigo-200">{price}</p>

            <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
              <a className="btn group mb-4 w-full bg-linear-to-t from-indigo-600 to-indigo-500 text-white sm:mb-0 sm:w-auto" href="/formulario">
                <span className="relative inline-flex items-center font-semibold">
                  Comprar agora
                  <span className="ml-1 tracking-normal text-white/70 transition-transform group-hover:translate-x-0.5">-&gt;</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
