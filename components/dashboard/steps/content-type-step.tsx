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
          className={`cursor-pointer transition-all duration-200 border group shadow-none ${
            contentType === CONTENT_TYPES.BLOG 
              ? 'border-green-200 bg-green-50/50' 
              : 'border-border hover:border-green-300 hover:bg-green-50/30'
          }`}
          onClick={() => onContentTypeChange(CONTENT_TYPES.BLOG)}
        >
          <CardContent className="px-6">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl transition-all duration-200 ${
                contentType === CONTENT_TYPES.BLOG 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-green-50 text-green-500 group-hover:bg-green-100 group-hover:text-green-600'
              }`}>
                <FileIcon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base mb-1">{getContentTypeLabel(CONTENT_TYPES.BLOG)}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getContentTypeDescription(CONTENT_TYPES.BLOG)}
                </p>
              </div>
              {contentType === CONTENT_TYPES.BLOG && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-200 border group shadow-none ${
            contentType === CONTENT_TYPES.LISTICLE 
              ? 'border-blue-200 bg-blue-50/50' 
              : 'border-border hover:border-blue-300 hover:bg-blue-50/30'
          }`}
          onClick={() => onContentTypeChange(CONTENT_TYPES.LISTICLE)}
        >
          <CardContent className="px-6">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl transition-all duration-200 ${
                contentType === CONTENT_TYPES.LISTICLE 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-blue-50 text-blue-500 group-hover:bg-blue-100 group-hover:text-blue-600'
              }`}>
                <ListOrdered className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base mb-1">{getContentTypeLabel(CONTENT_TYPES.LISTICLE)}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getContentTypeDescription(CONTENT_TYPES.LISTICLE)}
                </p>
              </div>
              {contentType === CONTENT_TYPES.LISTICLE && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-200 border group shadow-none ${
            contentType === CONTENT_TYPES.COURSE 
              ? 'border-purple-200 bg-purple-50/50' 
              : 'border-border hover:border-purple-300 hover:bg-purple-50/30'
          }`}
          onClick={() => onContentTypeChange(CONTENT_TYPES.COURSE)}
        >
          <CardContent className="px-6">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl transition-all duration-200 ${
                contentType === CONTENT_TYPES.COURSE 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'bg-purple-50 text-purple-500 group-hover:bg-purple-100 group-hover:text-purple-600'
              }`}>
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base mb-1">{getContentTypeLabel(CONTENT_TYPES.COURSE)}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getContentTypeDescription(CONTENT_TYPES.COURSE)}
                </p>
              </div>
              {contentType === CONTENT_TYPES.COURSE && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
              )}
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