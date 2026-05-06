import { offerPriceLabels } from "@/lib/pricing";

export default function ConversionWidgets() {
  return (
    <aside className="fixed bottom-4 left-4 z-40 max-w-[calc(100vw-2rem)] rounded-full border border-emerald-500/40 bg-gray-950/95 px-4 py-2 text-xs text-emerald-100 shadow-lg">
      Compra segura - {offerPriceLabels.current} - download liberado após o pagamento
    </aside>
  );
}
