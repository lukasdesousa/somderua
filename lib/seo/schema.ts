import { absoluteUrl } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/config";

type BreadcrumbItem = { name: string; path: string };

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/apple-touch-icon.png"),
    sameAs: [siteConfig.social.instagram],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
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

export function productOfferSchema({
  name,
  description,
  price,
  currency,
  productPath = "/",
  offerPath = productPath,
  image = absoluteUrl("/images/pack-16gb-4500.png"),
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
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
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
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/apple-touch-icon.png"),
      },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
  };
}
