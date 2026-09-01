import { absoluteUrl } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/config";

type BreadcrumbItem = { name: string; path: string };
type FaqItem = { question: string; answer: string };
type DigitalProductSchemaOffer = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  offerPath?: string;
};

const directDownloadDeliveryMethod = "http://purl.org/goodrelations/v1#DeliveryModeDirectDownload";

function organizationId() {
  return absoluteUrl("/#organization");
}

function websiteId() {
  return absoluteUrl("/#website");
}

function organizationLogo() {
  return {
    "@type": "ImageObject",
    url: absoluteUrl(siteConfig.logo),
    width: siteConfig.logoDimensions.width,
    height: siteConfig.logoDimensions.height,
  };
}

function organizationReference() {
  return {
    "@type": "Organization",
    "@id": organizationId(),
    name: siteConfig.name,
    url: absoluteUrl("/"),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(),
    name: siteConfig.name,
    url: absoluteUrl("/"),
    logo: organizationLogo(),
    sameAs: [siteConfig.social.instagram],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId(),
    url: absoluteUrl("/"),
    name: siteConfig.name,
    alternateName: siteConfig.alternateNames,
    inLanguage: siteConfig.language,
    publisher: {
      "@id": organizationId(),
    },
  };
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function digitalProductOffersSchema({
  name,
  description,
  productPath = "/",
  image = absoluteUrl("/images/pack-16gb-5000.png"),
  offers,
}: {
  name: string;
  description: string;
  productPath?: string;
  image?: string;
  offers: DigitalProductSchemaOffer[];
}) {
  const productUrl = absoluteUrl(productPath);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl("/baixar-musicas#product"),
    name,
    description,
    image: {
      "@type": "ImageObject",
      url: image,
      contentUrl: image,
      caption: "Imagem ilustrativa do pack digital de músicas; nenhum pen drive físico está incluído.",
    },
    url: productUrl,
    category: "Música > Conteúdo digital > Pack de músicas para download",
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    additionalProperty: {
      "@type": "PropertyValue",
      name: "Forma de acesso",
      value: "Download digital após a aprovação do pagamento; sem envio físico",
    },
    offers: offers.map((offer) => ({
      "@type": "Offer",
      "@id": absoluteUrl(`/baixar-musicas#offer-${offer.id}`),
      name: offer.name,
      description: offer.description,
      url: absoluteUrl(offer.offerPath ?? productPath),
      priceCurrency: offer.currency,
      price: offer.price.toFixed(2),
      ...(offer.originalPrice
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: offer.originalPrice.toFixed(2),
              priceCurrency: offer.currency,
              priceType: "https://schema.org/StrikethroughPrice",
            },
          }
        : {}),
      availability: "https://schema.org/OnlineOnly",
      availableDeliveryMethod: directDownloadDeliveryMethod,
      seller: organizationReference(),
    })),
  };
}

export function articleSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  image = absoluteUrl(siteConfig.ogImage),
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image,
    inLanguage: siteConfig.language,
    datePublished,
    dateModified,
    author: organizationReference(),
    publisher: {
      ...organizationReference(),
      logo: organizationLogo(),
    },
    mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
  };
}
