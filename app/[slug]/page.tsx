/* Next */
import { Metadata } from 'next'
import { notFound } from "next/navigation"

/* Actions */
import { getCourseWithUser } from "@/actions/course-db-actions"

/* Types */
import { CONTENT_TYPES } from "@/db/schemas/course-schema"

/* Components */
import CoursePage from "@/components/slug/course-page-client"

// ISR: Revalidate every hour (3600 seconds)
export const revalidate = 3600

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    
    try {
        const dbCourse = await getCourseWithUser(slug)
        
        if (!dbCourse || !dbCourse.published) {
            return {
                title: 'Course Not Found',
                description: 'The requested course could not be found.',
            }
        }

        const title = `${dbCourse.title} | Forged`
        const description = dbCourse.description || 'Discover premium educational content on Forged'
        const imageUrl = dbCourse.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop"
        const price = dbCourse.price / 100
        const url = `https://tryforged.vercel.app/${slug}`
        const contentType = dbCourse.contentType || CONTENT_TYPES.BLOG
        const isListicle = contentType === CONTENT_TYPES.LISTICLE
        const isCourse = contentType === CONTENT_TYPES.COURSE

        // Content-type aware keywords
        const getDefaultKeywords = () => {
            if (isCourse) return 'course, online learning, education, lessons, training, skill development'
            if (isListicle) return 'listicle, tips, guide, list, educational content'
            return 'education, learning, article, knowledge'
        }

        return {
            title,
            description,
            keywords: dbCourse.tags?.join(', ') || getDefaultKeywords(),
            authors: [{ name: dbCourse.userName }],
            creator: dbCourse.userName,
            publisher: 'Forged',
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },
            openGraph: {
                type: 'article', // Keep as article for all content types for better social media compatibility
                title,
                description,
                url,
                siteName: 'Forged',
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: title,
                    },
                ],
                authors: [dbCourse.userName],
                publishedTime: dbCourse.createdAt?.toISOString(),
                modifiedTime: dbCourse.updatedAt?.toISOString(),
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [imageUrl],
                creator: `@${dbCourse.userName}`,
                site: '@forged',
            },
            alternates: {
                canonical: url,
            },
            other: {
                'article:author': dbCourse.userName,
                'article:published_time': dbCourse.createdAt?.toISOString() || '',
                'article:modified_time': dbCourse.updatedAt?.toISOString() || '',
                'article:tag': dbCourse.tags?.join(', ') || '',
                'product:price:amount': price.toString(),
                'product:price:currency': 'USD',
            },
        }
    } catch (error) {
            console.error('Error generating metadata:', error)
        return {
            title: 'Course | Forged',
            description: 'Discover premium educational content on Forged',
        }
    }
}

export default async function BlogPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ access_code?: string }>
}) {
    const { slug } = await params
    const { access_code } = await searchParams

    const dbCourse = await getCourseWithUser(slug)
    
    if (!dbCourse.published) {
        notFound()
    }
    
    const contentType = dbCourse.contentType || CONTENT_TYPES.BLOG
    const isCourse = contentType === CONTENT_TYPES.COURSE
    
    // Calculate appropriate display time/info based on content type
    let displayTime = `${dbCourse.estimatedReadTime} min read`
    if (isCourse) {
        try {
            const courseContent = typeof dbCourse.content === 'string' 
                ? JSON.parse(dbCourse.content) 
                : dbCourse.content
            if (Array.isArray(courseContent)) {
                const lessonCount = courseContent.length
                displayTime = `${lessonCount} lesson${lessonCount !== 1 ? 's' : ''}`
            }
        } catch (error) {
            console.error('Failed to parse course content for lesson count:', error)
            displayTime = `Course • ${dbCourse.estimatedReadTime} min`
        }
    }
    
      const page = {
    id: dbCourse.id,
    title: dbCourse.title,
    description: dbCourse.description,
    price: dbCourse.price / 100,
    contentType,
    isPurchased: false,
    author: dbCourse.userName,
    readTime: displayTime,
    imageUrl: dbCourse.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    content: dbCourse.content,
    tags: dbCourse.tags,
    keyPoints: dbCourse.keyPoints,
    links: dbCourse.links || []
  }

    return (
        <CoursePage
            page={page} 
            accessCode={access_code} 
            slug={slug} 
            createdAt={dbCourse.createdAt} 
            updatedAt={dbCourse.updatedAt} 
        />
    )
}