"use client";

import {
  ExternalLink,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Plus,
  Trash2,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateCourseLinks } from "@/actions/course-db-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RedditIcon, XIcon } from "@/constants/lucide-icon";
import type { CourseLink } from "@/db/schemas/course-schema";

interface SocialsProps {
  courseId?: string;
  initialLinks?: CourseLink[];
  readOnly?: boolean;
}

const platformIcons: Record<string, any> = {
  linkedin: Linkedin,
  twitter: XIcon,
  website: Globe,
  github: Github,
  youtube: Youtube,
  instagram: Instagram,
  reddit: RedditIcon,
  default: ExternalLink,
};

const platformColors: Record<string, string> = {
  linkedin: "text-blue-600",
  twitter: "text-black",
  github: "text-gray-700 dark:text-gray-300",
  youtube: "text-red-600",
  instagram: "text-pink-600",
  reddit: "text-orange-600",
  website: "text-green-600",
  default: "text-gray-600",
};

const Socials = ({
  courseId,
  initialLinks = [],
  readOnly = false,
}: SocialsProps) => {
  const [links, setLinks] = useState<CourseLink[]>(initialLinks);
  const [newUrl, setNewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  const detectPlatform = (url: string): string => {
    const domain = url.toLowerCase();
    if (domain.includes("linkedin.com")) return "linkedin";
    if (domain.includes("twitter.com") || domain.includes("x.com"))
      return "twitter";
    if (domain.includes("github.com")) return "github";
    if (domain.includes("youtube.com")) return "youtube";
    if (domain.includes("instagram.com")) return "instagram";
    if (domain.includes("reddit.com")) return "reddit";
    return "website";
  };

  const formatUrl = (url: string): string => {
    if (!(url.startsWith("http://") || url.startsWith("https://"))) {
      return `https://${url}`;
    }
    return url;
  };

  const addLink = async () => {
    if (!(newUrl.trim() && courseId)) return;

    const formattedUrl = formatUrl(newUrl.trim());
    const platform = detectPlatform(formattedUrl);

    const newLink: CourseLink = {
      id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: formattedUrl,
      platform,
    };

    const updatedLinks = [...links, newLink];

    setIsLoading(true);
    try {
      const result = await updateCourseLinks(courseId, updatedLinks);
      if (result.success) {
        setLinks(updatedLinks);
        setNewUrl("");
        toast.success("Link added successfully!");
      } else {
        toast.error(result.error || "Failed to add link");
      }
    } catch (error) {
      toast.error("Failed to add link");
    } finally {
      setIsLoading(false);
    }
  };

  const removeLink = async (linkId: string) => {
    if (!courseId) return;

    const updatedLinks = links.filter((link) => link.id !== linkId);

    setIsLoading(true);
    try {
      const result = await updateCourseLinks(courseId, updatedLinks);
      if (result.success) {
        setLinks(updatedLinks);
        toast.success("Link removed successfully!");
      } else {
        toast.error(result.error || "Failed to remove link");
      }
    } catch (error) {
      toast.error("Failed to remove link");
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  };

  const IconComponent = (platform: string) => {
    return platformIcons[platform] || platformIcons.default;
  };

  if (readOnly && links.length === 0) {
    return null;
  }

  return (
    <Card className="flex flex-col transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <CardTitle className="text-lg">Links</CardTitle>
              <CardDescription>
                {readOnly
                  ? "Author's links and social media"
                  : "Add socials and other links to your course"}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {!readOnly && (
            <div className="flex items-center gap-2">
              <Input
                className="flex-1"
                disabled={isLoading}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLink()}
                placeholder="https://linkedin.com/in/your-profile"
                value={newUrl}
              />
              <Button
                disabled={isLoading || !newUrl.trim()}
                onClick={addLink}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}

          {links.length > 0 && (
            <div className="space-y-2">
              {links.map((link) => {
                const Icon = IconComponent(link.platform);
                const colorClass =
                  platformColors[link.platform] || platformColors.default;

                return (
                  <div
                    className="group flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/50"
                    key={link.id}
                  >
                    <Link
                      className="flex min-w-0 flex-1 items-center gap-3"
                      href={link.url}
                      target="_blank"
                    >
                      <Icon className={`h-4 w-4 ${colorClass} flex-shrink-0`} />
                      <span className="truncate text-sm">
                        {getDisplayUrl(link.url)}
                      </span>
                    </Link>
                    {!readOnly && (
                      <Button
                        className="h-6 w-6 p-1 transition-opacity group-hover:opacity-100 lg:opacity-0"
                        disabled={isLoading}
                        onClick={() => removeLink(link.id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {links.length === 0 && readOnly && (
            <p className="text-muted-foreground text-sm">No links available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Socials;
