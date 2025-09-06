"use server";

/* AI */
import { google } from "@ai-sdk/google";
import { generateObject, zodSchema } from "ai";
/* Types */
import {
  CONTENT_TYPES,
  type ContentType,
  type CourseContent,
} from "@/db/schemas/course-schema";
/* Actions */
import { courseStore } from "@/lib/course-store";
import { autoSelectImageFromTitle } from "@/lib/unsplash-api";
import {
  getBlogPrompt,
  getBlogSystemPrompt,
  getCoursePrompt,
  getCourseSystemPrompt,
  getListiclePrompt,
  getListicleSystemPrompt,
} from "@/utils/prompts";
/* Utils */
import { generateSlug } from "@/utils/slug";
import { blogSchema, courseSchema, listicleSchema } from "@/utils/zod-schemas";
import { saveCourse } from "./course-db-actions";

export interface CourseGenerationResult {
  success: boolean;
  data?: {
    id: string;
    title: string;
    description: string;
    content: CourseContent;
    originalContent: string;
    contentType: ContentType;
    tags: string[];
    keyPoints: string[];
    estimatedReadTime: number;
    price: number;
  };
  error?: string;
}

async function parsePDFToText(
  file: File
): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    if (file.type !== "application/pdf") {
      return { success: false, error: "File must be a PDF" };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { success: false, error: "File size must be less than 10MB" };
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF using pdf2json (server-side only)
    const PDFParser = (await import("pdf2json")).default;
    const pdfParser = new (PDFParser as any)(null, 1);

    // Create a promise to handle the async PDF parsing
    const extractedText = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        reject(new Error(errData.parserError));
      });

      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        try {
          let text = "";
          for (const page of pdfData.Pages) {
            for (const textItem of page.Texts) {
              for (const run of textItem.R) {
                text += decodeURIComponent(run.T) + " ";
              }
            }
            text += "\n";
          }
          resolve(text.trim());
        } catch (error) {
          reject(error);
        }
      });

      pdfParser.parseBuffer(buffer);
    });

    if (!extractedText.trim()) {
      return { success: false, error: "Could not extract text from PDF" };
    }

    return { success: true, text: extractedText };
  } catch (error) {
    console.error("PDF parsing error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred during PDF parsing",
    };
  }
}

export async function generateCourseFromPDF(
  formData: FormData
): Promise<CourseGenerationResult> {
  try {
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const contentType =
      (formData.get("contentType") as ContentType) || CONTENT_TYPES.BLOG;

    if (!file) {
      return { success: false, error: "No file uploaded" };
    }

    const parseResult = await parsePDFToText(file);
    if (!parseResult.success) {
      return {
        success: false,
        error: parseResult.error || "Failed to parse PDF",
      };
    }

    const extractedText = parseResult.text!;

    // Generate structured course content using generateObject
    const systemPrompt =
      contentType === CONTENT_TYPES.LISTICLE
        ? getListicleSystemPrompt(title, description, price)
        : contentType === CONTENT_TYPES.COURSE
          ? getCourseSystemPrompt(title, description, price)
          : getBlogSystemPrompt(title, description, price);

    const promptText =
      contentType === CONTENT_TYPES.LISTICLE
        ? getListiclePrompt(extractedText)
        : contentType === CONTENT_TYPES.COURSE
          ? getCoursePrompt(extractedText)
          : getBlogPrompt(extractedText);

    const result =
      contentType === CONTENT_TYPES.COURSE
        ? await generateObject({
            model: google("gemini-2.0-flash"),
            schema: zodSchema(courseSchema),
            system: systemPrompt,
            prompt: promptText,
          })
        : contentType === CONTENT_TYPES.LISTICLE
          ? await generateObject({
              model: google("gemini-2.0-flash"),
              schema: zodSchema(listicleSchema),
              system: systemPrompt,
              prompt: promptText,
            })
          : await generateObject({
              model: google("gemini-2.0-flash"),
              schema: zodSchema(blogSchema),
              system: systemPrompt,
              prompt: promptText,
            });

    const courseData = result.object;

    if (!courseData) {
      return { success: false, error: "Failed to generate course content" };
    }

    const courseId = generateSlug(courseData.title);

    const autoImageUrl = await autoSelectImageFromTitle(courseData.title);

    // Handle different content structures based on content type
    const contentForStore =
      contentType === CONTENT_TYPES.COURSE
        ? (courseData as any).lessons
        : (courseData as any).content;

    courseStore.set(courseId, {
      title: courseData.title,
      description: courseData.description,
      content: contentForStore,
      originalContent: extractedText,
      contentType,
      tags: courseData.tags,
      keyPoints: courseData.keyPoints,
      estimatedReadTime: courseData.estimatedReadTime,
    });

    const dbResult = await saveCourse({
      id: courseId,
      slug: courseId,
      title: courseData.title,
      description: courseData.description,
      content: contentForStore,
      originalContent: extractedText,
      contentType,
      tags: courseData.tags,
      keyPoints: courseData.keyPoints,
      estimatedReadTime: courseData.estimatedReadTime,
      price: courseData.price,
      imageUrl: autoImageUrl,
    });

    if (!dbResult.success) {
      console.error("Failed to save course to database:", dbResult.error);
    }

    return {
      success: true,
      data: {
        id: courseId,
        title: courseData.title,
        description: courseData.description,
        content: contentForStore,
        originalContent: extractedText,
        contentType,
        tags: courseData.tags,
        keyPoints: courseData.keyPoints,
        estimatedReadTime: courseData.estimatedReadTime,
        price: courseData.price,
      },
    };
  } catch (error) {
    console.error("Course generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
