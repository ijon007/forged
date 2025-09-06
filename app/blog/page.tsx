import Link from "next/link";
import { BEST_IN_2025 } from "@/constants/best-in-2025";
import { BEST_PLATFORM } from "@/constants/best-platform";
import { blogPosts } from "@/constants/blogs";
import { HOW_TO_START } from "@/constants/how-to-start";
import { MAKE_COURSE } from "@/constants/make-course";
import { MONETIZE_BLOG } from "@/constants/monetize-blog";
import { TOP_10_BLOG } from "@/constants/top-10-blog";

export const allBlogPosts = {
  ...blogPosts,
  ...BEST_IN_2025,
  ...HOW_TO_START,
  ...TOP_10_BLOG,
  ...MAKE_COURSE,
  ...MONETIZE_BLOG,
  ...BEST_PLATFORM,
};

export default function BlogMainPage() {
  const posts = Object.values(allBlogPosts).sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <>
      <main className="mx-auto mt-20 max-w-4xl px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="mb-2 font-bold text-4xl">Articles</h1>
          <p className="text-gray-600 text-lg">
            Insights, tutorials, and news about AI-powered course creation and
            knowledge monetization.
          </p>
        </header>
        <section className="grid gap-8">
          {posts.map((post) => (
            <article className="border-b pb-8 last:border-b-0" key={post.id}>
              <h2 className="mb-1 font-semibold text-2xl">
                <Link className="hover:underline" href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              <p className="mb-2 text-gray-700">{post.metaDescription}</p>
              <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
                <span>By {post.author}</span>
                <span>{post.readingTime} min read</span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
