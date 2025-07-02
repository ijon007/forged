'use client'

import { Badge } from '@/components/ui/badge'
import { Clock, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Socials from './socials'
import type { CourseLink } from '@/db/schemas/course-schema'

/* Plate js notes for integration
 - use editor plain
 - add simple toolbar
 - use plate markdown for content
 - add mcp
*/

interface BlogPreviewProps {
    previewData: {
        title: string
        generatedContent: string
        author?: string
        readTime?: string
        description?: string
        imageUrl?: string
        links?: CourseLink[]
        [key: string]: any
    }
}

const BlogPreview = ({ previewData }: BlogPreviewProps) => {
    const { title, generatedContent, author, readTime, description, imageUrl, links } = previewData
    const displayAuthor = author || "John Doe"
    const displayReadTime = readTime || "5 min read"
    const price = previewData.price || 29.99
    const displayDescription = description || "AI-generated blog post content"

    return (
        <article className="w-full max-w-6xl mx-auto bg-white rounded-xl border">
            <header className="px-6 py-8 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-green-600" />
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                        Blog Post
                    </Badge>
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 dark:text-gray-100">
                        {title}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        {displayDescription}
                    </p>
                </div>
                
                <div className="flex items-center gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">By {displayAuthor}</span>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{displayReadTime}</span>
                    </div>
                </div>
            </header>

            {imageUrl ? (
                <div className="px-6 py-6">
                    <img 
                        src={imageUrl} 
                        alt={title}
                        className="w-full h-64 md:h-80 object-cover rounded-lg"
                    />
                </div>
            ) : (
                <div className="px-6 py-6">
                    <div className="w-full h-64 md:h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                        Hero Image Placeholder
                    </div>
                </div>
            )}

            <div className="px-6 pb-8">
                <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '')
                                const language = match ? match[1] : ''
                                const isInline = !className?.includes('language-')
                                
                                if (isInline) {
                                    return (
                                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200" {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                                
                                return (
                                    <div className="my-6">
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={language || 'text'}
                                            PreTag="div"
                                            customStyle={{
                                                margin: 0,
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    </div>
                                )
                            },
                            h1: ({ children }) => (
                                <h1 className="text-3xl font-bold mt-12 mb-6 first:mt-8 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                                    {children}
                                </h1>
                            ),
                            h2: ({ children }) => (
                                <h2 className="text-2xl font-bold mt-10 mb-6 text-gray-900 dark:text-gray-100">
                                    {children}
                                </h2>
                            ),
                            h3: ({ children }) => (
                                <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">
                                    {children}
                                </h3>
                            ),
                            h4: ({ children }) => (
                                <h4 className="text-lg font-medium mt-6 mb-3 text-gray-900 dark:text-gray-100">
                                    {children}
                                </h4>
                            ),
                            p: ({ children }) => (
                                <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300 text-lg">
                                    {children}
                                </p>
                            ),
                            ul: ({ children }) => (
                                <ul className="mb-6 pl-6 space-y-3 list-disc list-outside text-gray-700 dark:text-gray-300">
                                    {children}
                                </ul>
                            ),
                            ol: ({ children }) => (
                                <ol className="mb-6 pl-6 space-y-3 list-decimal list-outside text-gray-700 dark:text-gray-300">
                                    {children}
                                </ol>
                            ),
                            li: ({ children }) => (
                                <li className="leading-relaxed text-lg">
                                    {children}
                                </li>
                            ),
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-green-500 pl-6 my-6 bg-gray-50 dark:bg-gray-800 py-4 rounded-r-lg">
                                    <div className="text-gray-700 dark:text-gray-300 italic text-lg">
                                        {children}
                                    </div>
                                </blockquote>
                            ),
                            strong: ({ children }) => (
                                <strong className="font-semibold text-gray-900 dark:text-gray-100">
                                    {children}
                                </strong>
                            ),
                            em: ({ children }) => <em className="italic">{children}</em>,
                            hr: () => (
                                <hr className="my-10 border-gray-200 dark:border-gray-700" />
                            ),
                        }}
                    >
                        {generatedContent}
                    </ReactMarkdown>
                </div>

                {links && links.length > 0 && (
                    <div className="mt-8">
                        <Socials initialLinks={links} readOnly={true} />
                    </div>
                )}
            </div>
        </article>
    )
}

export default BlogPreview