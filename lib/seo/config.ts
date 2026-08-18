export const siteConfig = {
  name: "Som de Rua",
  shortName: "Som de Rua",
  description:
    "Packs de músicas para pen drive e paredão com entrega automática, áudio otimizado e atualização frequente.",
  url: "https://somderua.com.br",
  ogImage: "/images/og-image.png",
  locale: "pt_BR",
  language: "pt-BR",
  twitter: "@somderua",
  social: {
    instagram: "https://www.instagram.com/somderua.br",
  },
  gscVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  keywords: [
    "pack de músicas",
    "pack de músicas 2026",
    "músicas para pen drive",
    "pack de músicas para paredão",
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
