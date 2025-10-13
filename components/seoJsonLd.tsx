// components/SeoJsonLd.tsx (Server component)
export default function SeoJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Pack de músicas Som de Rua",
    description:
      "Pack de músicas para pen drive e paredão — +16GB, 4500+ faixas. Download automático após pagamento.",
    image: ["https://somderua.com.br/og-image.png"],
    offers: {
      "@type": "Offer",
      url: "https://somderua.com.br",
      priceCurrency: "BRL",
      price: "5.0",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Som de Rua",
        url: "https://somderua.com.br"
      }
    },
    sku: "PACK-16GB-4500",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
