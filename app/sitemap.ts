import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content/blog";
import { privateRoutes } from "@/lib/seo/config";
import { absoluteUrl } from "@/lib/seo/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const basePages = ["/", "/blog", "/baixar-musicas", "/musicas-para-pen-drive", "/musicas-para-paredao"]
    .filter((route) => !privateRoutes.includes(route))
    .map((route) => ({
      url: absoluteUrl(route),
      lastModified: new Date(),
      changeFrequency: route === "/" ? "weekly" : "daily",
      priority: route === "/" ? 1 : 0.8,
    })) satisfies MetadataRoute.Sitemap;

  const blogPages = getAllPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...basePages, ...blogPages];
}
