import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/json-ld";
import { offerPriceLabels } from "@/lib/pricing";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

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
  const faqs = [{ question: "As músicas são boas para som automotivo?", answer: "Sim, o repertório é pensado para desempenho forte no som automotivo e paredão." }];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" aria-labelledby="paredao-title">
      <JsonLd id="paredao-breadcrumb" data={breadcrumbSchema(crumbs)} />
      <JsonLd id="paredao-faq" data={faqSchema(faqs)} />
      <p className="mb-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
        {offerPriceLabels.discount} para tocar hoje
      </p>
      <h1 id="paredao-title" className="text-4xl font-semibold text-gray-100">Músicas para paredão</h1>
      <p className="mt-3 text-indigo-200/75">Ideal para quem quer grave forte, repertório atualizado e acesso imediato.</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href="/musicas-para-pen-drive" className="btn-sm bg-gray-800 hover:bg-gray-700">Ver músicas para pen drive</Link>
        <Link href="/formulario" className="btn bg-linear-to-t from-indigo-600 to-indigo-500 text-white">
          Comprar por {offerPriceLabels.current}
        </Link>
        <span className="text-sm text-gray-400 line-through">De {offerPriceLabels.original}</span>
      </div>
    </section>
  );
}
