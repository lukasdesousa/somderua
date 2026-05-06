import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { getAllPosts } from "@/lib/content/blog";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Blog de repertórios e dicas para pen drive",
    description:
      "Guias práticos sobre músicas para pen drive, paredão, som automotivo, organização de pastas e compra segura de packs.",
    path: "/blog",
    keywords: ["blog de músicas", "dicas de repertório", "músicas para som automotivo"],
  });
}

export default function BlogPage() {
  const posts = getAllPosts();
  const crumbs = [
    { name: "Início", path: "/" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <JsonLd id="blog-breadcrumb-jsonld" data={breadcrumbSchema(crumbs)} />
      <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Blog" }]} />
      <h1 className="mb-3 text-4xl font-semibold text-gray-100">Blog de repertórios</h1>
      <p className="mb-8 max-w-3xl text-indigo-200/65">
        Guias para escolher, baixar, organizar e usar músicas em pen drive, carro, caixa de som e paredão.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
            <h2 className="text-2xl font-medium text-gray-100">
              <Link className="hover:text-indigo-300" href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-indigo-200/70">{post.excerpt}</p>
            <Link className="mt-4 inline-flex text-sm font-medium text-indigo-300 hover:text-indigo-200" href={`/blog/${post.slug}`}>
              Ler guia completo -&gt;
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
