import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "../db/drizzle";
import { account, session, user, verification } from "@/db/schemas/auth-schema";
import { polar, checkout, portal, webhooks, usage } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { eq } from "drizzle-orm";

const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    server: 'sandbox' // Use 'production' when ready
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
                            productId: "847b402b-f743-49d7-a0d1-02a2f7ab5393", // Monthly plan
                            slug: "knowledgesmith-monthly"
                        },
                        {
                            productId: process.env.POLAR_YEARLY_PRODUCT_ID!, // Yearly plan - you'll need to create this
                            slug: "knowledgesmith-yearly"
                        }
                    ],
                    successUrl: "/dashboard/success?checkout_id={CHECKOUT_ID}",
                    authenticatedUsersOnly: true
                }),
                portal(),
                usage(),
                webhooks({
                    secret: process.env.POLAR_WEBHOOK_SECRET!,
                    // Handle subscription events
                    onSubscriptionCreated: async (payload) => {
                        console.log('Subscription created:', payload);
                        await updateUserSubscription(payload);
                    },
                    onSubscriptionUpdated: async (payload) => {
                        console.log('Subscription updated:', payload);
                        await updateUserSubscription(payload);
                    },
                    onSubscriptionActive: async (payload) => {
                        console.log('Subscription activated:', payload);
                        await updateUserSubscription(payload);
                    },
                    onSubscriptionCanceled: async (payload) => {
                        console.log('Subscription canceled:', payload);
                        await updateUserSubscription(payload, 'canceled');
                    },
                    onOrderPaid: async (payload) => {
                        console.log('Order paid:', payload);
                        // Handle one-time payments if needed
                    },
                    onCheckoutUpdated: async (payload) => {
                        console.log('Checkout updated:', payload);
                        // Handle checkout completion
                    },
                    // Catch-all for debugging
                    onPayload: async (payload) => {
                        console.log('Polar webhook received:', payload.type, payload);
                    }
                })
            ],
        })
    ],
});

// Helper function to update user subscription from webhook data
async function updateUserSubscription(subscription: any, status?: string) {
    try {
        const customerId = subscription.customer_id;
        
        // Find user by polar customer ID
        const users = await db
            .select()
            .from(user)
            .where(eq(user.polarCustomerId, customerId))
            .limit(1);

        if (users.length === 0) {
            console.error('User not found for customer ID:', customerId);
            return;
        }

        const currentUser = users[0];

        // Determine plan type based on product or price
        const planType = subscription.price?.recurring_interval === 'year' ? 'yearly' : 'monthly';

        await db
            .update(user)
            .set({
                subscriptionId: subscription.id,
                subscriptionStatus: status || subscription.status,
                planType: planType,
                subscriptionEndsAt: subscription.current_period_end ? new Date(subscription.current_period_end) : null,
                updatedAt: new Date(),
            })
            .where(eq(user.id, currentUser.id));

        console.log(`Updated subscription for user ${currentUser.id}: ${status || subscription.status}`);
    } catch (error) {
        console.error('Error updating user subscription:', error);
    }
}