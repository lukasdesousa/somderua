import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { offerPriceLabels } from "@/lib/pricing";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

const steps = [
  "Baixe o pack após a confirmação do pagamento.",
  "Extraia o arquivo, se ele estiver compactado.",
  "Copie as pastas principais para o pen drive.",
  "Conecte no som do carro e teste estilos diferentes.",
];

const benefits = [
  "Pack de músicas para pen drive pronto para usar sem montar pasta por pasta.",
  "Variedade para viagem, resenha, rotina e som automotivo.",
  "Organização simples para navegar no painel do carro.",
  "Acesso vitalício e reembolso integral em caso de falha técnica não solucionada.",
];

const compatibilityTips = [
  "MP3 costuma ser o formato mais aceito em aparelhos automotivos com entrada USB.",
  "FAT32 tende a ser uma escolha mais compativel para pen drives usados em sons mais antigos.",
  "Pastas rasas e nomes simples ajudam o aparelho a listar o repertorio mais rapido.",
];

const faqs = [
  {
    question: "O pack de músicas funciona em pen drive comum?",
    answer: "Sim. Você baixa os arquivos e copia para um pen drive com espaço disponível.",
  },
  {
    question: "Preciso usar computador?",
    answer: "O computador facilita a cópia para o pen drive, mas você também pode baixar pelo celular e transferir depois.",
  },
  {
    question: "O som do carro reconhece todas as pastas?",
    answer: "A maioria reconhece, mas aparelhos antigos podem ter limite de pastas, arquivos ou formatos. Por isso vale testar uma pasta primeiro.",
  },
];

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Pack de musicas para pen drive 2026",
    description: "Pack de musicas para pen drive organizado em pastas, pronto para copiar e tocar no carro. Escolha entre 16 GB e mais de 28 GB com download automatico.",
    path: "/musicas-para-pen-drive",
    keywords: ["pack de musicas para pen drive", "musicas para pen drive", "pack para pen drive", "musicas para pen drive de carro"],
  });
}

export default function MusicasPenDrivePage() {
  const crumbs = [{ name: "Início", path: "/" }, { name: "Músicas para pen drive", path: "/musicas-para-pen-drive" }];

  return (
    <>
      <JsonLd id="pen-drive-breadcrumb" data={breadcrumbSchema(crumbs)} />
      <JsonLd id="pen-drive-faq" data={faqPageSchema(faqs)} />
      <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Músicas para pen drive" }]} />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" aria-labelledby="pen-drive-title">
        <section className="max-w-3xl">
          <p className="mb-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
            Opções a partir de {offerPriceLabels.entry}
          </p>
          <h1 id="pen-drive-title" className="text-4xl font-semibold text-gray-100">Pack de músicas para pen drive</h1>
          <p className="mt-3 text-lg text-indigo-200/75">
            Mais de 10 mil músicas prontas para baixar, copiar e tocar no carro, com pastas organizadas para facilitar a navegação no aparelho.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/baixar-musicas#escolha-seu-pack" className="btn bg-linear-to-t from-indigo-600 to-indigo-500 text-white">
              Escolher meu pack
            </Link>
            <Link href="/blog/como-colocar-musicas-no-pen-drive-para-tocar-no-carro" className="btn-sm bg-gray-800 hover:bg-gray-700">Como copiar para o pen drive</Link>
            <Link href="/musicas-para-som-automotivo" className="btn-sm bg-gray-800 hover:bg-gray-700">Ver som automotivo</Link>
            <span className="text-sm text-indigo-100/65">Básico 16 GB por {offerPriceLabels.entry} ou Premium +28 GB por {offerPriceLabels.recommended}</span>
          </div>
        </section>

        <section className="mt-12 grid gap-8 md:grid-cols-[0.9fr_1fr]" aria-labelledby="pen-drive-steps-title">
          <div>
            <h2 id="pen-drive-steps-title" className="text-3xl font-semibold text-gray-100">Como usar o pack no pen drive</h2>
            <p className="mt-3 text-indigo-200/70">
              A ideia é deixar o processo simples mesmo para quem quer só baixar o repertório e colocar para tocar.
            </p>
          </div>
          <ol className="grid gap-3">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-2xl border border-gray-800 bg-gray-900/50 p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-500 text-sm font-semibold text-white">{index + 1}</span>
                <span className="text-indigo-100/80">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12" aria-labelledby="pen-drive-compatibility-title">
          <h2 id="pen-drive-compatibility-title" className="text-3xl font-semibold text-gray-100">Formato e compatibilidade</h2>
          <p className="mt-3 max-w-3xl text-indigo-200/70">
            Nem todo som de carro le arquivos do mesmo jeito. Por isso, um repertorio simples e bem organizado tende a dar menos trabalho no uso diario.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {compatibilityTips.map((tip) => (
              <article key={tip} className="rounded-lg border border-gray-800 bg-gray-900/50 p-5 text-indigo-100/80">
                {tip}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="pen-drive-benefits-title">
          <h2 id="pen-drive-benefits-title" className="text-3xl font-semibold text-gray-100">Por que usar um pack organizado</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {benefits.map((benefit) => (
              <article key={benefit} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 text-indigo-100/80">
                {benefit}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="pen-drive-faq-title">
          <h2 id="pen-drive-faq-title" className="text-3xl font-semibold text-gray-100">Dúvidas sobre músicas para pen drive</h2>
          <div className="mt-6 grid gap-4">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
                <h3 className="font-semibold text-gray-100">{faq.question}</h3>
                <p className="mt-2 text-indigo-100/75">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-indigo-500/25 bg-indigo-500/10 p-5" aria-labelledby="pen-drive-related-title">
          <h2 id="pen-drive-related-title" className="text-2xl font-semibold text-gray-100">Também pode ajudar</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/baixar-musicas" className="btn-sm bg-gray-800 hover:bg-gray-700">Como baixar músicas</Link>
            <Link href="/musicas-para-som-automotivo" className="btn-sm bg-gray-800 hover:bg-gray-700">Músicas para som automotivo</Link>
            <Link href="/blog/como-organizar-pastas-de-musicas-no-pen-drive" className="btn-sm bg-gray-800 hover:bg-gray-700">Organizar pastas no pen drive</Link>
            <Link href="/blog/pen-drive-nao-toca-no-som-do-carro-formatos-e-solucoes" className="btn-sm bg-gray-800 hover:bg-gray-700">Pen drive não toca?</Link>
          </div>
        </section>
      </main>
    </>
  );
}
