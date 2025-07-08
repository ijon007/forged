// Better Auth
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

// Drizzle
import { db } from "../db/drizzle";
import { account, session, user, verification } from "@/db/schemas/auth-schema";
import { eq } from "drizzle-orm";

// Polar
import { polar, checkout, webhooks, portal } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    server: "production",
});

// Helper function to determine plan type from product ID
const getPlanTypeFromProductId = (productId: string): string => {
    if (productId === "d607a6a7-db1b-45c8-bd93-6d8d9179e0c4") {
        return "yearly";
    }
    return "monthly";
};

// Helper function to update user subscription
const updateUserSubscription = async (customerId: string, updates: any) => {
    try {
        const result = await db.update(user)
            .set({ ...updates, updatedAt: new Date() })
            .where(eq(user.polarCustomerId, customerId));
        
        console.log(`Updated user subscription for customer ${customerId}:`, updates);
        return result;
    } catch (error) {
        console.error(`Failed to update user subscription for customer ${customerId}:`, error);
        throw error;
    }
};
 
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: user,
            session: session,
            account: account,
            verification: verification
        }
    }),
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "847b402b-f743-49d7-a0d1-02a2f7ab5393",
                            slug: "forged",
                        },
                        {
                            productId: "d607a6a7-db1b-45c8-bd93-6d8d9179e0c4",
                            slug: "forged-yearly",
                        },
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true,
                }),
                portal(),
                webhooks({
                    secret: process.env.POLAR_WEBHOOK_SECRET!,
                    
                    onSubscriptionActive: async (payload) => {
                        console.log("Subscription active webhook:", payload);
                        
                        try {
                            const subscription = payload.data;
                            const customerId = subscription.customerId;
                            const planType = getPlanTypeFromProductId(subscription.productId);
                            
                            await updateUserSubscription(customerId, {
                                subscriptionId: subscription.id,
                                subscriptionStatus: "active",
                                planType: planType,
                                subscriptionEndsAt: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : null,
                            });
                        } catch (error) {
                            console.error("Error in onSubscriptionActive webhook:", error);
                        }
                    },

                    onSubscriptionRevoked: async (payload) => {
                        console.log("Subscription revoked webhook:", payload);
                        
                        try {
                            const subscription = payload.data;
                            const customerId = subscription.customerId;
                            
                            await updateUserSubscription(customerId, {
                                subscriptionStatus: "revoked",
                                subscriptionEndsAt: subscription.endedAt ? new Date(subscription.endedAt) : new Date(),
                            });
                        } catch (error) {
                            console.error("Error in onSubscriptionRevoked webhook:", error);
                        }
                    },

                    onSubscriptionCanceled: async (payload) => {
                        console.log("Subscription canceled webhook:", payload);
                        
                        try {
                            const subscription = payload.data;
                            const customerId = subscription.customerId;
                            
                            // When canceled, subscription remains active until period end
                            await updateUserSubscription(customerId, {
                                subscriptionStatus: "canceled",
                                subscriptionEndsAt: subscription.canceledAt ? new Date(subscription.canceledAt) : null,
                            });
                        } catch (error) {
                            console.error("Error in onSubscriptionCanceled webhook:", error);
                        }
                    },

                    onSubscriptionUpdated: async (payload) => {
                        console.log("Subscription updated webhook:", payload);
                        
                        try {
                            const subscription = payload.data;
                            const customerId = subscription.customerId;
                            const planType = getPlanTypeFromProductId(subscription.productId);
                            
                            // Update subscription details
                            await updateUserSubscription(customerId, {
                                subscriptionId: subscription.id,
                                planType: planType,
                                subscriptionEndsAt: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : null,
                            });
                        } catch (error) {
                            console.error("Error in onSubscriptionUpdated webhook:", error);
                        }
                    },

                    onCustomerStateChanged: async (payload) => {
                        console.log("Customer state changed webhook:", payload);
                        
                        try {
                            // Update polar customer ID if needed
                            if (payload.data.email) {
                                await db.update(user)
                                    .set({ 
                                        polarCustomerId: payload.data.id,
                                        updatedAt: new Date()
                                    })
                                    .where(eq(user.email, payload.data.email));
                            }
                        } catch (error) {
                            console.error("Error in onCustomerStateChanged webhook:", error);
                        }
                    },

                    onCustomerCreated: async (payload) => {
                        console.log("Customer created webhook:", payload);
                        
                        try {
                            // Link newly created Polar customer to existing user
                            const customer = payload.data;
                            if (customer.email) {
                                await db.update(user)
                                    .set({
                                        polarCustomerId: customer.id,
                                        updatedAt: new Date()
                                    })
                                    .where(eq(user.email, customer.email));
                            }
                        } catch (error) {
                            console.error("Error in onCustomerCreated webhook:", error);
                        }
                    },

                    onCustomerDeleted: async (payload) => {
                        console.log("Customer deleted webhook:", payload);
                        
                        try {
                            // Remove Polar customer ID and clear subscription data
                            const customer = payload.data;
                            await updateUserSubscription(customer.id, {
                                polarCustomerId: null,
                                subscriptionId: null,
                                subscriptionStatus: null,
                                planType: null,
                                subscriptionEndsAt: null,
                            });
                        } catch (error) {
                            console.error("Error in onCustomerDeleted webhook:", error);
                        }
                    },

                    onCustomerUpdated: async (payload) => {
                        console.log("Customer updated webhook:", payload);
                        
                        try {
                            // Update customer information
                            const customer = payload.data;
                            const updateData: any = {
                                updatedAt: new Date()
                            };
                            
                            // Update email if it changed (match by polarCustomerId)
                            if (customer.email) {
                                updateData.email = customer.email;
                            }
                            
                            await db.update(user)
                                .set(updateData)
                                .where(eq(user.polarCustomerId, customer.id));
                        } catch (error) {
                            console.error("Error in onCustomerUpdated webhook:", error);
                        }
                    },

                    onPayload: async (payload) => {
                        console.log("Webhook payload received:", {
                            type: payload.type,
                            timestamp: new Date().toISOString(),
                            data: payload.data
                        });
                    }
                })
            ],
        }),
        nextCookies(),
    ],
});
