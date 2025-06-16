import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Share, DollarSign } from "lucide-react"

interface CourseSidebarProps {
  author: string
  readTime: string
  price: number
  keyPoints?: string[]
  tags?: string[]
  isPurchased: boolean
}

const CourseSidebar = ({ author, readTime, price, keyPoints, tags, isPurchased }: CourseSidebarProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About this article</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Author</span>
            <span className="font-medium">{author}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Read time</span>
            <span className="font-medium">{readTime}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price</span>
            <span className="font-medium">${price}</span>
          </div>
        </CardContent>
      </Card>

      {keyPoints && keyPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Takeaways</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {tags && tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <Button variant="outline" className="w-full mb-3">
            <Share className="mr-2 h-4 w-4" />
            Share Article
          </Button>
          {!isPurchased && (
            <Button className="w-full">
              <DollarSign className="mr-2 h-4 w-4" />
              Buy Now - ${price}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CourseSidebar 