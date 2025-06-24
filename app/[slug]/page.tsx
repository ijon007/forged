import { notFound } from "next/navigation"
import { getCourseWithUser, hasUserPurchasedCourse } from "@/actions/course-db-actions"
import { Metadata } from 'next'
import PublishedContent from "@/components/slug/content"
import CourseHeader from "@/components/slug/course-header"
import CourseSidebar from "@/components/slug/course-sidebar"
import CourseJsonLd from "@/components/slug/course-json-ld"
import PoweredByBadge from "@/components/slug/powered-by-badge"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

// ISR: Revalidate every hour (3600 seconds)
export const revalidate = 3600

// Generate metadata for SEO
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

    const title = `${dbCourse.title} | Knowledgesmith`
    const description = dbCourse.description || 'Discover premium educational content on Knowledgesmith'
    const imageUrl = dbCourse.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop"
    const price = dbCourse.price / 100
    const url = `https://knowledgesmith.vercel.app/${slug}`

    return {
      title,
      description,
      keywords: dbCourse.tags?.join(', ') || 'education, learning, course, knowledge',
      authors: [{ name: dbCourse.userName }],
      creator: dbCourse.userName,
      publisher: 'Knowledgesmith',
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
        siteName: 'Knowledgesmith',
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
        site: '@knowledgesmith',
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
      title: 'Course | Knowledgesmith',
      description: 'Discover premium educational content on Knowledgesmith',
    }
  }
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { slug } = await params
  const { token } = await searchParams

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

  if (!token) {
    return (
      <>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8 w-11/12 lg:w-10/12">
            <CourseHeader
              title={page.title}
              description={page.description}
              author={page.author}
              readTime={page.readTime}
              imageUrl={page.imageUrl}
            />
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <PublishedContent page={page} />
              </div>
              <CourseSidebar
                price={page.price}
                keyPoints={page.keyPoints}
                tags={page.tags}
                isPurchased={page.isPurchased}
                courseId={slug}
              />
            </div>
          </div>
          <PoweredByBadge />
        </div>
      </>
    );
  }

  page.isPurchased = true;

  return (
    <>
      {/* JSON-LD structured data */}
      <CourseJsonLd
        title={page.title}
        description={page.description}
        imageUrl={page.imageUrl}
        author={page.author}
        slug={slug}
        tags={page.tags}
        price={page.price}
        createdAt={dbCourse.createdAt}
        updatedAt={dbCourse.updatedAt}
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 w-11/12 lg:w-10/12">
          
          <CourseHeader
            title={page.title}
            description={page.description}
            author={page.author}
            readTime={page.readTime}
            imageUrl={page.imageUrl}
          />

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <PublishedContent page={page} />
            </div>

            <CourseSidebar
              price={page.price}
              keyPoints={page.keyPoints}
              tags={page.tags}
              isPurchased={page.isPurchased}
              courseId={slug}
            />
          </div>
        </div>

        <PoweredByBadge />
      </div>
    </>
  )
}