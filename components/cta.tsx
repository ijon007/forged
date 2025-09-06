import { ArrowRight, PhoneCall } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA({ className }: { className?: string }) {
  return (
    <section className={className} id="cta">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container relative mx-auto px-4">
        <div className="text-center">
          <h2 className="mb-6 font-bold text-3xl text-white sm:text-4xl lg:text-5xl">
            Ready to sell your expertise online?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-300 text-lg leading-relaxed">
            Turn your knowledge into profitable digital playbooks and courses.
            Create, sell, and monetize your expertise with AI-powered course
            creation for just $20/month.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button
                className="group relative overflow-hidden rounded-xl bg-white text-black transition-all hover:scale-105 hover:bg-gray-100 hover:shadow-2xl"
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative font-semibold">Start Selling</span>
                <ArrowRight className="relative ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                className="group relative overflow-hidden rounded-xl bg-white text-black transition-all hover:scale-105 hover:bg-gray-100 hover:shadow-2xl"
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative font-semibold">Book a call</span>
                <PhoneCall className="relative ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
