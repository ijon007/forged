import { createAuthClient } from "better-auth/react"
import { polarClient } from "@polar-sh/better-auth"

// Get the correct base URL
function getBaseURL() {
    if (typeof window !== "undefined") {
      // Client-side: use current origin
      return window.location.origin
    }
  
    // Server-side: use environment variables
    if (process.env.NODE_ENV === "production") {
      return (
        process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` || "https://knowledgesmith.vercel.app"
      )
    }
  
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }
  

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
    plugins: [polarClient()]
});
export const { signIn, signOut, useSession } = authClient;