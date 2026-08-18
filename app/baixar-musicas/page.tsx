import type { Metadata } from "next";
import Link from "next/link";
import OfferCheckoutLink from "@/components/offer-checkout-link";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { packOfferList, type PackOfferId } from "@/lib/pricing";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

const downloadFlow = [
  {
    title: "Escolha",
    text: "Selecione o pack que faz mais sentido para o seu uso: entrada ou completo.",
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
  "Garantia de 7 dias para testar o pack.",
];

const comparisonRows = [
  { label: "Acesso digital", essencial: "✓", completo: "✓" },
  { label: "Pastas organizadas por estilos musicais", essencial: "✓", completo: "✓" },
  { label: "Pastas por bandas e seleções específicas", essencial: "—", completo: "✓" },
  { label: "Faixas para paredões e som automotivo", essencial: "Seleção base", completo: "Seleção ampliada" },
  { label: "Quantidade de músicas", essencial: "Pack de entrada", completo: "Mais músicas" },
  { label: "Qualidade de áudio", essencial: "Boa qualidade", completo: "Melhor qualidade de áudio" },
  { label: "⭐ Oferta recomendada", essencial: "—", completo: "✓" },
  { label: "Preço", essencial: "R$9,90", completo: "R$19,90" },
];

const offerBenefits: Record<PackOfferId, string[]> = {
  essencial: [
    "Acesso digital ao pack de entrada",
    "Pastas organizadas por estilos musicais",
    "Seleção base para carro, pen drive e uso diário",
    "Checkout seguro via Mercado Pago",
    "Garantia de 7 dias e suporte por e-mail",
  ],
  completo: [
    "Mais músicas no pack completo",
    "Melhor qualidade de áudio",
    "Faixas para paredões e som automotivo",
    "Pastas por estilos musicais, bandas e seleções específicas",
    "Garantia de 7 dias e suporte por e-mail",
  ],
};

const faqs = [
  {
    question: "Os dois packs têm conteúdos diferentes?",
    answer: "Sim. O Pack Essencial é a opção de entrada, enquanto o Pack Completo reúne uma seleção maior, com mais organização e foco em som automotivo e paredões.",
  },
  {
    question: "Qual o valor?",
    answer: "Você pode escolher entre Pack Essencial por R$9,90 ou Pack Completo por R$19,90.",
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
    title: "Baixar músicas atualizadas para carro e paredão",
    description: "Página oficial para baixar músicas com acesso imediato, repertório atualizado e entrega automática após o pagamento.",
    path: "/baixar-musicas",
    keywords: ["baixar músicas", "download de músicas", "músicas atualizadas"],
  });
}

export default function BaixarMusicasPage() {
  const crumbs = [{ name: "Início", path: "/" }, { name: "Baixar músicas", path: "/baixar-musicas" }];

  return (
    <>
      <JsonLd id="baixar-musicas-breadcrumb" data={breadcrumbSchema(crumbs)} />
      <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Baixar músicas" }]} />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" aria-labelledby="baixar-musicas-title">
        <section className="max-w-4xl">
          <p className="mb-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
            Duas opções para baixar seu repertório
          </p>
          <h1 id="baixar-musicas-title" className="text-4xl font-semibold text-gray-100 md:text-5xl">
            Seu repertório pronto para tocar — sem perder horas procurando música por música.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-indigo-200/75">
            Tenha seu pack organizado e pronto para baixar, transferir e utilizar em dispositivos compatíveis.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#escolha-seu-pack" className="btn bg-linear-to-t from-indigo-600 to-indigo-500 text-white">
              Escolher meu pack
            </a>
            <span className="text-sm text-indigo-100/65">A partir de R$9,90 em pagamento único.</span>
          </div>
        </section>

        <section id="escolha-seu-pack" className="mt-12 scroll-mt-24" aria-labelledby="offers-title">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-emerald-300">Escolha seu pack</p>
            <h2 id="offers-title" className="mt-2 text-3xl font-semibold text-gray-100">Escolha seu pack</h2>
            <p className="mt-3 text-indigo-200/70">
              O Essencial é a opção de entrada. O Completo é a oferta recomendada para quem quer mais músicas, melhor qualidade de áudio e uma organização mais ampla.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 md:items-stretch">
            {packOfferList.map((offer) => (
              <article
                key={offer.id}
                className={[
                  "relative flex h-full min-h-[520px] flex-col rounded-lg border p-6 shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-7",
                  offer.recommended
                    ? "border-emerald-300/70 bg-[linear-gradient(180deg,rgba(16,185,129,0.14),rgba(17,24,39,0.72))]"
                    : "border-gray-800 bg-[linear-gradient(180deg,rgba(31,41,55,0.72),rgba(17,24,39,0.58))]",
                ].join(" ")}
              >
                <div className="flex min-h-8 items-start">
                  {offer.badge ? (
                    <span className="inline-flex w-fit rounded-lg bg-emerald-300 px-3 py-1 text-xs font-bold uppercase text-slate-950">
                      {offer.badge}
                    </span>
                  ) : (
                    <span className="inline-flex w-fit rounded-lg border border-gray-700 px-3 py-1 text-xs font-bold uppercase text-gray-400">
                      Entrada
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <h3 className="text-2xl font-semibold text-gray-100">{offer.name}</h3>
                  <p className="mt-3 font-nacelle text-4xl font-semibold text-white">{offer.priceLabel}</p>
                  <p className="mt-3 min-h-[72px] text-indigo-100/75">{offer.description}</p>
                </div>

                <ul className="mt-6 grid gap-3 rounded-lg border border-white/10 bg-black/15 p-4 text-sm text-indigo-100/80" aria-label={`Benefícios do ${offer.name}`}>
                  {offerBenefits[offer.id].map((benefit) => (
                    <li key={benefit} className="flex gap-2">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-300/15 text-xs text-emerald-200" aria-hidden="true">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <OfferCheckoutLink
                  offer={offer}
                  source="baixar_musicas_offer_card"
                  className={[
                    "btn mt-auto min-h-12 w-full text-center text-sm font-bold",
                    offer.recommended
                      ? "bg-linear-to-t from-emerald-500 to-lime-400 text-slate-950 hover:from-emerald-400 hover:to-lime-300"
                      : "bg-gray-800 text-white hover:bg-gray-700",
                  ].join(" ")}
                >
                  {offer.cta}
                </OfferCheckoutLink>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="comparison-title">
          <h2 id="comparison-title" className="text-3xl font-semibold text-gray-100">Compare com transparência</h2>
          <div className="mt-6 overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full min-w-[520px] border-collapse bg-gray-900/50 text-left text-sm">
              <caption className="sr-only">Comparação entre Pack Essencial e Pack Completo</caption>
              <thead className="bg-gray-950/70 text-indigo-100">
                <tr>
                  <th className="px-4 py-4 font-semibold" scope="col">Item</th>
                  <th className="px-4 py-4 font-semibold" scope="col">Essencial</th>
                  <th className="px-4 py-4 font-semibold" scope="col">Completo</th>
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
            <Link href="/musicas-para-paredao" className="btn-sm bg-gray-800 hover:bg-gray-700">Músicas para paredão</Link>
            <Link href="/blog/como-baixar-pack-de-musicas-com-seguranca" className="btn-sm bg-gray-800 hover:bg-gray-700">Compra segura</Link>
          </div>
        </section>
      </main>
    </>
  );
}
