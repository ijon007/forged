"use server"

/* AI */
import { google } from '@ai-sdk/google'
import { generateObject, zodSchema } from 'ai'

/* Zod */
import { z } from 'zod'

/* Actions */
import { courseStore } from '@/lib/course-store'
import { saveCourse } from './course-db-actions'

/* Types */
import { ContentType, CONTENT_TYPES } from '@/db/schemas/course-schema'

/* Utils */
import { generateSlug } from '@/utils/slug'
import { autoSelectImageFromTitle } from '@/lib/unsplash-api'
import { getBlogPrompt, getBlogSystemPrompt, getListiclePrompt, getListicleSystemPrompt } from '@/utils/prompts'

export interface CourseGenerationResult {
  success: boolean
  data?: {
    id: string
    title: string
    description: string
    content: string
    originalContent: string
    contentType: ContentType
    tags: string[]
    keyPoints: string[]
    estimatedReadTime: number
    price: number
  }
  error?: string
}

export async function generateCourseFromPDF(formData: FormData): Promise<CourseGenerationResult> {
    try {
        const file = formData.get('file') as File
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const price = formData.get('price') as string
        const contentType = (formData.get('contentType') as ContentType) || CONTENT_TYPES.BLOG

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

        const blogSchema = z.object({
            title: z.string().describe('An engaging title for the blog post'),
            description: z.string().describe('A compelling description of the content'),
            content: z.string().describe('The complete blog post content in markdown format'),
            tags: z.array(z.string()).describe('Relevant tags for the content'),
            keyPoints: z.array(z.string()).describe('Key takeaways from the content'),
            estimatedReadTime: z.number().describe('Estimated reading time in minutes'),
            price: z.number().describe('Suggested price for this content in USD'),
        })

        const listicleSchema = z.object({
            title: z.string().describe('A catchy, numbered title for the listicle (e.g., "7 Essential Tips for...")'),
            description: z.string().describe('A compelling description highlighting the value of the list'),
            content: z.string().describe('The complete listicle content in markdown format with numbered sections'),
            tags: z.array(z.string()).describe('Relevant tags for the content'),
            keyPoints: z.array(z.string()).describe('Key takeaways from the content'),
            estimatedReadTime: z.number().describe('Estimated reading time in minutes'),
            price: z.number().describe('Suggested price for this content in USD'),
        })

        const schema = contentType === CONTENT_TYPES.LISTICLE ? listicleSchema : blogSchema

        // Generate structured course content using generateObject
        const systemPrompt = contentType === CONTENT_TYPES.LISTICLE ? 
            getListicleSystemPrompt(title, description, price) : 
            getBlogSystemPrompt(title, description, price)

        const promptText = contentType === CONTENT_TYPES.LISTICLE ? 
            getListiclePrompt(extractedText) : 
            getBlogPrompt(extractedText)

        const result = await generateObject({
            model: google('gemini-2.0-flash'),
            schema: zodSchema(schema),
            system: systemPrompt,
            prompt: promptText,
        })

        const courseData = result.object as z.infer<typeof schema>

        if (!courseData) {
            return { success: false, error: 'Failed to generate course content' }
        }

        const courseId = generateSlug(courseData.title)

        const autoImageUrl = await autoSelectImageFromTitle(courseData.title)

        courseStore.set(courseId, {
            title: courseData.title,
            description: courseData.description,
            content: courseData.content,
            originalContent: extractedText,
            contentType: contentType,
            tags: courseData.tags,
            keyPoints: courseData.keyPoints,
            estimatedReadTime: courseData.estimatedReadTime,
        })

        const dbResult = await saveCourse({
            id: courseId,
            slug: courseId,
            title: courseData.title,
            description: courseData.description,
            content: courseData.content,
            originalContent: extractedText,
            contentType: contentType,
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
                contentType: contentType,
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

export async function validatePDFFile(file: File): Promise<{ valid: boolean; error?: string }> {
    if (!file) {
        return { valid: false, error: 'No file provided' }
    }

    if (file.type !== 'application/pdf') {
        return { valid: false, error: 'File must be a PDF' }
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
        return { valid: false, error: 'File size must be less than 10MB' }
    }

    return { valid: true }
} 