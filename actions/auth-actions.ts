"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { user } from "@/db/schemas/auth-schema";
import { eq } from "drizzle-orm";

// Server-side actions
export const getSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session;
}

export const signOut = async () => {
    await auth.api.signOut({
        headers: await headers(),
    });
    redirect("/");
}

export const getUserWithSubscription = async () => {
    const session = await getSession();
    if (!session) return null;
    
    const userData = await db.select()
        .from(user)
        .where(eq(user.id, session.user.id))
        .limit(1);
    
    return userData[0] || null;
}

export const hasActiveSubscription = async () => {
    const userData = await getUserWithSubscription();
    if (!userData) return false;
    
    // Check if user has active subscription
    const isActive = userData.subscriptionStatus === "active";
    
    // Check if subscription hasn't expired
    const isNotExpired = !userData.subscriptionEndsAt || 
        new Date(userData.subscriptionEndsAt) > new Date();
    
    return isActive && isNotExpired;
}