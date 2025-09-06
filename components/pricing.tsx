"use client";

import { Check, PencilLine } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white py-24" id="pricing">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] [background-size:32px_32px]" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-6 font-bold text-4xl text-black md:text-5xl">
            Start earning from your knowledge
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 text-xl">
            Upload your notes or PDFs, generate beautiful AI-crafted content,
            set your price, and keep 100% of every sale.
          </p>
        </div>

        {/* Toggle */}
        <div className="mb-12 flex justify-center">
          <div className="relative flex items-center rounded-full bg-gray-100 p-1 shadow-inner">
            <button
              className={`relative cursor-pointer rounded-full px-8 py-3 font-semibold transition-all duration-300 ${
                isYearly
                  ? "text-gray-600 hover:text-gray-900"
                  : "bg-white text-gray-900 shadow-sm"
              }`}
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </button>
            <button
              className={`relative cursor-pointer rounded-full px-8 py-3 font-semibold transition-all duration-300 ${
                isYearly
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setIsYearly(true)}
            >
              Yearly
              <div className="-top-2 -right-2 absolute rounded-full bg-green-500 px-2 py-1 font-medium text-white text-xs">
                Save 33%
              </div>
            </button>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="flex justify-center">
          <div
            className="group relative w-full max-w-md"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Glow Effect */}
            <div
              className={`-inset-1 absolute rounded-3xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100 ${isHovered ? "animate-pulse" : ""}`}
            />

            {/* Main Card */}
            <div className="group-hover:-translate-y-2 relative rounded-3xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-500 group-hover:shadow-2xl">
              <div className="text-center">
                {/* Plan Name */}
                <div className="mb-8">
                  <div
                    className={`mb-6 inline-block rounded-full px-4 py-2 font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
                      isYearly
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {isYearly ? "Yearly Plan" : "Monthly Plan"}
                  </div>

                  {/* Pricing */}
                  <div className="relative">
                    {isYearly ? (
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-center gap-3">
                          <span className="font-semibold text-2xl text-gray-400 line-through">
                            $240
                          </span>
                          <span
                            className={`font-bold text-6xl text-black transition-all duration-500 ${isHovered ? "scale-110" : ""}`}
                          >
                            $160
                          </span>
                        </div>
                        <div className="font-semibold text-green-600 text-lg">
                          Save $80 — 4 months free!
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-baseline justify-center">
                        <span
                          className={`font-bold text-6xl text-black transition-all duration-500 ${isHovered ? "scale-110" : ""}`}
                        >
                          $20
                        </span>
                        <span className="ml-2 text-gray-500 text-xl">
                          /month
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <Link className="mb-8 block" href="/dashboard">
                  <Button
                    className="group/btn relative w-full overflow-hidden rounded-2xl bg-black px-10 py-6 text-white transition-all duration-300 hover:scale-105 hover:bg-gray-800 hover:shadow-xl"
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
                    <span className="relative flex items-center justify-center gap-2">
                      <PencilLine className="h-5 w-5 transition-transform group-hover/btn:rotate-12" />
                      Start Creating
                    </span>
                  </Button>
                </Link>

                {/* Features */}
                <div className="space-y-4 text-left">
                  {[
                    "Unlimited generations",
                    "Hosted & Shareable",
                    "Advanced analytics dashboard",
                    "No platform fees",
                  ].map((feature, index) => (
                    <div
                      className={`flex items-center text-gray-700 transition-all duration-300 ${
                        isHovered ? "translate-x-2" : ""
                      }`}
                      key={feature}
                      style={{
                        transitionDelay: isHovered ? `${index * 50}ms` : "0ms",
                      }}
                    >
                      <div className="relative mr-3 flex-shrink-0">
                        <Check className="h-5 w-5 text-green-600" />
                        {isHovered && (
                          <div className="absolute inset-0 animate-ping rounded-full bg-green-600 opacity-20" />
                        )}
                      </div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
