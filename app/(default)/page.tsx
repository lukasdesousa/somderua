const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Som de Rua — Packs de músicas para pen drive",
  "url": "https://somderua.com.br/",
  "description":
    "Baixe packs de músicas otimizadas para paredão e pen drive — entrega automática e qualidade de som impecável.",
  "inLanguage": "pt-BR",
  "isPartOf": {
    "@type": "WebSite",
    "@id": "https://somderua.com.br/#website",
  },
  "about": {
    "@type": "Thing",
    "name": "Packs de som automotivo",
  },
  "primaryImageOfPage": {
    "@type": "ImageObject",
    "url": "https://somderua.com.br/apple-touch-icon.png",
  },
  "publisher": {
    "@type": "Organization",
    "name": "Som de Rua",
    "logo": {
      "@type": "ImageObject",
      "url": "https://somderua.com.br/apple-touch-icon.png",
    },
  },
};

export const metadata = {
  title: "Músicas para pen-drive",
  description: "Melhor repertório de músicas para pen-drive atualizado outubro 2025 e 2026",
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-home";
import Workflows from "@/components/workflows";
import Features from "@/components/features";
import Testimonials from "@/components/testimonials";
import Cta from "@/components/cta";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <Script
        id="jsonld-product"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <PageIllustration />
      <Hero />
      <Workflows />
      <Features />
      <Testimonials />
      <Cta />
    </>
  );
}
