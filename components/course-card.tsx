import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, Eye, Edit, DollarSign, Share } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface CourseCardProps {
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

export function CourseCard({
  id,
  title,
  description,
  status,
  price,
  views,
  sales,
  progress,
  imageUrl,
  slug
}: CourseCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "published":
        return <Badge variant="default" className="bg-green-500">Live</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "generating":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Generating</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getEditLink = () => {
    if (status === "published" && slug) {
      return `/${slug}`
    }
    return `/dashboard/preview/${id}`
  }

  const getActionText = () => {
    switch (status) {
      case "published":
        return "View Live"
      case "draft":
        return "Continue Editing"
      case "generating":
        return "View Progress"
      default:
        return "View"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="line-clamp-2">{description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Page
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          {status === "generating" && progress !== undefined && (
            <div className="flex-1">
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </CardHeader>
      
      {imageUrl && (
        <div className="px-6 pb-3">
          <div className="aspect-video rounded-md bg-muted bg-cover bg-center" 
               style={{ backgroundImage: `url(${imageUrl})` }} />
        </div>
      )}
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {views} views
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {sales} purchases
            </span>
          </div>
          <span className="font-medium text-foreground">${price}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Link href={getEditLink()} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Link href={getEditLink()} className="flex-1">
            <Button size="sm" className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              {getActionText()}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
} 