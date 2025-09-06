import type { MetadataRoute } from "next";
import { getAllPublishedCourses } from "@/actions/course-db-actions";
import { blogPosts } from "@/constants/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.tryforged.me";

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  ];

  try {
    const courses = await getAllPublishedCourses();

    const courseRoutes = courses.map((course) => ({
      url: `${baseUrl}/${course.slug}`,
      lastModified: course.updatedAt || course.createdAt,
      changeFrequency: "monthly" as const,
      priority: 1,
    }));

    const blogRoutes = Object.values(blogPosts).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 1,
    }));

    return [...routes, ...courseRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return routes;
  }
}
