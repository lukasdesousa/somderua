import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { offerPriceLabels } from "@/lib/pricing";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

const automotiveSignals = [
  {
    title: "Grave com definicao",
    text: "A selecao prioriza faixas que mantem impacto no grave sem perder voz, medio e agudo.",
  },
  {
    title: "Pastas para rotina real",
    text: "Viagem, resenha, festa, funk, piseiro e sertanejo ficam separados no pen drive para reduzir procura no painel.",
  },
  {
    title: "Uso sem internet",
    text: "Depois de baixar, voce pode copiar o repertorio para pen drive, celular, notebook ou central multimidia.",
  },
];

const setupTips = [
  "Prefira arquivos em MP3 quando o aparelho do carro for mais antigo.",
  "Copie as pastas principais para a raiz do pen drive para facilitar a leitura.",
  "Evite nomes muito longos ou simbolos incomuns em pastas e arquivos.",
  "Teste primeiro em volume medio e ajuste ganho/equalizacao antes de aumentar.",
];

const useCases = [
  "Carro de uso diario com musicas organizadas por estilo.",
  "Som automotivo com grave mais forte para encontros e festas.",
  "Pen drive reserva para tocar quando o celular estiver sem internet.",
  "Caixa de som ou notebook em churrasco, viagem e resenha.",
];

const faqs = [
  {
    question: "O pack funciona em som automotivo comum?",
    answer:
      "Sim. Depois do download, voce pode copiar as pastas para um pen drive e testar no aparelho compativel com reproducao por USB.",
  },
  {
    question: "Musicas para som automotivo precisam ser diferentes?",
    answer:
      "O ideal e usar um repertorio organizado, com volume consistente, grave limpo e variedade para alternar entre rotina, viagem e festa.",
  },
  {
    question: "Tambem posso usar no celular?",
    answer:
      "Pode. O pack e digital, entao voce pode manter uma copia no celular, computador ou pen drive, respeitando a compatibilidade do aparelho.",
  },
  {
    question: "Qual oferta escolher para som automotivo?",
    answer:
      `O Pack Basico tem mais de 13 GB e mais de 5 mil faixas por ${offerPriceLabels.entry}. O Pack Premium tem mais de 26 GB e mais de 8 mil faixas por ${offerPriceLabels.recommended}.`,
  },
];

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Músicas para som automotivo 2026: pack para carro",
    description:
      "Repertorio para som automotivo e pack de musicas para pen drive, organizado em pastas para tocar no carro, com download automatico.",
    path: "/musicas-para-som-automotivo",
    keywords: ["musicas para som automotivo", "musicas para carro", "pack som automotivo", "repertorio automotivo"],
  });
}

export default function MusicasParaSomAutomotivoPage() {
  const crumbs = [
    { name: "Inicio", path: "/" },
    { name: "Musicas para som automotivo", path: "/musicas-para-som-automotivo" },
  ];

  return (
    <>
      <JsonLd id="som-automotivo-breadcrumb" data={breadcrumbSchema(crumbs)} />
      <JsonLd id="som-automotivo-faq" data={faqPageSchema(faqs)} />
      <Breadcrumbs items={[{ name: "Inicio", href: "/" }, { name: "Musicas para som automotivo" }]} />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" aria-labelledby="som-automotivo-title">
        <section className="max-w-3xl">
          <p className="mb-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
            Repertorio para carro, grave e pen drive
          </p>
          <h1 id="som-automotivo-title" className="text-4xl font-semibold text-gray-100 md:text-5xl">
            Musicas para som automotivo 2026
          </h1>
          <p className="mt-3 text-lg text-indigo-200/75">
            Um caminho direto para quem quer baixar um pack organizado, copiar para o pen drive e tocar no carro sem montar repertorio do zero.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/baixar-musicas#escolha-seu-pack" className="btn bg-linear-to-t from-indigo-600 to-indigo-500 text-white">
              Escolher meu pack
            </Link>
            <Link href="/musicas-para-pen-drive" className="btn-sm bg-gray-800 hover:bg-gray-700">
              Ver pack para pen drive
            </Link>
            <span className="text-sm text-indigo-100/65">Básico +13 GB por {offerPriceLabels.entry} ou Premium +26 GB por {offerPriceLabels.recommended}</span>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="automotive-signals-title">
          <h2 id="automotive-signals-title" className="text-3xl font-semibold text-gray-100">
            O que faz diferenca no som automotivo
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {automotiveSignals.map((item) => (
              <article key={item.title} className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
                <h3 className="font-semibold text-gray-100">{item.title}</h3>
                <p className="mt-2 text-indigo-100/75">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-8 md:grid-cols-[0.9fr_1fr]" aria-labelledby="automotive-setup-title">
          <div>
            <h2 id="automotive-setup-title" className="text-3xl font-semibold text-gray-100">
              Como preparar o repertorio para tocar no carro
            </h2>
            <p className="mt-3 text-indigo-200/70">
              A qualidade do uso depende do arquivo, da organizacao das pastas e tambem da compatibilidade do aparelho.
            </p>
          </div>
          <ul className="grid gap-3">
            {setupTips.map((tip) => (
              <li key={tip} className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-indigo-100/80">
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="automotive-use-title">
          <h2 id="automotive-use-title" className="text-3xl font-semibold text-gray-100">
            Quando um pack organizado ajuda mais
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {useCases.map((item) => (
              <article key={item} className="rounded-lg border border-gray-800 bg-gray-900/50 p-5 text-indigo-100/80">
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="som-automotivo-faq-title">
          <h2 id="som-automotivo-faq-title" className="text-3xl font-semibold text-gray-100">
            Duvidas sobre musicas para som automotivo
          </h2>
          <div className="mt-6 grid gap-4">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
                <h3 className="font-semibold text-gray-100">{faq.question}</h3>
                <p className="mt-2 text-indigo-100/75">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-lg border border-indigo-500/25 bg-indigo-500/10 p-5" aria-labelledby="som-automotivo-related-title">
          <h2 id="som-automotivo-related-title" className="text-2xl font-semibold text-gray-100">
            Continue pelo cluster certo
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/baixar-musicas" className="btn-sm bg-gray-800 hover:bg-gray-700">Baixar pack de musicas</Link>
            <Link href="/musicas-para-pen-drive" className="btn-sm bg-gray-800 hover:bg-gray-700">Musicas para pen drive</Link>
            <Link href="/blog/repertorio-atualizado-para-som-automotivo" className="btn-sm bg-gray-800 hover:bg-gray-700">Guia de repertorio automotivo</Link>
          </div>
        </section>
      </main>
    </>
  );
}
