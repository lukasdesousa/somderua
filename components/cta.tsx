import OfferCheckoutLink from "@/components/offer-checkout-link";
import { recommendedPackOffer } from "@/lib/pricing";

const offerBullets = [
  "Download liberado automaticamente após a aprovação",
  "Pagamento único com acesso vitalício ao pack",
  "Reembolso integral se uma falha técnica não puder ser resolvida",
  "Suporte por e-mail se precisar de ajuda no acesso",
];

const paymentSignals = ["PIX", "Mercado Pago", "Compra segura", "Entrega imediata"];

export default function Cta() {
  return (
    <section className="bg-slate-950 py-14 md:py-20" aria-labelledby="cta-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 rounded-lg border border-emerald-300/30 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(8,13,24,0.92)_45%,rgba(14,165,233,0.12))] p-6 md:grid-cols-[1fr_0.85fr] md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-200">Oferta recomendada</p>
            <h2 id="cta-title" className="mt-3 font-nacelle text-3xl font-semibold text-white md:text-5xl">
              Leve o repertório pronto para hoje e pare de montar playlist do zero.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              Um único download com músicas organizadas para carro, pen drive, festas, paredão e uso diário.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {paymentSignals.map((signal) => (
                <span key={signal} className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100">
                  {signal}
                </span>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-white/10 bg-slate-950/80 p-5" aria-label="Resumo da oferta recomendada">
            <span className="inline-flex rounded-lg bg-emerald-300 px-3 py-1 text-xs font-bold uppercase text-slate-950">
              {recommendedPackOffer.badge}
            </span>
            <p className="mt-4 text-sm font-semibold uppercase text-emerald-200">{recommendedPackOffer.name}</p>
            <p className="mt-1 font-nacelle text-5xl font-semibold text-white">{recommendedPackOffer.priceLabel}</p>
            <p className="mt-2 text-sm text-slate-300">
              Mais de 28 GB com repertório 2026, hits do momento, virais e músicas atualizadas para paredão.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-slate-300" aria-label="Vantagens da oferta">
              {offerBullets.map((hook) => (
                <li key={hook} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" aria-hidden="true" />
                  <span>{hook}</span>
                </li>
              ))}
            </ul>
            <OfferCheckoutLink
              offer={recommendedPackOffer}
              source="footer_cta_recommended"
              className="btn mt-6 min-h-12 w-full bg-linear-to-t from-emerald-500 to-lime-400 text-sm font-bold text-slate-950 hover:from-emerald-400 hover:to-lime-300"
              ariaLabel={`Comprar ${recommendedPackOffer.name} por ${recommendedPackOffer.priceLabel}`}
            >
              Quero o Premium
            </OfferCheckoutLink>
            <p className="mt-3 text-center text-xs text-slate-400">
              Você será direcionado ao checkout seguro.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
