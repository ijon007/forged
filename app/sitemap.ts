import { MetadataRoute } from 'next'
import { getAllPublishedCourses } from '@/actions/course-db-actions'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tryforged.vercel.app'
  
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
    // Get all published courses
    const courses = await getAllPublishedCourses()
    
    const courseRoutes = courses.map((course) => ({
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