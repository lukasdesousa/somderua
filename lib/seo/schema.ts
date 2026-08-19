import { absoluteUrl } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/config";

type BreadcrumbItem = { name: string; path: string };
type FaqItem = { question: string; answer: string };
type ProductSchemaOffer = {
  name: string;
  description: string;
  price: number;
  currency: string;
  offerPath?: string;
};

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

export function productOffersSchema({
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
  offers: ProductSchemaOffer[];
}) {
  const productUrl = absoluteUrl(productPath);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: offers.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      description: offer.description,
      url: absoluteUrl(offer.offerPath ?? productPath),
      priceCurrency: offer.currency,
      price: offer.price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: organizationReference(),
    })),
  };
}

export function productOfferSchema({
  name,
  description,
  price,
  currency,
  productPath = "/",
  offerPath = productPath,
  image = absoluteUrl("/images/pack-16gb-5000.png"),
}: {
  name: string;
  description: string;
  price: number;
  currency: string;
  productPath?: string;
  offerPath?: string;
  image?: string;
}) {
  const productUrl = absoluteUrl(productPath);
  const offerUrl = absoluteUrl(offerPath);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: offerUrl,
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: organizationReference(),
    },
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
