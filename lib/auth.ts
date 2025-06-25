// Better Auth
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

// Drizzle
import { db } from "../db/drizzle";
import { account, session, user, verification } from "@/db/schemas/auth-schema";
import { course, coursePurchase } from "@/db/schemas/course-schema";
import { eq, desc } from "drizzle-orm";

// Polar
import { polar, checkout, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    server: "sandbox",
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
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "4106f4b6-7fe4-4878-a585-e841be593ea1",
                            slug: "Knowledgesmith",
                        },
                        {
                            productId: "3196f5a1-28d3-4c44-9758-bb82bd1e38e9",
                            slug: "Knowledgesmith-Yearly",
                        },
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true,
                }),
                webhooks({
                    secret: process.env.POLAR_WEBHOOK_SECRET!,
                    
                    // Handle course purchases - works for both authenticated and anonymous users
                    onOrderPaid: async (payload) => {
                        console.log("Order paid", payload);
                        
                        const order = payload.data;
                        
                        // Find the course by polar product ID
                        if (order.productId) {
                            const courseData = await db.select()
                                .from(course)
                                .where(eq(course.polarProductId, order.productId))
                                .limit(1);
                            
                            if (courseData.length > 0) {
                                const courseId = courseData[0].id;
                                
                                // First, try to find an existing purchase token for this course
                                const existingPurchase = await db.select()
                                    .from(coursePurchase)
                                    .where(eq(coursePurchase.courseId, courseId))
                                    .orderBy(desc(coursePurchase.createdAt))
                                    .limit(5); // Check last 5 purchases for this course
                                
                                // Look for a pending purchase token that matches this timeframe
                                const recentPurchase = existingPurchase.find(p => 
                                    p.polarOrderId === null && 
                                    p.userId === null &&
                                    (new Date().getTime() - p.createdAt.getTime()) < 600000 // Within 10 minutes
                                );
                                
                                if (recentPurchase) {
                                    // Update the existing token with order ID
                                    await db.update(coursePurchase)
                                        .set({ polarOrderId: order.id })
                                        .where(eq(coursePurchase.id, recentPurchase.id));
                                    
                                    console.log(`Anonymous purchase completed: Token ${recentPurchase.id} for course ${courseId}`);
                                } else {
                                    // Try to find authenticated user purchase
                                    const userData = await db.select()
                                        .from(user)
                                        .where(eq(user.polarCustomerId, order.customerId))
                                        .limit(1);
                                    
                                    if (userData.length) {
                                        // Authenticated user purchase
                                        await db.insert(coursePurchase).values({
                                            id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                                            userId: userData[0].id,
                                            courseId: courseId,
                                            polarOrderId: order.id,
                                        });
                                        
                                        console.log(`Authenticated purchase recorded: User ${userData[0].id} bought course ${courseId}`);
                                    }
                                }
                            }
                        }
                    },
                    
                    onSubscriptionActive: async (payload) => {
                        console.log("Subscription active", payload);
                        
                        // Update user subscription status
                        const subscription = payload.data;
                        const customerId = subscription.customerId;
                        
                        // Determine plan type based on product
                        let planType = "monthly";
                        if (subscription.productId === "3196f5a1-28d3-4c44-9758-bb82bd1e38e9") {
                            planType = "yearly";
                        }
                        
                        await db.update(user)
                            .set({
                                subscriptionId: subscription.id,
                                subscriptionStatus: "active",
                                planType: planType,
                                subscriptionEndsAt: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : null,
                                updatedAt: new Date()
                            })
                            .where(eq(user.polarCustomerId, customerId));
                    },
                    onSubscriptionRevoked: async (payload) => {
                        console.log("Subscription revoked", payload);
                        
                        // Update user subscription status to revoked
                        const subscription = payload.data;
                        const customerId = subscription.customerId;
                        
                        await db.update(user)
                            .set({
                                subscriptionStatus: "revoked",
                                subscriptionEndsAt: subscription.endedAt ? new Date(subscription.endedAt) : new Date(),
                                updatedAt: new Date()
                            })
                            .where(eq(user.polarCustomerId, customerId));
                    },
                    onCustomerStateChanged: async (payload) => {
                        console.log("Customer state changed", payload);
                        
                        // Update polar customer ID if needed
                        if (payload.data.email) {
                            await db.update(user)
                                .set({ 
                                    polarCustomerId: payload.data.id,
                                    updatedAt: new Date()
                                })
                                .where(eq(user.email, payload.data.email));
                        }
                    },
                    onCustomerCreated: async (payload) => {
                        console.log("Customer created", payload);
                        
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
                    },
                    onCustomerDeleted: async (payload) => {
                        console.log("Customer deleted", payload);
                        
                        // Remove Polar customer ID and clear subscription data
                        const customer = payload.data;
                        await db.update(user)
                            .set({
                                polarCustomerId: null,
                                subscriptionId: null,
                                subscriptionStatus: null,
                                planType: null,
                                subscriptionEndsAt: null,
                                updatedAt: new Date()
                            })
                            .where(eq(user.polarCustomerId, customer.id));
                    },
                    onCustomerUpdated: async (payload) => {
                        console.log("Customer updated", payload);
                        
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
                    },
                    onPayload: async (payload) => {
                        console.log("Webhook payload received", payload);
                    }
                })
            ],
        }),
        nextCookies(),
    ],
});
