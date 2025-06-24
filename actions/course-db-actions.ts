"use server"

/* Next */
import { headers } from "next/headers"

/* DB */
import { db } from "@/db/drizzle"
import { course, coursePurchase, type NewCourse, type Course } from "@/db/schemas/course-schema"
import { eq, desc, and } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { user } from "@/db/schemas/auth-schema"

/* Polar */
import { createPolarProduct, createCheckoutLink } from "./polar-actions"

/* Utils */
import { getURL } from "@/utils/helpers"
import { generateToken, generateAccessCode } from "@/utils/token";

/* Types */
export interface SaveCourseParams {
  id: string
  slug: string
  title: string
  description: string
  content: string
  originalContent: string
  tags: string[]
  keyPoints: string[]
  estimatedReadTime: number
  price: number
  imageUrl?: string
}

export interface UpdateCourseParams {
  id: string
  title?: string
  description?: string
  price?: number
  imageUrl?: string
}

export async function saveCourse(courseData: SaveCourseParams): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user session
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' }
    }

    // Convert price to cents for storage
    const priceInCents = Math.round(courseData.price * 100)

    // Try to create Polar product first
    let polarProductId: string | undefined
    let polarProductSlug: string | undefined

    try {
      const polarResult = await createPolarProduct({
        name: courseData.title,
        description: courseData.description,
        price: priceInCents
      })

      if (polarResult.success && polarResult.data) {
        polarProductId = polarResult.data.productId
        polarProductSlug = courseData.slug
      }
    } catch (error) {
      console.error('Error creating Polar product:', error)
      // Continue with course creation even if Polar product creation fails
    }

    const newCourse: NewCourse = {
      id: courseData.id,
      slug: courseData.slug,
      title: courseData.title,
      description: courseData.description,
      content: courseData.content,
      originalContent: courseData.originalContent,
      tags: courseData.tags,
      keyPoints: courseData.keyPoints,
      estimatedReadTime: courseData.estimatedReadTime,
      price: priceInCents,
      imageUrl: courseData.imageUrl,
      published: false,
      userId: session.user.id,
      polarProductId: polarProductId,
      polarProductSlug: polarProductSlug,
    }

    await db.insert(course).values(newCourse)

    return { success: true }
  } catch (error) {
    console.error('❌ Error saving course:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save course' 
    }
  }
}

export async function updateCourse(courseData: UpdateCourseParams): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user session
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' }
    }

    // Check if course exists and belongs to user
    const existingCourse = await getCourse(courseData.id)
    if (!existingCourse) {
      return { success: false, error: 'Course not found' }
    }

    if (existingCourse.userId !== session.user.id) {
      return { success: false, error: 'Not authorized to update this course' }
    }

    // Prepare update data
    const updateData: Partial<Course> = {
      updatedAt: new Date(),
    }

    if (courseData.title !== undefined) {
      updateData.title = courseData.title
    }
    if (courseData.description !== undefined) {
      updateData.description = courseData.description
    }
    if (courseData.price !== undefined) {
      updateData.price = Math.round(courseData.price * 100) // Convert to cents
    }
    if (courseData.imageUrl !== undefined) {
      updateData.imageUrl = courseData.imageUrl
    }

    await db.update(course)
      .set(updateData)
      .where(eq(course.id, courseData.id))

    return { success: true }
  } catch (error) {
    console.error('Error updating course:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update course' 
    }
  }
}

export async function publishCourse(courseId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user session
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' }
    }

    // Check if course exists and belongs to user
    const existingCourse = await getCourse(courseId)
    if (!existingCourse) {
      return { success: false, error: 'Course not found' }
    }

    if (existingCourse.userId !== session.user.id) {
      return { success: false, error: 'Not authorized to publish this course' }
    }

    // Update course to published status
    await db.update(course)
      .set({ 
        published: true,
        updatedAt: new Date()
      })
      .where(eq(course.id, courseId))

    return { success: true }
  } catch (error) {
    console.error('Error publishing course:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to publish course' 
    }
  }
}

export async function unpublishCourse(courseId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user session
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' }
    }

    // Check if course exists and belongs to user
    const existingCourse = await getCourse(courseId)
    if (!existingCourse) {
      return { success: false, error: 'Course not found' }
    }

    if (existingCourse.userId !== session.user.id) {
      return { success: false, error: 'Not authorized to unpublish this course' }
    }

    // Update course to unpublished status
    await db.update(course)
      .set({ 
        published: false,
        updatedAt: new Date()
      })
      .where(eq(course.id, courseId))

    return { success: true }
  } catch (error) {
    console.error('Error unpublishing course:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to unpublish course' 
    }
  }
}

export async function getCourse(courseId: string): Promise<Course | null> {
  try {
    const result = await db
      .select()
      .from(course)
      .where(eq(course.id, courseId))
      .limit(1)

    return result[0] || null
  } catch (error) {
    console.error('Error getting course:', error)
    return null
  }
}

export async function getCourseWithUser(courseId: string): Promise<(Course & { userName: string })> {
  try {
    const result = await db
      .select({
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        content: course.content,
        originalContent: course.originalContent,
        tags: course.tags,
        keyPoints: course.keyPoints,
        estimatedReadTime: course.estimatedReadTime,
        price: course.price,
        imageUrl: course.imageUrl,
        published: course.published,
        polarProductId: course.polarProductId,
        polarProductSlug: course.polarProductSlug,
        userId: course.userId,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        userName: user.name,
      })
      .from(course)
      .leftJoin(user, eq(course.userId, user.id))
      .where(eq(course.id, courseId))
      .limit(1)

    const courseData = result[0]
    if (!courseData) throw new Error('Course not found')

    return {
      ...courseData,
      userName: courseData.userName || 'Anonymous'
    }
  } catch (error) {
    throw new Error('Failed to get course with user: ' + error)
  }
}

export async function getUserCourses(userId?: string): Promise<Course[]> {
  try {
    let targetUserId = userId

    // If no userId provided, get from current session
    if (!targetUserId) {
      const session = await auth.api.getSession({
        headers: await headers()
      })

      if (!session?.user?.id) {
        return []
      }
      targetUserId = session.user.id
    }

    const result = await db
      .select()
      .from(course)
      .where(eq(course.userId, targetUserId))
      .orderBy(desc(course.createdAt))

    return result
  } catch (error) {
    console.error('Error getting user courses:', error)
    return []
  }
}

export async function deleteCourse(courseId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' }
    }

    // First check if the course exists and belongs to the user
    const existingCourse = await db
      .select()
      .from(course)
      .where(eq(course.id, courseId))
      .limit(1)

    if (!existingCourse[0]) {
      return { success: false, error: 'Course not found' }
    }

    if (existingCourse[0].userId !== session.user.id) {
      return { success: false, error: 'Not authorized to delete this course' }
    }

    await db.delete(course).where(eq(course.id, courseId))

    return { success: true }
  } catch (error) {
    console.error('Error deleting course:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete course' 
    }
  }
}

export async function getAllPublishedCourses(): Promise<{ slug: string; createdAt: Date; updatedAt: Date | null }[]> {
  try {
    const result = await db
      .select({
        slug: course.slug,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      })
      .from(course)
      .where(eq(course.published, true))
      .orderBy(desc(course.updatedAt))

    return result
  } catch (error) {
    console.error('Error getting published courses:', error)
    return []
  }
}

export async function getCourseCheckoutUrl(courseId: string): Promise<{ success: boolean; checkoutUrl?: string; error?: string }> {
  try {
    const courseData = await db.select({
      polarProductId: course.polarProductId,
      title: course.title,
      price: course.price,
      slug: course.slug,
    })
    .from(course)
    .where(eq(course.id, courseId))
    .limit(1);

    if (!courseData.length) {
      return { success: false, error: 'Course not found' };
    }

    const courseInfo = courseData[0];

    if (!courseInfo.polarProductId) {
      return { success: false, error: 'No Polar product associated with this course' };
    }

    let accessCode = generateAccessCode();
    let attempts = 0;
    
    while (attempts < 5) {
      try {
        await db.insert(coursePurchase).values({
          id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: "anonymous",
          courseId: courseId,
          accessCode: accessCode,
        });
        break;
      } catch (error) {
        accessCode = generateAccessCode();
        attempts++;
      }
    }

    const successUrl = `${getURL(`/${courseInfo.slug}`)}?access_code=${accessCode}`;
    const checkoutResult = await createCheckoutLink(courseInfo.polarProductId, successUrl);

    if (!checkoutResult.success) {
      return { success: false, error: checkoutResult.error };
    }

    return {
      success: true,
      checkoutUrl: checkoutResult.data?.checkoutUrl
    };

  } catch (error) {
    console.error('Error getting checkout URL:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get checkout URL'
    };
  }
}

export async function checkFirstTimeAccess(courseId: string, accessCode: string): Promise<{ success: boolean; isFirstTime?: boolean; error?: string }> {
  try {
    const purchase = await db.select()
      .from(coursePurchase)
      .where(and(eq(coursePurchase.courseId, courseId), eq(coursePurchase.accessCode, accessCode)))
      .limit(1);

    if (purchase.length === 0) {
      return { success: false, error: 'Invalid access code' };
    }

    const isFirstTime = !purchase[0].polarOrderId;
    return { success: true, isFirstTime };
  } catch (error) {
    console.error('Error checking first time access:', error);
    return { success: false, error: 'Failed to check access' };
  }
}

export async function validateAccessCode(courseId: string, accessCode: string): Promise<{ success: boolean; error?: string }> {
  try {
    const purchase = await db.select()
      .from(coursePurchase)
      .where(and(eq(coursePurchase.courseId, courseId), eq(coursePurchase.accessCode, accessCode)))
      .limit(1);

    if (purchase.length === 0) {
      return { success: false, error: 'Invalid access code' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error validating access code:', error);
    return { success: false, error: 'Failed to validate access code' };
  }
}
