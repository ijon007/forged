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
  
  // Try to get course from memory store first, then database, then fall back to mock data
  let generatedCourse = courseStore.get(slug)
  
  // If not in memory, try database
  if (!generatedCourse) {
    const dbCourse = await getCourse(slug)
    if (dbCourse) {
      // Convert database course to memory store format and cache it
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
      
      // Cache in memory for faster future access
      courseStore.set(slug, generatedCourse)
    }
  }
  
  let previewData
  
  if (generatedCourse) {
    // Get price from database if available
    const dbCourse = await getCourse(slug)
    const priceInCents = dbCourse?.price
    previewData = formatCourseForPreview(generatedCourse, priceInCents)
  } else {
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