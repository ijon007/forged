"use server"

/* AI */
import { google } from '@ai-sdk/google'
import { generateObject, zodSchema } from 'ai'

/* Zod */
import { z } from 'zod'

/* Actions */
import { courseStore } from '@/lib/course-store'
import { saveCourse } from './course-db-actions'

/* Utils */
import { generateSlug } from '@/utils/slug'
import { autoSelectImageFromTitle } from '@/lib/unsplash-api'

/* Types */
export interface CourseGenerationResult {
  success: boolean
  data?: {
    id: string
    title: string
    description: string
    content: string
    originalContent: string
    tags: string[]
    keyPoints: string[]
    estimatedReadTime: number
    price: number
  }
  error?: string
}

export async function generateCourseFromPDF(
  formData: FormData
): Promise<CourseGenerationResult> {
  try {
    // Extract file and metadata from form data
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string

    if (!file) {
      return { success: false, error: 'No file uploaded' }
    }

    // Convert file to buffer and extract text
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Extract text from PDF using pdf2json
    const PDFParser = (await import('pdf2json')).default
    const pdfParser = new (PDFParser as any)(null, 1)
    
    let extractedText = ''
    
    // Create a promise to handle the async PDF parsing
    const parsePromise = new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        reject(new Error(errData.parserError))
      })
      
      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        try {
          let text = ''
          for (const page of pdfData.Pages) {
            for (const textItem of page.Texts) {
              for (const run of textItem.R) {
                text += decodeURIComponent(run.T) + ' '
              }
            }
            text += '\n'
          }
          resolve(text.trim())
        } catch (error) {
          reject(error)
        }
      })
      
      pdfParser.parseBuffer(buffer)
    })
    
    extractedText = await parsePromise

    if (!extractedText.trim()) {
      return { success: false, error: 'Could not extract text from PDF' }
    }

    // Check if we have the Google AI API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return { success: false, error: 'Google AI API key not configured' }
    }

    // Define the schema for type inference
    const courseSchema = z.object({
      title: z.string().describe('An engaging title for the blog post'),
      description: z.string().describe('A compelling description of the content'),
      content: z.string().describe('The complete blog post content in markdown format'),
      tags: z.array(z.string()).describe('Relevant tags for the content'),
      keyPoints: z.array(z.string()).describe('Key takeaways from the content'),
      estimatedReadTime: z.number().describe('Estimated reading time in minutes'),
      price: z.number().describe('Suggested price for this content in USD'),
    })

    // Generate structured course content using generateObject
    const result = await generateObject({
        model: google('gemini-2.0-flash'),
        schema: zodSchema(courseSchema),
        system:
            `You are an expert content strategist and educator who specializes in creating professional, high-value educational content. Your task is to transform PDF content into a comprehensive playbook/course that provides genuine value to learners.

            PROFESSIONAL CONTENT STANDARDS:
            - Maintain a professional, authoritative tone throughout
            - Focus on delivering practical, actionable insights
            - Structure content for optimal learning and retention
            - Ensure every section provides clear value to the reader
            - Use precise, clear language without unnecessary fluff
            - Stick closely to the source material while enhancing its presentation

            CONTENT ENHANCEMENT APPROACH:
            - Organize information into logical, progressive sections
            - Add context and explanations to make complex topics accessible
            - Include practical examples and real-world applications
            - Provide step-by-step guidance where appropriate
            - Highlight critical concepts and important distinctions
            - Create clear connections between different concepts

            EDUCATIONAL VALUE FOCUS:
            - Transform raw information into structured learning modules
            - Add implementation guidance and best practices
            - Include common pitfalls and how to avoid them
            - Provide frameworks and methodologies for practical application
            - Ensure content is comprehensive yet concise
            - Create content that learners can reference and apply immediately

            CONTENT STRUCTURE:
            - Use clear, descriptive headings that outline what readers will learn
            - Break complex topics into digestible sections
            - Include summary points and key takeaways
            - Ensure logical flow from basic concepts to advanced applications
            - Add practical exercises or reflection questions where beneficial

            IMPORTANT: You must return a JSON object with EXACTLY these field names:
            - title: string (professional, value-focused title)
            - description: string (clear description of what learners will gain)
            - content: string (complete educational content in markdown format)
            - tags: array of strings (relevant professional tags)
            - keyPoints: array of strings (practical key takeaways)
            - estimatedReadTime: number (reading time in minutes)
            - price: number (price in USD as a number, not string)

            The user provided these preferences:
            - Title preference: ${title || 'Not specified'}
            - Description preference: ${description || 'Not specified'}
            - Price point: $${price || 'Not specified'}

            Focus on creating professional educational content that provides clear value and actionable insights.`,
        prompt: 
            `Please analyze this PDF content and transform it into a professional educational playbook/course:

            ${extractedText}

            CONTENT TRANSFORMATION OBJECTIVES:
            1. Extract and organize the core concepts into a logical learning progression
            2. Enhance clarity by adding context, explanations, and practical examples
            3. Structure information into comprehensive yet digestible sections
            4. Identify and highlight the most valuable insights and methodologies
            5. Provide practical implementation guidance throughout
            6. Ensure the content serves as a complete reference guide on the topic
            7. Add professional insights that enhance understanding without straying from source material
            8. Create clear learning outcomes for each major section

            PROFESSIONAL FORMATTING REQUIREMENTS:
            - Use clear, informative headings that describe what learners will gain
            - Organize content in a logical sequence from foundational to advanced concepts
            - Include practical applications and real-world examples where relevant
            - Highlight key principles, frameworks, and methodologies
            - Provide actionable steps and implementation guidance
            - Add summary sections that reinforce learning objectives
            - Ensure each section builds upon previous knowledge

            EDUCATIONAL VALUE STANDARDS:
            - Make complex topics accessible without oversimplifying
            - Focus on practical application and real-world utility
            - Include best practices and common implementation challenges
            - Provide frameworks that learners can apply immediately
            - Ensure content is comprehensive enough to serve as a complete guide
            - Maintain professional tone while being engaging and clear

            QUALITY CHECKLIST:
            - Does this provide clear, actionable value to learners?
            - Is the content well-organized and easy to follow?
            - Are key concepts explained thoroughly yet concisely?
            - Does it include practical guidance for implementation?
            - Would someone pay for this level of educational content?

            Remember to output the exact field names specified in the schema: title, description, content, tags, keyPoints, estimatedReadTime, and price.`,
    })

    // Extract object from result with type assertion
    const courseData = result.object as z.infer<typeof courseSchema>

    if (!courseData) {
      return { success: false, error: 'Failed to generate course content' }
    }

    const courseId = generateSlug(courseData.title)

    const autoImageUrl = await autoSelectImageFromTitle(courseData.title)

    // Save to in-memory store (for immediate access)
    courseStore.set(courseId, {
      title: courseData.title,
      description: courseData.description,
      content: courseData.content,
      originalContent: extractedText,
      tags: courseData.tags,
      keyPoints: courseData.keyPoints,
      estimatedReadTime: courseData.estimatedReadTime,
    })

    // Save to database
    const dbResult = await saveCourse({
      id: courseId,
      slug: courseId,
      title: courseData.title,
      description: courseData.description,
      content: courseData.content,
      originalContent: extractedText,
      tags: courseData.tags,
      keyPoints: courseData.keyPoints,
      estimatedReadTime: courseData.estimatedReadTime,
      price: courseData.price,
      imageUrl: autoImageUrl,
    })

    if (!dbResult.success) {
      console.error('Failed to save course to database:', dbResult.error)
    }

    return {
      success: true,
      data: {
        id: courseId,
        title: courseData.title,
        description: courseData.description,
        content: courseData.content,
        originalContent: extractedText,
        tags: courseData.tags,
        keyPoints: courseData.keyPoints,
        estimatedReadTime: courseData.estimatedReadTime,
        price: courseData.price,
      },
    }
  } catch (error) {
    console.error('Course generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

// Simple validation function for client-side use
export async function validatePDFFile(file: File): Promise<{ valid: boolean; error?: string }> {
  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'File must be a PDF' }
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' }
  }

  return { valid: true }
} 