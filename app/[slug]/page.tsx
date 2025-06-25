/* Next */
import { Metadata } from 'next'
import { notFound } from "next/navigation"

/* Actions */
import { getCourseWithUser } from "@/actions/course-db-actions"

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

        return {
            title,
            description,
            keywords: dbCourse.tags?.join(', ') || 'education, learning, course, knowledge',
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
                type: 'article',
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
    
    const page = {
        id: dbCourse.id,
        title: dbCourse.title,
        description: dbCourse.description,
        price: dbCourse.price / 100,
        isPurchased: false,
        author: dbCourse.userName,
        readTime: `${dbCourse.estimatedReadTime} min read`,
        imageUrl: dbCourse.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
        content: dbCourse.content,
        tags: dbCourse.tags,
        keyPoints: dbCourse.keyPoints
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