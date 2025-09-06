"use client";

import { DollarSign, Loader2, Share, Star } from "lucide-react";
/* React */
import { useState } from "react";
import { toast } from "sonner";
import Socials from "@/components/preview/socials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
/* Components */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* Types */
import type { CourseLink } from "@/db/schemas/course-schema";
import { CONTENT_TYPES } from "@/db/schemas/course-schema";

interface CourseSidebarProps {
  price: number;
  keyPoints?: string[];
  tags?: string[];
  links?: CourseLink[];
  isPurchased: boolean;
  courseId: string;
  contentType?: string;
}

const CourseSidebar = ({
  price,
  keyPoints,
  tags,
  links,
  isPurchased,
  courseId,
  contentType,
}: CourseSidebarProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const isCourse = contentType === CONTENT_TYPES.COURSE;
  const isListicle = contentType === CONTENT_TYPES.LISTICLE;

  // Get content-appropriate labels
  const getShareLabel = () => {
    if (isCourse) return "Share Course";
    if (isListicle) return "Share List";
    return "Share Article";
  };

  const getKeyPointsLabel = () => {
    if (isCourse) return "Course Highlights";
    if (isListicle) return "Key Points";
    return "Key Takeaways";
  };

  const handlePurchase = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.error(data.error || "Failed to create checkout");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to initiate purchase");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Course link copied to clipboard!");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-2">
        {!isPurchased && price > 0 && (
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={handlePurchase}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <DollarSign className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Processing..." : `Buy Now - $${price}`}
          </Button>
        )}
        <Button className="mb-3 w-full" onClick={handleShare} variant="outline">
          <Share className="mr-2 h-4 w-4" />
          {getShareLabel()}
        </Button>
      </div>
      {keyPoints && keyPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{getKeyPointsLabel()}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {keyPoints.map((point, index) => (
                <li className="flex items-start gap-2" key={index}>
                  <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {tags && tags.length > 0 && (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge className="text-xs" key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {links && links.length > 0 && (
        <Socials initialLinks={links} readOnly={true} />
      )}
    </div>
  );
};

export default CourseSidebar;
