import { notFound } from "next/navigation"
import { mockPreviewData } from "@/constants/preview"
import { courseStore, formatCourseForPreview } from "@/lib/course-store"
import { getCourse } from "@/actions/course-db-actions"
import Content from "@/components/preview/content"
import Preferences from "@/components/preview/preferences"
import Preview from "@/components/preview/preview"
import TopNav from "@/components/preview/top-nav"

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  // Always try database first to get the latest data
  const dbCourse = await getCourse(slug)
  let generatedCourse
  
  if (dbCourse) {
    // Convert database course to memory store format
    generatedCourse = {
      id: dbCourse.id,
      title: dbCourse.title,
      description: dbCourse.description,
      content: dbCourse.content,
      originalContent: dbCourse.originalContent,
      tags: dbCourse.tags,
      keyPoints: dbCourse.keyPoints,
      estimatedReadTime: dbCourse.estimatedReadTime,
      createdAt: dbCourse.createdAt,
    }
    
    // Update memory store with latest data (exclude id and createdAt)
    courseStore.set(slug, {
      title: dbCourse.title,
      description: dbCourse.description,
      content: dbCourse.content,
      originalContent: dbCourse.originalContent,
      tags: dbCourse.tags,
      keyPoints: dbCourse.keyPoints,
      estimatedReadTime: dbCourse.estimatedReadTime,
    })
  } else {
    // Fallback to memory store if not in database
    generatedCourse = courseStore.get(slug)
  }
  
  let previewData
  
  if (generatedCourse && dbCourse) {
    // Use fresh database data for title, description, price, and published status
    const priceInCents = dbCourse.price
    const published = dbCourse.published || false
    
    previewData = {
      id: dbCourse.id,
      title: dbCourse.title, // Use fresh DB data
      description: dbCourse.description, // Use fresh DB data
      price: priceInCents / 100, // Convert from cents and use fresh DB data
      slug: slug,
      status: published ? 'published' : 'draft',
      published,
      originalContent: generatedCourse.originalContent,
      generatedContent: generatedCourse.content,
      tags: generatedCourse.tags,
      keyPoints: generatedCourse.keyPoints,
      estimatedReadTime: generatedCourse.estimatedReadTime,
      author: "KnowledgeSmith AI",
      createdAt: generatedCourse.createdAt.toISOString(),
    }
  } else if (generatedCourse) {
    // Fallback for memory-only data
    const basePreviewData = formatCourseForPreview(generatedCourse, undefined)
    previewData = {
      ...basePreviewData,
      published: false,
      status: 'draft'
    }
  } else {
    // Final fallback to mock data
    previewData = mockPreviewData[slug as keyof typeof mockPreviewData]
  }

  if (!previewData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav previewData={previewData}/>

      <div className="container mx-auto px-4 py-6 max-w-8xl">
        <div className="flex flex-col xl:flex-row gap-6">
          
          <div className="flex flex-col gap-6 xl:w-1/3 xl:min-w-[400px]">
            <Preferences previewData={previewData} />
            <Content previewData={previewData} />
          </div>

          <div className="flex-1 xl:w-2/3">
            <Preview previewData={previewData} />
          </div>
        </div>
      </div>
    </div>
  )
} 