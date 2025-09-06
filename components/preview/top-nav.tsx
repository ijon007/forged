"use client";

import { Check, ExternalLink, Eye, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { publishCourse, unpublishCourse } from "@/actions/course-db-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { Course } from "@/db/schemas/course-schema";
import PreferencesSheet from "./preferences-sheet";
import PublishDialog from "./publish-dialog";

interface TopNavProps {
  previewData: {
    id: string;
    title: string;
    status: string;
    slug: string;
    contentType?: string;
    published?: boolean;
    [key: string]: any;
  };
  dbCourse: Course;
}

const TopNav = ({ previewData, dbCourse }: TopNavProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const isCurrentlyPublished =
        previewData.published || previewData.status === "published";

      if (isCurrentlyPublished) {
        const result = await unpublishCourse(previewData.id);
        if (result.success) {
          toast.success("Course unpublished successfully!");
          router.refresh();
        } else {
          toast.error(
            "Failed to unpublish: " + (result.error || "Unknown error")
          );
        }
      } else {
        const result = await publishCourse(previewData.id);
        if (result.success) {
          toast.success("Course published successfully!");
          window.open(`/${previewData.id}`, "_blank");
        } else {
          toast.error(
            "Failed to publish: " + (result.error || "Unknown error")
          );
        }
      }
    } catch (error) {
      console.error("Failed to publish:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePreview = () => {
    let previewRoute = `/dashboard/preview/${previewData.id}/blog`; // default to blog

    if (previewData.contentType === "listicle") {
      previewRoute = `/dashboard/preview/${previewData.id}/listicle`;
    } else if (previewData.contentType === "course") {
      previewRoute = `/dashboard/preview/${previewData.id}/course`;
    }

    window.open(previewRoute, "_blank");
  };

  const isPublished =
    previewData.published || previewData.status === "published";

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-8xl px-4 py-4">
        <div className="flex flex-col items-center justify-between lg:flex-row">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="block md:hidden" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="max-w-[200px] truncate font-semibold text-lg sm:max-w-[300px]">
                  {previewData.title}
                </h1>
                <Badge
                  className={
                    isPublished ? "bg-green-500 text-white" : "text-xs"
                  }
                  variant={isPublished ? "default" : "outline"}
                >
                  {isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="hidden text-muted-foreground text-sm md:block">
                {isPublished
                  ? "Your course is live and accessible to users"
                  : "Preview and edit your generated page"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <PreferencesSheet
              basePreviewData={previewData}
              dbCourse={dbCourse}
            />

            <Button
              className="rounded-xl py-2 hover:bg-muted"
              onClick={handlePreview}
              size="lg"
              variant="outline"
            >
              <Eye className="h-4 w-4 sm:mr-2" />
              <span className="hidden text-sm md:inline">Preview</span>
            </Button>

            {isPublished && (
              <Link href={`/${previewData.id}`} target="_blank">
                <Button
                  className="rounded-xl py-2 hover:bg-muted"
                  size="lg"
                  variant="outline"
                >
                  <ExternalLink className="h-4 w-4 sm:mr-2" />
                  <span className="hidden text-sm md:inline">View Live</span>
                </Button>
              </Link>
            )}

            <PublishDialog
              courseTitle={previewData.title}
              isLoading={isPublishing}
              isPublished={isPublished}
              onConfirm={handlePublish}
            >
              <Button
                className={`group relative ${
                  isPublished
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-black text-white hover:bg-gray-800"
                } overflow-hidden rounded-xl transition-all hover:scale-105 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
                disabled={isPublishing}
                size="lg"
              >
                <div
                  className={`absolute inset-0 ${
                    isPublished
                      ? "bg-gradient-to-r from-red-700 to-red-600"
                      : "bg-gradient-to-r from-gray-800 to-black"
                  } opacity-0 transition-opacity group-hover:opacity-100`}
                />
                {isPublished ? (
                  <X className="relative h-4 w-4 sm:mr-2" />
                ) : (
                  <Check className="relative h-4 w-4 sm:mr-2" />
                )}
                <span className="relative hidden text-sm text-white md:inline">
                  {isPublished ? "Unpublish" : "Publish"}
                </span>
              </Button>
            </PublishDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
