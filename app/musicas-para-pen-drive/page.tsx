import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/json-ld";
import { offerPriceLabels } from "@/lib/pricing";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Músicas para pen drive atualizadas toda semana",
    description: "Packs de músicas para pen drive com seleção atualizada, download rápido e organização simples.",
    path: "/musicas-para-pen-drive",
    keywords: ["músicas para pen drive", "pendrive com músicas", "repertório para pen drive"],
  });
}

export default function MusicasPenDrivePage() {
  const crumbs = [{ name: "Início", path: "/" }, { name: "Músicas para pen drive", path: "/musicas-para-pen-drive" }];
  const faqs = [{ question: "Funciona em pen drive comum?", answer: "Sim. Você baixa os arquivos e copia para o pen drive normalmente." }];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" aria-labelledby="pen-drive-title">
      <JsonLd id="pen-drive-breadcrumb" data={breadcrumbSchema(crumbs)} />
      <JsonLd id="pen-drive-faq" data={faqSchema(faqs)} />
      <p className="mb-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
        Economize {offerPriceLabels.savings} hoje
      </p>
      <h1 id="pen-drive-title" className="text-4xl font-semibold text-gray-100">Músicas para pen drive</h1>
      <p className="mt-3 text-indigo-200/75">Conteúdo pronto para você baixar, copiar e tocar no carro em poucos minutos.</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href="/musicas-para-paredao" className="btn-sm bg-gray-800 hover:bg-gray-700">Ver músicas para paredão</Link>
        <Link href="/formulario" className="btn bg-linear-to-t from-indigo-600 to-indigo-500 text-white">
          Comprar por {offerPriceLabels.current}
        </Link>
        <span className="text-sm text-gray-400 line-through">De {offerPriceLabels.original}</span>
      </div>
    </section>
  );
}
