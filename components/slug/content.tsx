import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Lock, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CONTENT_TYPES } from '@/db/schemas/course-schema'

const PublishedContent = ({ page }: { page: any }) => {
    const isListicle = page.contentType === CONTENT_TYPES.LISTICLE
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
                            const isNumberedItem = /^\d+\./.test(childString.trim())
                            
                            if (isNumberedItem) {
                                return (
                                    <h2 className="text-xl font-semibold mt-8 mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                {childString.match(/^(\d+)/)?.[1]}
                                            </div>
                                            <span>{childString.replace(/^\d+\.\s*/, '')}</span>
                                        </div>
                                    </h2>
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
                    {page.content}
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
                                const isNumberedItem = /^\d+\./.test(childString.trim())
                                
                                if (isNumberedItem) {
                                    return (
                                        <h2 className="text-2xl font-semibold mt-8 mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                    {childString.match(/^(\d+)/)?.[1]}
                                                </div>
                                                <span>{childString.replace(/^\d+\.\s*/, '')}</span>
                                            </div>
                                        </h2>
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
                      {page.content.split('\n').slice(0, 15).join('\n')}
                    </ReactMarkdown>
                  </div>
                  
                  <Card className="border-dashed border-2 bg-muted/20">
                    <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4 sm:px-6">
                      <Lock className="h-10 w-10 sm:h-12 sm:w-12 text-black mb-3 sm:mb-4" />
                      <CardTitle className="mb-2 text-lg sm:text-xl">Continue Reading</CardTitle>
                      <CardDescription className="mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
                        Unlock the full article to continue reading and get access to all the examples and insights.
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