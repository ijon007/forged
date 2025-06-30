'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Socials from './socials'
import type { CourseLink } from '@/db/schemas/course-schema'

interface PreviewProps {
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

const Preview = ({ previewData }: PreviewProps) => {
    const author = previewData.author || "John Doe"
    const readTime = previewData.readTime || "5 min read"
    const price = previewData.price || 29.99
    const description = previewData.description || "AI-generated blog post content"

    return (
        <Card className="flex-1">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Generated Blog Post Preview</CardTitle>
                        <CardDescription>
                            Preview how your published page will look
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto border rounded-lg bg-white dark:bg-background">
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <Badge variant="secondary">Blog Post</Badge>
                            <h1 className="text-2xl font-bold leading-tight">{previewData.title}</h1>
                            <p className="text-lg text-muted-foreground">{description}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>By {author}</span>
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{readTime}</span>
                            </div>
                        </div>
                        
                        <Separator />

                        {previewData.imageUrl ? (
                            <div>
                                <img 
                                    src={previewData.imageUrl} 
                                    alt={previewData.title}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                                Hero Image Placeholder
                            </div>
                        )}

                        <div className="prose prose-gray dark:prose-invert max-w-none prose-sm">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ className, children, ...props }: any) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        const language = match ? match[1] : ''
                                        const isInline = !className?.includes('language-')
                                        
                                        if (isInline) {
                                            return (
                                                <code className="bg-muted/60 text-foreground px-1.5 py-0.5 rounded text-sm font-mono border" {...props}>
                                                    {children}
                                                </code>
                                            )
                                        }
                                        
                                        return (
                                            <div className="my-4 not-prose">
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={language || 'text'}
                                                    PreTag="div"
                                                    customStyle={{
                                                        margin: 0,
                                                        borderRadius: '0.5rem',
                                                        fontSize: '0.875rem',
                                                        lineHeight: '1.5',
                                                        border: '1px solid #374151',
                                                    }}
                                                    codeTagProps={{
                                                        style: {
                                                            fontSize: '0.875rem',
                                                            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                                            lineHeight: '1.5',
                                                        },
                                                    }}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            </div>
                                        )
                                    },
                                    h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-3 first:mt-0">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>,
                                    h4: ({ children }) => <h4 className="text-base font-medium mt-3 mb-2">{children}</h4>,
                                    p: ({ children }) => <p className="mb-3 leading-6 text-gray-700 dark:text-gray-300">{children}</p>,
                                    ul: ({ children }) => <ul className="mb-4 pl-6 space-y-2 list-disc list-outside">{children}</ul>,
                                    ol: ({ children }) => <ol className="mb-4 pl-6 space-y-2 list-decimal list-outside">{children}</ol>,
                                    li: ({ children }) => <li className="leading-6 text-gray-700 dark:text-gray-300">{children}</li>,
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 italic text-gray-600 dark:text-gray-400 mb-3">
                                            {children}
                                        </blockquote>
                                    ),
                                    strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
                                    em: ({ children }) => <em className="italic">{children}</em>,
                                    hr: () => <hr className="my-6 border-gray-200 dark:border-gray-700" />,
                                }}
                            >
                                {previewData.generatedContent}
                            </ReactMarkdown>
                        </div>

                        <div className="mt-8 p-4 bg-muted/20 rounded-lg">
                            <h4 className="font-medium mb-3">About this article</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Author</span>
                                    <span className="font-medium">{author}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Read time</span>
                                    <span className="font-medium">{readTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Price</span>
                                    <span className="font-medium">${price}</span>
                                </div>
                            </div>
                        </div>

                        {previewData.links && previewData.links.length > 0 && (
                            <div className="mt-6">
                                <Socials initialLinks={previewData.links} readOnly={true} />
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default Preview