import {
  DollarSign,
  Edit,
  Eye,
  FileIcon,
  GraduationCap,
  ListOrdered,
  MoreHorizontal,
  Share,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { CONTENT_TYPES, type ContentType } from "@/db/schemas/course-schema";
import { getContentTypeLabel } from "@/lib/course-store";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  status: "draft" | "published" | "generating";
  price: number;
  views: number;
  sales: number;
  progress?: number;
  imageUrl?: string;
  slug?: string;
  contentType?: ContentType;
}

export function CourseCard({
  id,
  title,
  description,
  status,
  price,
  views,
  sales,
  progress,
  imageUrl,
  slug,
  contentType = CONTENT_TYPES.BLOG,
}: CourseCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-500" variant="default">
            Live
          </Badge>
        );
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "generating":
        return (
          <Badge
            className="border-orange-500 text-orange-500"
            variant="outline"
          >
            Generating
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getContentTypeBadge = () => {
    const icons = {
      [CONTENT_TYPES.BLOG]: <FileIcon className="h-3 w-3" />,
      [CONTENT_TYPES.LISTICLE]: <ListOrdered className="h-3 w-3" />,
      [CONTENT_TYPES.COURSE]: <GraduationCap className="h-3 w-3" />,
    };

    return (
      <Badge className="flex items-center gap-1" variant="outline">
        {icons[contentType] || icons[CONTENT_TYPES.BLOG]}
        {getContentTypeLabel(contentType)}
      </Badge>
    );
  };

  const getEditLink = () => {
    if (status === "published" && slug) {
      return `/${slug}`;
    }
    return `/dashboard/preview/${id}`;
  };

  const getActionText = () => {
    switch (status) {
      case "published":
        return "View Live";
      case "draft":
        return "Continue Editing";
      case "generating":
        return "View Progress";
      default:
        return "View";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8 p-0" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Page
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {getStatusBadge()}
          {getContentTypeBadge()}
          {status === "generating" && progress !== undefined && (
            <div className="min-w-[100px] flex-1">
              <Progress className="h-2" value={progress} />
            </div>
          )}
        </div>
      </CardHeader>

      {imageUrl && (
        <div className="px-6 pb-3">
          <div
            className="aspect-video rounded-md bg-center bg-cover bg-muted"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        </div>
      )}

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-muted-foreground text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {views} views
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {sales} purchases
            </span>
          </div>
          <span className="font-medium text-foreground">${price}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex w-full gap-2">
          <Link className="flex-1" href={getEditLink()}>
            <Button className="w-full" size="sm" variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Link className="flex-1" href={getEditLink()}>
            <Button className="w-full" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              {getActionText()}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
