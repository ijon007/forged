"use server";

/* Actions */
import { getSession } from "@/actions/auth-actions";

/* DB */
import { db } from "@/db/drizzle";
import { user } from "@/db/schemas/auth-schema";
import { eq } from "drizzle-orm";

/* Polar */
import { Polar } from "@polar-sh/sdk";

export async function getPolarConnectionStatus() {
  try {
    const session = await getSession();
    if (!session) {
      return { isConnected: false, error: "Not authenticated" };
    }

    const userData = await db.select({
      polarUserId: user.polarUserId,
      polarOrganizationId: user.polarOrganizationId,
      polarAccessToken: user.polarAccessToken,
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

    let organizationInfo = null;

    // If connected and token is valid, fetch organization details
    if (isConnected && !isTokenExpired && userPolarData.polarAccessToken && userPolarData.polarOrganizationId) {
      try {
        const orgResponse = await fetch(`https://api.polar.sh/v1/organizations/${userPolarData.polarOrganizationId}`, {
          headers: {
            'Authorization': `Bearer ${userPolarData.polarAccessToken}`,
          },
        });

        if (orgResponse.ok) {
          organizationInfo = await orgResponse.json();
        }
      } catch (error) {
        console.error("Error fetching organization info:", error);
        // Don't fail the whole function if org fetch fails
      }
    }

    return {
      isConnected,
      isTokenExpired,
      connectedAt: userPolarData.polarConnectedAt,
      needsReconnection: isConnected && isTokenExpired,
      organizationInfo,
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
        polarOrganizationId: null,
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

export async function createPolarProduct(courseData: {
  name: string;
  description: string;
  price: number; // price in cents
}) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    // Get user's Polar access token
    const userData = await db.select({
      polarAccessToken: user.polarAccessToken,
      polarTokenExpiresAt: user.polarTokenExpiresAt,
      polarUserId: user.polarUserId,
      polarOrganizationId: user.polarOrganizationId,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

    if (!userData.length || !userData[0].polarAccessToken) {
      return { success: false, error: "Polar account not connected" };
    }

    const userPolarData = userData[0];

    if (!userPolarData.polarOrganizationId) {
      return { success: false, error: "Polar organization not found. Please reconnect your Polar account." };
    }
    
    // Check if token is expired
    if (userPolarData.polarTokenExpiresAt && new Date() > userPolarData.polarTokenExpiresAt) {
      try {
        await refreshPolarToken();
        // Refetch the updated token
        const updatedUserData = await db.select({
          polarAccessToken: user.polarAccessToken,
        })
        .from(user)
        .where(eq(user.id, session.user.id))
        .limit(1);
        
        if (!updatedUserData.length || !updatedUserData[0].polarAccessToken) {
          return { success: false, error: "Failed to refresh Polar token" };
        }
        
        userPolarData.polarAccessToken = updatedUserData[0].polarAccessToken;
      } catch (error) {
        return { success: false, error: "Polar token expired and could not be refreshed" };
      }
    }

    if (!userPolarData.polarUserId) {
      return { success: false, error: "Polar user ID not found" };
    }

    // Create Polar client with user's access token
    const userPolarClient = new Polar({
      accessToken: userPolarData.polarAccessToken!,
      server: "production",
    });

    // Create the product on Polar using creator's organization
    const productResponse = await userPolarClient.products.create({
      name: courseData.name,
      description: courseData.description,
      organizationId: userPolarData.polarOrganizationId!, // Creator's org, not yours!
      recurringInterval: null,
      prices: [
        {
          amountType: "fixed",
          priceCurrency: "usd",
          priceAmount: courseData.price,
        }
      ],
    });

    return {
      success: true,
      data: {
        productId: productResponse.id,
        productName: productResponse.name,
        productDescription: productResponse.description,
        prices: productResponse.prices,
      }
    };

  } catch (error) {
    console.error("Error creating Polar product:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create Polar product"
    };
  }
}

export async function createCheckoutLink(productId: string, successUrl?: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    // Get user's Polar access token
    const userData = await db.select({
      polarAccessToken: user.polarAccessToken,
      polarTokenExpiresAt: user.polarTokenExpiresAt,
      polarOrganizationId: user.polarOrganizationId,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

    if (!userData.length || !userData[0].polarAccessToken) {
      return { success: false, error: "Polar account not connected" };
    }

    const userPolarData = userData[0];

    if (!userPolarData.polarOrganizationId) {
      return { success: false, error: "Polar organization not found. Please reconnect your Polar account." };
    }
    
    if (userPolarData.polarTokenExpiresAt && new Date() > userPolarData.polarTokenExpiresAt) {
      try {
        await refreshPolarToken();
        // Refetch the updated token
        const updatedUserData = await db.select({
          polarAccessToken: user.polarAccessToken,
        })
        .from(user)
        .where(eq(user.id, session.user.id))
        .limit(1);
        
        if (!updatedUserData.length || !updatedUserData[0].polarAccessToken) {
          return { success: false, error: "Failed to refresh Polar token" };
        }
        
        userPolarData.polarAccessToken = updatedUserData[0].polarAccessToken;
      } catch (error) {
        return { success: false, error: "Polar token expired and could not be refreshed" };
      }
    }

    const userPolarClient = new Polar({
      accessToken: userPolarData.polarAccessToken!,
      server: "production",
    });

    const checkoutResponse = await userPolarClient.checkouts.create({
      products: [productId],
      successUrl: successUrl,
      allowDiscountCodes: true,
      requireBillingAddress: false,
      isBusinessCustomer: false,
    });

    return {
      success: true,
      data: {
        checkoutUrl: checkoutResponse.url!,
        checkoutId: checkoutResponse.id,
      }
    };

  } catch (error) {
    console.error("Error creating checkout link:", error);
    
    // Check if it's a scope error
    if (error instanceof Error && error.message.includes("insufficient_scope")) {
      return {
        success: false,
        error: "Your Polar account needs to be reconnected with updated permissions. Please disconnect and reconnect your Polar account to enable checkout creation."
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout link"
    };
  }
}

export async function archivePolarProduct(productId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    const userData = await db.select({
      polarAccessToken: user.polarAccessToken,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

    if (!userData.length || !userData[0].polarAccessToken) {
      return { success: false, error: "Polar account not connected" };
    }

    const response = await fetch(`https://api.polar.sh/v1/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${userData[0].polarAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        is_archived: true
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to archive product: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error archiving Polar product:", error);
    return { success: false, error: "Failed to archive product" };
  }
} 