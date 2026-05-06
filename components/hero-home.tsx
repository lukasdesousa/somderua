"use client";

import VideoThumb from "@/public/images/videoThumb.png";
import ModalVideo from "@/components/modal-video";
import { offerPriceLabels } from "@/lib/pricing";

const badges = [
  "Compra segura",
  "Download imediato",
  "Funciona no celular, carro e pen drive",
  `${offerPriceLabels.discount} no pack completo`,
];

export default function HeroHome() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-16">
          <div className="pb-8 text-center md:pb-12">
            <span className="inline-flex rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-200">
              Pack completo com download imediato
            </span>
            <h1
              className="mt-6 animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-4xl font-semibold text-transparent md:text-5xl"
              data-aos="fade-up"
            >
              Mais de 4.500 músicas atualizadas pra fazer seu som bater forte HOJE
            </h1>
            <div className="mx-auto max-w-3xl">
              <p className="mb-6 text-lg text-indigo-100/80 md:text-xl" data-aos="fade-up" data-aos-delay={200}>
                Baixe agora e toque no seu carro em minutos, sem repetição e com grave ajustado pra paredão.
              </p>
              <div className="mb-8 flex flex-col items-center gap-3" aria-label="Oferta promocional do Pack Som de Rua">
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 shadow-[0_0_30px_rgba(16,185,129,0.16)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Preço promocional publicado</p>
                  <div className="mt-2 flex flex-wrap items-end justify-center gap-3">
                    <span className="text-base text-gray-400 line-through">De {offerPriceLabels.original}</span>
                    <strong className="font-nacelle text-4xl text-white">Por {offerPriceLabels.current}</strong>
                    <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-gray-950">{offerPriceLabels.discount}</span>
                  </div>
                  <p className="mt-2 text-sm text-emerald-100/85">Você economiza {offerPriceLabels.savings} e recebe o download imediatamente.</p>
                </div>
              </div>
              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                <div data-aos="fade-up" data-aos-delay={400}>
                  <a
                    className="btn group mb-3 w-full bg-linear-to-t from-indigo-600 to-indigo-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] transition sm:mb-0 sm:w-auto"
                    href="/formulario"
                  >
                    <span className="relative inline-flex items-center font-semibold">
                      BAIXAR AGORA
                      <span className="ml-1 tracking-normal text-white/70 transition-transform group-hover:translate-x-0.5">-&gt;</span>
                    </span>
                  </a>
                  <p className="mt-2 text-xs text-indigo-100/75">
                    Pague {offerPriceLabels.current} uma vez - garantia de 7 dias - acesso vitalício
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {badges.map((badge) => (
                  <span key={badge} className="rounded-full border border-gray-700 bg-gray-900/80 px-3 py-1 text-xs text-gray-200">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <ModalVideo
            thumb={VideoThumb}
            thumbWidth={1104}
            thumbHeight={576}
            thumbAlt="Prévia do pack de músicas Som de Rua"
            video="videos/somderua_preview.mp4"
            videoWidth={1920}
            videoHeight={1080}
          />
        </div>
      </div>
    </section>
  );
}
