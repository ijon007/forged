import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, ListOrdered, FileIcon, GraduationCap } from "lucide-react"
import { CONTENT_TYPES } from "@/db/schemas/course-schema"
import { getContentTypeLabel } from "@/lib/course-store"
import Image from "next/image"

interface CourseHeaderProps {
  title: string
  description: string
  author: string
  readTime: string
  imageUrl?: string
  contentType?: string
}

const CourseHeader = ({ title, description, author, readTime, imageUrl, contentType }: CourseHeaderProps) => {
  const isListicle = contentType === CONTENT_TYPES.LISTICLE
  const isCourse = contentType === CONTENT_TYPES.COURSE
  const contentLabel = contentType ? getContentTypeLabel(contentType as any) : 'Blog Post'
  
  // Get appropriate icon for content type
  const getContentIcon = () => {
    if (isCourse) return <GraduationCap className="h-4 w-4 text-primary" />
    if (isListicle) return <ListOrdered className="h-4 w-4 text-primary" />
    return <FileIcon className="h-4 w-4 text-primary" />
  }
  
  return (
    <>
      <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            {getContentIcon()}
            <Badge variant="secondary">{contentLabel}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">{title}</h1>
          <p className="text-lg sm:text-xl text-muted-foreground">{description}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-muted-foreground">
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
            src={imageUrl} 
            alt={title}
            className="w-full h-48 sm:h-64 object-cover rounded-lg"
            width={1000}
            height={1000}
          />
        </div>
      )}
    </>
  )
}

export default CourseHeader 