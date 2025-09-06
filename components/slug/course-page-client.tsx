"use client";

import { useRouter, useSearchParams } from "next/navigation";
/* React */
import { useEffect, useState } from "react";
/* Actions */
import {
  markPurchaseCompleted,
  validateAccessCode,
} from "@/actions/course-db-actions";
/* Types */
import type { CourseContent } from "@/db/schemas/course-schema";
import { AccessCodeDialog, AccessCodeInputDialog } from "./access-code-dialog";
import PublishedContent from "./content";
/* Components */
import CourseHeader from "./course-header";
import CourseJsonLd from "./course-json-ld";
import CourseSidebar from "./course-sidebar";
import PoweredByBadge from "./powered-by-badge";

interface CoursePageClientProps {
  page: {
    id: string;
    title: string;
    description: string;
    price: number;
    contentType: string;
    isPurchased: boolean;
    author: string;
    readTime: string;
    imageUrl: string;
    content: CourseContent;
    tags: string[];
    keyPoints: string[];
    links: any[];
  };
  accessCode?: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  isPreview?: boolean;
}

export default function CoursePage({
  page,
  slug,
  createdAt,
  updatedAt,
  isPreview = false,
}: CoursePageClientProps) {
  const [hasAccess, setHasAccess] = useState(isPreview ? true : false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [generatedAccessCode, setGeneratedAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Skip all access code logic in preview mode
    if (isPreview) {
      setHasAccess(true);
      return;
    }

    const accessCodeFromUrl = searchParams.get("access_code");
    const fromManualEntry = searchParams.get("manual") === "true";

    if (accessCodeFromUrl) {
      const validateUrlAccessCode = async () => {
        try {
          const result = await validateAccessCode(page.id, accessCodeFromUrl);

          if (result.success) {
            setHasAccess(true);
            setGeneratedAccessCode(accessCodeFromUrl);

            if (!fromManualEntry) {
              setShowSuccessDialog(true);
            }
          } else {
            setShowInputDialog(true);
            setError("Invalid access code");
          }
        } catch (error) {
          setShowInputDialog(true);
          setError("Failed to validate access code");
        }
      };

      validateUrlAccessCode();
    } else if (page.price > 0) {
      setShowInputDialog(true);
    }
  }, [searchParams, page.id, isPreview]);

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
  };

  const handleAccessCodeSubmit = async (code: string) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await validateAccessCode(page.id, code);

      if (result.success) {
        setHasAccess(true);
        setShowInputDialog(false);
        const url = new URL(window.location.href);
        url.searchParams.set("access_code", code);
        url.searchParams.set("manual", "true");
        router.replace(url.toString());
      } else {
        setError(result.error || "Invalid access code");
      }
    } catch (error) {
      setError("Failed to validate access code");
    }

    setIsLoading(false);
  };

  const handleContinueToCourse = async () => {
    try {
      await markPurchaseCompleted(page.id, generatedAccessCode);
    } catch (error) {
      console.error("Failed to mark purchase as completed:", error);
    }
  };

  const pageWithAccess = { ...page, isPurchased: hasAccess };

  return (
    <>
      <CourseJsonLd
        author={page.author}
        contentType={page.contentType}
        createdAt={createdAt}
        description={page.description}
        imageUrl={page.imageUrl}
        price={page.price}
        slug={slug}
        tags={page.tags}
        title={page.title}
        updatedAt={updatedAt}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto w-11/12 px-4 py-8 lg:w-10/12">
          <CourseHeader
            author={page.author}
            contentType={page.contentType}
            description={page.description}
            imageUrl={page.imageUrl}
            readTime={page.readTime}
            title={page.title}
          />
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-4 lg:gap-8">
            <div className="min-w-0 lg:col-span-3">
              <PublishedContent page={pageWithAccess} />
            </div>
            <div className="order-1 lg:order-last">
              <CourseSidebar
                contentType={page.contentType}
                courseId={page.id}
                isPurchased={hasAccess}
                keyPoints={page.keyPoints.slice(0, 5)}
                links={page.links}
                price={page.price}
                tags={page.tags}
              />
            </div>
          </div>
        </div>
        <PoweredByBadge />
      </div>

      {!isPreview && page.price > 0 && (
        <>
          <AccessCodeDialog
            accessCode={generatedAccessCode}
            courseTitle={page.title}
            isOpen={showSuccessDialog}
            onClose={handleSuccessDialogClose}
            onContinue={handleContinueToCourse}
          />

          <AccessCodeInputDialog
            error={error}
            isLoading={isLoading}
            isOpen={showInputDialog}
            onClose={() => setShowInputDialog(false)}
            onSubmit={handleAccessCodeSubmit}
          />
        </>
      )}
    </>
  );
}
