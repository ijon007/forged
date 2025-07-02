'use client'

import { Badge } from '@/components/ui/badge'
import { Clock, ListOrdered } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { CourseLink } from '@/db/schemas/course-schema'

interface ListiclePreviewProps {
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

export default function ListiclePreview({ previewData }: ListiclePreviewProps) {
    const { title, generatedContent, author, readTime, description, imageUrl } = previewData

    return (
        <article className="w-full max-w-6xl mx-auto bg-white rounded-xl border">
            <header className="px-6 py-8 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                    <ListOrdered className="h-5 w-5 text-blue-600" />
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                        Listicle
                    </Badge>
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 dark:text-gray-100">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
                
                <div className="flex items-center gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
                    {author && (
                        <span className="font-medium">By {author}</span>
                    )}
                    {readTime && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{readTime}</span>
                        </div>
                    )}
                </div>
            </header>

            {imageUrl && (
                <div className="px-6 py-6">
                    <img 
                        src={imageUrl} 
                        alt={title}
                        className="w-full h-64 md:h-80 object-cover rounded-lg"
                    />
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
                            h2: ({ children }) => {
                                const childString = String(children)
                                const numberMatch = childString.match(/^(\d+)\.\s*(.+)/)
                                
                                if (numberMatch) {
                                    const [, number, title] = numberMatch
                                    return (
                                        <div className="my-10 first:mt-6">
                                            <div className="flex items-start gap-4 mb-6">
                                                <div className="bg-black text-white rounded-full flex items-center justify-center text-lg font-bold w-9 h-9">
                                                    {number}
                                                </div>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 leading-tight">
                                                    {title}
                                                </h2>
                                            </div>
                                        </div>
                                    )
                                }
                                
                                return (
                                    <h2 className="text-2xl font-bold mt-10 mb-6 text-gray-900 dark:text-gray-100">
                                        {children}
                                    </h2>
                                )
                            },
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
                                <blockquote className="border-l-4 border-blue-500 pl-6 my-6 bg-gray-50 dark:bg-gray-800 py-4 rounded-r-lg">
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
            </div>
        </article>
    )
} 