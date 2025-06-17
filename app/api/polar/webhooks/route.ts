import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// Handle POST requests for webhooks
export async function POST(request: NextRequest) {
  try {
    // Get the raw body for webhook verification
    const body = await request.text()

    // Create a new request with the body for the auth handler
    const modifiedRequest = new Request(request.url, {
      method: "POST",
      headers: request.headers,
      body: body,
    })

    // Use the auth handler to process the webhook
    const response = await auth.handler(modifiedRequest)
    return response
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

// Handle GET requests (for webhook verification if needed)
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Webhook endpoint active" })
}
