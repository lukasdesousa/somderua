import type { MetadataRoute } from "next";
import { privateRoutes } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: privateRoutes,
    },
    sitemap: "https://somderua.com.br/sitemap.xml",
    host: "https://somderua.com.br",
  };
}
