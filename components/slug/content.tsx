import { Lock } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { CONTENT_TYPES } from "@/db/schemas/course-schema";
import PublicCoursePlayer from "./public-course-player";

const PublishedContent = ({ page }: { page: any }) => {
  const isListicle = page.contentType === CONTENT_TYPES.LISTICLE;
  const isCourse = page.contentType === CONTENT_TYPES.COURSE;

  if (isCourse && (page.isPurchased || page.price === 0)) {
    let lessons;
    try {
      lessons =
        typeof page.content === "string"
          ? JSON.parse(page.content)
          : page.content;
    } catch (error) {
      console.error("Failed to parse course content:", error);
      return <div>Error loading course content</div>;
    }

    if (Array.isArray(lessons)) {
      return <PublicCoursePlayer courseTitle={page.title} lessons={lessons} />;
    }
  }

  return (
    <>
      {page.isPurchased || page.price === 0 ? (
        <div className="prose prose-gray dark:prose-invert prose-sm sm:prose-base max-w-none">
          <ReactMarkdown
            components={{
              code({ className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "";
                const isInline = !className?.includes("language-");

                if (isInline) {
                  return (
                    <code
                      className="rounded bg-muted px-1 py-0.5 font-mono text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }

                return (
                  <div className="my-4 overflow-x-auto">
                    <SyntaxHighlighter
                      codeTagProps={{
                        style: {
                          fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                          fontFamily:
                            'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        },
                      }}
                      customStyle={{
                        margin: 0,
                        borderRadius: "0.5rem",
                        fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                        overflowX: "auto",
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
                <h1 className="mt-6 mb-3 font-bold text-2xl first:mt-0">
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
                      <div className="my-8 first:mt-4">
                        <div className="mb-6 flex items-start gap-4">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-black font-bold text-sm text-white">
                            {number}
                          </div>
                          <h2 className="mt-1 font-bold text-gray-900 text-xl leading-tight dark:text-gray-100">
                            {title}
                          </h2>
                        </div>
                      </div>
                    );
                  }
                }
                return (
                  <h2 className="mt-6 mb-3 font-semibold text-xl">
                    {children}
                  </h2>
                );
              },
              h3: ({ children }) => (
                <h3 className="mt-4 mb-2 font-medium text-lg">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="mt-3 mb-2 font-medium text-base">{children}</h4>
              ),
              p: ({ children }) => (
                <p className="mb-3 text-gray-700 leading-6 dark:text-gray-300">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="mb-4 list-outside list-disc space-y-2 pl-6">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-4 list-outside list-decimal space-y-2 pl-6">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-gray-700 leading-6 dark:text-gray-300">
                  {children}
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="mb-3 border-gray-300 border-l-4 pl-3 text-gray-600 italic dark:border-gray-600 dark:text-gray-400">
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-900 dark:text-gray-100">
                  {children}
                </strong>
              ),
              em: ({ children }) => <em className="italic">{children}</em>,
              hr: () => (
                <hr className="my-6 border-gray-200 dark:border-gray-700" />
              ),
            }}
            remarkPlugins={[remarkGfm]}
          >
            {typeof page.content === "string"
              ? page.content
              : JSON.stringify(page.content)}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          <div className="prose prose-gray dark:prose-invert prose-sm sm:prose-base max-w-none">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }: any) {
                  const isInline = !className?.includes("language-");
                  return isInline ? (
                    <code
                      className="rounded bg-muted px-1 py-0.5 font-mono text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4">
                      <code className="font-mono text-sm" {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                h1: ({ children }) => (
                  <h1 className="mt-8 mb-4 font-bold text-3xl first:mt-0">
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
                        <div className="my-10 first:mt-6">
                          <div className="mb-6 flex items-start gap-4">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-black font-bold text-base text-white">
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
                    <h2 className="mt-8 mb-4 font-semibold text-2xl">
                      {children}
                    </h2>
                  );
                },
                h3: ({ children }) => (
                  <h3 className="mt-6 mb-3 font-medium text-xl">{children}</h3>
                ),
                h4: ({ children }) => (
                  <h4 className="mt-4 mb-2 font-medium text-lg">{children}</h4>
                ),
                p: ({ children }) => (
                  <p className="mb-4 text-gray-700 leading-7 dark:text-gray-300">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 list-inside list-disc space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 list-inside list-decimal space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="leading-7">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="mb-4 border-gray-300 border-l-4 pl-4 text-gray-600 italic dark:border-gray-600 dark:text-gray-400">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900 dark:text-gray-100">
                    {children}
                  </strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                hr: () => (
                  <hr className="my-8 border-gray-200 dark:border-gray-700" />
                ),
              }}
              remarkPlugins={[remarkGfm]}
            >
              {typeof page.content === "string"
                ? page.content.split("\n").slice(0, 15).join("\n")
                : "Course content preview..."}
            </ReactMarkdown>
          </div>

          <Card className="border-2 border-dashed bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center px-4 py-8 text-center sm:px-6 sm:py-12">
              <Lock className="mb-3 h-10 w-10 text-black sm:mb-4 sm:h-12 sm:w-12" />
              <CardTitle className="mb-2 text-lg sm:text-xl">
                {isCourse ? "Continue Learning" : "Continue Reading"}
              </CardTitle>
              <CardDescription className="mb-4 max-w-md text-sm sm:mb-6 sm:text-base">
                {isCourse
                  ? "Unlock the full course to access all lessons, quizzes, and interactive content."
                  : "Unlock the full article to continue reading and get access to all the examples and insights."}
              </CardDescription>

              <div className="w-full max-w-sm space-y-3 sm:space-y-4">
                <div className="text-center">
                  <span className="font-bold text-2xl sm:text-3xl">
                    ${page.price}
                  </span>
                  <span className="ml-1 text-muted-foreground text-sm sm:text-base">
                    one-time
                  </span>
                </div>

                <div className="text-muted-foreground text-xs">
                  Instant access • No subscription
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default PublishedContent;
