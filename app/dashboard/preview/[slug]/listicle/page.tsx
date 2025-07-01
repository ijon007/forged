import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Eye, ListOrdered } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getCourseWithUser } from "@/actions/course-db-actions"
import { courseStore, formatCourseForPreview } from "@/lib/course-store"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { SidebarTrigger } from '@/components/ui/sidebar'
import CourseSidebar from "@/components/slug/course-sidebar"
import Image from "next/image"

export default async function ListiclePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    
    let generatedCourse = courseStore.get(slug)
    
    if (!generatedCourse) {
        const dbCourse = await getCourseWithUser(slug)
        if (dbCourse) {
            generatedCourse = {
                id: dbCourse.id,
                title: dbCourse.title,
                description: dbCourse.description,
                content: dbCourse.content,
                originalContent: dbCourse.originalContent,
                contentType: dbCourse.contentType || 'blog',
                tags: dbCourse.tags,
                keyPoints: dbCourse.keyPoints,
                estimatedReadTime: dbCourse.estimatedReadTime,
                createdAt: dbCourse.createdAt,
            }
            
            courseStore.set(slug, generatedCourse)
        }
    }
    
    if (!generatedCourse) {
        notFound()
    }

    const dbCourse = await getCourseWithUser(slug)
    if (!dbCourse) {
        notFound()
    }

    const priceInCents = dbCourse.price
    const formattedCourse = formatCourseForPreview(generatedCourse, priceInCents)
    
    const page = {
        id: formattedCourse.id,
        title: formattedCourse.title,
        description: formattedCourse.description,
        price: formattedCourse.price,
        author: dbCourse.userName,
        readTime: `${formattedCourse.estimatedReadTime} min read`,
        imageUrl: dbCourse.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
        content: formattedCourse.generatedContent,
        links: dbCourse.links || []
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-8xl">
                
                <div className="flex flex-row items-center justify-between">
                    <div className="mb-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl w-[55%] lg:w-full">
                        <div className="flex flex-col items-start gap-2">
                            <div className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-green-600" />
                                <span className="font-medium text-green-800 dark:text-green-200">Listicle Preview Mode</span>
                            </div>
                        </div>
                    </div>
                    <SidebarTrigger className="block md:hidden" />
                </div>
                
                <div className="space-y-6 mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <ListOrdered className="h-5 w-5 text-primary" />
                                <Badge variant="secondary">Listicle</Badge>
                            </div>
                            <h1 className="text-4xl font-bold leading-tight">{page.title}</h1>
                            <p className="text-xl text-muted-foreground">{page.description}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>By {page.author}</span>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{page.readTime}</span>
                        </div>
                    </div>
                    
                    <Separator />
                </div>

                <div className="mb-8">
                    <Image 
                        src={page.imageUrl} 
                        alt={page.title}
                        width={1000}
                        height={1000}
                        className="w-full h-64 object-cover rounded-lg"
                    />
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
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
                                h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0 text-primary">{children}</h1>,
                                h2: ({ children }) => {
                                const childString = String(children)
                                const isNumberedItem = /^\d+\./.test(childString.trim())
                                
                                return (
                                    <h2 
                                        className={`text-2xl font-bold mt-10 mb-6 ${
                                            isNumberedItem 
                                                ? 'p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl' 
                                                : ''
                                            }`
                                        }
                                    >
                                        {isNumberedItem && (
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold">
                                                    {childString.match(/^(\d+)/)?.[1]}
                                                </div>
                                            </div>
                                        )}
                                        {children}
                                    </h2>
                                )
                                },
                                h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-4">{children}</h3>,
                                h4: ({ children }) => <h4 className="text-lg font-medium mt-4 mb-3">{children}</h4>,
                                p: ({ children }) => <p className="mb-4 leading-7 text-gray-700 dark:text-gray-300">{children}</p>,
                                ul: ({ children }) => <ul className="mb-6 pl-6 space-y-3 list-disc list-outside">{children}</ul>,
                                ol: ({ children }) => <ol className="mb-6 pl-6 space-y-3 list-decimal list-outside">{children}</ol>,
                                li: ({ children }) => <li className="leading-7 text-gray-700 dark:text-gray-300">{children}</li>,
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-primary pl-6 italic text-gray-600 dark:text-gray-400 mb-6 bg-muted/50 py-4 rounded-r-lg">
                                        {children}
                                    </blockquote>
                                ),
                                strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
                                em: ({ children }) => <em className="italic">{children}</em>,
                                hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,
                            }}
                        >
                            {page.content}
                        </ReactMarkdown>
                        </div>
                    </div>

                    <div className="order-1 lg:order-last">
                        <CourseSidebar
                            price={page.price}
                            keyPoints={generatedCourse.keyPoints.slice(0, 5)}
                            tags={generatedCourse.tags}
                            links={page.links}
                            isPurchased={false}
                            courseId={page.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
} 