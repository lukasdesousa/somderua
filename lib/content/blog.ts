export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  keywords: string[];
  publishedAt: string;
  updatedAt: string;
  content: string[];
  relatedSlugs: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "repertorio-para-pen-drive-atualizado",
    title: "Repertório para pen drive atualizado: como escolher músicas que engajam",
    description:
      "Guia prático para montar repertório atualizado para pen drive com foco em hits, retenção e qualidade sonora para paredão.",
    excerpt:
      "Aprenda a montar um repertório equilibrado entre tendência, grave e experiência de audição.",
    keywords: ["repertório atualizado", "músicas para pen drive", "hits para paredão"],
    publishedAt: "2026-03-01T08:00:00.000Z",
    updatedAt: "2026-03-20T08:00:00.000Z",
    content: [
      "Comece identificando seu público principal e o contexto de uso do pen drive, como festas, viagens ou paredão.",
      "Misture hits virais, clássicos e faixas com grave limpo para aumentar tempo de reprodução.",
      "Mantenha o pack atualizado com revisão quinzenal e remova faixas com baixa aceitação.",
    ],
    relatedSlugs: ["musicas-com-grave-forte-para-paredao", "como-baixar-pack-de-musicas-com-seguranca"],
  },
  {
    slug: "musicas-com-grave-forte-para-paredao",
    title: "Músicas com grave forte para paredão: critérios de qualidade antes do download",
    description:
      "Veja como avaliar qualidade de grave, loudness e organização de arquivos para baixar packs de músicas para paredão sem surpresas.",
    excerpt:
      "Critérios simples para diferenciar um pack profissional de coleções com baixa qualidade.",
    keywords: ["músicas graves", "paredão", "pack para som automotivo"],
    publishedAt: "2026-02-18T08:00:00.000Z",
    updatedAt: "2026-03-15T08:00:00.000Z",
    content: [
      "Cheque se os arquivos mantêm padrão de qualidade e não apresentam distorção em volumes elevados.",
      "Priorize coleções com separação por gênero e BPM para facilitar playlists estratégicas.",
      "Padronize nomes dos arquivos para melhorar navegação em players automotivos.",
    ],
    relatedSlugs: ["repertorio-para-pen-drive-atualizado", "como-baixar-pack-de-musicas-com-seguranca"],
  },
  {
    slug: "como-baixar-pack-de-musicas-com-seguranca",
    title: "Como baixar pack de músicas com segurança e entrega imediata",
    description:
      "Entenda como validar páginas de compra, checkout e links de download para adquirir packs com segurança.",
    excerpt:
      "Checklist essencial para compra segura e acesso rápido ao repertório.",
    keywords: ["download de músicas", "compra segura", "pack de músicas"],
    publishedAt: "2026-02-05T08:00:00.000Z",
    updatedAt: "2026-03-10T08:00:00.000Z",
    content: [
      "Verifique HTTPS, política de suporte e domínio canônico antes de concluir o pagamento.",
      "Prefira páginas com fluxo de pagamento transparente e confirmação por e-mail.",
      "Após o download, valide a integridade dos arquivos e mantenha backup local.",
    ],
    relatedSlugs: ["repertorio-para-pen-drive-atualizado", "musicas-com-grave-forte-para-paredao"],
  },
];

export function getAllPosts() {
  return blogPosts;
}

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
