import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { offerPriceLabels } from "@/lib/pricing";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

const qualitySignals = [
  {
    title: "Grave forte sem embolar",
    text: "A seleção busca músicas que mantêm pressão no grave sem deixar a voz sumir ou o som estourar fácil.",
  },
  {
    title: "Variedade para manter energia",
    text: "Funk, remix, automotivo e faixas virais ajudam a alternar momentos de impacto e resenha.",
  },
  {
    title: "Pastas fáceis de navegar",
    text: "Uma estrutura simples evita perder tempo procurando música quando o som já está ligado.",
  },
];

const testTips = [
  "Teste uma faixa de grave pesado em volume médio antes de aumentar.",
  "Compare músicas de pastas diferentes para perceber volume e definição.",
  "Ajuste ganho e equalização do aparelho se notar distorção.",
  "Mantenha uma pasta de favoritos para eventos, rua e encontros.",
];

const faqs = [
  {
    question: "As músicas são boas para som automotivo?",
    answer: "Sim. O repertório é pensado para uso em carro, caixa de som e paredão, com foco em grave e variedade.",
  },
  {
    question: "Grave forte quer dizer volume estourado?",
    answer: "Não. O ideal é ter impacto sem distorção. A qualidade também depende do aparelho e da regulagem do som.",
  },
  {
    question: "Também funciona no pen drive?",
    answer: "Sim. Você pode copiar as pastas para um pen drive e usar em aparelhos compatíveis com USB.",
  },
];

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Músicas para paredão com grave forte e repertório atualizado",
    description: "Seleção de músicas para paredão e som automotivo com atualização frequente e download imediato.",
    path: "/musicas-para-paredao",
    keywords: ["músicas para paredão", "som automotivo", "grave forte"],
  });
}

export default function MusicasParedaoPage() {
  const crumbs = [{ name: "Início", path: "/" }, { name: "Músicas para paredão", path: "/musicas-para-paredao" }];

  return (
    <>
      <JsonLd id="paredao-breadcrumb" data={breadcrumbSchema(crumbs)} />
      <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Músicas para paredão" }]} />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" aria-labelledby="paredao-title">
        <section className="max-w-3xl">
          <p className="mb-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
            {offerPriceLabels.discount} no pack completo
          </p>
          <h1 id="paredao-title" className="text-4xl font-semibold text-gray-100">Músicas para paredão</h1>
          <p className="mt-3 text-lg text-indigo-200/75">
            Repertório para quem quer grave forte, pastas organizadas e músicas prontas para tocar em som automotivo.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/formulario" className="btn bg-linear-to-t from-indigo-600 to-indigo-500 text-white">
              Comprar por {offerPriceLabels.current}
            </Link>
            <Link href="/musicas-para-pen-drive" className="btn-sm bg-gray-800 hover:bg-gray-700">Ver músicas para pen drive</Link>
            <span className="text-sm text-gray-400 line-through">De {offerPriceLabels.original}</span>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="paredao-quality-title">
          <h2 id="paredao-quality-title" className="text-3xl font-semibold text-gray-100">O que faz diferença no paredão</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {qualitySignals.map((item) => (
              <article key={item.title} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
                <h3 className="font-semibold text-gray-100">{item.title}</h3>
                <p className="mt-2 text-indigo-100/75">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-8 md:grid-cols-[0.9fr_1fr]" aria-labelledby="paredao-test-title">
          <div>
            <h2 id="paredao-test-title" className="text-3xl font-semibold text-gray-100">Como testar no seu som</h2>
            <p className="mt-3 text-indigo-200/70">
              O resultado final depende também de caixa, módulo, regulagem e volume. Testar com calma ajuda a evitar distorção.
            </p>
          </div>
          <ul className="grid gap-3">
            {testTips.map((tip) => (
              <li key={tip} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-4 text-indigo-100/80">
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="paredao-faq-title">
          <h2 id="paredao-faq-title" className="text-3xl font-semibold text-gray-100">Dúvidas sobre músicas para paredão</h2>
          <div className="mt-6 grid gap-4">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
                <h3 className="font-semibold text-gray-100">{faq.question}</h3>
                <p className="mt-2 text-indigo-100/75">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-indigo-500/25 bg-indigo-500/10 p-5" aria-labelledby="paredao-related-title">
          <h2 id="paredao-related-title" className="text-2xl font-semibold text-gray-100">Continue pesquisando</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/baixar-musicas" className="btn-sm bg-gray-800 hover:bg-gray-700">Baixar músicas com acesso imediato</Link>
            <Link href="/blog/musicas-com-grave-forte-para-paredao" className="btn-sm bg-gray-800 hover:bg-gray-700">Guia de grave forte</Link>
            <Link href="/blog/repertorio-atualizado-para-som-automotivo" className="btn-sm bg-gray-800 hover:bg-gray-700">Som automotivo</Link>
          </div>
        </section>
      </main>
    </>
  );
}
