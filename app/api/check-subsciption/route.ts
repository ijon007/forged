import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/actions/auth-actions"
import { hasActiveSubscription } from "@/lib/subscription"

export async function GET(request: NextRequest) {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json({ hasActiveSubscription: false }, { status: 401 })
        }

        const hasSubscription = await hasActiveSubscription(session.user.id)

        return NextResponse.json({
            hasActiveSubscription: hasSubscription,
            userId: session.user.id,
        })
    } catch (error) {
        console.error("Error checking subscription:", error)
        return NextResponse.json(
            {
                hasActiveSubscription: false,
                error: "Failed to check subscription status",
            },
            { status: 500 },
        )
    }
}
