"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileIcon, ListOrdered, GraduationCap } from "lucide-react"
import { ContentType, CONTENT_TYPES } from "@/db/schemas/course-schema"
import { getContentTypeLabel, getContentTypeDescription } from "@/lib/course-store"

interface ContentTypeStepProps {
  contentType: ContentType
  onContentTypeChange: (type: ContentType) => void
  onBack: () => void
  onContinue: () => void
}

export default function ContentTypeStep({ 
  contentType, 
  onContentTypeChange, 
  onBack, 
  onContinue 
}: ContentTypeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Choose Content Type</h3>
        <p className="text-sm text-muted-foreground">
          Select the type of content you'd like to generate
        </p>
      </div>
      
      <div className="grid gap-4">
        <Card 
          className={`cursor-pointer transition-all border-2 ${
            contentType === CONTENT_TYPES.BLOG 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => onContentTypeChange(CONTENT_TYPES.BLOG)}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                <FileIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{getContentTypeLabel(CONTENT_TYPES.BLOG)}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {getContentTypeDescription(CONTENT_TYPES.BLOG)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all border-2 ${
            contentType === CONTENT_TYPES.LISTICLE 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => onContentTypeChange(CONTENT_TYPES.LISTICLE)}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                <ListOrdered className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{getContentTypeLabel(CONTENT_TYPES.LISTICLE)}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {getContentTypeDescription(CONTENT_TYPES.LISTICLE)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all border-2 ${
            contentType === CONTENT_TYPES.COURSE 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => onContentTypeChange(CONTENT_TYPES.COURSE)}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{getContentTypeLabel(CONTENT_TYPES.COURSE)}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {getContentTypeDescription(CONTENT_TYPES.COURSE)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onContinue} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  )
} 