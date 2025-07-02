import { z } from "zod"

export const blogSchema = z.object({
    title: z.string().describe('An engaging title for the blog post'),
    description: z.string().describe('A compelling description of the content'),
    content: z.string().describe('The complete blog post content in markdown format'),
    tags: z.array(z.string()).describe('Relevant tags for the content'),
    keyPoints: z.array(z.string()).describe('Key takeaways from the content'),
    estimatedReadTime: z.number().describe('Estimated reading time in minutes'),
    price: z.number().describe('Suggested price for this content in USD'),
})

export const listicleSchema = z.object({
    title: z.string().describe('A catchy, numbered title for the listicle (e.g., "7 Essential Tips for...")'),
    description: z.string().describe('A compelling description highlighting the value of the list'),
    content: z.string().describe('The complete listicle content in markdown format with numbered sections'),
    tags: z.array(z.string()).describe('Relevant tags for the content'),
    keyPoints: z.array(z.string()).describe('Key takeaways from the content'),
    estimatedReadTime: z.number().describe('Estimated reading time in minutes'),
    price: z.number().describe('Suggested price for this content in USD'),
})

export const courseSchema = z.object({
    title: z.string().describe('A clear, descriptive course title'),
    description: z.string().describe('A compelling description of what learners will achieve'),
    lessons: z.array(z.object({
        title: z.string().describe('Clear lesson title'),
        content: z.string().describe('Lesson content in markdown format'),
        quiz: z.object({
            question: z.string().describe('Clear, focused question about the lesson'),
            options: z.array(z.string()).length(4).describe('Exactly 4 answer choices'),
            correctAnswer: z.number().min(0).max(3).describe('Index of correct answer (0-3)'),
        }).describe('Quiz for the lesson')
    })).describe('Array of course lessons with quizzes'),
    tags: z.array(z.string()).describe('Relevant educational tags'),
    keyPoints: z.array(z.string()).describe('Main learning outcomes'),
    estimatedReadTime: z.number().describe('Total course completion time in minutes'),
    price: z.number().describe('Suggested price for this content in USD'),
})

export type BlogData = z.infer<typeof blogSchema>
export type ListicleData = z.infer<typeof listicleSchema>
export type CourseData = z.infer<typeof courseSchema>