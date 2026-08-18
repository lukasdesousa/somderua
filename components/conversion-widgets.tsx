import { offerPriceLabels } from "@/lib/pricing";

export default function ConversionWidgets() {
  return (
    <aside className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-lg border border-emerald-300/30 bg-slate-950/95 px-4 py-3 text-xs text-slate-100 shadow-[0_16px_42px_rgba(0,0,0,0.36)] backdrop-blur md:inset-x-auto md:left-4 md:mx-0 md:max-w-[360px]">
      <span>
        Packs a partir de <strong className="text-emerald-200">{offerPriceLabels.entry}</strong>
      </span>
      <a className="rounded-lg bg-emerald-300 px-3 py-1.5 font-bold text-slate-950" href="/baixar-musicas#escolha-seu-pack">
        Ver opções
      </a>
    </aside>
  );
}
