/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  async redirects() {
    return [
      {
        source: "/pack-de-musicas",
        destination: "/",
        permanent: true,
      },
      {
        source: "/pack-de-musicas-2026",
        destination: "/",
        permanent: true,
      },
      {
        source: "/pack-musicas",
        destination: "/",
        permanent: true,
      },
      {
        source: "/musicas-para-carro",
        destination: "/musicas-para-som-automotivo",
        permanent: true,
      },
      {
        source: "/musicas-para-paredao",
        destination: "/musicas-para-pen-drive",
        permanent: true,
      },
      {
        source: "/blog/musicas-com-grave-forte-para-paredao",
        destination: "/blog/musicas-com-grave-forte-para-pen-drive",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
