import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/json-ld";
import { offerPriceLabels } from "@/lib/pricing";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

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
  const faqs = [
    { question: "Como baixar músicas agora?", answer: "Clique em comprar, finalize o pagamento e o download é liberado automaticamente." },
    { question: "Qual o valor?", answer: `O valor promocional atual é ${offerPriceLabels.current}, de ${offerPriceLabels.original}, em pagamento único.` },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" aria-labelledby="baixar-musicas-title">
      <JsonLd id="baixar-musicas-breadcrumb" data={breadcrumbSchema(crumbs)} />
      <JsonLd id="baixar-musicas-faq" data={faqSchema(faqs)} />
      <p className="mb-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
        {offerPriceLabels.discount} com entrega imediata
      </p>
      <h1 id="baixar-musicas-title" className="text-4xl font-semibold text-gray-100">Baixar músicas com acesso imediato</h1>
      <p className="mt-3 text-indigo-200/75">Repertório atualizado para carro, pen drive e paredão com liberação automática.</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href="/formulario" className="btn bg-linear-to-t from-indigo-600 to-indigo-500 text-white">
          Baixar por {offerPriceLabels.current}
        </Link>
        <span className="text-sm text-gray-400 line-through">De {offerPriceLabels.original}</span>
        <span className="text-sm font-medium text-emerald-300">Economize {offerPriceLabels.savings}</span>
      </div>
    </section>
  );
}
