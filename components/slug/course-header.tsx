import { Clock, FileIcon, GraduationCap, ListOrdered } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CONTENT_TYPES } from "@/db/schemas/course-schema";
import { getContentTypeLabel } from "@/lib/course-store";

interface CourseHeaderProps {
  title: string;
  description: string;
  author: string;
  readTime: string;
  imageUrl?: string;
  contentType?: string;
}

const CourseHeader = ({
  title,
  description,
  author,
  readTime,
  imageUrl,
  contentType,
}: CourseHeaderProps) => {
  const isListicle = contentType === CONTENT_TYPES.LISTICLE;
  const isCourse = contentType === CONTENT_TYPES.COURSE;
  const contentLabel = contentType
    ? getContentTypeLabel(contentType as any)
    : "Blog Post";

  // Get appropriate icon for content type
  const getContentIcon = () => {
    if (isCourse) return <GraduationCap className="h-4 w-4 text-primary" />;
    if (isListicle) return <ListOrdered className="h-4 w-4 text-primary" />;
    return <FileIcon className="h-4 w-4 text-primary" />;
  };

  return (
    <>
      <div className="mb-6 space-y-4 sm:mb-8 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            {getContentIcon()}
            <Badge variant="secondary">{contentLabel}</Badge>
          </div>
          <h1 className="font-bold text-2xl leading-tight sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-3 text-muted-foreground text-sm sm:flex-row sm:items-center sm:gap-6">
          <span>By {author}</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readTime}</span>
          </div>
        </div>

        <Separator />
      </div>

      {imageUrl && (
        <div className="mb-6 sm:mb-8">
          <Image
            alt={title}
            className="h-48 w-full rounded-lg object-cover sm:h-64"
            height={1000}
            src={imageUrl}
            width={1000}
          />
        </div>
      )}
    </>
  );
};

export default CourseHeader;
