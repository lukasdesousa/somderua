import "./css/style.css";

import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Header from "@/components/ui/header";
import { Analytics } from "@vercel/analytics/next"
import { Metadata } from "next";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const nacelle = localFont({
  src: [
    {
      path: "../public/fonts/nacelle-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/nacelle-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/nacelle-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/nacelle-semibolditalic.woff2",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-nacelle",
  display: "swap",
});

const globalJson = {
  "@context": "https://schema.org",
  "@type": ["WebSite", "Organization"],
  "name": "Som de Rua",
  "url": "https://somderua.com.br",
  "logo": "https://somderua.com.br/apple-touch-icon.png",
  "sameAs": [
    "https://www.instagram.com/somderua.br"
  ],
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://somderua.com.br/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const metadata: Metadata = {
  title: {
    default: "Som de Rua — Repertório de músicas para pen drive",
    template: "%s | Som de Rua"
  },
  description: "Baixe repertório de músicas otimizadas para paredão e pen drive — entrega automática e qualidade de som impecável.",
  metadataBase: new URL("https://somderua.com.br"),
  openGraph: {
    type: "website",
    url: "https://somderua.com.br",
    title: "Repertório de músicas para pen drive",
    description: "Baixe packs de músicas otimizadas para paredão e pen drive — qualidade de som impecável e entrega automática.",
    siteName: "Som de Rua",
    locale: "pt_BR",
    images: [
      {
        url: "https://somderua.com.br/apple-touch-icon.png",
        width: 512,
        height: 512,
        alt: "Logo Som de Rua",
      },
    ],
  },
  keywords: [
    "músicas para pen drive",
    "packs de som automotivo",
    "paredão de som",
    "músicas mp3",
    "som de rua",
    "baixar músicas online",
    "pen drive com músicas",
    "músicas para paredão",
    "hits 2025",
    "pen drive atualizado",
    "repertório atualizado",
    "baixar músicas",
    "pack de músicas mp3 para pen drive",
    "baixar packs de som para paredão",
    "músicas de funk para pen drive",
    "músicas atualizadas para som automotivo",
    "playlist para paredão de som",
    "repertório completo para pen drive",
    "packs de músicas 2025",
    "download de músicas para carro",
    "músicas para eventos e festas",
    "músicas organizadas para pen drive",
    "packs de som digital para paredão",
    "coleção de músicas mp3 atualizada",
    "repertório funk, sertanejo e eletrônico",
    "packs de músicas para som de rua",
    "pendrives com musicas",
    "forrozin",
    "baixar repertório para pen drive",
    "palco mp3",
    "paredão com músicas",
    "músicas de paredão baixar",
    "pen drive musica",
  ],
  alternates: {
    canonical: "https://somderua.com.br",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      follow: true,
      index: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          id="jsonld-product"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJson) }}
        />
      </head>
      <body
        className={`${inter.variable} ${nacelle.variable} bg-gray-950 font-inter text-base text-gray-200 antialiased`}
      >
        <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          <Header />
          {children}
          <Analytics />
        </div>
      </body>
    </html>
  );
}
