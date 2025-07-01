"use client"

import { Progress } from "@/components/ui/progress"
import { PlusCircle } from "lucide-react"
import { ContentType, CONTENT_TYPES } from "@/db/schemas/course-schema"

interface GeneratingStepProps {
  generationProgress: number
  contentType: ContentType
}

export default function GeneratingStep({ generationProgress, contentType }: GeneratingStepProps) {
  const getGenerationMessage = () => {
    const contentLabel = contentType === CONTENT_TYPES.LISTICLE ? "listicle" : "blog post"
    if (generationProgress < 30) return "Extracting content from PDF..."
    if (generationProgress < 60) return "Analyzing structure and key points..."
    if (generationProgress < 90) return `Generating ${contentLabel} content...`
    return "Finalizing your page..."
  }

  return (
    <div className="space-y-6 text-center py-8">
      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <PlusCircle className="w-8 h-8 text-primary animate-pulse" />
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Generating your page...</h3>
        <p className="text-sm text-muted-foreground">
          {getGenerationMessage()}
        </p>
      </div>
      <div className="space-y-2">
        <Progress value={generationProgress} className="w-full" />
        <p className="text-xs text-muted-foreground">{generationProgress.toFixed(2)}% complete</p>
      </div>
    </div>
  )
} 