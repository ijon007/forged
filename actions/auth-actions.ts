"use server";

/* Next */
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db/drizzle";
import { user } from "@/db/schemas/auth-schema";
import { eq } from "drizzle-orm";

export const getSession = cache(async () => {
    return await auth.api.getSession({
        headers: await headers(),
    });
});

export const signOut = async () => {
    await auth.api.signOut({
        headers: await headers(),
    });
    redirect("/");
}

export async function getUserData() {
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
}