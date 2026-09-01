import type { Metadata } from "next";
import Link from "next/link";
import OfferCheckoutLink from "@/components/offer-checkout-link";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import {
  digitalProduct,
  entryPackOffer,
  packOfferList,
  recommendedPackOffer,
  type PackOfferId,
} from "@/lib/pricing";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, digitalProductOffersSchema, faqPageSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

const downloadFlow = [
  {
    title: "Escolha",
    text: "Compare o Básico de 16 GB com o Premium de mais de 28 GB e escolha o ideal para você.",
  },
  {
    title: "Pagamento",
    text: "Confira o pack escolhido, finalize no checkout seguro e aguarde a confirmação.",
  },
  {
    title: "Download",
    text: "Quando o pagamento é aprovado, o acesso ao download é liberado automaticamente.",
  },
];

const safetyChecks = [
  "Página com valor e produto explicados antes da compra.",
  "Checkout seguro para processar o pagamento.",
  "Suporte por e-mail para dúvidas de acesso.",
  "Reembolso integral em caso de falha técnica não solucionada.",
];

const comparisonRows = [
  { label: "Volume do pack", essencial: "16 GB", completo: "Mais de 28 GB" },
  { label: "Quantidade de faixas", essencial: "Mais de 4.950", completo: "10 mil" },
  { label: "Repertórios atualizados em 2026", essencial: "✓", completo: "✓" },
  { label: "Hits de maio a agosto de 2026", essencial: "Não inclusos", completo: "Inclusos" },
  { label: "Hits do momento e músicas virais", essencial: "—", completo: "✓" },
  { label: "Seleção para pen drive", essencial: "Seleção base", completo: "Seleção atualizada" },
  { label: "Pastas organizadas por estilos", essencial: "✓", completo: "✓" },
  { label: "Download após a aprovação", essencial: "Imediato", completo: "Imediato" },
  { label: "Preço", essencial: entryPackOffer.priceLabel, completo: recommendedPackOffer.priceLabel },
];

const offerDetails: Record<PackOfferId, {
  volume: string;
  volumeLabel: string;
  updateLabel: string;
  availabilityNote: string;
  benefits: string[];
}> = {
  essencial: {
    volume: "16 GB",
    volumeLabel: "de músicas",
    updateLabel: "Repertórios 2026",
    availabilityNote: "Não inclui os hits lançados entre maio e agosto de 2026.",
    benefits: [
      "Bons repertórios, variados e atualizados",
      "Pastas organizadas por estilos musicais",
      "Seleção para carro, pen drive e uso diário",
      "Download liberado após a aprovação",
      "Reembolso integral para falha técnica não solucionada",
    ],
  },
  completo: {
    volume: "+28 GB",
    volumeLabel: "de músicas",
    updateLabel: "Atualizado em 2026",
    availabilityNote: "Inclui os hits atuais de maio a agosto de 2026.",
    benefits: [
      "Hits do momento e músicas virais",
      "Repertório atualizado e organizado para pen drive",
      "Seleções para som automotivo, festas e resenhas",
      "Download rápido e imediato após a aprovação",
      "Reembolso integral para falha técnica não solucionada",
    ],
  },
};

const faqs = [
  {
    question: "Os dois packs têm conteúdos diferentes?",
    answer: "Sim. O Pack Básico tem 16 GB de repertórios atualizados, mas não inclui os hits de maio a agosto de 2026. O Pack Premium tem mais de 28 GB e inclui hits do momento, virais e músicas organizadas para pen drive.",
  },
  {
    question: "Qual o valor?",
    answer: `Na promoção O Patrão Endoidou, o Pack Básico de 16 GB baixou de ${entryPackOffer.originalPriceLabel} para ${entryPackOffer.priceLabel}. O Pack Premium de mais de 28 GB custa ${recommendedPackOffer.priceLabel}.`,
  },
  {
    question: "Como baixar músicas agora?",
    answer: "Escolha uma oferta, finalize o pagamento e aguarde a confirmação para acessar o download automático.",
  },
  {
    question: "Posso baixar pelo celular?",
    answer: "Pode. Para copiar para um pen drive, normalmente é mais prático usar um computador ou adaptador compatível.",
  },
];

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Baixar pack de musicas para pen drive em 2026",
    description: "Baixe um pack de musicas para pen drive organizado por estilos. Escolha entre 16 GB no Basico ou mais de 28 GB no Premium, com acesso automatico.",
    path: "/baixar-musicas",
    keywords: ["pack de musicas para pen drive", "baixar pack de musicas", "musicas para pen drive", "download de musicas para pen drive"],
  });
}

export default function BaixarMusicasPage() {
  const crumbs = [{ name: "Início", path: "/" }, { name: "Baixar músicas", path: "/baixar-musicas" }];

  return (
    <>
      <JsonLd id="baixar-musicas-breadcrumb" data={breadcrumbSchema(crumbs)} />
      <JsonLd
        id="baixar-musicas-product"
        data={digitalProductOffersSchema({
          name: digitalProduct.checkoutName,
          description: digitalProduct.description,
          productPath: "/baixar-musicas",
          offers: packOfferList.map((offer) => ({
            id: offer.id,
            name: offer.name,
            description: offer.description,
            price: offer.price,
            originalPrice: offer.originalPrice,
            currency: digitalProduct.currency,
            offerPath: `/baixar-musicas#pack-${offer.id}`,
          })),
        })}
      />
      <JsonLd id="baixar-musicas-faq" data={faqPageSchema(faqs)} />
      <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Baixar músicas" }]} />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" aria-labelledby="baixar-musicas-title">
        <section className="max-w-4xl">
          <p className="mb-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
            Packs atualizados em 2026
          </p>
          <h1 id="baixar-musicas-title" className="text-4xl font-semibold text-gray-100 md:text-5xl">
            Do repertório essencial aos hits que estão tocando agora.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-indigo-200/75">
            Escolha seu pack de músicas para pen drive: 16 GB de bons repertórios no Básico ou mais de 28 GB no Premium, com hits do momento e músicas organizadas por estilo.
          </p>
          <p className="mt-3 max-w-3xl text-sm font-medium text-emerald-200">
            Produto 100% digital: o acesso é liberado por download após a aprovação do pagamento. Não há envio de pen drive ou de qualquer item físico.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#escolha-seu-pack" className="btn bg-linear-to-t from-indigo-600 to-indigo-500 text-white">
              Escolher meu pack
            </a>
            <span className="text-sm text-indigo-100/65">
              A partir de <span className="line-through">{entryPackOffer.originalPriceLabel}</span>{" "}
              <strong className="text-emerald-300">{entryPackOffer.priceLabel}</strong> em pagamento único.
            </span>
          </div>
        </section>

        <section id="escolha-seu-pack" className="mt-12 scroll-mt-24" aria-labelledby="offers-title">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-300">Escolha seu pack</p>
            <h2 id="offers-title" className="mt-2 text-3xl font-semibold text-gray-100">Compare e escolha sem dúvida</h2>
            <p className="mt-3 text-indigo-200/70">
              Os dois packs têm pagamento único, conteúdo organizado e acesso após a aprovação. A diferença está no tamanho e na atualização do repertório.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 md:items-stretch">
            {packOfferList.map((offer) => {
              const details = offerDetails[offer.id];

              return (
                <article
                  key={offer.id}
                  id={`pack-${offer.id}`}
                  className={[
                    "relative isolate flex h-full min-h-[610px] overflow-hidden rounded-2xl border p-6 shadow-[0_22px_55px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 sm:p-7",
                    offer.recommended
                      ? "border-emerald-300/70 bg-[linear-gradient(155deg,rgba(16,185,129,0.2),rgba(17,24,39,0.96)_48%,rgba(6,78,59,0.28))] shadow-emerald-950/30"
                      : "border-slate-700/80 bg-[linear-gradient(155deg,rgba(51,65,85,0.72),rgba(15,23,42,0.96)_48%,rgba(30,41,59,0.72))]",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "absolute -right-20 -top-20 -z-10 h-56 w-56 rounded-full blur-3xl",
                      offer.recommended ? "bg-emerald-400/20" : "bg-indigo-400/10",
                    ].join(" ")}
                    aria-hidden="true"
                  />

                  <div className="flex w-full flex-1 flex-col">
                    <div className="flex min-h-8 items-start justify-between gap-3">
                      {offer.promotionLabel ? (
                        <span className="inline-flex w-fit rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-slate-950 shadow-lg shadow-orange-950/30">
                          🔥 {offer.promotionLabel}
                        </span>
                      ) : offer.badge ? (
                        <span className="inline-flex w-fit rounded-full bg-emerald-300 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-slate-950 shadow-lg shadow-emerald-950/30">
                          {offer.badge}
                        </span>
                      ) : (
                        <span className="inline-flex w-fit rounded-full border border-slate-600 bg-slate-900/60 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-300">
                          Mais econômico
                        </span>
                      )}
                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-indigo-100/80">
                        {details.updateLabel}
                      </span>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-200/65">{offer.name}</p>
                      <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
                        <strong className="font-nacelle text-5xl font-semibold leading-none text-white sm:text-6xl">{details.volume}</strong>
                        <span className="pb-1 text-sm text-indigo-100/60">{details.volumeLabel}</span>
                      </div>
                      <p className="mt-5 text-indigo-100/75">{offer.description}</p>
                    </div>

                    <div
                      className={[
                        "mt-5 rounded-xl border px-4 py-3 text-sm font-medium",
                        offer.recommended
                          ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"
                          : "border-amber-300/20 bg-amber-300/5 text-amber-100/80",
                      ].join(" ")}
                    >
                      {details.availabilityNote}
                    </div>

                    <ul className="mt-5 grid gap-3 text-sm text-indigo-100/85" aria-label={`Benefícios do ${offer.name}`}>
                      {details.benefits.map((benefit) => (
                        <li key={benefit} className="flex gap-3">
                          <span
                            className={[
                              "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs",
                              offer.recommended ? "bg-emerald-300/15 text-emerald-200" : "bg-indigo-300/10 text-indigo-200",
                            ].join(" ")}
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-7">
                      <div className="mb-4 flex items-end justify-between gap-3 border-t border-white/10 pt-5">
                        <span className="text-sm text-indigo-100/60">Pagamento único</span>
                        <div className="text-right">
                          {offer.originalPriceLabel ? (
                            <div className="mb-1 flex items-center justify-end gap-2 text-xs">
                              <span className="text-indigo-100/50 line-through">{offer.originalPriceLabel}</span>
                              <span className="rounded-full bg-amber-300 px-2 py-0.5 font-extrabold text-slate-950">
                                {offer.discountLabel}
                              </span>
                            </div>
                          ) : null}
                          <strong className="font-nacelle text-3xl font-semibold text-white">{offer.priceLabel}</strong>
                        </div>
                      </div>
                      <OfferCheckoutLink
                        offer={offer}
                        source="baixar_musicas_offer_card"
                        className={[
                          "btn min-h-12 w-full text-center text-sm font-bold",
                          offer.recommended
                            ? "bg-linear-to-t from-emerald-500 to-lime-400 text-slate-950 shadow-lg shadow-emerald-950/40 hover:from-emerald-400 hover:to-lime-300"
                            : "border border-slate-600 bg-slate-800 text-white hover:bg-slate-700",
                        ].join(" ")}
                      >
                        {offer.cta}
                      </OfferCheckoutLink>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-4 rounded-xl border border-indigo-300/15 bg-indigo-400/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <p className="font-semibold text-white">Ficou com alguma dúvida antes de escolher?</p>
              <p className="mt-1 text-sm text-indigo-100/65">
                Acione nosso suporte. Responderemos rapidamente para ajudar você a escolher o pack ideal.
              </p>
            </div>
            <Link
              href="/suporte"
              className="btn-sm shrink-0 border border-white/10 bg-white/10 text-center text-white hover:bg-white/15"
            >
              Falar com o suporte
            </Link>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="comparison-title">
          <h2 id="comparison-title" className="text-3xl font-semibold text-gray-100">Compare com transparência</h2>
          <div className="mt-6 overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full min-w-[520px] border-collapse bg-gray-900/50 text-left text-sm">
              <caption className="sr-only">Comparação entre Pack Básico e Pack Premium</caption>
              <thead className="bg-gray-950/70 text-indigo-100">
                <tr>
                  <th className="px-4 py-4 font-semibold" scope="col">Item</th>
                  <th className="px-4 py-4 font-semibold" scope="col">Básico</th>
                  <th className="px-4 py-4 font-semibold text-emerald-200" scope="col">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-indigo-100/80">
                {comparisonRows.map((row) => (
                  <tr key={row.label}>
                    <th className="px-4 py-4 font-semibold text-gray-100" scope="row">{row.label}</th>
                    <td className="px-4 py-4">{row.essencial}</td>
                    <td className="px-4 py-4">{row.completo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="download-flow-title">
          <h2 id="download-flow-title" className="text-3xl font-semibold text-gray-100">Como funciona o download</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {downloadFlow.map((item) => (
              <article key={item.title} className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
                <h3 className="font-semibold text-gray-100">{item.title}</h3>
                <p className="mt-2 text-indigo-100/75">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-8 md:grid-cols-[0.9fr_1fr]" aria-labelledby="safe-download-title">
          <div>
            <h2 id="safe-download-title" className="text-3xl font-semibold text-gray-100">Sinais de compra segura</h2>
            <p className="mt-3 text-indigo-200/70">
              Antes de baixar qualquer pack, confira se a página explica o produto, mostra o preço e oferece suporte caso algo dê errado.
            </p>
          </div>
          <ul className="grid gap-3">
            {safetyChecks.map((item) => (
              <li key={item} className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-indigo-100/80">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="baixar-musicas-faq-title">
          <h2 id="baixar-musicas-faq-title" className="text-3xl font-semibold text-gray-100">Dúvidas sobre baixar músicas</h2>
          <div className="mt-6 grid gap-4">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
                <h3 className="font-semibold text-gray-100">{faq.question}</h3>
                <p className="mt-2 text-indigo-100/75">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-lg border border-indigo-500/25 bg-indigo-500/10 p-5" aria-labelledby="baixar-related-title">
          <h2 id="baixar-related-title" className="text-2xl font-semibold text-gray-100">Guias relacionados</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/musicas-para-pen-drive" className="btn-sm bg-gray-800 hover:bg-gray-700">Músicas para pen drive</Link>
            <Link href="/blog/como-organizar-pastas-de-musicas-no-pen-drive" className="btn-sm bg-gray-800 hover:bg-gray-700">Organizar o pen drive</Link>
            <Link href="/musicas-para-som-automotivo" className="btn-sm bg-gray-800 hover:bg-gray-700">Som automotivo</Link>
            <Link href="/blog/como-baixar-pack-de-musicas-com-seguranca" className="btn-sm bg-gray-800 hover:bg-gray-700">Compra segura</Link>
          </div>
        </section>
      </main>
    </>
  );
}
