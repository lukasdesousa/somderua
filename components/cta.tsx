import { offerPriceLabels } from "@/lib/pricing";

const offerBullets = [
  "Download liberado automaticamente apos a aprovacao",
  "Pagamento unico com acesso vitalicio ao pack",
  "Garantia de 7 dias para testar com calma",
  "Suporte por e-mail se precisar de ajuda no acesso",
];

const paymentSignals = ["PIX", "Mercado Pago", "Compra segura", "Entrega imediata"];

export default function Cta() {
  return (
    <section className="bg-slate-950 py-14 md:py-20" aria-labelledby="cta-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 rounded-lg border border-emerald-300/30 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(8,13,24,0.92)_45%,rgba(14,165,233,0.12))] p-6 md:grid-cols-[1fr_0.85fr] md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-200">Oferta do pack completo</p>
            <h2 id="cta-title" className="mt-3 font-nacelle text-3xl font-semibold text-white md:text-5xl">
              Leve o repertorio pronto para hoje e pare de montar playlist do zero.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              Um unico download com musicas organizadas para carro, pen drive, festas, paredao e uso diario.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {paymentSignals.map((signal) => (
                <span key={signal} className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100">
                  {signal}
                </span>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-white/10 bg-slate-950/80 p-5" aria-label="Resumo da oferta">
            <p className="text-sm text-slate-400 line-through">De {offerPriceLabels.original}</p>
            <div className="mt-1 flex flex-wrap items-end gap-3">
              <p className="font-nacelle text-5xl font-semibold text-white">Por {offerPriceLabels.current}</p>
              <span className="mb-1 rounded-lg bg-emerald-300 px-3 py-1 text-xs font-bold uppercase text-slate-950">
                {offerPriceLabels.discount}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-emerald-200">
              Economia de {offerPriceLabels.savings} no {offerPriceLabels.installment}
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-slate-300" aria-label="Vantagens da oferta">
              {offerBullets.map((hook) => (
                <li key={hook} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" aria-hidden="true" />
                  <span>{hook}</span>
                </li>
              ))}
            </ul>
            <a
              className="btn mt-6 min-h-12 w-full bg-linear-to-t from-emerald-500 to-lime-400 text-sm font-bold text-slate-950 hover:from-emerald-400 hover:to-lime-300"
              href="/formulario"
              aria-label={`Comprar Pack Som de Rua por ${offerPriceLabels.current}`}
            >
              Comprar pack completo
            </a>
            <p className="mt-3 text-center text-xs text-slate-400">
              Voce sera direcionado ao checkout seguro.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
