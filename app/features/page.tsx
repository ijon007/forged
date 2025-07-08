import { Features } from "@/components/features"
import { FloatingNav } from "@/components/floating-nav"

export const metadata = {
    title: "Features",
    description: "Explore the features of Forged and see how it can help you create and make money from your content.",
    canonical: "https://www.tryforged.me/features",
}

export default function FeaturesPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-16">
            <FloatingNav />
            <Features page={true}/>
        </main>
    )
}