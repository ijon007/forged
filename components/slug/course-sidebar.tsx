"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Share, DollarSign, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface CourseSidebarProps {
  author: string
  readTime: string
  price: number
  keyPoints?: string[]
  tags?: string[]
  isPurchased: boolean
  courseId: string
}

const CourseSidebar = ({ author, readTime, price, keyPoints, tags, isPurchased, courseId }: CourseSidebarProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      })
      
      const data = await response.json()
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        toast.error(data.error || "Failed to create checkout")
      }
      
    } catch (error) {
      console.error('Purchase error:', error)
      toast.error("Failed to initiate purchase")
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this course by ${author}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Course link copied to clipboard!")
    }
  }

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
          <Button variant="outline" className="w-full mb-3" onClick={handleShare}>
            <Share className="mr-2 h-4 w-4" />
            Share Article
          </Button>
          {!isPurchased && (
            <Button 
              className="w-full" 
              onClick={handlePurchase}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <DollarSign className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Processing..." : `Buy Now - $${price}`}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CourseSidebar 