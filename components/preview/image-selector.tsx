"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Image, Edit } from "lucide-react"
import { ImageSelectionDialog } from "./image-selection-dialog"

interface ImageSelectorProps {
  title: string
  courseId: string
  currentImageUrl?: string
  onImageChange?: (imageUrl: string) => void
}

export function ImageSelector({ title, courseId, currentImageUrl, onImageChange }: ImageSelectorProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Hero Image</Label>
      
      {/* Current Image Preview */}
      {currentImageUrl ? (
        <div className="space-y-3">
          <div className="relative group">
            <img
              src={currentImageUrl}
              alt="Current hero image"
              className="w-full h-32 object-cover rounded-lg border"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDialogOpen(true)}
                className="backdrop-blur-sm"
              >
                <Edit className="h-3 w-3 mr-1" />
                Change Image
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-full h-32 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
            <div className="text-center">
              <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No image selected</p>
            </div>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="w-full"
          >
            <Image className="h-3 w-3 mr-2" />
            Choose Hero Image
          </Button>
        </div>
      )}

      <ImageSelectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={title}
        courseId={courseId}
        currentImageUrl={currentImageUrl}
        onImageChange={onImageChange}
      />
    </div>
  )
} 