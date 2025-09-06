import { CTA } from "@/components/cta";
import { FAQ } from "@/components/faq";
import { Features } from "@/components/features";
import { FloatingNav } from "@/components/floating-nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Pricing } from "@/components/pricing";
import { Testimonials } from "@/components/testimonials";

export default async function Home() {
  return (
    <main className="min-h-screen bg-white">
      <FloatingNav />
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA className="ml-5 flex w-11/12 self-center overflow-hidden rounded-4xl bg-gradient-to-br from-black via-gray-900 to-black py-40 md:ml-10 lg:ml-12 xl:ml-20" />
      <Footer />
    </main>
  );
}
