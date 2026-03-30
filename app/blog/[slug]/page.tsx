import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { getAllPosts, getPostBySlug } from "@/lib/content/blog";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: "Conteúdo não encontrado",
      description: "Este conteúdo não está mais disponível.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const related = post.relatedSlugs
    .map((relatedSlug) => getPostBySlug(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const crumbs = [
    { name: "Início", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <JsonLd
        id="article-jsonld"
        data={articleSchema({
          title: post.title,
          description: post.description,
          slug: post.slug,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
        })}
      />
      <JsonLd id="article-breadcrumb-jsonld" data={breadcrumbSchema(crumbs)} />

      <Breadcrumbs
        items={[
          { name: "Início", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title },
        ]}
      />
      <h1 className="mb-3 mt-4 text-4xl font-semibold text-gray-100">{post.title}</h1>
      <p className="mb-8 text-indigo-200/70">{post.description}</p>

      <div className="space-y-4 text-lg leading-relaxed text-gray-200">
        {post.content.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
        <h2 className="text-2xl font-semibold text-gray-100">Páginas relacionadas</h2>
        <ul className="mt-3 space-y-2">
          {related.map((item) => (
            <li key={item.slug}>
              <Link className="text-indigo-300 hover:text-indigo-200" href={`/blog/${item.slug}`}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
