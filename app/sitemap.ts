// app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://somderua.com.br/",
      lastModified: new Date(),
    },
    {
      url: "https://somderua.com.br/formulario",
      lastModified: new Date(),
    },
  ];
}
