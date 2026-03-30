import "./css/style.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import Header from "@/components/ui/header";
import JsonLd from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/seo/config";
import { absoluteUrl } from "@/lib/seo/metadata";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const nacelle = localFont({
  src: [
    { path: "../public/fonts/nacelle-regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/nacelle-italic.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/nacelle-semibold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/nacelle-semibolditalic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-nacelle",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Som de Rua | Repertório de músicas para pen drive",
    template: "%s | Som de Rua",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  referrer: "origin-when-cross-origin",
  category: "music",
  keywords: siteConfig.keywords,
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
    },
  },
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
  openGraph: {
    type: "website",
    title: "Som de Rua | Repertório atualizado para pen drive e paredão",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [
      {
        url: absoluteUrl(siteConfig.ogImage),
        width: 1200,
        height: 630,
        alt: "Som de Rua",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Som de Rua | Repertório atualizado para pen drive",
    description: siteConfig.description,
    images: [absoluteUrl(siteConfig.ogImage)],
    creator: siteConfig.twitter,
  },
  verification: siteConfig.gscVerification
    ? {
        google: siteConfig.gscVerification,
      }
    : undefined,
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${nacelle.variable} bg-gray-950 font-inter text-base text-gray-200 antialiased`}
      >
        <JsonLd id="organization-jsonld" data={organizationSchema()} />
        <JsonLd id="website-jsonld" data={websiteSchema()} />
        {siteConfig.gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaId}`} strategy="afterInteractive" />
            <Script id="ga-setup" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${siteConfig.gaId}');`}
            </Script>
          </>
        ) : null}

        <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          <Header />
          {children}
          <Analytics />
        </div>
      </body>
    </html>
  );
}
