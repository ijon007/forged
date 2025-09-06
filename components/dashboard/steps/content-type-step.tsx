"use client";

import { FileIcon, GraduationCap, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CONTENT_TYPES, type ContentType } from "@/db/schemas/course-schema";
import {
  getContentTypeDescription,
  getContentTypeLabel,
} from "@/lib/course-store";

interface ContentTypeStepProps {
  contentType: ContentType;
  onContentTypeChange: (type: ContentType) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function ContentTypeStep({
  contentType,
  onContentTypeChange,
  onBack,
  onContinue,
}: ContentTypeStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="font-semibold text-lg">Choose Content Type</h3>
        <p className="text-muted-foreground text-sm">
          Select the type of content you'd like to generate
        </p>
      </div>

      <div className="grid gap-4">
        <Card
          className={`group cursor-pointer border shadow-none transition-all duration-200 ${
            contentType === CONTENT_TYPES.BLOG
              ? "border-green-200 bg-green-50/50"
              : "border-border hover:border-green-300 hover:bg-green-50/30"
          }`}
          onClick={() => onContentTypeChange(CONTENT_TYPES.BLOG)}
        >
          <CardContent className="px-6">
            <div className="flex items-start space-x-4">
              <div
                className={`rounded-xl p-3 transition-all duration-200 ${
                  contentType === CONTENT_TYPES.BLOG
                    ? "bg-green-100 text-green-600"
                    : "bg-green-50 text-green-500 group-hover:bg-green-100 group-hover:text-green-600"
                }`}
              >
                <FileIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="mb-1 font-semibold text-base">
                  {getContentTypeLabel(CONTENT_TYPES.BLOG)}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {getContentTypeDescription(CONTENT_TYPES.BLOG)}
                </p>
              </div>
              {contentType === CONTENT_TYPES.BLOG && (
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card
          className={`group cursor-pointer border shadow-none transition-all duration-200 ${
            contentType === CONTENT_TYPES.LISTICLE
              ? "border-blue-200 bg-blue-50/50"
              : "border-border hover:border-blue-300 hover:bg-blue-50/30"
          }`}
          onClick={() => onContentTypeChange(CONTENT_TYPES.LISTICLE)}
        >
          <CardContent className="px-6">
            <div className="flex items-start space-x-4">
              <div
                className={`rounded-xl p-3 transition-all duration-200 ${
                  contentType === CONTENT_TYPES.LISTICLE
                    ? "bg-blue-100 text-blue-600"
                    : "bg-blue-50 text-blue-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                }`}
              >
                <ListOrdered className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="mb-1 font-semibold text-base">
                  {getContentTypeLabel(CONTENT_TYPES.LISTICLE)}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {getContentTypeDescription(CONTENT_TYPES.LISTICLE)}
                </p>
              </div>
              {contentType === CONTENT_TYPES.LISTICLE && (
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card
          className={`group cursor-pointer border shadow-none transition-all duration-200 ${
            contentType === CONTENT_TYPES.COURSE
              ? "border-purple-200 bg-purple-50/50"
              : "border-border hover:border-purple-300 hover:bg-purple-50/30"
          }`}
          onClick={() => onContentTypeChange(CONTENT_TYPES.COURSE)}
        >
          <CardContent className="px-6">
            <div className="flex items-start space-x-4">
              <div
                className={`rounded-xl p-3 transition-all duration-200 ${
                  contentType === CONTENT_TYPES.COURSE
                    ? "bg-purple-100 text-purple-600"
                    : "bg-purple-50 text-purple-500 group-hover:bg-purple-100 group-hover:text-purple-600"
                }`}
              >
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="mb-1 font-semibold text-base">
                  {getContentTypeLabel(CONTENT_TYPES.COURSE)}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {getContentTypeDescription(CONTENT_TYPES.COURSE)}
                </p>
              </div>
              {contentType === CONTENT_TYPES.COURSE && (
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 pt-4">
        <Button className="flex-1" onClick={onBack} variant="outline">
          Back
        </Button>
        <Button className="flex-1" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
