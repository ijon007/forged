import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock } from "lucide-react"

interface CourseHeaderProps {
  title: string
  description: string
  author: string
  readTime: string
  imageUrl?: string
}

const CourseHeader = ({ title, description, author, readTime, imageUrl }: CourseHeaderProps) => {
  return (
    <>
      <div className="space-y-6 mb-8">
        <div className="space-y-4">
          <Badge variant="secondary">Blog Post</Badge>
          <h1 className="text-4xl font-bold leading-tight">{title}</h1>
          <p className="text-xl text-muted-foreground">{description}</p>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span>By {author}</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readTime}</span>
          </div>
        </div>
        
        <Separator />
      </div>

      {imageUrl && (
        <div className="mb-8">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}
    </>
  )
}

export default CourseHeader 