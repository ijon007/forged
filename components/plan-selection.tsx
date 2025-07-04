"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { Check } from "lucide-react"
import { useState } from "react"

export function PlanSelection() {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const buyMonthlyPlan = async () => {
    setIsLoading('monthly')
    await authClient.checkout({
      products: ["4106f4b6-7fe4-4878-a585-e841be593ea1"],
      slug: "forged",
    });
  }

  const buyYearlyPlan = async () => {
    setIsLoading('yearly')
    await authClient.checkout({
      products: ["3196f5a1-28d3-4c44-9758-bb82bd1e38e9"],
      slug: "forged-yearly",
    });
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Monthly Plan */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
          <div className="relative rounded-3xl border border-gray-200 bg-white p-10 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="text-center flex flex-col items-center">
              <div className="mb-8">
                <div className="inline-block px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-semibold uppercase tracking-wide mb-4">
                  Monthly Plan
                </div>
                
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-6xl font-bold text-gray-900">$20</span>
                  <span className="text-xl text-gray-500 ml-1">/month</span>
                </div>
              </div>

              <Button 
                onClick={() => buyMonthlyPlan()}
                disabled={isLoading !== null}
                className="mb-8 py-6 w-full bg-black text-white hover:bg-gray-800 transition-all hover:scale-105 hover:shadow-lg rounded-2xl font-semibold"
              >
                {isLoading === 'monthly' ? 'Loading...' : 'Start Creating'}
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
                <div className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Yearly Plan */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
          <div className="relative rounded-3xl border border-gray-200 bg-white p-10 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="text-center flex flex-col items-center">
              <div className="mb-8">
                <div className="inline-block px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-semibold uppercase tracking-wide mb-4">
                  Yearly Plan
                </div>
                
                <div className="flex items-baseline justify-center mb-2 gap-3">
                  <span className="text-3xl font-semibold text-gray-400 line-through select-none">
                    $240
                  </span>
                  <span className="text-6xl font-bold text-gray-900">
                    $160
                  </span>
                </div>
                
                <div className="flex justify-center items-center text-green-700 font-semibold">
                  <span>Save $80 — 4 months free</span>
                </div>
              </div>

              <Button 
                onClick={() => buyYearlyPlan()}
                disabled={isLoading !== null}
                className="mb-8 py-6 w-full bg-black text-white hover:bg-gray-800 transition-all hover:scale-105 hover:shadow-lg rounded-2xl font-semibold"
              >
                {isLoading === 'yearly' ? 'Loading...' : 'Start Creating'}
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
                <div className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                  <span>Billed yearly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 