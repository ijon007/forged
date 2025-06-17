import { createAuthClient } from "better-auth/react";
import { polarClient } from "@polar-sh/better-auth";

export const authClient = createAuthClient({
    plugins: [polarClient()],
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    redirectUrl: '/',
});

export const { signIn, signUp, useSession } = authClient;