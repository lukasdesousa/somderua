/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ];
  },
};

module.exports = nextConfig;
