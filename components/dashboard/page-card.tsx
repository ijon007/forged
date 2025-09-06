"use client";

import {
  BookOpen,
  Edit,
  Eye,
  FileIcon,
  ListOrdered,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { DeleteCourseDialog } from "@/components/dashboard/delete-course-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CONTENT_TYPES, type ContentType } from "@/db/schemas/course-schema";
import { getContentTypeLabel } from "@/lib/course-store";

interface PageCardProps {
  id: string;
  title: string;
  description: string;
  status: "draft" | "published";
  price: number;
  imageUrl?: string;
  slug?: string;
  contentType?: ContentType;
}

export function PageCard({
  id,
  title,
  description,
  status,
  price,
  imageUrl,
  slug,
  contentType = CONTENT_TYPES.BLOG,
}: PageCardProps) {
  const statusConfig = {
    draft: {
      badge: "Draft",
      color:
        "text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950 dark:border-yellow-800",
      dot: "bg-yellow-500",
    },
    published: {
      badge: "Live",
      color:
        "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800",
      dot: "bg-green-500",
    },
  };

  const getContentTypeBadge = () => {
    const isListicle = contentType === CONTENT_TYPES.LISTICLE;
    return (
      <Badge className="flex items-center gap-1 text-xs" variant="outline">
        {contentType === CONTENT_TYPES.COURSE ? (
          <BookOpen className="h-5 w-5 text-purple-500" />
        ) : isListicle ? (
          <ListOrdered className="h-5 w-5 text-blue-500" />
        ) : (
          <FileIcon className="h-5 w-5 text-green-500" />
        )}
        {getContentTypeLabel(contentType)}
      </Badge>
    );
  };

  return (
    <div className="group relative flex max-h-xl cursor-default flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg dark:border-gray-800 dark:bg-gray-950">
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {getContentTypeBadge()}
            <div
              className={`h-2 w-2 rounded-full ${statusConfig[status].dot}`}
            />
            <Badge
              className={`${statusConfig[status].color} font-medium text-xs`}
              variant="outline"
            >
              {statusConfig[status].badge}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                size="sm"
                variant="ghost"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DeleteCourseDialog courseId={id} courseTitle={title}>
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" color="red" />
                  Delete
                </DropdownMenuItem>
              </DeleteCourseDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <h3 className="line-clamp-1 font-semibold text-gray-900 text-lg dark:text-gray-100">
            {title}
          </h3>
          <p className="line-clamp-2 text-gray-600 text-sm leading-relaxed dark:text-gray-400">
            {description.slice(0, 70)}...
          </p>
        </div>
      </div>

      <div className="flex-shrink-0 px-6 pb-4">
        <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          {imageUrl ? (
            <img
              alt={title}
              className="h-full w-full object-cover"
              src={imageUrl}
            />
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-300 dark:bg-gray-700">
                <Eye className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-gray-500 text-xs dark:text-gray-400">
                Preview will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex-shrink-0 border-gray-100 border-t bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="font-bold text-gray-900 text-xl dark:text-gray-100">
            ${price}
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/preview/${slug}`}>
              <Button className="h-8 rounded-lg" size="sm" variant="outline">
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>
            </Link>
            {status === "published" && (
              <Link href={`/${slug}`}>
                <Button
                  className="h-8 rounded-lg bg-black text-white hover:bg-neutral-800"
                  size="sm"
                >
                  <Eye className="mr-1 h-4 w-4" />
                  View Live
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
