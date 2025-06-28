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

// Cache session for the duration of the request to prevent multiple DB calls
export const getSession = cache(async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session;
})

export const signOut = async () => {
    await auth.api.signOut({
        headers: await headers(),
    });
    redirect("/");
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