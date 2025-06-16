"use client"

import { Button } from "@/components/ui/button"
import { PencilLine, Check } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const router = useRouter()

  const handleStartCreating = () => {
    // Always redirect to login from landing page
    router.push('/login')
  }

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 overflow-hidden">
      {/* Subtle Background elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-gray-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gray-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-2000" />

      <div className="container relative mx-auto px-4">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl">
            Pricing
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Upload your notes or PDFs, generate beautiful AI-crafted playbooks, set your price, and keep 100% of every sale.
          </p>
        </div>

        {/* Toggle */}
        <div className="mb-10 flex justify-center">
          <div className="relative bg-gray-100 rounded-full p-1 flex items-center">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
                !isYearly
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
                isYearly
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Single Pricing Card */}
        <div className="flex justify-center">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
            <div className="relative rounded-3xl border border-gray-200 bg-white p-10 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="text-center flex flex-col items-center">
                <div className="mb-8">
                  <div className="inline-block px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-semibold uppercase tracking-wide mb-4">
                    {isYearly ? "Yearly Plan" : "Monthly Plan"}
                  </div>
                  
                  {isYearly ? (
                    <div className="flex items-baseline justify-center mb-2 gap-3">
                      <span className="text-3xl font-semibold text-gray-400 line-through select-none">
                        $60
                      </span>
                      <span className="text-6xl font-bold text-gray-900">
                        $40
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-6xl font-bold text-gray-900">
                        $5
                      </span>
                    </div>
                  )}
                  
                  {isYearly && (
                    <div className="flex justify-center items-center text-green-700 font-semibold">
                      <span>Save $20 — 4 months free</span>
                    </div>
                  )}
                </div>

                <Button className="mb-8 py-6 w-full bg-black text-white hover:bg-gray-800 transition-all hover:scale-105 hover:shadow-lg rounded-2xl font-semibold">
                  <PencilLine className="mr-2 h-4 w-4" />
                  Start Creating
                </Button>

                <div className="space-y-4 w-full">
                  <div className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                    <span>Unlimited generations</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                    <span>Hosted & Shareable</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                    <span>No platform fees - Earnings are all yours</span>
                  </div>
                  {isYearly && (
                    <div className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                      <span>Billed yearly</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
