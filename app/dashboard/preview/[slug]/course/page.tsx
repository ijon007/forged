import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, GraduationCap } from "lucide-react"
import { getCourseWithUser } from "@/actions/course-db-actions"
import { courseStore, formatCourseForPreview } from "@/lib/course-store"
import { SidebarTrigger } from '@/components/ui/sidebar'
import CourseSidebar from "@/components/slug/course-sidebar"
import { CONTENT_TYPES } from "@/db/schemas/course-schema"
import Image from "next/image"
import CoursePreview from "@/components/preview/course-preview"

export default async function CoursePreviewPage({
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
        readTime: `${formattedCourse.estimatedReadTime} min course`,
        imageUrl: dbCourse.imageUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
        content: formattedCourse.generatedContent,
        links: dbCourse.links || []
    }

    // Parse lessons from content if it's a string
    let lessons = []
    if (typeof page.content === 'string') {
        try {
            lessons = JSON.parse(page.content)
        } catch (error) {
            console.error('Failed to parse course content:', error)
            lessons = []
        }
    } else if (Array.isArray(page.content)) {
        lessons = page.content
    }

    const previewData = {
        title: page.title,
        description: page.description,
        author: page.author,
        estimatedReadTime: formattedCourse.estimatedReadTime,
        generatedContent: lessons,
        imageUrl: page.imageUrl,
        links: page.links
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                
                {/* Preview Mode Banner */}
                <div className="flex flex-row items-center justify-between mb-8">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg w-full max-w-md">
                        <div className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-800">Preview Mode</span>
                        </div>
                    </div>
                    <SidebarTrigger className="block md:hidden" />
                </div>
                
                {/* Course Header */}
                <article className="overflow-hidden mb-8">
                    <header className="px-8 py-10 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-6">
                            <GraduationCap className="h-5 w-5 text-purple-600" />
                            <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                                Course
                            </Badge>
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
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" />
                                <span>{lessons.length} lessons</span>
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
                </article>

                {/* Content and Sidebar Layout */}
                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <CoursePreview previewData={previewData} />
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