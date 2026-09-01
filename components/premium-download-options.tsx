"use client";

import type { DownloadProvider } from "@/lib/downloads";

type PremiumDownloadOptionsProps = {
  loadingProvider: DownloadProvider | null;
  onDownload: (provider: DownloadProvider) => void;
};

const options: Array<{
  provider: DownloadProvider;
  badge: string;
  title: string;
  description: string;
  buttonLabel: string;
  loadingLabel: string;
  cardClassName: string;
  buttonClassName: string;
}> = [
  {
    provider: "google_drive",
    badge: "RECOMENDADO NO CELULAR",
    title: "Google Drive",
    description: "Melhor opção para telefones e outros dispositivos móveis.",
    buttonLabel: "Baixar pelo Google Drive",
    loadingLabel: "Abrindo Google Drive...",
    cardClassName: "border-emerald-400/30 bg-emerald-500/10",
    buttonClassName:
      "bg-linear-to-t from-emerald-500 to-lime-400 text-slate-950",
  },
  {
    provider: "direct",
    badge: "RECOMENDADO NO PC",
    title: "Download direto",
    description:
      "Melhor opção para computadores. Baixa o arquivo ZIP pelo navegador.",
    buttonLabel: "Baixar direto pelo site",
    loadingLabel: "Iniciando download...",
    cardClassName: "border-indigo-400/30 bg-indigo-500/10",
    buttonClassName: "bg-linear-to-t from-indigo-600 to-indigo-500 text-white",
  },
];

export default function PremiumDownloadOptions({
  loadingProvider,
  onDownload,
}: PremiumDownloadOptionsProps) {
  return (
    <div className="mt-6">
      <div className="grid gap-4 text-left sm:grid-cols-2">
        {options.map((option) => {
          const isLoading = loadingProvider === option.provider;

          return (
            <article
              key={option.provider}
              className={`flex flex-col rounded-2xl border p-4 ${option.cardClassName}`}
            >
              <span className="w-fit rounded-full border border-white/10 bg-gray-950/40 px-2.5 py-1 text-[10px] font-bold tracking-wide text-indigo-100/80">
                {option.badge}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {option.title}
              </h3>
              <p className="mt-1 grow text-sm leading-6 text-indigo-100/65">
                {option.description}
              </p>
              <button
                type="button"
                className={`btn mt-4 w-full cursor-pointer font-bold disabled:cursor-wait disabled:opacity-60 ${option.buttonClassName}`}
                onClick={() => onDownload(option.provider)}
                disabled={loadingProvider !== null}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <span
                    className="inline-flex items-center justify-center gap-2"
                    role="status"
                  >
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current"
                      aria-hidden="true"
                    />
                    {option.loadingLabel}
                  </span>
                ) : (
                  option.buttonLabel
                )}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
