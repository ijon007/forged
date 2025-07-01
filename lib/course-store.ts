import { type CourseLink, type ContentType, CONTENT_TYPES } from "@/db/schemas/course-schema"

interface GeneratedCourse {
    id: string
    title: string
    description: string
    content: string
    originalContent: string
    contentType: ContentType
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

export const courseStore = new CourseStore()

export function formatCourseForPreview(course: GeneratedCourse, priceInCents?: number) {
    const price = priceInCents ? priceInCents / 100 : 19.99
    
    return {
        id: course.id,
        title: course.title,
        description: course.description,
        price: price,
        contentType: course.contentType,
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

export function getContentTypeLabel(contentType: ContentType): string {
    switch (contentType) {
        case CONTENT_TYPES.BLOG:
            return 'Blog Post'
        case CONTENT_TYPES.LISTICLE:
            return 'Listicle'
        case CONTENT_TYPES.COURSE:
            return 'Course'
        default:
            return 'Blog Post'
    }
}

export function getContentTypeDescription(contentType: ContentType): string {
    switch (contentType) {
        case CONTENT_TYPES.BLOG:
            return 'A comprehensive blog post with detailed content'
        case CONTENT_TYPES.LISTICLE:
            return 'A list-based article with numbered points'
        case CONTENT_TYPES.COURSE:
            return 'An educational course with lessons and quizzes'
        default:
            return 'A comprehensive blog post with detailed content'
    }
} 