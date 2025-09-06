"use client";

import { PlusCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CONTENT_TYPES, type ContentType } from "@/db/schemas/course-schema";

interface GeneratingStepProps {
  generationProgress: number;
  contentType: ContentType;
}

export default function GeneratingStep({
  generationProgress,
  contentType,
}: GeneratingStepProps) {
  const getGenerationMessage = () => {
    const contentLabel =
      contentType === CONTENT_TYPES.LISTICLE
        ? "listicle"
        : contentType === CONTENT_TYPES.COURSE
          ? "course with lessons and quizzes"
          : "blog post";

    if (contentType === CONTENT_TYPES.COURSE) {
      if (generationProgress < 25) return "Extracting content from PDF...";
      if (generationProgress < 50)
        return "Analyzing structure and key concepts...";
      if (generationProgress < 75) return "Creating structured lessons...";
      if (generationProgress < 90)
        return "Generating quizzes for each lesson...";
      return "Finalizing your course...";
    }

    if (generationProgress < 30) return "Extracting content from PDF...";
    if (generationProgress < 60) return "Analyzing structure and key points...";
    if (generationProgress < 90) return `Generating ${contentLabel} content...`;
    return "Finalizing your page...";
  };

  const getTitle = () => {
    return contentType === CONTENT_TYPES.COURSE
      ? "Generating your course..."
      : "Generating your page...";
  };

  return (
    <div className="space-y-6 py-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <PlusCircle className="h-8 w-8 animate-pulse text-primary" />
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{getTitle()}</h3>
        <p className="text-muted-foreground text-sm">
          {getGenerationMessage()}
        </p>
      </div>
      <div className="space-y-2">
        <Progress className="w-full" value={generationProgress} />
        <p className="text-muted-foreground text-xs">
          {generationProgress.toFixed(0)}% complete
        </p>
      </div>
    </div>
  );
}
