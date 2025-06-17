import { createAuthClient } from "better-auth/react"
import { polarClient } from "@polar-sh/better-auth"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
    plugins: [polarClient()]
});
export const { signIn, signOut, useSession } = authClient;