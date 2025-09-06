"use client";

import { Clock, ListOrdered } from "lucide-react";
import { toast } from "sonner";
import { updateCourse } from "@/actions/course-db-actions";
import { Badge } from "@/components/ui/badge";
import type { CourseLink } from "@/db/schemas/course-schema";
import { ContentEditor } from "./content-editor";

interface ListiclePreviewProps {
  previewData: {
    id: string;
    title: string;
    generatedContent: string;
    author?: string;
    readTime?: string;
    description?: string;
    imageUrl?: string;
    links?: CourseLink[];
    [key: string]: any;
  };
}

export default function ListiclePreview({ previewData }: ListiclePreviewProps) {
  const { title, generatedContent, author, readTime, description, imageUrl } =
    previewData;

  return (
    <article className="mx-auto w-full max-w-6xl rounded-xl border bg-white">
      <header className="border-gray-100 border-b px-6 py-8 dark:border-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <ListOrdered className="h-5 w-5 text-blue-600" />
          <Badge
            className="border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950"
            variant="outline"
          >
            Listicle
          </Badge>
        </div>

        <div className="space-y-4">
          <h1 className="font-bold text-3xl text-gray-900 leading-tight md:text-4xl dark:text-gray-100">
            {title}
          </h1>
          {description && (
            <p className="text-gray-600 text-lg leading-relaxed dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center gap-6 text-gray-500 text-sm dark:text-gray-400">
          {author && <span className="font-medium">By {author}</span>}
          {readTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readTime}</span>
            </div>
          )}
        </div>
      </header>

      {imageUrl && (
        <div className="px-6 py-6">
          <img
            alt={title}
            className="h-64 w-full rounded-lg object-cover md:h-80"
            src={imageUrl}
          />
        </div>
      )}

      <div className="px-6 pb-8">
        <ContentEditor
          contentType="listicle"
          initialContent={generatedContent}
          onContentChange={async (newContent) => {
            try {
              const result = await updateCourse({
                id: previewData.id,
                content: newContent,
              });

              if (result.success) {
                toast.success("Content saved successfully");
              } else {
                toast.error(result.error || "Failed to save content");
              }
            } catch (error) {
              console.error("Error saving content:", error);
              toast.error("Failed to save content");
            }
          }}
        />
      </div>
    </article>
  );
}
