import { Hero } from "@/components/hero"
import { Pricing } from "@/components/pricing"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { FloatingNav } from "@/components/floating-nav"
import { Features } from "@/components/features"

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <FloatingNav />
            <Hero />
            <Features />
            <Pricing />
            <Testimonials />
            <FAQ />
            <CTA />
            <Footer />
        </main>
    )
}