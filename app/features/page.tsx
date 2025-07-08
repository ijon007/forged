import { Features } from "@/components/features"
import { FloatingNav } from "@/components/floating-nav"

export default function FeaturesPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-16">
            <FloatingNav />
            <Features page={true}/>
        </main>
    )
}