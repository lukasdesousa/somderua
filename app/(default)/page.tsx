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
import { offerPricing } from "@/lib/pricing";
import { breadcrumbSchema, productOfferSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

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
  const breadcrumbs = [
    { name: "Início", path: "/" },
    { name: "Pack de músicas", path: "/" },
  ];
  

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
        })}
      />
      <Breadcrumbs items={[{ name: "Início" }, { name: "Pack de músicas" }]} />
      <PageIllustration />
      <Hero />
      <Workflows />
      <Features />
      <Testimonials />
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
        <h2 className="mb-3 text-2xl font-semibold text-gray-100">Conteúdos relacionados</h2>
        <p className="mb-4 text-indigo-200/65">Guias para palavras-chave long tail e dúvidas comuns dos clientes.</p>
        <div className="flex flex-wrap gap-3">
          <Link className="btn-sm bg-gray-800 hover:bg-gray-700" href="/blog">
            Ver blog de repertórios
          </Link>
          <Link className="btn-sm bg-gray-800 hover:bg-gray-700" href="/formulario">
            Comprar agora
          </Link>
        </div>
      </section>
      <Cta />
      <ConversionWidgets />
    </>
  );
}
