"use server";

import { and, desc, eq, isNull } from "drizzle-orm";

/* Next */
import { headers } from "next/headers";
/* React */
import { cache } from "react";
/* DB */
import { db } from "@/db/drizzle";
import { user } from "@/db/schemas/auth-schema";
import {
  type ContentType,
  type Course,
  type CourseContent,
  type CourseLink,
  course,
  coursePurchase,
  type NewCourse,
} from "@/db/schemas/course-schema";
import { auth } from "@/lib/auth";
/* Utils */
import { getURL } from "@/utils/helpers";
import { generateAccessCode } from "@/utils/token";
/* Polar */
import {
  archivePolarProduct,
  createCheckoutLink,
  createPolarProduct,
} from "./polar-actions";

/* Types */
export interface SaveCourseParams {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: CourseContent;
  originalContent: CourseContent;
  contentType: ContentType;
  tags: string[];
  keyPoints: string[];
  links?: CourseLink[];
  estimatedReadTime: number;
  price: number;
  imageUrl?: string;
}

export interface UpdateCourseParams {
  id: string;
  title?: string;
  description?: string;
  content?: CourseContent;
  originalContent?: CourseContent;
  price?: number;
  imageUrl?: string;
  links?: CourseLink[];
}

export async function saveCourse(
  courseData: SaveCourseParams
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    // Convert price to cents for storage
    const priceInCents = Math.round(courseData.price * 100);

    // Try to create Polar product first
    let polarProductId: string | undefined;
    let polarProductSlug: string | undefined;

    try {
      const polarResult = await createPolarProduct({
        name: courseData.title,
        description: courseData.description,
        price: priceInCents,
      });

      if (polarResult.success && polarResult.data) {
        polarProductId = polarResult.data.productId;
        polarProductSlug = courseData.slug;
      }
    } catch (error) {
      console.error("Error creating Polar product:", error);
      // Continue with course creation even if Polar product creation fails
    }

    const newCourse: NewCourse = {
      id: courseData.id,
      slug: courseData.slug,
      title: courseData.title,
      description: courseData.description,
      content: courseData.content,
      originalContent: courseData.originalContent,
      contentType: courseData.contentType,
      tags: courseData.tags,
      keyPoints: courseData.keyPoints,
      links: courseData.links || [],
      estimatedReadTime: courseData.estimatedReadTime,
      price: priceInCents,
      imageUrl: courseData.imageUrl,
      published: false,
      userId: session.user.id,
      polarProductId,
      polarProductSlug,
    };

    await db.insert(course).values(newCourse);

    return { success: true };
  } catch (error) {
    console.error("❌ Error saving course:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save course",
    };
  }
}

export async function updateCourse(
  courseData: UpdateCourseParams
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    // Check if course exists and belongs to user
    const existingCourse = await getCourse(courseData.id);
    if (!existingCourse) {
      return { success: false, error: "Course not found" };
    }

    if (existingCourse.userId !== session.user.id) {
      return { success: false, error: "Not authorized to update this course" };
    }

    // Prepare update data
    const updateData: Partial<Course> = {
      updatedAt: new Date(),
    };

    if (courseData.title !== undefined) {
      updateData.title = courseData.title;
    }
    if (courseData.description !== undefined) {
      updateData.description = courseData.description;
    }
    if (courseData.content !== undefined) {
      updateData.content = courseData.content;
    }
    if (courseData.originalContent !== undefined) {
      updateData.originalContent = courseData.originalContent;
    }
    if (courseData.price !== undefined) {
      updateData.price = Math.round(courseData.price * 100); // Convert to cents
    }
    if (courseData.imageUrl !== undefined) {
      updateData.imageUrl = courseData.imageUrl;
    }
    if (courseData.links !== undefined) {
      updateData.links = courseData.links;
    }

    await db.update(course).set(updateData).where(eq(course.id, courseData.id));

    return { success: true };
  } catch (error) {
    console.error("Error updating course:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update course",
    };
  }
}

export async function publishCourse(
  courseId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    // Check if course exists and belongs to user
    const existingCourse = await getCourse(courseId);
    if (!existingCourse) {
      return { success: false, error: "Course not found" };
    }

    if (existingCourse.userId !== session.user.id) {
      return { success: false, error: "Not authorized to publish this course" };
    }

    // Update course to published status
    await db
      .update(course)
      .set({
        published: true,
        updatedAt: new Date(),
      })
      .where(eq(course.id, courseId));

    return { success: true };
  } catch (error) {
    console.error("Error publishing course:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to publish course",
    };
  }
}

export async function unpublishCourse(
  courseId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    // Check if course exists and belongs to user
    const existingCourse = await getCourse(courseId);
    if (!existingCourse) {
      return { success: false, error: "Course not found" };
    }

    if (existingCourse.userId !== session.user.id) {
      return {
        success: false,
        error: "Not authorized to unpublish this course",
      };
    }

    // Update course to unpublished status
    await db
      .update(course)
      .set({
        published: false,
        updatedAt: new Date(),
      })
      .where(eq(course.id, courseId));

    return { success: true };
  } catch (error) {
    console.error("Error unpublishing course:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to unpublish course",
    };
  }
}

export async function getCourse(courseId: string): Promise<Course | null> {
  try {
    const result = await db
      .select()
      .from(course)
      .where(eq(course.id, courseId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("Error getting course:", error);
    return null;
  }
}

export async function getCourseWithUser(
  courseId: string
): Promise<Course & { userName: string }> {
  try {
    const result = await db
      .select({
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        content: course.content,
        originalContent: course.originalContent,
        contentType: course.contentType,
        tags: course.tags,
        keyPoints: course.keyPoints,
        links: course.links,
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
      .limit(1);

    const courseData = result[0];
    if (!courseData) throw new Error("Course not found");

    return {
      ...courseData,
      userName: courseData.userName || "Anonymous",
    };
  } catch (error) {
    throw new Error("Failed to get course with user: " + error);
  }
}

export const getUserCourses = cache(
  async (userId?: string): Promise<Course[]> => {
    try {
      let targetUserId = userId;

      // If no userId provided, get from current session
      if (!targetUserId) {
        const session = await auth.api.getSession({
          headers: await headers(),
        });

        if (!session?.user?.id) {
          return [];
        }
        targetUserId = session.user.id;
      }

      const result = await db
        .select()
        .from(course)
        .where(eq(course.userId, targetUserId))
        .orderBy(desc(course.createdAt));

      return result;
    } catch (error) {
      console.error("Error getting user courses:", error);
      return [];
    }
  }
);

export async function deleteCourse(
  courseId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    const existingCourse = await db
      .select()
      .from(course)
      .where(eq(course.id, courseId))
      .limit(1);

    if (!existingCourse[0]) {
      return { success: false, error: "Course not found" };
    }

    if (existingCourse[0].userId !== session.user.id) {
      return { success: false, error: "Not authorized to delete this course" };
    }

    if (existingCourse[0].polarProductId) {
      try {
        await archivePolarProduct(existingCourse[0].polarProductId);
      } catch (error) {
        console.error("Error archiving Polar product:", error);
      }
    }

    await db.delete(course).where(eq(course.id, courseId));

    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete course",
    };
  }
}

export async function getAllPublishedCourses(): Promise<
  { slug: string; createdAt: Date; updatedAt: Date | null }[]
> {
  try {
    const result = await db
      .select({
        slug: course.slug,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      })
      .from(course)
      .where(eq(course.published, true))
      .orderBy(desc(course.updatedAt));

    return result;
  } catch (error) {
    console.error("Error getting published courses:", error);
    return [];
  }
}

export async function getCourseCheckoutUrl(
  courseId: string
): Promise<{ success: boolean; checkoutUrl?: string; error?: string }> {
  try {
    console.log(`🛒 Creating checkout for course: ${courseId}`);

    const courseData = await db
      .select({
        polarProductId: course.polarProductId,
        title: course.title,
        price: course.price,
        slug: course.slug,
      })
      .from(course)
      .where(eq(course.id, courseId))
      .limit(1);

    if (!courseData.length) {
      return { success: false, error: "Course not found" };
    }

    const courseInfo = courseData[0];

    if (!courseInfo.polarProductId) {
      return {
        success: false,
        error: "No Polar product associated with this course",
      };
    }

    let accessCode = generateAccessCode();
    let attempts = 0;

    console.log(`🎫 Generated access code: ${accessCode}`);

    while (attempts < 5) {
      try {
        console.log(
          `📝 Attempting to create purchase record (attempt ${attempts + 1})`
        );

        await db.insert(coursePurchase).values({
          id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: null, // Anonymous purchase
          courseId,
          accessCode,
        });

        console.log("✅ Purchase record created successfully");
        break;
      } catch (error) {
        console.error(
          `❌ Purchase creation failed (attempt ${attempts + 1}):`,
          error
        );
        accessCode = generateAccessCode();
        attempts++;
      }
    }

    if (attempts >= 5) {
      console.error("❌ Failed to create purchase record after 5 attempts");
      return { success: false, error: "Failed to create purchase record" };
    }

    const successUrl = `${getURL(`/${courseInfo.slug}`)}?access_code=${accessCode}`;
    console.log(`🔗 Success URL: ${successUrl}`);

    const checkoutResult = await createCheckoutLink(
      courseInfo.polarProductId,
      successUrl
    );

    if (!checkoutResult.success) {
      return { success: false, error: checkoutResult.error };
    }

    console.log("🎉 Checkout URL created successfully");
    return {
      success: true,
      checkoutUrl: checkoutResult.data?.checkoutUrl,
    };
  } catch (error) {
    console.error("❌ Error getting checkout URL:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get checkout URL",
    };
  }
}

export async function validateAccessCode(
  courseId: string,
  accessCode: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(
      `🔍 Validating access code: courseId=${courseId}, accessCode=${accessCode}`
    );

    const purchase = await db
      .select()
      .from(coursePurchase)
      .where(
        and(
          eq(coursePurchase.courseId, courseId),
          eq(coursePurchase.accessCode, accessCode)
        )
      )
      .limit(1);

    console.log(`📊 Found ${purchase.length} matching purchases`);

    if (purchase.length === 0) {
      console.log(`❌ No valid purchase found for access code: ${accessCode}`);
      return { success: false, error: "Invalid access code" };
    }

    console.log("✅ Valid access code found");
    return { success: true };
  } catch (error) {
    console.error("❌ Error validating access code:", error);
    return { success: false, error: "Failed to validate access code" };
  }
}

export async function updateCourseLinks(
  courseId: string,
  links: CourseLink[]
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    // Check if course exists and belongs to user
    const existingCourse = await getCourse(courseId);
    if (!existingCourse) {
      return { success: false, error: "Course not found" };
    }

    if (existingCourse.userId !== session.user.id) {
      return { success: false, error: "Not authorized to update this course" };
    }

    // Update course links
    await db
      .update(course)
      .set({
        links,
        updatedAt: new Date(),
      })
      .where(eq(course.id, courseId));

    return { success: true };
  } catch (error) {
    console.error("Error updating course links:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update course links",
    };
  }
}

export async function markPurchaseCompleted(
  courseId: string,
  accessCode: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(
      `✅ Marking purchase as completed: courseId=${courseId}, accessCode=${accessCode}`
    );

    await db
      .update(coursePurchase)
      .set({
        polarOrderId: `completed_${Date.now()}`,
        purchaseDate: new Date(),
      })
      .where(
        and(
          eq(coursePurchase.courseId, courseId),
          eq(coursePurchase.accessCode, accessCode),
          isNull(coursePurchase.userId) // Only update anonymous (null userId) purchases
        )
      );

    console.log("✅ Purchase marked as completed successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Error marking purchase as completed:", error);
    return { success: false, error: "Failed to mark purchase as completed" };
  }
}
