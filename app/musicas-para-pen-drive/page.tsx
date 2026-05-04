import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return buildMetadata({ title: "Músicas para pen drive atualizadas toda semana", description: "Packs de músicas para pen drive com seleção atualizada, download rápido e organização simples.", path: "/musicas-para-pen-drive", keywords: ["músicas para pen drive", "pendrive com músicas", "repertório para pen drive"] });
}

export default function MusicasPenDrivePage() {
  const crumbs = [{ name: "Início", path: "/" }, { name: "Músicas para pen drive", path: "/musicas-para-pen-drive" }];

  return <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6"><JsonLd id="pen-drive-breadcrumb" data={breadcrumbSchema(crumbs)} /><JsonLd id="pen-drive-faq" data={faqSchema([{ question: "Funciona em pen drive comum?", answer: "Sim. Você baixa os arquivos e copia para o pen drive normalmente." }])} /><h1 className="text-4xl font-semibold text-gray-100">Músicas para pen drive</h1><p className="mt-3 text-indigo-200/75">Conteúdo pronto para você baixar, copiar e tocar no carro em poucos minutos.</p><div className="mt-6 flex gap-3"><Link href="/musicas-para-paredao" className="btn-sm bg-gray-800 hover:bg-gray-700">Ver músicas para paredão</Link><Link href="/formulario" className="btn bg-linear-to-t from-indigo-600 to-indigo-500 text-white">Comprar por R$5,00</Link></div></section>;
}
