import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
    try {
        const body = await request.text()

        const modifiedRequest = new Request(request.url, {
            method: "POST",
            headers: request.headers,
            body: body,
        })

        const response = await auth.handler(modifiedRequest)
        return response
    } catch (error) {
        console.error("Webhook error:", error)
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    return NextResponse.json({ message: "Webhook endpoint active" })
}
