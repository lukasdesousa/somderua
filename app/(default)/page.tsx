import Link from "next/link";
import type { Metadata } from "next";
import Cta from "@/components/cta";
import Features from "@/components/features";
import Hero from "@/components/hero-home";
import PageIllustration from "@/components/page-illustration";
import Testimonials from "@/components/testimonials";
import Workflows from "@/components/workflows";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import ConversionWidgets from "@/components/conversion-widgets";
import { buildMetadata } from "@/lib/seo/metadata";
import { offerPriceLabels, offerPricing } from "@/lib/pricing";
import { breadcrumbSchema, productOfferSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

const packHighlights = [
  {
    title: "Mais de 4.500 músicas",
    text: "Repertório pronto para carro, pen drive, caixa de som e paredão, com variedade para tocar por horas.",
  },
  {
    title: "Pastas organizadas",
    text: "Separação por estilos e momentos de uso para você encontrar funk, remix, grave pesado e músicas de viagem.",
  },
  {
    title: "Download automático",
    text: "Após a confirmação do pagamento, o acesso é liberado para baixar e copiar os arquivos sem depender de envio manual.",
  },
  {
    title: "Suporte e garantia",
    text: "Você tem garantia de 7 dias e suporte por e-mail se precisar de ajuda com pagamento, acesso ou download.",
  },
];

const usageSteps = [
  "Finalize a compra no checkout seguro.",
  "Aguarde a confirmação do pagamento.",
  "Baixe o pack no celular ou computador.",
  "Copie as pastas para o pen drive e teste no carro.",
];

const compatibilityItems = [
  "Pen drive comum com espaço disponível",
  "Som automotivo com entrada USB",
  "Celular, notebook ou computador para baixar",
  "Caixas de som e players que aceitam arquivos de áudio",
];

const homeFaqs = [
  {
    question: "O que vem no Pack Som de Rua?",
    answer:
      "Um repertório com mais de 4.500 músicas organizado em pastas para pen drive, carro, caixa de som e paredão.",
  },
  {
    question: "O download é liberado na hora?",
    answer:
      "Sim. Depois que o pagamento é confirmado, o acesso ao download é liberado automaticamente.",
  },
  {
    question: "Funciona em pen drive comum?",
    answer:
      "Sim. Você baixa os arquivos, copia para o pen drive e usa em aparelhos compatíveis com reprodução por USB.",
  },
  {
    question: "Tem garantia?",
    answer:
      "Sim. O pack tem garantia de 7 dias para você testar com calma.",
  },
];

const relatedLinks = [
  {
    href: "/musicas-para-pen-drive",
    title: "Músicas para pen drive",
    text: "Veja como usar o repertório em pen drive comum e som automotivo.",
  },
  {
    href: "/musicas-para-paredao",
    title: "Músicas para paredão",
    text: "Entenda a seleção para grave forte, som automotivo e festas.",
  },
  {
    href: "/baixar-musicas",
    title: "Baixar músicas",
    text: "Confira como funciona o acesso imediato após o pagamento.",
  },
  {
    href: "/blog",
    title: "Guias de repertório",
    text: "Leia dicas para organizar pastas, resolver erros no pen drive e escolher músicas.",
  },
];

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Músicas para pen drive e paredão com entrega imediata",
    description:
      "Compre repertório com mais de 16GB, músicas selecionadas para paredão e download automático com suporte rápido.",
    path: "/",
    keywords: ["download imediato de músicas", "pack 16GB de músicas"],
  });
}

export default function Home() {
  const breadcrumbs = [{ name: "Início", path: "/" }];

  return (
    <>
      <JsonLd id="home-breadcrumb-jsonld" data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        id="home-product-jsonld"
        data={productOfferSchema({
          name: offerPricing.productName,
          description: offerPricing.productDescription,
          price: offerPricing.currentPrice,
          currency: offerPricing.currency,
          productPath: "/",
          offerPath: "/",
        })}
      />
      <Breadcrumbs items={[{ name: "Início" }]} />
      <PageIllustration />
      <Hero />
      <Workflows />
      <Features />

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16" aria-labelledby="pack-content-title">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-200">
            O que vem no pack
          </p>
          <h2 id="pack-content-title" className="text-3xl font-semibold text-gray-100 md:text-4xl">
            Repertório completo para tocar no carro, no pen drive e no paredão
          </h2>
          <p className="mt-4 text-lg text-indigo-200/70">
            O Som de Rua foi pensado para quem quer baixar uma vez, organizar rápido e ter música pronta para diferentes momentos.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {packHighlights.map((item) => (
            <article key={item.title} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="text-lg font-semibold text-gray-100">{item.title}</h3>
              <p className="mt-2 text-indigo-100/75">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16" aria-labelledby="how-to-download-title">
        <div className="grid gap-8 md:grid-cols-[1fr_0.9fr] md:items-start">
          <div>
            <h2 id="how-to-download-title" className="text-3xl font-semibold text-gray-100">
              Como baixar e usar no pen drive
            </h2>
            <p className="mt-3 text-indigo-200/70">
              O fluxo foi feito para ser simples: comprar, baixar, copiar e tocar. Você pode começar pelo celular ou pelo computador.
            </p>
            <ol className="mt-6 grid gap-3">
              {usageSteps.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-2xl border border-gray-800 bg-gray-900/50 p-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="text-indigo-100/80">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-5">
            <h3 className="text-xl font-semibold text-gray-100">Compatibilidade</h3>
            <ul className="mt-4 grid gap-3 text-sm text-emerald-100/85">
              {compatibilityItems.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-emerald-100/75">
              Em aparelhos mais antigos, vale testar uma pasta primeiro e conferir o manual do som para formatos aceitos.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16" aria-labelledby="home-faq-title">
        <h2 id="home-faq-title" className="text-3xl font-semibold text-gray-100">
          Dúvidas comuns antes de baixar
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {homeFaqs.map((faq) => (
            <article key={faq.question} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="font-semibold text-gray-100">{faq.question}</h3>
              <p className="mt-2 text-indigo-100/75">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6" aria-labelledby="related-content-title">
        <h2 id="related-content-title" className="mb-3 text-2xl font-semibold text-gray-100">Conteúdos relacionados</h2>
        <p className="mb-5 max-w-3xl text-indigo-200/65">
          Continue por guias específicos de pen drive, paredão, download e organização do repertório.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {relatedLinks.map((item) => (
            <Link key={item.href} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 transition hover:border-indigo-500/50" href={item.href}>
              <span className="text-lg font-semibold text-gray-100">{item.title}</span>
              <span className="mt-2 block text-sm text-indigo-100/70">{item.text}</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="btn-sm bg-gray-800 hover:bg-gray-700" href="/blog">
            Ver todos os guias
          </Link>
          <Link className="btn-sm bg-gray-800 hover:bg-gray-700" href="/formulario">
            Comprar por {offerPriceLabels.current}
          </Link>
        </div>
      </section>

      <Testimonials />
      <Cta />
      <ConversionWidgets />
    </>
  );
}
