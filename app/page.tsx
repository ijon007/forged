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
            <CTA className="flex self-center bg-gradient-to-br from-black via-gray-900 to-black py-40 overflow-hidden w-11/12 rounded-4xl ml-5 md:ml-10 lg:ml-12 xl:ml-20"/>
            <Footer />
        </main>
    )
}