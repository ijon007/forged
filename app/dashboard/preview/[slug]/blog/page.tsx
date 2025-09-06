/* Next */

import { Clock, Eye, FileText, ListOrdered } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
/* Markdown */
import remarkGfm from "remark-gfm";
/* Actions */
import { getCourseWithUser } from "@/actions/course-db-actions";
import CourseSidebar from "@/components/slug/course-sidebar";
/* Components */
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
/* Types */
import { CONTENT_TYPES } from "@/db/schemas/course-schema";
/* Utils */
import { courseStore, formatCourseForPreview } from "@/lib/course-store";

export const metadata: Metadata = {
  title: "Preview | Dashboard",
  description: "Preview Mode",
};

export default async function BlogPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let generatedCourse = courseStore.get(slug);

  if (!generatedCourse) {
    const dbCourse = await getCourseWithUser(slug);
    if (dbCourse) {
      generatedCourse = {
        id: dbCourse.id,
        title: dbCourse.title,
        description: dbCourse.description,
        content: dbCourse.content,
        originalContent:
          typeof dbCourse.originalContent === "string"
            ? dbCourse.originalContent
            : "",
        contentType: dbCourse.contentType || "blog",
        tags: dbCourse.tags,
        keyPoints: dbCourse.keyPoints,
        estimatedReadTime: dbCourse.estimatedReadTime,
        createdAt: dbCourse.createdAt,
      };

      if (generatedCourse) {
        courseStore.set(slug, generatedCourse);
      }
    }
  }

  if (!generatedCourse) {
    notFound();
  }

  const dbCourse = await getCourseWithUser(slug);
  if (!dbCourse) {
    notFound();
  }

  const priceInCents = dbCourse.price;
  const formattedCourse = formatCourseForPreview(generatedCourse, priceInCents);

  const page = {
    id: formattedCourse.id,
    title: formattedCourse.title,
    description: formattedCourse.description,
    price: formattedCourse.price,
    contentType: generatedCourse.contentType,
    author: dbCourse.userName,
    readTime: `${formattedCourse.estimatedReadTime} min read`,
    imageUrl:
      dbCourse.imageUrl ||
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    content: formattedCourse.generatedContent,
    links: dbCourse.links || [],
  };

  const isListicle = page.contentType === CONTENT_TYPES.LISTICLE;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-row items-center justify-between">
          <div className="w-full max-w-md rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Preview Mode</span>
            </div>
          </div>
          <SidebarTrigger className="block md:hidden" />
        </div>

        <article className="mb-8 overflow-hidden">
          <header className="border-gray-100 border-b px-8 py-10">
            <div className="mb-6 flex items-center gap-2">
              {isListicle ? (
                <>
                  <ListOrdered className="h-5 w-5 text-blue-600" />
                  <Badge
                    className="border-blue-200 bg-blue-50 text-blue-600"
                    variant="outline"
                  >
                    Listicle
                  </Badge>
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 text-green-600" />
                  <Badge
                    className="border-green-200 bg-green-50 text-green-600"
                    variant="outline"
                  >
                    Blog Post
                  </Badge>
                </>
              )}
            </div>

            <div className="space-y-6">
              <h1 className="font-bold text-4xl text-gray-900 leading-tight md:text-5xl">
                {page.title}
              </h1>
              {page.description && (
                <p className="text-gray-600 text-xl leading-relaxed">
                  {page.description}
                </p>
              )}
            </div>

            <div className="mt-8 flex items-center gap-8 text-gray-500 text-sm">
              <span className="font-medium">By {page.author}</span>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{page.readTime}</span>
              </div>
            </div>
          </header>

          <div className="px-8 py-8">
            <Image
              alt={page.title}
              className="h-80 w-full rounded-lg object-cover"
              height={600}
              src={page.imageUrl}
              width={1000}
            />
          </div>
        </article>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="prose prose-xl prose-gray max-w-none">
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    const language = match ? match[1] : "";
                    const isInline = !className?.includes("language-");

                    if (isInline) {
                      return (
                        <code
                          className="rounded bg-gray-100 px-2 py-1 font-mono text-base text-gray-800"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }

                    return (
                      <div className="my-8">
                        <SyntaxHighlighter
                          customStyle={{
                            margin: 0,
                            borderRadius: "0.5rem",
                            fontSize: "1rem",
                          }}
                          language={language || "text"}
                          PreTag="div"
                          style={vscDarkPlus}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    );
                  },
                  h1: ({ children }) => (
                    <h1 className="border-gray-200 pb-4 font-bold text-4xl text-gray-900">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => {
                    if (isListicle) {
                      const childString = String(children);
                      const numberMatch = childString.match(/^(\d+)\.\s*(.+)/);

                      if (numberMatch) {
                        const [, number, title] = numberMatch;
                        return (
                          <div className="my-12 first:mt-8">
                            <div className="mb-8 flex items-start gap-6">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black font-bold text-lg text-white">
                                {number}
                              </div>
                              <h2 className="mt-1 font-bold text-2xl text-gray-900 leading-tight dark:text-gray-100">
                                {title}
                              </h2>
                            </div>
                          </div>
                        );
                      }
                    }
                    return (
                      <h2 className="mt-12 mb-8 font-bold text-3xl text-gray-900">
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children }) => (
                    <h3 className="mt-10 mb-6 font-semibold text-2xl text-gray-900">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="mt-8 mb-4 font-medium text-gray-900 text-xl">
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="mb-6 text-gray-700 text-lg leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-8 list-outside list-disc space-y-4 pl-8 text-gray-700">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-8 list-outside list-decimal space-y-4 pl-8 text-gray-700">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-lg leading-relaxed">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote
                      className={`border-l-4 ${isListicle ? "border-blue-500" : "border-green-500"} my-8 rounded-r-lg bg-gray-50 py-6 pl-8`}
                    >
                      <div className="text-gray-700 text-xl italic">
                        {children}
                      </div>
                    </blockquote>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                  hr: () => <hr className="my-12 border-gray-200" />,
                }}
                remarkPlugins={[remarkGfm]}
              >
                {typeof page.content === "string" ? page.content : ""}
              </ReactMarkdown>
            </div>
          </div>

          <div className="order-1 lg:order-last">
            <CourseSidebar
              courseId={page.id}
              isPurchased={false}
              keyPoints={generatedCourse.keyPoints.slice(0, 5)}
              links={page.links}
              price={page.price}
              tags={generatedCourse.tags}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
