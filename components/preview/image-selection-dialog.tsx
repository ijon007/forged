"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Loader2, Image as ImageIcon, Check } from "lucide-react"
import { updateCourse } from "@/actions/course-db-actions"
import { toast } from "sonner"
import { searchUnsplashImages, type UnsplashImage } from "@/lib/unsplash-api"

interface ImageSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  courseId: string
  currentImageUrl?: string
  onImageChange?: (imageUrl: string) => void
}

// Now using the real Unsplash API from lib/unsplash-api.ts

export function ImageSelectionDialog({
  open,
  onOpenChange,
  title,
  courseId,
  currentImageUrl,
  onImageChange
}: ImageSelectionDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [images, setImages] = useState<UnsplashImage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>(currentImageUrl || "")
  const [isUpdating, setIsUpdating] = useState(false)

  // Initial search based on title
  useEffect(() => {
    if (open && title) {
      const initialQuery = title.toLowerCase().split(' ').slice(0, 3).join(' ')
      setSearchQuery(initialQuery)
      handleSearch(initialQuery)
    }
  }, [open, title])

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const results = await searchUnsplashImages(query)
      setImages(results)
    } catch (error) {
      toast.error("Failed to search images")
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageSelect = async (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setIsUpdating(true)

    try {
      const result = await updateCourse({
        id: courseId,
        imageUrl: imageUrl
      })

      if (result.success) {
        onImageChange?.(imageUrl)
        toast.success("Image updated successfully")
        onOpenChange(false)
      } else {
        toast.error(result.error || "Failed to update image")
      }
    } catch (error) {
      toast.error("Failed to update image")
      console.error("Error updating image:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Choose Hero Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search for images (e.g., 'technology', 'business', 'education')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button 
              onClick={() => handleSearch()}
              disabled={isLoading || !searchQuery.trim()}
              size="default"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </Button>
          </div>

          {/* Current Selection */}
          {selectedImage && (
            <div className="p-3 bg-muted rounded-lg">
              <Label className="text-sm font-medium">Current Selection:</Label>
              <div className="mt-2">
                <img
                  src={selectedImage}
                  alt="Selected image"
                  className="w-full max-w-md h-32 object-cover rounded border"
                />
              </div>
            </div>
          )}

          {/* Images Grid */}
          <div className="overflow-y-auto max-h-96">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Searching images...</span>
              </div>
            ) : images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((image) => (
                  <Card 
                    key={image.id}
                    className={`cursor-pointer transition-all hover:ring-2 hover:ring-blue-500 ${
                      selectedImage === image.url ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleImageSelect(image.url)}
                  >
                    <CardContent className="p-0 relative">
                      <img
                        src={image.thumbnailUrl}
                        alt={image.alt_description || image.description || "Image option"}
                        className="w-full h-32 object-cover rounded"
                      />
                      {selectedImage === image.url && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-blue-500 text-white rounded-full p-1">
                            <Check className="h-3 w-3" />
                          </div>
                        </div>
                      )}
                      {isUpdating && selectedImage === image.url && (
                        <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                          <Loader2 className="h-4 w-4 text-white animate-spin" />
                        </div>
                      )}
                      <div className="p-2">
                        <p className="text-xs text-muted-foreground truncate">
                          {image.description || image.alt_description || "Professional image"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchQuery && !isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No images found for "{searchQuery}"</p>
                <p className="text-sm mt-1">Try searching for different keywords</p>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 