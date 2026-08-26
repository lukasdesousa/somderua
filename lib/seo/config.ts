export const siteConfig = {
  name: "Som de Rua",
  shortName: "Som de Rua",
  alternateNames: ["SomDeRua", "somderua.com.br"],
  description:
    "Pack de músicas para pen drive com entrega automática, faixas organizadas por estilo e repertório atualizado para carro e aparelhos USB.",
  url: "https://somderua.com.br/",
  ogImage: "/images/og-image.png",
  logo: "/images/somderua_logo.png",
  logoDimensions: {
    width: 1024,
    height: 1536,
  },
  icons: {
    favicon: "/favicon.ico",
    icon48: "/icon-48x48.png",
    icon96: "/icon-96x96.png",
    apple: "/apple-touch-icon.png",
  },
  locale: "pt_BR",
  language: "pt-BR",
  twitter: "@somderua",
  social: {
    instagram: "https://www.instagram.com/somderua.br",
  },
  gscVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  keywords: [
    "pack de músicas para pen drive",
    "pack de músicas 2026",
    "músicas para pen drive",
    "download de músicas para pen drive",
    "músicas para som automotivo",
    "repertório atualizado",
    "som automotivo",
    "músicas graves",
  ],
};

export const privateRoutes = [
  "/download",
  "/pagamento-pendente",
  "/pagamento-recusado",
  "/formulario",
];

export const robotsDisallowRoutes = [
  "/api/",
];
