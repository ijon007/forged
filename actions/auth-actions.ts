"use server";

/* React */
import { cache } from "react";

/* Next */
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { user } from "@/db/schemas/auth-schema";
import { eq } from "drizzle-orm";

/* Utils */
import { 
    isSubscriptionActive, 
    isSubscriptionExpired,
    type SubscriptionDetails,
    type SubscriptionStatus,
    type PlanType
} from "@/utils/subscription";

// Cache session for the duration of the request to prevent multiple DB calls
export const getSession = cache(async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session;
})

// Redirect to login page if not authenticated
export const requireAuth = async () => {
    const session = await getSession();
    if (!session) {
        redirect("/login");
    }
    return session;
}

// Cache user data for the duration of the request
export const getUserData = cache(async () => {
    try {
        const session = await getSession();
        if (!session) {
            return null;
        }

        const userData = await db.select({
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image,
            // Subscription/Payment fields
            polarCustomerId: user.polarCustomerId,
            subscriptionId: user.subscriptionId,
            subscriptionStatus: user.subscriptionStatus,
            planType: user.planType,
            subscriptionEndsAt: user.subscriptionEndsAt,
            // Polar OAuth fields
            polarUserId: user.polarUserId,
            polarOrganizationId: user.polarOrganizationId,
            polarConnectedAt: user.polarConnectedAt,
            polarTokenExpiresAt: user.polarTokenExpiresAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })
        .from(user)
        .where(eq(user.id, session.user.id))
        .limit(1);

        if (!userData.length) {
            return null;
        }

        return userData[0];
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
})

// Check if user has an active subscription
export const hasActiveSubscription = cache(async (): Promise<boolean> => {
    try {
        const userData = await getUserData();
        if (!userData) {
            return false;
        }

        return isSubscriptionActive(
            userData.subscriptionStatus as SubscriptionStatus,
            userData.subscriptionEndsAt
        );
    } catch (error) {
        console.error("Error checking subscription status:", error);
        return false;
    }
});

// Get subscription details
export const getSubscriptionDetails = cache(async (): Promise<SubscriptionDetails | null> => {
    try {
        const userData = await getUserData();
        if (!userData) {
            return null;
        }

        const status = userData.subscriptionStatus as SubscriptionStatus;
        const planType = userData.planType as PlanType;
        const endsAt = userData.subscriptionEndsAt;

        const isActive = isSubscriptionActive(status, endsAt);
        const isExpired = isSubscriptionExpired(endsAt);

        return {
            isActive,
            isExpired,
            status,
            planType,
            endsAt,
            subscriptionId: userData.subscriptionId,
        };
    } catch (error) {
        console.error("Error getting subscription details:", error);
        return null;
    }
});

// Require active subscription - redirect to pricing if not active
export const requireActiveSubscription = async (): Promise<true> => {
    const isActive = await hasActiveSubscription();
    if (!isActive) {
        redirect("/pricing");
    }
    return true;
};

// Check if user needs to see pricing page
export const shouldShowPricing = cache(async (): Promise<boolean> => {
    const session = await getSession();
    if (!session) {
        return false; // Not logged in, should go to login first
    }

    const isActive = await hasActiveSubscription();
    return !isActive;
});

export const signOut = async () => {
    await auth.api.signOut({
        headers: await headers(),
    });
    redirect("/");
}