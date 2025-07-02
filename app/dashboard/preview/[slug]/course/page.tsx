import { notFound } from "next/navigation"
import { getCourseWithUser } from "@/actions/course-db-actions"
import { courseStore, formatCourseForPreview } from "@/lib/course-store"
import { CONTENT_TYPES } from "@/db/schemas/course-schema"
import CoursePage from "@/components/slug/course-page-client"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Preview | Dashboard",
    description: "Preview Mode",
}

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
                contentType: dbCourse.contentType || CONTENT_TYPES.BLOG,
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

    const contentType = dbCourse.contentType || CONTENT_TYPES.BLOG
    const isCourse = contentType === CONTENT_TYPES.COURSE
    
    const formattedCourse = formatCourseForPreview(generatedCourse, dbCourse.price)
    
    let displayTime = `${dbCourse.estimatedReadTime} min read`
    if (isCourse) {
        try {
            const courseContent = typeof dbCourse.content === 'string' 
                ? JSON.parse(dbCourse.content) 
                : dbCourse.content
            if (Array.isArray(courseContent)) {
                const lessonCount = courseContent.length
                displayTime = `${lessonCount} lesson${lessonCount !== 1 ? 's' : ''}`
            }
        } catch (error) {
            console.error('Failed to parse course content for lesson count:', error)
            displayTime = `Course • ${dbCourse.estimatedReadTime} min`
        }
    }
    
    const page = {
        id: dbCourse.id,
        title: dbCourse.title,
        description: dbCourse.description,
        price: dbCourse.price / 100,
        contentType,
        isPurchased: true,
        author: dbCourse.userName,
        readTime: displayTime,
        imageUrl: dbCourse.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
        content: formattedCourse.generatedContent,
        tags: dbCourse.tags,
        keyPoints: dbCourse.keyPoints,
        links: dbCourse.links || []
    }

    return (
        <div>
            <div className="bg-green-50 border-b border-green-200 px-4 py-2">
                <div className="container mx-auto w-11/12 lg:w-10/12">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="font-medium">Preview Mode</span>
                    </div>
                </div>
            </div>
            
            <CoursePage
                page={page} 
                accessCode={undefined} 
                slug={slug} 
                createdAt={dbCourse.createdAt} 
                updatedAt={dbCourse.updatedAt}
                isPreview
            />
        </div>
    )
} 