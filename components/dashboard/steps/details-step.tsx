"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PageData {
  title: string;
  description: string;
  price: string;
}

interface DetailsStepProps {
  pageData: PageData;
  onPageDataChange: (data: PageData) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function DetailsStep({
  pageData,
  onPageDataChange,
  onBack,
  onSubmit,
}: DetailsStepProps) {
  const handleInputChange = (field: keyof PageData, value: string) => {
    onPageDataChange({ ...pageData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Page Title</Label>
        <Input
          id="title"
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Enter your page title"
          value={pageData.title}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Brief description of your content"
          value={pageData.description}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          onChange={(e) => handleInputChange("price", e.target.value)}
          placeholder="19.99"
          type="number"
          value={pageData.price}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button className="flex-1" onClick={onBack} variant="outline">
          Back
        </Button>
        <Button className="flex-1" onClick={onSubmit}>
          Generate Content
        </Button>
      </div>
    </div>
  );
}
