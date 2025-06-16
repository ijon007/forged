"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { DeleteCourseDialog } from "@/components/dashboard/delete-course-dialog"

interface PageCardProps {
  id: string
  title: string
  description: string
  status: "draft" | "published" | "generating"
  price: number
  views: number
  sales: number
  progress?: number
  imageUrl?: string
  slug?: string
}

export function PageCard({
  id,
  title,
  description,
  status,
  price,
  sales,
  progress,
  imageUrl,
  slug
}: PageCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "published":
        return { 
          badge: "Live", 
          color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
          dot: "bg-green-500"
        }
      case "draft":
        return { 
          badge: "Draft", 
          color: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
          dot: "bg-gray-500"
        }
      case "generating":
        return { 
          badge: "Generating", 
          color: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
          dot: "bg-orange-500"
        }
      default:
        return { 
          badge: "Unknown", 
          color: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
          dot: "bg-gray-500"
        }
    }
  }

  const statusConfig = getStatusConfig()

  const revenue = sales * price

  return (
    <div className="group relative bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg overflow-hidden cursor-default max-h-xl flex flex-col justify-between">
      {/* Header with status and menu */}
      <div className="p-6 pb-4 flex-shrink-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
            <Badge variant="outline" className={`${statusConfig.color} text-xs font-medium`}>
              {statusConfig.badge}
            </Badge>
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

        {/* Title and description */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {description.slice(0, 70)}...
          </p>
        </div>

        {/* Progress bar for generating status */}
        {status === "generating" && progress !== undefined && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
              <span>Generation Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      {/* Image placeholder or actual image */}
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

      {/* Stats and pricing */}
      <div className="px-6 pb-4 flex-shrink-0">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {sales}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Sales</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              ${revenue.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Revenue</div>
          </div>
        </div>
      </div>

      {/* Footer with price and actions */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 mt-auto flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
            ${price}
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/preview/${id}`}>
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