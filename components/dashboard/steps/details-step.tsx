"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface PageData {
  title: string
  description: string
  price: string
}

interface DetailsStepProps {
  pageData: PageData
  onPageDataChange: (data: PageData) => void
  onBack: () => void
  onSubmit: () => void
}

export default function DetailsStep({ 
  pageData, 
  onPageDataChange, 
  onBack, 
  onSubmit 
}: DetailsStepProps) {
  const handleInputChange = (field: keyof PageData, value: string) => {
    onPageDataChange({ ...pageData, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Page Title</Label>
        <Input
          id="title"
          placeholder="Enter your page title"
          value={pageData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Brief description of your content"
          value={pageData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          type="number"
          placeholder="19.99"
          value={pageData.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onSubmit} className="flex-1">
          Generate Content
        </Button>
      </div>
    </div>
  )
} 