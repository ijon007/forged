"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit, Trash2, ListOrdered, FileIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteCourseDialog } from "@/components/dashboard/delete-course-dialog"
import { CONTENT_TYPES, type ContentType } from "@/db/schemas/course-schema"
import { getContentTypeLabel } from "@/lib/course-store"

interface PageCardProps {
    id: string
    title: string
    description: string
    status: "draft" | "published"
    price: number
    imageUrl?: string
    slug?: string
    contentType?: ContentType
}

export function PageCard({
    id,
    title,
    description,
    status,
    price,
    imageUrl,
    slug,
    contentType = CONTENT_TYPES.BLOG
}: PageCardProps) {
    const statusConfig = {
        draft: {
            badge: "Draft",
            color: "text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950 dark:border-yellow-800",
            dot: "bg-yellow-500"
        },
        published: {
            badge: "Live",
            color: "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800",
            dot: "bg-green-500"
        }
    }

    const getEditLink = () => {
        if (status === "published" && slug) {
            return `/${slug}`
        }
        return `/dashboard/preview/${id}`
    }

    const getContentTypeBadge = () => {
        const isListicle = contentType === CONTENT_TYPES.LISTICLE
        return (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
                {isListicle ? (
                    <ListOrdered className="h-3 w-3" />
                ) : (
                    <FileIcon className="h-3 w-3" />
                )}
                {getContentTypeLabel(contentType)}
            </Badge>
        )
    }

    return (
        <div className="group relative bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg overflow-hidden cursor-default max-h-xl flex flex-col justify-between">
            <div className="p-6 pb-4 flex-shrink-0">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className={`w-2 h-2 rounded-full ${statusConfig[status].dot}`} />
                        <Badge variant="outline" className={`${statusConfig[status].color} text-xs font-medium`}>
                            {statusConfig[status].badge}
                        </Badge>
                        {getContentTypeBadge()}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DeleteCourseDialog courseId={id} courseTitle={title}>
                                <DropdownMenuItem 
                                    className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" color="red"/>
                                    Delete
                                </DropdownMenuItem>
                            </DeleteCourseDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {description.slice(0, 70)}...
                    </p>
                </div>
            </div>

            <div className="px-6 pb-4 flex-shrink-0">
                <div className="aspect-[16/9] rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                                <Eye className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Preview will appear here</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 mt-auto flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        ${price}
                    </div>
                    <div className="flex gap-2">
                        <Link href={getEditLink()}>
                            <Button variant="outline" size="sm" className="h-8 rounded-lg">
                                <Edit className="w-4 h-4 mr-1" />
                                Preview
                            </Button>
                        </Link>
                        {status === "published" && (
                            <Link href={`/${slug}`}>
                                <Button size="sm" className="h-8 bg-black text-white hover:bg-neutral-800 rounded-lg">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View Live
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 