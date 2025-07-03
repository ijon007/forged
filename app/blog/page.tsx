import { blogPosts } from '@/constants/blogs'
import Link from 'next/link'
import { FloatingNav } from '@/components/floating-nav'

export default function BlogMainPage() {
    const posts = Object.values(blogPosts).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

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
                                <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                <span>{post.readingTime} min read</span>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </>
    )
}