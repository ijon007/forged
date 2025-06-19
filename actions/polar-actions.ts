"use server";

import { getSession } from "@/actions/auth-actions";
import { db } from "@/db/drizzle";
import { user } from "@/db/schemas/auth-schema";
import { eq } from "drizzle-orm";

export async function getPolarConnectionStatus() {
  try {
    const session = await getSession();
    if (!session) {
      return { isConnected: false, error: "Not authenticated" };
    }

    const userData = await db.select({
      polarUserId: user.polarUserId,
      polarConnectedAt: user.polarConnectedAt,
      polarTokenExpiresAt: user.polarTokenExpiresAt,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

    if (!userData.length) {
      return { isConnected: false, error: "User not found" };
    }

    const userPolarData = userData[0];
    const isConnected = !!userPolarData.polarUserId;
    const isTokenExpired = userPolarData.polarTokenExpiresAt 
      ? new Date() > userPolarData.polarTokenExpiresAt 
      : false;

    return {
      isConnected,
      isTokenExpired,
      connectedAt: userPolarData.polarConnectedAt,
      needsReconnection: isConnected && isTokenExpired,
    };
  } catch (error) {
    console.error("Error checking Polar connection status:", error);
    return { isConnected: false, error: "Failed to check connection status" };
  }
}

export async function disconnectPolarAccount() {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    await db.update(user)
      .set({
        polarUserId: null,
        polarAccessToken: null,
        polarRefreshToken: null,
        polarTokenExpiresAt: null,
        polarConnectedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    return { success: true };
  } catch (error) {
    console.error("Error disconnecting Polar account:", error);
    throw new Error("Failed to disconnect Polar account");
  }
}

export async function refreshPolarToken() {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    const userData = await db.select({
      polarRefreshToken: user.polarRefreshToken,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

    if (!userData.length || !userData[0].polarRefreshToken) {
      throw new Error("No refresh token available");
    }

    const refreshToken = userData[0].polarRefreshToken;

    // Exchange refresh token for new access token
    const tokenResponse = await fetch('https://api.polar.sh/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.POLAR_OAUTH_CLIENT_ID!,
        client_secret: process.env.POLAR_OAUTH_CLIENT_SECRET!,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to refresh token");
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Update user with new token data
    const expiresAt = new Date(Date.now() + expires_in * 1000);
    
    await db.update(user)
      .set({
        polarAccessToken: access_token,
        polarRefreshToken: refresh_token || refreshToken, // Use new refresh token if provided
        polarTokenExpiresAt: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    return { success: true };
  } catch (error) {
    console.error("Error refreshing Polar token:", error);
    throw new Error("Failed to refresh token");
  }
} 