import Link from 'next/link'
import { blogPosts } from '@/constants/blogs'
import { BEST_IN_2025 } from '@/constants/best-in-2025'
import { HOW_TO_START } from '@/constants/how-to-start'
import { TOP_10_BLOG } from '@/constants/top-10-blog'
import { MAKE_COURSE } from '@/constants/make-course'
import { MONETIZE_BLOG } from '@/constants/monetize-blog'
import { BEST_PLATFORM } from '@/constants/best-platform'

export const allBlogPosts = {
  ...blogPosts,
  ...BEST_IN_2025,
  ...HOW_TO_START,
  ...TOP_10_BLOG,
  ...MAKE_COURSE,
  ...MONETIZE_BLOG,
  ...BEST_PLATFORM,
}

export default function BlogMainPage() {
    const posts = Object.values(allBlogPosts).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return (
        <>
            <main className="max-w-4xl mx-auto py-12 mt-20 px-4">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-2">Articles</h1>
                    <p className="text-lg text-gray-600">Insights, tutorials, and news about AI-powered course creation and knowledge monetization.</p>
                </header>
                <section className="grid gap-8">
                    {posts.map(post => (
                        <article key={post.id} className="border-b pb-8 last:border-b-0">
                            <h2 className="text-2xl font-semibold mb-1">
                                <Link href={`/blog/${post.slug}`} className="hover:underline">
                                    {post.title}
                                </Link>
                            </h2>
                            <p className="text-gray-700 mb-2">{post.metaDescription}</p>
                            <div className="text-sm text-gray-500 flex flex-wrap gap-4">
                                <span>By {post.author}</span>
                                <span>{post.readingTime} min read</span>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </>
    )
}