import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { CTA } from "@/components/cta";
import { allBlogPosts } from "../page";

export async function generateStaticParams() {
  return Object.values(allBlogPosts).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = Object.values(allBlogPosts).find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.keyword,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `https://www.tryforged.me/blog/${post.slug}`,
      type: "article",
    },
    alternates: {
      canonical: `https://www.tryforged.me/blog/${post.slug}`,
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = Object.values(allBlogPosts).find((p) => p.slug === slug);
  if (!post) return notFound();

  return (
    <main className="mx-auto mt-20 min-h-screen max-w-3xl bg-white px-4 py-16">
      <article className="mx-auto">
        <header className="mb-8 border-b pb-6">
          <h1 className="mb-2 font-bold text-4xl text-gray-900">
            {post.title}
          </h1>
          <p className="mb-4 text-gray-600 text-lg">{post.metaDescription}</p>
          <div className="mb-4 flex flex-wrap gap-6 text-gray-500 text-sm">
            <span>
              By{" "}
              <span className="font-medium text-gray-700">{post.author}</span>
            </span>
            <span>{post.readingTime} min read</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  className="inline-block rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-800 text-xs"
                  key={tag}
                >
                  {tag
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
              ))}
            </div>
          )}
        </header>
        <section className="prose prose-lg prose-slate mt-8 max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="mt-8 mb-4 border-b pb-2 font-bold text-3xl text-gray-900">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="mt-8 mb-4 font-semibold text-2xl text-gray-900">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-6 mb-3 font-semibold text-gray-900 text-xl">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="mb-4 list-disc space-y-2 pl-6">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-4 list-decimal space-y-2 pl-6">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-gray-700">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="my-6 border-blue-500 border-l-4 pl-4 text-gray-600 italic">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="rounded bg-gray-100 px-2 py-1 font-mono text-black text-sm">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-100 p-4">
                  {children}
                </pre>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-900">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="text-gray-700 italic">{children}</em>
              ),
              a: ({ href, children }) => (
                <a
                  className="text-blue-600 underline hover:text-blue-800"
                  href={href}
                >
                  {children}
                </a>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </section>
      </article>
      <CTA className="my-20 flex w-full self-center overflow-hidden rounded-4xl bg-gradient-to-br from-black via-gray-900 to-black py-40" />
    </main>
  );
}
