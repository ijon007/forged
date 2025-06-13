"use server"

import { google } from '@ai-sdk/google'
import { generateObject, zodSchema } from 'ai'
import { z } from 'zod'
import { courseStore } from '@/lib/course-store'

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
      system: `You are an expert content creator and educator. Your task is to transform PDF content into an engaging, well-structured blog post.

IMPORTANT: You must return a JSON object with EXACTLY these field names:
- title: string (engaging title)
- description: string (compelling description)
- content: string (complete blog post in markdown)
- tags: array of strings (relevant tags)
- keyPoints: array of strings (key takeaways)
- estimatedReadTime: number (reading time in minutes)
- price: number (price in USD as a number, not string)

Requirements:
- Create an engaging title that captures the essence of the content
- Write a compelling description that would make someone want to read more
- Transform the content into a well-formatted blog post with proper markdown structure
- Use markdown formatting for headers, lists, emphasis, etc.
- Make the content engaging and easy to read
- Extract 3-5 key takeaways as keyPoints
- Estimate a realistic reading time based on word count
- Set a fair price as a number (e.g., 5 for $5, not "$5")
- Include 3-5 relevant tags

The user provided these preferences:
- Title preference: ${title || 'Not specified'}
- Description preference: ${description || 'Not specified'}
- Price point: $${price || 'Not specified'}

Use these as guidance but prioritize creating the best possible content.`,
      prompt: `Please analyze this PDF content and generate a comprehensive blog post:

${extractedText}

Transform this into an engaging blog post that:
1. Has a clear structure with proper headings
2. Is easy to read and engaging
3. Maintains the original information while making it more accessible
4. Includes relevant examples or analogies where appropriate
5. Has a strong introduction and conclusion

Remember to output the exact field names specified in the schema: title, description, content, tags, keyPoints, estimatedReadTime, and price.`,
    })

    // Extract object from result with type assertion
    const courseData = result.object as z.infer<typeof courseSchema>

    if (!courseData) {
      return { success: false, error: 'Failed to generate course content' }
    }

    // Generate a unique ID for the course
    const courseId = Date.now().toString()

    // Save to store
    courseStore.set(courseId, {
      title: courseData.title,
      description: courseData.description,
      content: courseData.content,
      originalContent: extractedText,
      tags: courseData.tags,
      keyPoints: courseData.keyPoints,
      estimatedReadTime: courseData.estimatedReadTime,
    })

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