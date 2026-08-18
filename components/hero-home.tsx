import Image from "next/image";
import ModalVideo from "@/components/modal-video";
import PackVisual from "@/public/images/pack-16gb-5000.png";
import VideoThumb from "@/public/images/videoThumb.png";
import { entryPackOffer, recommendedPackOffer } from "@/lib/pricing";

const badges = [
  "Compra segura via Mercado Pago",
  "PIX com entrega automática",
  "Garantia de 7 dias",
  "Compatível com carro, USB e celular",
];

const heroStats = [
  { value: "+5.000", label: "músicas organizadas" },
  { value: "+40", label: "gêneros e pastas" },
  { value: "320kbps", label: "qualidade de áudio" },
  { value: "Imediato", label: "acesso após aprovação" },
];

export default function HeroHome() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#060811]">
      <Image
        src={PackVisual}
        alt=""
        aria-hidden="true"
        priority
        fill
        sizes="100vw"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-30"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,8,17,0.7)_0%,rgba(6,8,17,0.94)_55%,rgba(6,8,17,1)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent via-cyan-300/70 to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 md:pb-14 md:pt-14">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-1 text-xs font-semibold uppercase text-cyan-100">
            Pack Som de Rua atualizado para 2026
          </span>
          <h1
            className="mt-6 font-nacelle text-4xl font-semibold text-white md:text-6xl"
            data-aos="fade-up"
          >
            Pack de músicas 2026 para pen drive, carro e paredão.
          </h1>
          <p
            className="mx-auto mt-5 max-w-3xl text-lg text-slate-200 md:text-xl"
            data-aos="fade-up"
            data-aos-delay={150}
          >
            Mais de 5.000 músicas separadas por estilo, prontas para carro,
            paredão, pen drive, celular e festas sem perder tempo procurando
            faixa por faixa.
          </p>

          <div
            className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
            data-aos="fade-up"
            data-aos-delay={250}
          >
            <a
              className="btn min-h-12 w-full bg-linear-to-t from-emerald-500 to-lime-400 px-6 text-sm font-bold text-slate-950 shadow-[0_16px_40px_rgba(16,185,129,0.28)] hover:from-emerald-400 hover:to-lime-300 sm:w-auto"
              href="/baixar-musicas#escolha-seu-pack"
            >
              Escolher meu pack
            </a>
            <a
              className="btn min-h-12 w-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/20 sm:w-auto"
              href="#previa-do-pack"
            >
              Ver prévia do pack
            </a>
          </div>

          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-300"
            aria-label="Resumo da oferta"
          >
            <span>Essencial {entryPackOffer.priceLabel}</span>
            <strong className="font-nacelle text-3xl text-white">Completo {recommendedPackOffer.priceLabel}</strong>
            <span className="rounded-lg bg-emerald-300 px-3 py-1 text-xs font-bold uppercase text-slate-950">
              {recommendedPackOffer.badge}
            </span>
            <span>pagamento único</span>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs text-slate-100"
              >
                {badge}
              </span>
            ))}
          </div>

          <dl
            className="mt-9 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 text-left sm:grid-cols-4"
            aria-label="Indicadores do pack"
          >
            {heroStats.map((stat) => (
              <div key={stat.label} className="bg-slate-950/80 p-4 text-center">
                <dt className="text-xs uppercase text-slate-400">{stat.label}</dt>
                <dd className="mt-1 font-nacelle text-2xl font-semibold text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          id="previa-do-pack"
          className="mx-auto mt-10 max-w-5xl scroll-mt-24"
          aria-label="Prévia em vídeo do pack"
        >
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
