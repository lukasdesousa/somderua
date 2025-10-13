/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // URL base do site (SEM barra no final)
  siteUrl: "https://somderua.com.br",

  // Gera automaticamente robots.txt
  generateRobotsTxt: true,

  // Exclui rotas internas, APIs ou administrativas
  exclude: [
    "/api/*",
    "/admin/*",
    "/_next/*",
    "/404",
    "/500",
  ],

  // Frequência de atualização sugerida ao Google
  changefreq: "weekly",

  // Prioridade padrão (0.0 a 1.0)
  priority: 0.7,

  // Tamanho máximo por sitemap antes de dividir (5000 URLs é padrão do Google)
  sitemapSize: 5000,

  // Cria sitemap dinâmico por rota do App Router
  generateIndexSitemap: true,

  // Define como os caminhos devem ser tratados
  trailingSlash: false,

  // Define um transformador customizado — útil para priorizar páginas específicas
  transform: async (config, path) => {
    // Ajusta prioridades por tipo de página
    let priority = 0.7;
    let changefreq = "weekly";

    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    } else if (path.startsWith("/download") || path.startsWith("/formulario")) {
      priority = 0.9;
      changefreq = "daily";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },

  // Define comportamento do robots.txt gerado
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/"],
      },
    ],
  },

  // Opção útil para debugar localmente (não precisa subir)
  outDir: "./public", // garante que o arquivo vá para a pasta pública do Next
};
