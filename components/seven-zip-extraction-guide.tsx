import {
  SEVEN_ZIP_OFFICIAL_URL,
  ZARCHIVER_GOOGLE_PLAY_URL,
} from "@/lib/seven-zip";

type SevenZipExtractionGuideProps = {
  headingId: string;
  compact?: boolean;
  premium?: boolean;
  className?: string;
};

const extractionSteps = [
  <>Baixe o Pack e aguarde o download terminar completamente.</>,
  <>Baixe e instale o 7-Zip.</>,
  <>
    Clique com o botão direito no arquivo{" "}
    <code className="rounded bg-black/25 px-1.5 py-0.5 font-mono text-[0.9em] text-emerald-100">
      .zip
    </code>{" "}
    já baixado.
  </>,
  <>
    Selecione{" "}
    <strong className="font-semibold text-white">
      7-Zip → Extrair para...
    </strong>
  </>,
  <>Aguarde a extração terminar antes de abrir ou mover as músicas.</>,
];

const androidExtractionSteps = [
  <>Baixe o Pack e aguarde o download terminar completamente.</>,
  <>
    Baixe e instale o{" "}
    <strong className="font-semibold text-white">ZArchiver</strong>.
  </>,
  <>
    Abra o ZArchiver e localize o arquivo{" "}
    <code className="rounded bg-black/25 px-1.5 py-0.5 font-mono text-[0.9em] text-indigo-100">
      .zip
    </code>{" "}
    baixado.
  </>,
  <>
    Toque no arquivo e selecione{" "}
    <strong className="font-semibold text-white">Extrair aqui</strong> ou{" "}
    <strong className="font-semibold text-white">Extrair para...</strong>
  </>,
  <>Aguarde a extração terminar antes de abrir as músicas.</>,
];

export default function SevenZipExtractionGuide({
  headingId,
  compact = false,
  premium = false,
  className = "",
}: SevenZipExtractionGuideProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-emerald-300/20 bg-slate-950/80 shadow-[0_24px_70px_rgba(0,0,0,0.24)] ${className}`}
      aria-labelledby={headingId}
    >
      <div
        className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className={`relative grid gap-7 ${compact ? "p-5 sm:p-7" : "p-6 sm:p-8 md:grid-cols-[0.82fr_1.18fr] md:gap-10 md:p-10"}`}
      >
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-emerald-300/25 bg-emerald-300/10 text-emerald-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7 3.75h6.8L18 7.95v12.3H7V3.75Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.5 3.75v4.5H18M10.25 7h2M10.25 10h2M10.25 13h2M10.25 16h2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-200">
              Windows · 7-Zip
            </span>
          </div>

          <h2
            id={headingId}
            className={`mt-5 font-nacelle font-semibold text-white ${compact ? "text-2xl sm:text-3xl" : "text-3xl md:text-4xl"}`}
          >
            Como extrair o Pack sem erros
          </h2>
          <p className="mt-4 leading-relaxed text-slate-300">
            {premium
              ? "O Pack Premium tem mais de 28 GB e chega em um arquivo"
              : "O Pack é entregue em um arquivo"}{" "}
            <code className="rounded bg-black/25 px-1.5 py-0.5 font-mono text-[0.9em] text-emerald-100">
              .zip
            </code>{" "}
            e não precisa ser instalado. Depois que o download terminar, extraia
            todo o conteúdo com o 7-Zip. Esse processo evita os erros mais
            comuns de extração causados pelo tamanho do arquivo.
          </p>

          <a
            href={SEVEN_ZIP_OFFICIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/35 bg-emerald-300/[0.08] px-4 py-3 text-sm font-bold text-emerald-100 transition hover:border-emerald-200/60 hover:bg-emerald-300/[0.14] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 sm:w-auto"
          >
            Baixar 7-Zip — Site Oficial
            <svg
              viewBox="0 0 20 20"
              width="17"
              height="17"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7.5 5.5h7v7M14.25 5.75 6 14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <ol className="grid content-start gap-3">
          {extractionSteps.map((step, index) => (
            <li
              key={index}
              className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-3.5 text-left sm:p-4"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-300 font-nacelle text-sm font-semibold text-slate-950">
                {index + 1}
              </span>
              <span className="pt-1 text-sm leading-6 text-slate-300 sm:text-base">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="relative border-t border-white/10 bg-indigo-400/[0.035]">
        <div
          className={`grid gap-7 ${compact ? "p-5 sm:p-7" : "p-6 sm:p-8 md:grid-cols-[0.82fr_1.18fr] md:gap-10 md:p-10"}`}
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-indigo-300/25 bg-indigo-300/10 text-indigo-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="6.5"
                    y="2.75"
                    width="11"
                    height="18.5"
                    rx="2.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 5.5h4M10.5 18.5h3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="rounded-full border border-indigo-300/20 bg-indigo-300/[0.08] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-200">
                Celular e tablet
              </span>
            </div>

            <h3
              className={`mt-5 font-nacelle font-semibold text-white ${compact ? "text-2xl" : "text-2xl md:text-3xl"}`}
            >
              No Android
            </h3>
            <p className="mt-4 leading-relaxed text-slate-300">
              Use o ZArchiver para abrir e extrair o arquivo{" "}
              <code className="rounded bg-black/25 px-1.5 py-0.5 font-mono text-[0.9em] text-indigo-100">
                .zip
              </code>
              . O 7-Zip não possui versão oficial para Android. Mantenha espaço
              livre para o arquivo baixado e para a pasta que será extraída.
            </p>

            <a
              href={ZARCHIVER_GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-300/35 bg-indigo-300/[0.08] px-4 py-3 text-sm font-bold text-indigo-100 transition hover:border-indigo-200/60 hover:bg-indigo-300/[0.14] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 sm:w-auto"
            >
              Baixar ZArchiver — Google Play
              <svg
                viewBox="0 0 20 20"
                width="17"
                height="17"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7.5 5.5h7v7M14.25 5.75 6 14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <ol className="grid content-start gap-3">
            {androidExtractionSteps.map((step, index) => (
              <li
                key={index}
                className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-3.5 text-left sm:p-4"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-indigo-300 font-nacelle text-sm font-semibold text-slate-950">
                  {index + 1}
                </span>
                <span className="pt-1 text-sm leading-6 text-slate-300 sm:text-base">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
