import { db } from "@/db/drizzle"
import { user } from "@/db/schemas/auth-schema"
import { eq } from "drizzle-orm"

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const userRecord = await db
      .select({
        subscriptionStatus: user.subscriptionStatus,
        subscriptionEndsAt: user.subscriptionEndsAt,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1)

    if (userRecord.length === 0) {
      return false
    }

    const { subscriptionStatus, subscriptionEndsAt } = userRecord[0]

    // Check if subscription is active
    if (subscriptionStatus === "active") {
      // If there's an end date, make sure it's in the future
      if (subscriptionEndsAt) {
        return new Date() < subscriptionEndsAt
      }
      return true
    }

    return false
  } catch (error) {
    console.error("Error checking subscription status:", error)
    return false
  }
}

export async function getUserSubscription(userId: string) {
  try {
    const userRecord = await db
      .select({
        subscriptionId: user.subscriptionId,
        subscriptionStatus: user.subscriptionStatus,
        planType: user.planType,
        subscriptionEndsAt: user.subscriptionEndsAt,
        polarCustomerId: user.polarCustomerId,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1)

    return userRecord.length > 0 ? userRecord[0] : null
  } catch (error) {
    console.error("Error getting user subscription:", error)
    return null
  }
}
