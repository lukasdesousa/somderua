import OfferCheckoutLink from "@/components/offer-checkout-link";
import { entryPackOffer } from "@/lib/pricing";

export default function HomePromotionBanner() {
  return (
    <>
      <div className="h-14" aria-hidden="true" />
      <aside
        className="fixed inset-x-0 top-16 z-50 border-y border-amber-200/25 bg-[linear-gradient(90deg,#7c2d12_0%,#ea580c_38%,#f59e0b_68%,#b45309_100%)] text-white shadow-[0_12px_35px_rgba(124,45,18,0.34)] md:top-20"
        aria-label="Promoção O Patrão Endoidou"
      >
        <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/25 bg-black/20 text-lg shadow-inner" aria-hidden="true">
              🔥
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-black uppercase tracking-[0.14em] text-amber-100 sm:text-sm">
                Por tempo limitado
              </p>
              <p className="truncate text-xs font-semibold text-white/90 sm:text-sm">
                Pack Básico 16 GB de <span className="text-white/70 line-through">{entryPackOffer.originalPriceLabel}</span>{" "}
                por <strong className="text-base text-white sm:text-lg">{entryPackOffer.priceLabel}</strong>
                <span className="ml-2 hidden rounded-full bg-slate-950/80 px-2 py-0.5 text-[10px] font-black text-amber-200 sm:inline-block">
                  {entryPackOffer.discountLabel}
                </span>
              </p>
            </div>
          </div>

          <OfferCheckoutLink
            offer={entryPackOffer}
            source="home_promotion_banner"
            className="shrink-0 rounded-lg border border-white/30 bg-slate-950 px-3 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-black sm:px-5 sm:text-sm"
            ariaLabel={`Aproveitar Pack Básico por ${entryPackOffer.priceLabel}`}
          >
            Aproveitar agora
          </OfferCheckoutLink>
        </div>
      </aside>
    </>
  );
}
