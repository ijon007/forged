import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, FileText, ListOrdered } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getCourseWithUser } from "@/actions/course-db-actions"
import { courseStore, formatCourseForPreview } from "@/lib/course-store"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { SidebarTrigger } from '@/components/ui/sidebar'
import CourseSidebar from "@/components/slug/course-sidebar"
import { CONTENT_TYPES } from "@/db/schemas/course-schema"
import Image from "next/image"

export default async function BlogPreviewPage({
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
                originalContent: typeof dbCourse.originalContent === 'string' ? dbCourse.originalContent : '',
                contentType: dbCourse.contentType || 'blog',
                tags: dbCourse.tags,
                keyPoints: dbCourse.keyPoints,
                estimatedReadTime: dbCourse.estimatedReadTime,
                createdAt: dbCourse.createdAt,
            }
            
            if (generatedCourse) {
                courseStore.set(slug, generatedCourse)
            }
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
        contentType: generatedCourse.contentType,
        author: dbCourse.userName,
        readTime: `${formattedCourse.estimatedReadTime} min read`,
        imageUrl: dbCourse.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
        content: formattedCourse.generatedContent,
        links: dbCourse.links || []
    }

    const isListicle = page.contentType === CONTENT_TYPES.LISTICLE

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                
                <div className="flex flex-row items-center justify-between mb-8">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg w-full max-w-md">
                        <div className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-800">Preview Mode</span>
                        </div>
                    </div>
                    <SidebarTrigger className="block md:hidden" />
                </div>
                
                <article className="overflow-hidden mb-8">
                    <header className="px-8 py-10 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-6">
                            {isListicle ? (
                                <>
                                    <ListOrdered className="h-5 w-5 text-blue-600" />
                                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                                        Listicle
                                    </Badge>
                                </>
                            ) : (
                                <>
                                    <FileText className="h-5 w-5 text-green-600" />
                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                        Blog Post
                                    </Badge>
                                </>
                            )}
                        </div>
                        
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                                {page.title}
                            </h1>
                            {page.description && (
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    {page.description}
                                </p>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-8 mt-8 text-sm text-gray-500">
                            <span className="font-medium">By {page.author}</span>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{page.readTime}</span>
                            </div>
                        </div>
                    </header>

                    <div className="px-8 py-8">
                        <Image 
                            src={page.imageUrl} 
                            alt={page.title}
                            width={1000}
                            height={600}
                            className="w-full h-80 object-cover rounded-lg"
                        />
                    </div>
                </article>

                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <div className="prose prose-xl prose-gray max-w-none">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ className, children, ...props }: any) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        const language = match ? match[1] : ''
                                        const isInline = !className?.includes('language-')
                                        
                                        if (isInline) {
                                            return (
                                                <code className="bg-gray-100 px-2 py-1 rounded text-base font-mono text-gray-800" {...props}>
                                                    {children}
                                                </code>
                                            )
                                        }
                                        
                                        return (
                                            <div className="my-8">
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={language || 'text'}
                                                    PreTag="div"
                                                    customStyle={{
                                                        margin: 0,
                                                        borderRadius: '0.5rem',
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            </div>
                                        )
                                    },
                                    h1: ({ children }) => (
                                        <h1 className="text-4xl font-bold text-gray-900 border-gray-200 pb-4">
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => {
                                        if (isListicle) {
                                            const childString = String(children)
                                            const numberMatch = childString.match(/^(\d+)\.\s*(.+)/)
                                            
                                            if (numberMatch) {
                                                const [, number, title] = numberMatch
                                                return (
                                                    <div className="my-12 first:mt-8">
                                                        <div className="flex items-start gap-6 mb-8">
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
                                        }
                                        return (
                                            <h2 className="text-3xl font-bold mt-12 mb-8 text-gray-900">
                                                {children}
                                            </h2>
                                        )
                                    },
                                    h3: ({ children }) => (
                                        <h3 className="text-2xl font-semibold mt-10 mb-6 text-gray-900">
                                            {children}
                                        </h3>
                                    ),
                                    h4: ({ children }) => (
                                        <h4 className="text-xl font-medium mt-8 mb-4 text-gray-900">
                                            {children}
                                        </h4>
                                    ),
                                    p: ({ children }) => (
                                        <p className="mb-6 leading-relaxed text-gray-700 text-lg">
                                            {children}
                                        </p>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="mb-8 pl-8 space-y-4 list-disc list-outside text-gray-700">
                                            {children}
                                        </ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="mb-8 pl-8 space-y-4 list-decimal list-outside text-gray-700">
                                            {children}
                                        </ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="leading-relaxed text-lg">
                                            {children}
                                        </li>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className={`border-l-4 ${isListicle ? 'border-blue-500' : 'border-green-500'} pl-8 my-8 bg-gray-50 py-6 rounded-r-lg`}>
                                            <div className="text-gray-700 italic text-xl">
                                                {children}
                                            </div>
                                        </blockquote>
                                    ),
                                    strong: ({ children }) => (
                                        <strong className="font-semibold text-gray-900">
                                            {children}
                                        </strong>
                                    ),
                                    em: ({ children }) => <em className="italic">{children}</em>,
                                    hr: () => (
                                        <hr className="my-12 border-gray-200" />
                                    ),
                                }}
                            >
                                {typeof page.content === 'string' ? page.content : ''}
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