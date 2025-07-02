import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Lock } from 'lucide-react'
import { CONTENT_TYPES } from '@/db/schemas/course-schema'
import PublicCoursePlayer from './public-course-player'

const PublishedContent = ({ page }: { page: any }) => {
    const isListicle = page.contentType === CONTENT_TYPES.LISTICLE
    const isCourse = page.contentType === CONTENT_TYPES.COURSE
    
    if (isCourse && (page.isPurchased || page.price === 0)) {
        let lessons;
        try {
            lessons = typeof page.content === 'string' 
                ? JSON.parse(page.content) 
                : page.content;
        } catch (error) {
            console.error('Failed to parse course content:', error);
            return <div>Error loading course content</div>;
        }
        
        if (Array.isArray(lessons)) {
            return <PublicCoursePlayer lessons={lessons} courseTitle={page.title} />;
        }
    }
    
    return (
        <>
            {page.isPurchased || page.price === 0 ? (
                <div className="prose prose-gray dark:prose-invert max-w-none prose-sm sm:prose-base">
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
                                    <div className="my-4 overflow-x-auto">
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={language || 'text'}
                                            PreTag="div"
                                            customStyle={{
                                                margin: 0,
                                                borderRadius: '0.5rem',
                                                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                                overflowX: 'auto'
                                            }}
                                            codeTagProps={{
                                                style: {
                                                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                                },
                                            }}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    </div>
                                )
                            },
                            h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-3 first:mt-0">{children}</h1>,
                            h2: ({ children }) => {
                                if (isListicle) {
                                    const childString = String(children)
                                    const numberMatch = childString.match(/^(\d+)\.\s*(.+)/)
                                    
                                    if (numberMatch) {
                                        const [, number, title] = numberMatch
                                        return (
                                            <div className="my-8 first:mt-4">
                                                <div className="flex items-start gap-4 mb-6">
                                                    <div className="flex-shrink-0 w-9 h-9 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                        {number}
                                                    </div>
                                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1 leading-tight">
                                                        {title}
                                                    </h2>
                                                </div>
                                            </div>
                                        )
                                    }
                                }
                                return <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>
                            },
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
                        {typeof page.content === 'string' ? page.content : JSON.stringify(page.content)}
                    </ReactMarkdown>
                </div>
              ) : (
                <div className="space-y-6 sm:space-y-8">
                  <div className="prose prose-gray dark:prose-invert max-w-none prose-sm sm:prose-base">
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ className, children, ...props }: any) {
                                const isInline = !className?.includes('language-')
                                return isInline ? (
                                    <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
                                    {children}
                                    </code>
                                ) : (
                                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                                    <code className="text-sm font-mono" {...props}>
                                        {children}
                                    </code>
                                    </pre>
                                )
                                },
                                h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0">{children}</h1>,
                                h2: ({ children }) => {
                                    if (isListicle) {
                                        const childString = String(children)
                                        const numberMatch = childString.match(/^(\d+)\.\s*(.+)/)
                                        
                                        if (numberMatch) {
                                            const [, number, title] = numberMatch
                                            return (
                                                <div className="my-10 first:mt-6">
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <div className="flex-shrink-0 w-9 h-9 bg-black text-white rounded-full flex items-center justify-center text-base font-bold">
                                                            {number}
                                                        </div>
                                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 leading-tight">
                                                            {title}
                                                        </h2>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    }
                                    return <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>
                                },
                                h3: ({ children }) => <h3 className="text-xl font-medium mt-6 mb-3">{children}</h3>,
                                h4: ({ children }) => <h4 className="text-lg font-medium mt-4 mb-2">{children}</h4>,
                                p: ({ children }) => <p className="mb-4 leading-7 text-gray-700 dark:text-gray-300">{children}</p>,
                                ul: ({ children }) => <ul className="mb-4 space-y-2 list-disc list-inside">{children}</ul>,
                                ol: ({ children }) => <ol className="mb-4 space-y-2 list-decimal list-inside">{children}</ol>,
                                li: ({ children }) => <li className="leading-7">{children}</li>,
                                blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 mb-4">
                                    {children}
                                </blockquote>
                                ),
                                strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
                                em: ({ children }) => <em className="italic">{children}</em>,
                                hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,
                            }}
                        >
                            {typeof page.content === 'string' 
                                ? page.content.split('\n').slice(0, 15).join('\n')
                                : 'Course content preview...'
                            }
                        </ReactMarkdown>
                    </div>
                  
                    <Card className="border-dashed border-2 bg-muted/20">
                        <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4 sm:px-6">
                            <Lock className="h-10 w-10 sm:h-12 sm:w-12 text-black mb-3 sm:mb-4" />
                            <CardTitle className="mb-2 text-lg sm:text-xl">
                                {isCourse ? 'Continue Learning' : 'Continue Reading'}
                            </CardTitle>
                            <CardDescription className="mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
                                {isCourse 
                                    ? 'Unlock the full course to access all lessons, quizzes, and interactive content.'
                                    : 'Unlock the full article to continue reading and get access to all the examples and insights.'
                                }
                            </CardDescription>
                            
                            <div className="space-y-3 sm:space-y-4 w-full max-w-sm">
                                <div className="text-center">
                                    <span className="text-2xl sm:text-3xl font-bold">${page.price}</span>
                                    <span className="text-muted-foreground ml-1 text-sm sm:text-base">one-time</span>
                                </div>
                                
                                <div className="text-xs text-muted-foreground">
                                    Instant access • No subscription
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
              )}
        </>
    )
}

export default PublishedContent