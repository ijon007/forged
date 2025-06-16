"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useState } from "react"

interface PlanSelectionProps {
  userId: string
}

export function PlanSelection({ userId }: PlanSelectionProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handlePlanSelect = async (plan: 'monthly' | 'yearly') => {
    setIsLoading(plan)
    
    // Your checkout URLs
    const monthlyCheckoutUrl = process.env.NEXT_PUBLIC_POLAR_MONTHLY_CHECKOUT!
    const yearlyCheckoutUrl = process.env.NEXT_PUBLIC_POLAR_YEARLY_CHECKOUT!
    
    const checkoutUrl = plan === 'monthly' ? monthlyCheckoutUrl : yearlyCheckoutUrl
    
    // Add metadata to track the user and plan
    const urlWithParams = new URL(checkoutUrl)
    urlWithParams.searchParams.set('user_id', userId)
    urlWithParams.searchParams.set('plan', plan)
    
    // Redirect to Polar checkout
    window.location.href = urlWithParams.toString()
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
                  <span className="text-6xl font-bold text-gray-900">$5</span>
                  <span className="text-xl text-gray-500 ml-1">/month</span>
                </div>
              </div>

              <Button 
                onClick={() => handlePlanSelect('monthly')}
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
                    $60
                  </span>
                  <span className="text-6xl font-bold text-gray-900">
                    $40
                  </span>
                </div>
                
                <div className="flex justify-center items-center text-green-700 font-semibold">
                  <span>Save $20 — 4 months free</span>
                </div>
              </div>

              <Button 
                onClick={() => handlePlanSelect('yearly')}
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