import "./css/style.css";

import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Header from "@/components/ui/header";
import { Analytics } from "@vercel/analytics/next"
import { Metadata } from "next";
import SeoJsonLd from "@/components/seoJsonLd";

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


export const metadata: Metadata = {
  title: {
    default: "Som de Rua — Pack de músicas para pen drive",
    template: "%s | Som de Rua",
  },
  description:
    "Pack de músicas para pen drive e paredão — +16GB, 4500+ faixas. Download imediato após pagamento. Graves otimizados e sem faixas duplicadas.",
  metadataBase: new URL("https://somderua.com.br"),
  alternates: {
    canonical: "https://somderua.com.br",
    languages: {
      "pt-BR": "https://somderua.com.br",
    },
  },
  openGraph: {
    title: "Som de Rua — Pack de músicas para pen drive e paredão",
    description:
      "Pack de músicas para pen drive e paredão — +16GB, 4500+ músicas. Envio automático após pagamento.",
    url: "https://somderua.com.br",
    siteName: "Som de Rua",
    images: [
      {
        url: "https://somderua.com.br/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Som de Rua — Pack 16GB, 4500+ músicas",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Som de Rua — Pack 16GB / 4500+ músicas",
    description:
      "Pack de músicas para pen drive e paredão — +16GB, 4500+ faixas. Download imediato.",
    images: ["https://somderua.com.br/images/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${nacelle.variable} bg-gray-950 font-inter text-base text-gray-200 antialiased`}
      >
        <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          <Header />
          {children}
          <SeoJsonLd />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
