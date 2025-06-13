import { notFound } from "next/navigation"
import { mockPreviewData } from "@/constants/preview"
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
  const previewData = mockPreviewData[id as keyof typeof mockPreviewData]

  if (!previewData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background max-w-8xl mx-auto">
      <TopNav previewData={previewData}/>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-row w-full gap-6">
          <div className="flex flex-col gap-6 w-full">
            <Preferences previewData={previewData} />
            <Content previewData={previewData} />
          </div>

          <div className="flex flex-col gap-6 w-full">
            <Preview previewData={previewData} />
          </div>
        </div>
      </div>
    </div>
  )
} 