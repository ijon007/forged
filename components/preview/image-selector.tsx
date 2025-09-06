"use client";

import { Edit, Image } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageSelectionDialog } from "./image-selection-dialog";

interface ImageSelectorProps {
  title: string;
  courseId: string;
  currentImageUrl?: string;
  onImageChange?: (imageUrl: string) => void;
}

export function ImageSelector({
  title,
  courseId,
  currentImageUrl,
  onImageChange,
}: ImageSelectorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Label className="font-medium text-sm">Hero Image</Label>

      {/* Current Image Preview */}
      {currentImageUrl ? (
        <div className="space-y-3">
          <div className="group relative">
            <img
              alt="Current hero image"
              className="h-32 w-full rounded-lg border object-cover"
              src={currentImageUrl}
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
              <Button
                className="backdrop-blur-sm"
                onClick={() => setDialogOpen(true)}
                size="sm"
                variant="secondary"
              >
                <Edit className="mr-1 h-3 w-3" />
                Change Image
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed bg-muted">
            <div className="text-center">
              <Image className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
              <p className="text-muted-foreground text-sm">No image selected</p>
            </div>
          </div>
          <Button className="w-full" onClick={() => setDialogOpen(true)}>
            <Image className="mr-2 h-3 w-3" />
            Choose Hero Image
          </Button>
        </div>
      )}

      <ImageSelectionDialog
        courseId={courseId}
        currentImageUrl={currentImageUrl}
        onImageChange={onImageChange}
        onOpenChange={setDialogOpen}
        open={dialogOpen}
        title={title}
      />
    </div>
  );
}
