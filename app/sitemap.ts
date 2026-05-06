import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content/blog";
import { privateRoutes } from "@/lib/seo/config";
import { absoluteUrl } from "@/lib/seo/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { route: "/", lastModified: "2026-05-06", changeFrequency: "weekly" as const, priority: 1 },
    { route: "/blog", lastModified: "2026-05-06", changeFrequency: "weekly" as const, priority: 0.8 },
    { route: "/baixar-musicas", lastModified: "2026-05-06", changeFrequency: "monthly" as const, priority: 0.8 },
    { route: "/musicas-para-pen-drive", lastModified: "2026-05-06", changeFrequency: "monthly" as const, priority: 0.8 },
    { route: "/musicas-para-paredao", lastModified: "2026-05-06", changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  const basePages = staticPages
    .filter((page) => !privateRoutes.includes(page.route))
    .map((page) => ({
      url: absoluteUrl(page.route),
      lastModified: new Date(page.lastModified),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })) satisfies MetadataRoute.Sitemap;

  const blogPages = getAllPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...basePages, ...blogPages];
}
