import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"

export function Pricing() {
  const features = [
    "Unlimited PDF uploads",
    "AI-powered course generation",
    "Custom pricing for your courses",
    "Image uploads and customization",
    "Unique shareable URLs",
    "Analytics and insights",
    "Priority support",
  ]

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />

      <div className="container relative mx-auto px-4">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mx-auto mb-16 max-w-2xl text-lg text-gray-600">
            Start monetizing your knowledge today for just $5 per month
          </p>
        </div>

        <div className="mx-auto max-w-md">
          <div className="group relative rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-2xl transition-all hover:border-transparent hover:shadow-3xl hover:-translate-y-2">
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-sm" />

            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                <Sparkles className="mr-1 h-4 w-4" />
                Most Popular
              </div>
            </div>

            <div className="text-center">
              <h3 className="mb-2 text-2xl font-bold text-black">Pro Plan</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  $5
                </span>
                <span className="text-gray-600">/month</span>
              </div>

              <Button className="mb-8 w-full bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black transition-all hover:scale-105 hover:shadow-xl rounded-xl">
                Start Your Journey
              </Button>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center group/item">
                  <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-transform group-hover/item:scale-110">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-700 group-hover/item:text-black transition-colors">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 p-4">
              <p className="text-center text-sm text-gray-600">
                <strong>No setup fees.</strong> Cancel anytime. Start earning from day one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
