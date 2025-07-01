import { notFound } from "next/navigation"
import { courseStore } from "@/lib/course-store"
import { getCourseWithUser } from "@/actions/course-db-actions"
import { CONTENT_TYPES } from "@/db/schemas/course-schema"
import Preferences from "@/components/preview/preferences"
import ListiclePreview from "@/components/preview/listicle-preview"
import TopNav from "@/components/preview/top-nav"
import Socials from "@/components/preview/socials"
import BlogPreview from "@/components/preview/blog-preview"

export default async function PreviewPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    
    const dbCourse = await getCourseWithUser(slug)
    if (!dbCourse) {
        notFound()
    }

    let generatedCourse = {
        id: dbCourse.id,
        slug: dbCourse.slug,
        title: dbCourse.title,
        description: dbCourse.description,
        content: dbCourse.content,
        originalContent: dbCourse.originalContent,
        contentType: dbCourse.contentType || CONTENT_TYPES.BLOG,
        tags: dbCourse.tags,
        keyPoints: dbCourse.keyPoints,
        estimatedReadTime: dbCourse.estimatedReadTime,
        createdAt: dbCourse.createdAt,
    }
  
    courseStore.set(slug, {
        title: dbCourse.title,
        description: dbCourse.description,
        content: dbCourse.content,
        originalContent: dbCourse.originalContent,
        contentType: dbCourse.contentType || CONTENT_TYPES.BLOG,
        tags: dbCourse.tags,
        keyPoints: dbCourse.keyPoints,
        links: dbCourse.links,
        estimatedReadTime: dbCourse.estimatedReadTime,
    })

    const priceInCents = dbCourse.price
    const published = dbCourse.published || false
    
    const previewData = {
        id: dbCourse.id,
        title: dbCourse.title,
        description: dbCourse.description,
        price: priceInCents / 100,
        contentType: generatedCourse.contentType,
        slug: slug,
        status: published ? 'published' : 'draft',
        published,
        imageUrl: dbCourse.imageUrl || undefined,
        originalContent: generatedCourse.originalContent,
        generatedContent: generatedCourse.content,
        tags: generatedCourse.tags,
        keyPoints: generatedCourse.keyPoints,
        links: dbCourse.links || [],
        estimatedReadTime: generatedCourse.estimatedReadTime,
        author: dbCourse.userName,
        createdAt: generatedCourse.createdAt.toISOString(),
    }

    return (
        <div className="min-h-screen bg-background">
            <TopNav previewData={previewData}/>

            <div className="container mx-auto px-4 py-6 max-w-8xl">
                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex flex-col gap-6 xl:w-1/3 xl:min-w-[400px]">
                        <Preferences previewData={previewData} />
                        <Socials courseId={dbCourse.id} initialLinks={dbCourse.links || []} />
                    </div>

                    <div className="flex-1 xl:w-2/3">
                        {previewData.contentType === CONTENT_TYPES.LISTICLE ? (
                            <ListiclePreview previewData={previewData} />
                        ) : (
                            <BlogPreview previewData={previewData} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 