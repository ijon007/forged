// Better Auth
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

// Drizzle
import { db } from "../db/drizzle";
import { eq } from "drizzle-orm";
import { account, session, user, verification } from "@/db/schemas/auth-schema";

// Polar
import { polar, checkout, portal, webhooks, usage } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    server: 'sandbox'
});
 
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
        nextCookies(),
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: process.env.POLAR_MONTHLY_PRODUCT_ID!,
                            slug: "knowledgesmith-monthly",
                        },
                        {
                            productId: process.env.POLAR_YEARLY_PRODUCT_ID!,
                            slug: "knowledgesmith-yearly",
                        },
                    ],
                    successUrl: "https://knowledgesmith.vercel.app/dashboard/success?checkout_id={CHECKOUT_ID}",
                }),
                portal(),
                usage(),
                webhooks({
                    secret: process.env.POLAR_WEBHOOK_SECRET!,
        
                    onSubscriptionCreated: async (payload) => {
                        console.log("Subscription created:", payload)
            
                        try {
                            const subscription = payload.data
                            const customerId = subscription.customerId
            
                            const existingUser = await db.select().from(user).where(eq(user.polarCustomerId, customerId)).limit(1)
            
                            if (existingUser.length > 0) {
                            await db
                                .update(user)
                                .set({
                                subscriptionId: subscription.id,
                                subscriptionStatus: subscription.status,
                                planType: subscription.product.name?.toLowerCase().includes("yearly") ? "yearly" : "monthly",
                                subscriptionEndsAt: subscription.currentPeriodEnd
                                    ? new Date(subscription.currentPeriodEnd)
                                    : null,
                                updatedAt: new Date(),
                                })
                                .where(eq(user.id, existingUser[0].id))
            
                            console.log(`Updated subscription for user ${existingUser[0].id}`)
                            }
                        } catch (error) {
                            console.error("Error handling subscription created:", error)
                        }
                    },
        
                    onSubscriptionUpdated: async (payload) => {
                        console.log("Subscription updated:", payload)
            
                        try {
                            const subscription = payload.data
            
                            await db
                            .update(user)
                            .set({
                                subscriptionStatus: subscription.status,
                                subscriptionEndsAt: subscription.currentPeriodEnd
                                ? new Date(subscription.currentPeriodEnd)
                                : null,
                                updatedAt: new Date(),
                            })
                            .where(eq(user.subscriptionId, subscription.id))
            
                            console.log(`Updated subscription status to ${subscription.status}`)
                        } catch (error) {
                            console.error("Error handling subscription updated:", error)
                        }
                    },
        
                    onSubscriptionActive: async (payload) => {
                        console.log("Subscription activated:", payload)
            
                        try {
                            const subscription = payload.data
            
                            await db
                            .update(user)
                            .set({
                                subscriptionStatus: "active",
                                updatedAt: new Date(),
                            })
                            .where(eq(user.subscriptionId, subscription.id))
            
                            console.log(`Activated subscription ${subscription.id}`)
                        } catch (error) {
                            console.error("Error handling subscription activated:", error)
                        }
                    },
        
                    onSubscriptionCanceled: async (payload) => {
                        console.log("Subscription canceled:", payload)
            
                        try {
                            const subscription = payload.data
            
                            await db
                            .update(user)
                            .set({
                                subscriptionStatus: "canceled",
                                updatedAt: new Date(),
                            })
                            .where(eq(user.subscriptionId, subscription.id))
            
                            console.log(`Canceled subscription ${subscription.id}`)
                        } catch (error) {
                            console.error("Error handling subscription canceled:", error)
                        }
                    },
        
                    onCheckoutUpdated: async (payload) => {
                        console.log("Checkout updated:", payload)
            
                        try {
                            const checkout = payload.data
            
                            if (checkout.status === "confirmed" && checkout.customerId) {
                            // Update user with customer ID if not already set
                            const existingUser = await db
                                .select()
                                .from(user)
                                .where(eq(user.polarCustomerId, checkout.customerId))
                                .limit(1)
            
                                if (existingUser.length === 0) {
                                    // Try to find user by email if customer ID not found
                                    if (checkout.customerEmail) {
                                    await db
                                        .update(user)
                                        .set({
                                        polarCustomerId: checkout.customerId,
                                        updatedAt: new Date(),
                                        })
                                        .where(eq(user.email, checkout.customerEmail))
                                    }
                                }
                            }
                        } catch (error) {
                            console.error("Error handling checkout updated:", error)
                        }
                    },
        
                    // Catch-all for debugging
                    onPayload: async (payload) => {
                        console.log("Polar webhook received:", payload.type, payload)
                    },
                }),
            ],
        })
    ],
});
