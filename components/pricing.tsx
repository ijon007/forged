"use client"

import { Button } from "@/components/ui/button"
import { PencilLine, Check } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section id="pricing" className="relative bg-white py-24 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] [background-size:32px_32px]" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">Start earning from your knowledge</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your notes or PDFs, generate beautiful AI-crafted content, set your price, and keep 100% of every
            sale.
          </p>
        </div>

        {/* Toggle */}
        <div className="mb-12 flex justify-center">
          <div className="relative bg-gray-100 rounded-full p-1 flex items-center shadow-inner">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 relative cursor-pointer ${
                !isYearly ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 relative cursor-pointer ${
                isYearly ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Save 33%
                </div>
            </button>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="flex justify-center">
          <div
            className="group relative max-w-md w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Glow Effect */}
            <div
              className={`absolute -inset-1 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm ${isHovered ? "animate-pulse" : ""}`}
            />

            {/* Main Card */}
            <div className="relative rounded-3xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
              <div className="text-center">
                {/* Plan Name */}
                <div className="mb-8">
                  <div
                    className={`inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide mb-6 transition-all duration-300 ${
                      isYearly ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {isYearly ? "Yearly Plan" : "Monthly Plan"}
                  </div>

                  {/* Pricing */}
                  <div className="relative">
                    {isYearly ? (
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-center gap-3">
                          <span className="text-2xl font-semibold text-gray-400 line-through">$240</span>
                          <span
                            className={`text-6xl font-bold text-black transition-all duration-500 ${isHovered ? "scale-110" : ""}`}
                          >
                            $160
                          </span>
                        </div>
                        <div className="text-green-600 font-semibold text-lg">Save $80 — 4 months free!</div>
                      </div>
                    ) : (
                      <div className="flex items-baseline justify-center">
                        <span
                          className={`text-6xl font-bold text-black transition-all duration-500 ${isHovered ? "scale-110" : ""}`}
                        >
                          $20
                        </span>
                        <span className="text-xl text-gray-500 ml-2">/month</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <Link href="/login" className="block mb-8">
                  <Button
                    size="lg"
                    className="group/btn relative bg-black text-white hover:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl w-full py-6 px-10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center justify-center gap-2">
                      <PencilLine className="w-5 h-5 transition-transform group-hover/btn:rotate-12" />
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
                      key={feature}
                      className={`flex items-center text-gray-700 transition-all duration-300 ${
                        isHovered ? "translate-x-2" : ""
                      }`}
                      style={{ transitionDelay: isHovered ? `${index * 50}ms` : "0ms" }}
                    >
                      <div className="relative mr-3 flex-shrink-0">
                        <Check className="w-5 h-5 text-green-600" />
                        {isHovered && (
                          <div className="absolute inset-0 bg-green-600 rounded-full opacity-20 animate-ping" />
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
  )
}
