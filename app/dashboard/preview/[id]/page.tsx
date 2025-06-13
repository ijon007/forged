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
    <div className="min-h-screen bg-background">
      <TopNav previewData={previewData}/>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          
          <Content previewData={previewData} />

          <div className="flex flex-col gap-6">
            <Preferences previewData={previewData} />
            <Preview previewData={previewData} />
          </div>
        </div>
      </div>
    </div>
  )
} 