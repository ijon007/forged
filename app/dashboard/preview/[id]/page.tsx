import { notFound } from "next/navigation"
import { mockPreviewData } from "@/constants/preview"
import { courseStore, formatCourseForPreview } from "@/lib/course-store"
import Content from "@/components/preview/content"
import Preferences from "@/components/preview/preferences"
import Preview from "@/components/preview/preview"
import TopNav from "@/components/preview/top-nav"

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  // Try to get generated course first, then fall back to mock data
  const generatedCourse = courseStore.get(id)
  let previewData
  
  if (generatedCourse) {
    previewData = formatCourseForPreview(generatedCourse)
  } else {
    previewData = mockPreviewData[id as keyof typeof mockPreviewData]
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