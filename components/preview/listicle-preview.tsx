'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
        <Card className="w-full">
            <CardHeader className="space-y-4">
                <div className="flex items-center gap-2">
                    <ListOrdered className="h-5 w-5 text-primary" />
                    <Badge variant="secondary">Listicle</Badge>
                </div>
                
                <div className="space-y-3">
                    <CardTitle className="text-2xl font-bold leading-tight">{title}</CardTitle>
                    {description && (
                        <CardDescription className="text-base">{description}</CardDescription>
                    )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {author && <span>By {author}</span>}
                    {readTime && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{readTime}</span>
                        </div>
                    )}
                </div>
                
                <Separator />
            </CardHeader>

            <CardContent>
                {imageUrl && (
                    <div className="mb-6">
                        <img 
                            src={imageUrl} 
                            alt={title}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    </div>
                )}

                <div className="prose prose-gray dark:prose-invert max-w-none listicle-content">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '')
                                const language = match ? match[1] : ''
                                const isInline = !className?.includes('language-')
                                
                                if (isInline) {
                                    return (
                                        <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                                
                                return (
                                    <div className="my-4">
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={language || 'text'}
                                            PreTag="div"
                                            customStyle={{
                                                margin: 0,
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem',
                                            }}
                                            codeTagProps={{
                                                style: {
                                                    fontSize: '0.875rem',
                                                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                                },
                                            }}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    </div>
                                )
                            },
                            h1: ({ children }) => (
                                <h1 className="text-2xl font-bold mt-8 mb-4 first:mt-0 text-primary">
                                    {children}
                                </h1>
                            ),
                            h2: ({ children }) => {
                                // Special handling for numbered listicle items
                                const childString = String(children)
                                const isNumberedItem = /^\d+\./.test(childString.trim())
                                
                                return (
                                    <h2 className={`text-xl font-semibold mt-8 mb-4 ${
                                        isNumberedItem 
                                            ? 'p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg' 
                                            : ''
                                    }`}>
                                        {isNumberedItem && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                                                    {childString.match(/^(\d+)/)?.[1]}
                                                </div>
                                            </div>
                                        )}
                                        {children}
                                    </h2>
                                )
                            },
                            h3: ({ children }) => <h3 className="text-lg font-medium mt-6 mb-3">{children}</h3>,
                            h4: ({ children }) => <h4 className="text-base font-medium mt-4 mb-2">{children}</h4>,
                            p: ({ children }) => <p className="mb-4 leading-7 text-gray-700 dark:text-gray-300">{children}</p>,
                            ul: ({ children }) => <ul className="mb-6 pl-6 space-y-3 list-disc list-outside">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-6 pl-6 space-y-3 list-decimal list-outside">{children}</ol>,
                            li: ({ children }) => <li className="leading-7 text-gray-700 dark:text-gray-300">{children}</li>,
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 dark:text-gray-400 mb-6 bg-muted/50 py-3 rounded-r-lg">
                                    {children}
                                </blockquote>
                            ),
                            strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                            hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,
                        }}
                    >
                        {generatedContent}
                    </ReactMarkdown>
                </div>
            </CardContent>
        </Card>
    )
} 