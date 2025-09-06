"use client";

import { Clock, FileText } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { updateCourse } from "@/actions/course-db-actions";
import { Badge } from "@/components/ui/badge";
import type { CourseLink } from "@/db/schemas/course-schema";
import { ContentEditor } from "./content-editor";
import Socials from "./socials";

interface BlogPreviewProps {
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

const BlogPreview = ({ previewData }: BlogPreviewProps) => {
  const {
    title,
    generatedContent,
    author,
    readTime,
    description,
    imageUrl,
    links,
  } = previewData;
  const displayAuthor = author || "John Doe";
  const displayReadTime = readTime || "5 min read";
  const displayDescription = description || "AI-generated blog post content";

  return (
    <article className="mx-auto w-full max-w-6xl rounded-xl border bg-white">
      <header className="border-gray-100 border-b px-6 py-8 dark:border-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-600" />
          <Badge
            className="border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-950"
            variant="outline"
          >
            Blog Post
          </Badge>
        </div>

        <div className="space-y-4">
          <h1 className="font-bold text-3xl text-gray-900 leading-tight md:text-4xl dark:text-gray-100">
            {title}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed dark:text-gray-400">
            {displayDescription}
          </p>
        </div>

        <div className="mt-6 flex items-center gap-6 text-gray-500 text-sm dark:text-gray-400">
          <span className="font-medium">By {displayAuthor}</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{displayReadTime}</span>
          </div>
        </div>
      </header>

      {imageUrl ? (
        <div className="px-6 py-6">
          <Image
            alt={title}
            className="h-64 w-full rounded-lg object-cover md:h-80"
            height={1000}
            src={imageUrl}
            width={1000}
          />
        </div>
      ) : (
        <div className="px-6 py-6">
          <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100 text-gray-500 md:h-80 dark:bg-gray-800 dark:text-gray-400">
            Hero Image Placeholder
          </div>
        </div>
      )}

      <div className="px-6 pb-8">
        <ContentEditor
          contentType="blog"
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

        {links && links.length > 0 && (
          <div className="mt-8">
            <Socials initialLinks={links} readOnly={true} />
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogPreview;
