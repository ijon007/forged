import { blogPosts } from '@/constants/blogs'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

export async function generateStaticParams() {
    return Object.values(blogPosts).map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const post = Object.values(blogPosts).find(p => p.slug === slug)
    if (!post) return {}
    return {
        title: post.title,
        description: post.metaDescription,
        keywords: post.keyword,
        openGraph: {
            title: post.title,
            description: post.metaDescription,
            url: `https://tryforged.me/blog/${post.slug}`,
            type: 'article',
        },
        alternates: {
            canonical: `https://tryforged.me/blog/${post.slug}`,
        },
    }
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = Object.values(blogPosts).find(p => p.slug === slug)
    if (!post) return notFound()

    return (
        <main className="max-w-3xl mx-auto py-16 px-4 bg-white min-h-screen mt-20">
            <article className="mx-auto">
                <header className="mb-8 border-b pb-6">
                    <h1 className="text-4xl font-bold mb-2 text-gray-900">{post.title}</h1>
                    <p className="text-lg text-gray-600 mb-4">{post.metaDescription}</p>
                    <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-4">
                        <span>By <span className="font-medium text-gray-700">{post.author}</span></span>
                        <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span>{post.readingTime} min read</span>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    {tag.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </span>
                            ))}
                        </div>
                    )}
                </header>
                <section className="mt-8 prose prose-lg prose-slate max-w-none">
                    <ReactMarkdown
                        components={{
                            h1: ({ children }) => (
                                <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 border-b pb-2">
                                    {children}
                                </h1>
                            ),
                            h2: ({ children }) => (
                                <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                                    {children}
                                </h2>
                            ),
                            h3: ({ children }) => (
                                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                                    {children}
                                </h3>
                            ),
                            p: ({ children }) => (
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    {children}
                                </p>
                            ),
                            ul: ({ children }) => (
                                <ul className="list-disc pl-6 mb-4 space-y-2">
                                    {children}
                                </ul>
                            ),
                            ol: ({ children }) => (
                                <ol className="list-decimal pl-6 mb-4 space-y-2">
                                    {children}
                                </ol>
                            ),
                            li: ({ children }) => (
                                <li className="text-gray-700">
                                    {children}
                                </li>
                            ),
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-6">
                                    {children}
                                </blockquote>
                            ),
                            code: ({ children }) => (
                                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-black">
                                    {children}
                                </code>
                            ),
                            pre: ({ children }) => (
                                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                                    {children}
                                </pre>
                            ),
                            strong: ({ children }) => (
                                <strong className="font-semibold text-gray-900">
                                    {children}
                                </strong>
                            ),
                            em: ({ children }) => (
                                <em className="italic text-gray-700">
                                    {children}
                                </em>
                            ),
                            a: ({ href, children }) => (
                                <a href={href} className="text-blue-600 hover:text-blue-800 underline">
                                    {children}
                                </a>
                            ),
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </section>
                <footer className="mt-12 border-t pt-6 text-center">
                    <Link href="/blog" className="text-blue-600 hover:underline">← Back to Articles</Link>
                </footer>
            </article>
        </main>
    )
}