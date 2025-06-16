import { db } from '@/db/drizzle';
import { user } from '@/db/schemas/auth-schema';
import { eq } from 'drizzle-orm';

export async function getUserSubscription(userId: string) {
  const users = await db
    .select({
      polarCustomerId: user.polarCustomerId,
      subscriptionId: user.subscriptionId,
      subscriptionStatus: user.subscriptionStatus,
      planType: user.planType,
      subscriptionEndsAt: user.subscriptionEndsAt,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  return users[0] || null;
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription || !subscription.subscriptionStatus) {
    return false;
  }

  // Check if subscription is active and not expired
  const isActive = subscription.subscriptionStatus === 'active';
  const notExpired = !subscription.subscriptionEndsAt || subscription.subscriptionEndsAt > new Date();

  return isActive && notExpired;
}

export async function updateUserPolarCustomerId(userId: string, polarCustomerId: string) {
  await db
    .update(user)
    .set({
      polarCustomerId,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId));
} 