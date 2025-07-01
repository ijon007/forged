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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                
                {/* Preview Mode Banner */}
                <div className="flex flex-row items-center justify-between mb-8">
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg w-full max-w-md">
                        <div className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-800 dark:text-green-200">Listicle Preview Mode</span>
                        </div>
                    </div>
                    <SidebarTrigger className="block md:hidden" />
                </div>
                
                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        {/* Article Container */}
                        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                            {/* Header */}
                            <header className="px-8 py-10 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-6">
                                    <ListOrdered className="h-5 w-5 text-blue-600" />
                                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                                        Listicle
                                    </Badge>
                                </div>
                                
                                <div className="space-y-6">
                                    <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-gray-100">
                                        {page.title}
                                    </h1>
                                    {page.description && (
                                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {page.description}
                                        </p>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-8 mt-8 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium">By {page.author}</span>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{page.readTime}</span>
                                    </div>
                                </div>
                            </header>

                            {/* Featured Image */}
                            <div className="px-8 py-8">
                                <Image 
                                    src={page.imageUrl} 
                                    alt={page.title}
                                    width={1000}
                                    height={600}
                                    className="w-full h-80 object-cover rounded-lg"
                                />
                            </div>

                            {/* Content */}
                            <div className="px-8 pb-10">
                                <div className="prose prose-xl prose-gray dark:prose-invert max-w-none">
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ className, children, ...props }: any) {
                                                const match = /language-(\w+)/.exec(className || '')
                                                const language = match ? match[1] : ''
                                                const isInline = !className?.includes('language-')
                                                
                                                if (isInline) {
                                                    return (
                                                        <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-base font-mono text-gray-800 dark:text-gray-200" {...props}>
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
                                                <h1 className="text-4xl font-bold mt-16 mb-8 first:mt-10 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-4">
                                                    {children}
                                                </h1>
                                            ),
                                            h2: ({ children }) => {
                                                const childString = String(children)
                                                const numberMatch = childString.match(/^(\d+)\.\s*(.+)/)
                                                
                                                if (numberMatch) {
                                                    const [, number, title] = numberMatch
                                                    return (
                                                        <div className="my-12 first:mt-8">
                                                            <div className="flex items-start gap-6 mb-8">
                                                                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                                                                    {number}
                                                                </div>
                                                                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2 leading-tight">
                                                                    {title}
                                                                </h2>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                
                                                return (
                                                    <h2 className="text-3xl font-bold mt-12 mb-8 text-gray-900 dark:text-gray-100">
                                                        {children}
                                                    </h2>
                                                )
                                            },
                                            h3: ({ children }) => (
                                                <h3 className="text-2xl font-semibold mt-10 mb-6 text-gray-900 dark:text-gray-100">
                                                    {children}
                                                </h3>
                                            ),
                                            h4: ({ children }) => (
                                                <h4 className="text-xl font-medium mt-8 mb-4 text-gray-900 dark:text-gray-100">
                                                    {children}
                                                </h4>
                                            ),
                                            p: ({ children }) => (
                                                <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300 text-lg">
                                                    {children}
                                                </p>
                                            ),
                                            ul: ({ children }) => (
                                                <ul className="mb-8 pl-8 space-y-4 list-disc list-outside text-gray-700 dark:text-gray-300">
                                                    {children}
                                                </ul>
                                            ),
                                            ol: ({ children }) => (
                                                <ol className="mb-8 pl-8 space-y-4 list-decimal list-outside text-gray-700 dark:text-gray-300">
                                                    {children}
                                                </ol>
                                            ),
                                            li: ({ children }) => (
                                                <li className="leading-relaxed text-lg">
                                                    {children}
                                                </li>
                                            ),
                                            blockquote: ({ children }) => (
                                                <blockquote className="border-l-4 border-blue-500 pl-8 my-8 bg-gray-50 dark:bg-gray-700 py-6 rounded-r-lg">
                                                    <div className="text-gray-700 dark:text-gray-300 italic text-xl">
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
                                                <hr className="my-12 border-gray-200 dark:border-gray-700" />
                                            ),
                                        }}
                                    >
                                        {page.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </article>
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