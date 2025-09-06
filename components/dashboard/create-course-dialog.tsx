"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { generateCourseFromPDF } from "@/actions/course-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CONTENT_TYPES, type ContentType } from "@/db/schemas/course-schema";
import { validatePDFFile } from "@/lib/pdf-parsing";
import ContentTypeStep from "./steps/content-type-step";
import DetailsStep from "./steps/details-step";
import GeneratingStep from "./steps/generating-step";
import UploadStep from "./steps/upload-step";

interface CreateCourseDialogProps {
  children: React.ReactNode;
}

interface PageData {
  title: string;
  description: string;
  price: string;
}

export function CreateCourseDialog({ children }: CreateCourseDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<
    "upload" | "contentType" | "details" | "generating"
  >("upload");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState<ContentType>(
    CONTENT_TYPES.BLOG
  );
  const [pageData, setPageData] = useState<PageData>({
    title: "",
    description: "",
    price: "",
  });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Show upload progress for actual file reading
    setUploadProgress(50);

    const validation = await validatePDFFile(selectedFile);
    if (!validation.valid) {
      toast.error(validation.error || "Invalid file");
      setUploadProgress(0);
      return;
    }

    setFile(selectedFile);
    setUploadProgress(100);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    setStep("generating");
    setGenerationProgress(10); // Initial progress

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", pageData.title);
      formData.append("description", pageData.description);
      formData.append("price", pageData.price);
      formData.append("contentType", contentType);

      // Only show progress during actual AI generation
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);

      const result = await generateCourseFromPDF(formData);

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (result.success && result.data) {
        const successMessage =
          contentType === CONTENT_TYPES.COURSE
            ? "Course generated successfully!"
            : "Content generated successfully!";
        toast.success(successMessage);

        // Navigate immediately after success
        setOpen(false);

        // Reset state
        setStep("upload");
        setFile(null);
        setUploadProgress(0);
        setGenerationProgress(0);
        setContentType(CONTENT_TYPES.BLOG);
        setPageData({ title: "", description: "", price: "" });

        router.push(`/dashboard/preview/${result.data!.id}`);
      } else {
        toast.error(result.error || "Failed to generate content");
        setStep("details");
        setGenerationProgress(0);
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("An unexpected error occurred");
      setStep("details");
      setGenerationProgress(0);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setFile(null);
    setUploadProgress(0);
    setGenerationProgress(0);
    setContentType(CONTENT_TYPES.BLOG);
  };

  const renderCurrentStep = () => {
    switch (step) {
      case "upload":
        return (
          <UploadStep
            file={file}
            onContinue={() => setStep("contentType")}
            onFileUpload={handleFileUpload}
            onReset={handleReset}
            uploadProgress={uploadProgress}
          />
        );
      case "contentType":
        return (
          <ContentTypeStep
            contentType={contentType}
            onBack={handleReset}
            onContentTypeChange={setContentType}
            onContinue={() => setStep("details")}
          />
        );
      case "details":
        return (
          <DetailsStep
            onBack={() => setStep("contentType")}
            onPageDataChange={setPageData}
            onSubmit={handleSubmit}
            pageData={pageData}
          />
        );
      case "generating":
        return (
          <GeneratingStep
            contentType={contentType}
            generationProgress={generationProgress}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
          <DialogDescription>
            Upload a PDF and we'll generate professional content for you - blog
            posts, listicles, or interactive courses
          </DialogDescription>
        </DialogHeader>

        {renderCurrentStep()}
      </DialogContent>
    </Dialog>
  );
}
