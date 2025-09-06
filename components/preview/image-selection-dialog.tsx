"use client";

import { Check, Image as ImageIcon, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateCourse } from "@/actions/course-db-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { searchUnsplashImages, type UnsplashImage } from "@/lib/unsplash-api";

interface ImageSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  courseId: string;
  currentImageUrl?: string;
  onImageChange?: (imageUrl: string) => void;
}

// Now using the real Unsplash API from lib/unsplash-api.ts

export function ImageSelectionDialog({
  open,
  onOpenChange,
  title,
  courseId,
  currentImageUrl,
  onImageChange,
}: ImageSelectionDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>(
    currentImageUrl || ""
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Initial search based on title
  useEffect(() => {
    if (open && title) {
      const initialQuery = title.toLowerCase().split(" ").slice(0, 3).join(" ");
      setSearchQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [open, title]);

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const results = await searchUnsplashImages(query);
      setImages(results);
    } catch (error) {
      toast.error("Failed to search images");
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = async (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsUpdating(true);

    try {
      const result = await updateCourse({
        id: courseId,
        imageUrl,
      });

      if (result.success) {
        onImageChange?.(imageUrl);
        toast.success("Image updated successfully");
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to update image");
      }
    } catch (error) {
      toast.error("Failed to update image");
      console.error("Error updating image:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Choose Hero Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for images (e.g., 'technology', 'business', 'education')"
                value={searchQuery}
              />
            </div>
            <Button
              disabled={isLoading || !searchQuery.trim()}
              onClick={() => handleSearch()}
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
            <div className="rounded-lg bg-muted p-3">
              <Label className="font-medium text-sm">Current Selection:</Label>
              <div className="mt-2">
                <img
                  alt="Selected image"
                  className="h-32 w-full max-w-md rounded border object-cover"
                  src={selectedImage}
                />
              </div>
            </div>
          )}

          {/* Images Grid */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Searching images...</span>
              </div>
            ) : images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {images.map((image) => (
                  <Card
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedImage === image.url
                        ? "border-primary bg-muted/30"
                        : ""
                    }`}
                    key={image.id}
                    onClick={() => handleImageSelect(image.url)}
                  >
                    <CardContent className="relative p-0">
                      <img
                        alt={
                          image.alt_description ||
                          image.description ||
                          "Image option"
                        }
                        className="h-32 w-full rounded object-cover"
                        src={image.thumbnailUrl}
                      />
                      {selectedImage === image.url && (
                        <div className="absolute top-2 right-2">
                          <div className="rounded-full bg-primary p-1 text-primary-foreground">
                            <Check className="h-3 w-3" />
                          </div>
                        </div>
                      )}
                      {isUpdating && selectedImage === image.url && (
                        <div className="absolute inset-0 flex items-center justify-center rounded bg-black/50">
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                        </div>
                      )}
                      <div className="p-2">
                        <p className="truncate text-muted-foreground text-xs">
                          {image.description ||
                            image.alt_description ||
                            "Professional image"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchQuery && !isLoading ? (
              <div className="py-12 text-center text-muted-foreground">
                <ImageIcon className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p>No images found for "{searchQuery}"</p>
                <p className="mt-1 text-sm">
                  Try searching for different keywords
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
