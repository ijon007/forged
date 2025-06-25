// Simple in-memory store for generated courses
// In a production app, this would be replaced with a database
import type { CourseLink } from "@/db/schemas/course-schema"

interface GeneratedCourse {
  id: string
  title: string
  description: string
  content: string
  originalContent: string
  tags: string[]
  keyPoints: string[]
  links?: CourseLink[]
  estimatedReadTime: number
  createdAt: Date
}

class CourseStore {
  private courses: Map<string, GeneratedCourse> = new Map()

  set(id: string, course: Omit<GeneratedCourse, 'id' | 'createdAt'>) {
    this.courses.set(id, {
      ...course,
      id,
      createdAt: new Date(),
    })
  }

  get(id: string): GeneratedCourse | undefined {
    return this.courses.get(id)
  }

  getAll(): GeneratedCourse[] {
    return Array.from(this.courses.values())
  }

  delete(id: string): boolean {
    return this.courses.delete(id)
  }

  clear() {
    this.courses.clear()
  }
}

// Global instance
export const courseStore = new CourseStore()

// Helper function to format course data for preview
export function formatCourseForPreview(course: GeneratedCourse, priceInCents?: number) {
  // Convert price from cents to dollars, default to 19.99 if not provided
  const price = priceInCents ? priceInCents / 100 : 19.99
  
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    price: price,
    slug: `generated-${course.id}`,
    status: 'draft' as const,
    originalContent: course.originalContent,
    generatedContent: course.content,
    tags: course.tags,
    keyPoints: course.keyPoints,
    links: course.links || [],
    estimatedReadTime: course.estimatedReadTime,
    author: 'AI Generated',
    createdAt: course.createdAt.toISOString(),
  }
} 