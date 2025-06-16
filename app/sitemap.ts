import { MetadataRoute } from 'next'
import { getCourseWithUser } from '@/actions/course-db-actions'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://knowledgesmith.vercel.app'
  
  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
  ]

  try {
    // You'll need to implement a function to get all published courses
    // For now, this is a placeholder structure
    // Replace this with actual database query to get all published courses
    const courses = [] // await getAllPublishedCourses()
    
    const courseRoutes = courses.map((course: any) => ({
      url: `${baseUrl}/${course.slug}`,
      lastModified: course.updatedAt || course.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    return [...routes, ...courseRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return routes
  }
} 