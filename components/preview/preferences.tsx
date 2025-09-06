"use client";

import { AlertCircle, CheckCircle2, Copy, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateCourse } from "@/actions/course-db-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageSelector } from "./image-selector";

interface PreferencesProps {
  previewData: {
    id: string;
    title: string;
    price: number;
    description: string;
    slug: string;
    published?: boolean;
    status?: string;
    [key: string]: any; // Allow additional properties
  };
}

const Preferences = ({ previewData }: PreferencesProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: previewData.title,
    price: previewData.price,
    description: previewData.description,
    slug: previewData.slug,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Track if there are unsaved changes
  useEffect(() => {
    const hasUnsavedChanges =
      JSON.stringify(formData) !==
      JSON.stringify({
        title: previewData.title,
        price: previewData.price,
        description: previewData.description,
        slug: previewData.slug,
      });
    setHasChanges(hasUnsavedChanges);
  }, [formData, previewData]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateCourse({
        id: previewData.id,
        title: formData.title,
        description: formData.description,
        price: formData.price,
      });

      if (result.success) {
        setLastSaved(new Date());
        setHasChanges(false);
        toast.success("Changes saved successfully!");

        // Refresh the page data without full reload
        router.refresh();
      } else {
        toast.error(
          "Failed to save changes: " + (result.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();

    setFormData((prev) => ({ ...prev, slug }));
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(`www.tryforged.me/${formData.slug}`);
    toast.success("URL copied to clipboard!");
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Page Settings</CardTitle>
            <CardDescription>
              Customize your page details before publishing
            </CardDescription>
          </div>
          {lastSaved && !hasChanges && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              Saved {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="title">Title</Label>
            <Input
              className="text-sm"
              id="title"
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter page title..."
              value={formData.title}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              className="text-sm"
              id="price"
              min="0"
              onChange={(e) =>
                handleInputChange(
                  "price",
                  Number.parseFloat(e.target.value) || 0
                )
              }
              step="0.01"
              type="number"
              value={formData.price}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            className="resize-none text-sm"
            id="description"
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Write a compelling description..."
            rows={3}
            value={formData.description}
          />
          <div className="text-right text-muted-foreground text-xs">
            {formData.description.length}/160 characters
          </div>
        </div>

        {/* Image Selector */}
        <ImageSelector
          courseId={previewData.id}
          currentImageUrl={previewData.imageUrl}
          onImageChange={() => router.refresh()}
          title={formData.title}
        />

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-muted-foreground text-sm">
              tryforged.me/
            </span>
            <div className="relative flex-1">
              <Input
                className="pr-8 text-sm"
                disabled
                id="slug"
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="url-slug"
                value={formData.slug}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button
              className="h-6 px-2 text-xs"
              onClick={copyUrl}
              size="sm"
              variant="ghost"
            >
              <Copy className="mr-1 h-3 w-3" />
              Copy URL
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              {hasChanges && (
                <>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span>You have unsaved changes</span>
                </>
              )}
            </div>
            <Button
              className="min-w-[100px]"
              disabled={isSaving || !hasChanges}
              onClick={handleSave}
              size="sm"
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Preferences;
