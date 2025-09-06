import { notFound } from "next/navigation";
import { getCourseWithUser } from "@/actions/course-db-actions";
import BlogPreview from "@/components/preview/blog-preview";
import CoursePreview from "@/components/preview/course-preview";
import ListiclePreview from "@/components/preview/listicle-preview";
import Preferences from "@/components/preview/preferences";
import PreferencesSheet from "@/components/preview/preferences-sheet";
import Socials from "@/components/preview/socials";
import TopNav from "@/components/preview/top-nav";
import { CONTENT_TYPES, type Lesson } from "@/db/schemas/course-schema";
import { courseStore } from "@/lib/course-store";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const dbCourse = await getCourseWithUser(slug);
  if (!dbCourse) {
    notFound();
  }

  const generatedCourse = {
    id: dbCourse.id,
    slug: dbCourse.slug,
    title: dbCourse.title,
    description: dbCourse.description,
    content: dbCourse.content,
    originalContent: dbCourse.originalContent,
    contentType: dbCourse.contentType || CONTENT_TYPES.BLOG,
    tags: dbCourse.tags,
    keyPoints: dbCourse.keyPoints,
    estimatedReadTime: dbCourse.estimatedReadTime,
    createdAt: dbCourse.createdAt,
  };

  courseStore.set(slug, {
    title: dbCourse.title,
    description: dbCourse.description,
    content: dbCourse.content,
    originalContent:
      typeof dbCourse.originalContent === "string"
        ? dbCourse.originalContent
        : JSON.stringify(dbCourse.originalContent),
    contentType: dbCourse.contentType || CONTENT_TYPES.BLOG,
    tags: dbCourse.tags,
    keyPoints: dbCourse.keyPoints,
    links: dbCourse.links,
    estimatedReadTime: dbCourse.estimatedReadTime,
  });

  const priceInCents = dbCourse.price;
  const published = dbCourse.published;

  const basePreviewData = {
    id: dbCourse.id,
    title: dbCourse.title,
    description: dbCourse.description,
    price: priceInCents / 100,
    contentType: generatedCourse.contentType,
    slug,
    status: published ? "published" : "draft",
    published,
    imageUrl: dbCourse.imageUrl || undefined,
    tags: generatedCourse.tags,
    keyPoints: generatedCourse.keyPoints,
    links: dbCourse.links || [],
    estimatedReadTime: generatedCourse.estimatedReadTime,
    readTime: `${generatedCourse.estimatedReadTime} min read`,
    author: dbCourse.userName,
    createdAt: generatedCourse.createdAt.toISOString(),
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav dbCourse={dbCourse} previewData={basePreviewData} />

      <div className="container mx-auto w-full px-4 py-6">
        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="flex-1">
            {basePreviewData.contentType === CONTENT_TYPES.COURSE ? (
              <CoursePreview
                previewData={{
                  ...basePreviewData,
                  generatedContent: generatedCourse.content as Lesson[],
                }}
              />
            ) : basePreviewData.contentType === CONTENT_TYPES.LISTICLE ? (
              <ListiclePreview
                previewData={{
                  ...basePreviewData,
                  generatedContent: generatedCourse.content as string,
                }}
              />
            ) : (
              <BlogPreview
                previewData={{
                  ...basePreviewData,
                  generatedContent: generatedCourse.content as string,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
