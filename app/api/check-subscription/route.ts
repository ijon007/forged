import { getSession } from "@/actions/auth-actions"
import { hasActiveSubscription } from "@/lib/subscription"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await getSession()
        
        if (!session) {
            return NextResponse.json({ hasActiveSubscription: false }, { status: 401 })
        }

        const hasSubscription = await hasActiveSubscription(session.user.id)
        
        return NextResponse.json({ hasActiveSubscription: hasSubscription })
    } catch (error) {
        console.error('Error checking subscription status:', error)
        return NextResponse.json({ hasActiveSubscription: false }, { status: 500 })
    }
} 