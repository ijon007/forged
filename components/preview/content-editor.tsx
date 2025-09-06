"use client";

import {
  ArrowBigUp,
  Bold,
  Code,
  Command,
  Edit,
  Italic,
  Quote,
  Save,
  Strikethrough,
  Underline,
  X,
} from "lucide-react";
/* Plate */
import { Plate, usePlateEditor } from "platejs/react";
/* React */
import React, { useEffect, useState } from "react";

/* Markdown */
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { BasicNodesKit } from "@/components/basic-nodes-kit";
import { MarkdownKit } from "@/components/markdown-kit";
/* Components */
import { Button } from "@/components/ui/button";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { MarkToolbarButton } from "@/components/ui/mark-toolbar-button";
import { Separator } from "@/components/ui/separator";
import { ToolbarButton } from "@/components/ui/toolbar";

interface ContentEditorProps {
  initialContent: string;
  onContentChange?: (markdown: string) => void;
  readOnly?: boolean;
  className?: string;
  contentType?: "blog" | "listicle" | "course";
}

export function ContentEditor({
  initialContent,
  onContentChange,
  readOnly = false,
  className = "",
  contentType = "blog",
}: ContentEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentContent, setCurrentContent] = useState(initialContent);

  const editor = usePlateEditor({
    plugins: [...BasicNodesKit, ...MarkdownKit],
  });

  React.useEffect(() => {
    if (isEditing && editor && currentContent) {
      const plateValue = editor.api.markdown.deserialize(currentContent);
      editor.tf.setValue(plateValue);
    }
  }, [isEditing, currentContent, editor]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditing && (event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        handleSave();
      }
      if (isEditing && event.key === "Escape") {
        event.preventDefault();
        handleCancel();
      }
      if (
        !(isEditing || readOnly) &&
        (event.shiftKey || event.metaKey) &&
        event.key === "E"
      ) {
        event.preventDefault();
        handleEdit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, readOnly]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editor) {
      const markdown = editor.api.markdown.serialize();
      setCurrentContent(markdown);
      onContentChange?.(markdown);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentContent(initialContent);
    setIsEditing(false);
  };

  const getBorderColor = () => {
    switch (contentType) {
      case "blog":
        return "border-green-500";
      case "listicle":
        return "border-blue-500";
      case "course":
        return "border-purple-500";
      default:
        return "border-gray-500";
    }
  };

  const renderViewMode = () => (
    <div className="relative">
      {!readOnly && (
        <div className="absolute right-4 z-10">
          <Button
            className="gap-2 bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white/95"
            onClick={handleEdit}
            size="sm"
            variant="outline"
          >
            <Edit className="flex h-4 w-4 md:hidden" />
            Edit
            <span className="ml-1 hidden flex-row items-center text-xs opacity-75 md:flex">
              <ArrowBigUp size={16} /> + E
            </span>
          </Button>
        </div>
      )}
      <div
        className={`prose prose-lg prose-gray dark:prose-invert max-w-none ${className}`}
      >
        <ReactMarkdown
          components={{
            code({ className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              const isInline = !className?.includes("language-");

              if (isInline) {
                return (
                  <code
                    className="rounded bg-gray-100 px-2 py-1 font-mono text-gray-800 text-sm dark:bg-gray-800 dark:text-gray-200"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <div className="my-6">
                  <SyntaxHighlighter
                    customStyle={{
                      margin: 0,
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
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
              <h1 className="mt-12 mb-6 border-gray-200 border-b pb-3 font-bold text-3xl text-gray-900 first:mt-8 dark:border-gray-700 dark:text-gray-100">
                {children}
              </h1>
            ),
            h2: ({ children }) => {
              if (contentType === "listicle") {
                const childString = String(children);
                const numberMatch = childString.match(/^(\d+)\.\s*(.+)/);

                if (numberMatch) {
                  const [, number, title] = numberMatch;
                  return (
                    <div className="my-10 first:mt-6">
                      <div className="mb-6 flex items-start gap-4">
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
                <h2 className="mt-10 mb-6 font-bold text-2xl text-gray-900 dark:text-gray-100">
                  {children}
                </h2>
              );
            },
            h3: ({ children }) => (
              <h3 className="mt-8 mb-4 font-semibold text-gray-900 text-xl dark:text-gray-100">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="mt-6 mb-3 font-medium text-gray-900 text-lg dark:text-gray-100">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="mb-6 text-gray-700 text-lg leading-relaxed dark:text-gray-300">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="mb-6 list-outside list-disc space-y-3 pl-6 text-gray-700 dark:text-gray-300">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-6 list-outside list-decimal space-y-3 pl-6 text-gray-700 dark:text-gray-300">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-lg leading-relaxed">{children}</li>
            ),
            blockquote: ({ children }) => {
              const borderColor =
                contentType === "blog"
                  ? "border-green-500"
                  : contentType === "listicle"
                    ? "border-blue-500"
                    : "border-purple-500";
              return (
                <blockquote
                  className={`border-l-4 ${borderColor} my-6 rounded-r-lg bg-gray-50 py-4 pl-6 dark:bg-gray-800`}
                >
                  <div className="text-gray-700 text-lg italic dark:text-gray-300">
                    {children}
                  </div>
                </blockquote>
              );
            },
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900 dark:text-gray-100">
                {children}
              </strong>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
            hr: () => (
              <hr className="my-10 border-gray-200 dark:border-gray-700" />
            ),
          }}
          remarkPlugins={[remarkGfm]}
        >
          {currentContent}
        </ReactMarkdown>
      </div>
    </div>
  );

  const renderEditMode = () => (
    <Plate editor={editor}>
      <FixedToolbar className="justify-between rounded-t-lg">
        <div className="flex items-center">
          <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
            <Bold className="h-4 w-4" />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
            <Italic className="h-4 w-4" />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">
            <Underline className="h-4 w-4" />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="strikethrough" tooltip="Strikethrough">
            <Strikethrough className="h-4 w-4" />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="code" tooltip="Code (⌘+E)">
            <Code className="h-4 w-4" />
          </MarkToolbarButton>

          <Separator className="mx-1 h-6" orientation="vertical" />

          <ToolbarButton
            className="font-semibold text-sm"
            onClick={() => editor.tf.h1.toggle()}
            tooltip="Heading 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            className="font-semibold text-sm"
            onClick={() => editor.tf.h2.toggle()}
            tooltip="Heading 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            className="font-semibold text-sm"
            onClick={() => editor.tf.h3.toggle()}
            tooltip="Heading 3"
          >
            H3
          </ToolbarButton>

          <Separator className="mx-1 h-6" orientation="vertical" />

          <ToolbarButton
            onClick={() => editor.tf.blockquote.toggle()}
            tooltip="Quote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <div className="flex gap-2">
          <Button
            className="gap-2"
            onClick={handleSave}
            size="sm"
            variant="default"
          >
            <Save className="flex h-4 w-4 md:hidden" />
            Save
            <span className="ml-1 hidden flex-row items-center text-xs opacity-75 md:flex">
              <Command size={16} /> + S
            </span>
          </Button>
          <Button
            className="gap-2"
            onClick={handleCancel}
            size="sm"
            title="Cancel (Esc)"
            variant="outline"
          >
            <X className="flex h-4 w-4 md:hidden" />
            Cancel
            <span className="ml-1 hidden text-xs opacity-75 md:flex">Esc</span>
          </Button>
        </div>
      </FixedToolbar>

      <EditorContainer className={`min-h-64 ${className}`}>
        <Editor
          className="prose prose-lg max-w-none p-4"
          placeholder="Start editing your content..."
        />
      </EditorContainer>
    </Plate>
  );

  return (
    <div className="relative">
      <div
        className={`${isEditing ? "rounded-lg border" : ""} ${isEditing ? getBorderColor() : ""}`}
      >
        {isEditing ? renderEditMode() : renderViewMode()}
      </div>
    </div>
  );
}
