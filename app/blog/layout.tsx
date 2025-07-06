
import { FloatingNav } from "@/components/floating-nav"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: {
        default: "Blog",
        template: "%s | Blog",
    },
    description: "Read articles, tutorials, and insights about AI-powered course creation, knowledge monetization, and more on the Forged blog.",
    alternates: {
        canonical: "https://tryforged.me/blog",
    }
}

export default async function BlogLayout({
    children,
}: {
  children: React.ReactNode
}) {
    return (
            <div className="min-h-screen bg-white">
            <FloatingNav />
            {children}
        </div>
    )
}   