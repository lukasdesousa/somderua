import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { offerPriceLabels } from "@/lib/pricing";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

const downloadFlow = [
  {
    title: "Compra",
    text: "Você acessa o checkout, confere o valor e finaliza o pagamento com segurança.",
  },
  {
    title: "Confirmação",
    text: "Quando o pagamento é aprovado, o sistema libera o acesso ao download automaticamente.",
  },
  {
    title: "Uso",
    text: "Depois de baixar, copie as pastas para o pen drive ou mantenha uma cópia no celular/computador.",
  },
];

const safetyChecks = [
  "Página com valor e produto explicados antes da compra.",
  "Checkout seguro para processar o pagamento.",
  "Suporte por e-mail para dúvidas de acesso.",
  "Garantia de 7 dias para testar o pack.",
];

const faqs = [
  {
    question: "Como baixar músicas agora?",
    answer: "Clique em comprar, finalize o pagamento e aguarde a confirmação para acessar o download automático.",
  },
  {
    question: "Qual o valor?",
    answer: `O valor atual é ${offerPriceLabels.current}, de ${offerPriceLabels.original}, em pagamento único.`,
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
        <section className="max-w-3xl">
          <p className="mb-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
            {offerPriceLabels.discount} com entrega automática
          </p>
          <h1 id="baixar-musicas-title" className="text-4xl font-semibold text-gray-100">Baixar músicas com acesso imediato</h1>
          <p className="mt-3 text-lg text-indigo-200/75">
            Repertório atualizado para carro, pen drive e paredão, com liberação automática após a confirmação do pagamento.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/formulario" className="btn bg-linear-to-t from-indigo-600 to-indigo-500 text-white">
              Baixar por {offerPriceLabels.current}
            </Link>
            <span className="text-sm text-gray-400 line-through">De {offerPriceLabels.original}</span>
            <span className="text-sm font-medium text-emerald-300">Economize {offerPriceLabels.savings}</span>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="download-flow-title">
          <h2 id="download-flow-title" className="text-3xl font-semibold text-gray-100">Como funciona o download</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {downloadFlow.map((item) => (
              <article key={item.title} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
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
              <li key={item} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-4 text-indigo-100/80">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="baixar-musicas-faq-title">
          <h2 id="baixar-musicas-faq-title" className="text-3xl font-semibold text-gray-100">Dúvidas sobre baixar músicas</h2>
          <div className="mt-6 grid gap-4">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
                <h3 className="font-semibold text-gray-100">{faq.question}</h3>
                <p className="mt-2 text-indigo-100/75">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-indigo-500/25 bg-indigo-500/10 p-5" aria-labelledby="baixar-related-title">
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
