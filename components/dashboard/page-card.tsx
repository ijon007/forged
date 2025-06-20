"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, Eye, Edit, Trash2, Globe, ExternalLink, Copy, Loader2, ImageIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { DeleteCourseDialog } from "@/components/dashboard/delete-course-dialog"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface PageCardProps {
  id: string
  title: string
  description: string
  status: "published" | "draft"
  price: number
  views: number
  sales: number
  slug: string
  imageUrl?: string
  polarProductId?: string
}

export function PageCard({ 
  id, 
  title, 
  description, 
  status, 
  price, 
  views, 
  sales, 
  slug, 
  imageUrl,
  polarProductId 
}: PageCardProps) {
  const router = useRouter()
  const [isPublishing, setIsPublishing] = useState(false)

  const handleEdit = () => {
    router.push(`/dashboard/preview/${slug}`)
  }

  const handlePublish = async () => {
    try {
      setIsPublishing(true)
      // TODO: Implement publish functionality
      toast.success("Page published successfully!")
      router.refresh()
    } catch (error) {
      console.error("Error publishing page:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsPublishing(false)
    }
  }

  const handleView = () => {
    window.open(`/${slug}`, '_blank')
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <div className="aspect-video relative overflow-hidden rounded-t-lg bg-gray-100">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant={status === "published" ? "default" : "secondary"}>
            {status === "published" ? "Published" : "Draft"}
          </Badge>
        </div>
        {/* Add Polar integration badge */}
        {polarProductId && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              🔗 Polar Ready
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center">
              <div className="font-medium">${price}</div>
              <div className="text-muted-foreground">Price</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{views.toLocaleString()}</div>
              <div className="text-muted-foreground">Views</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{sales}</div>
              <div className="text-muted-foreground">Sales</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit} className="flex-1">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            {status === "draft" && (
              <Button 
                size="sm" 
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1"
              >
                {isPublishing ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Globe className="h-4 w-4 mr-1" />
                )}
                {isPublishing ? "Publishing..." : "Publish"}
              </Button>
            )}

            {status === "published" && (
              <Button variant="outline" size="sm" onClick={handleView} className="flex-1">
                <ExternalLink className="h-4 w-4 mr-1" />
                View
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${slug}`)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteCourseDialog courseId={id} courseTitle={title}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Page
                  </DropdownMenuItem>
                </DeleteCourseDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 