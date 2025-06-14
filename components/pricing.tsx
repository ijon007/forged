import { Button } from "@/components/ui/button"
import { PencilLine, Sparkles } from "lucide-react"

export function Pricing() {
  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />

      <div className="container relative mx-auto px-4">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl">
            $5/mo — All-Access to Your Personal AI Playbook Studio
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Upload your notes or PDFs, generate beautiful AI-crafted playbooks, set your price, and keep 100% of every sale.
          </p>
        </div>

        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
          {/* Monthly Plan */}
          <div className="group relative rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-2xl transition-all hover:border-transparent hover:shadow-3xl hover:-translate-y-2">
            {/* Badge */}
            {/* <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                <Sparkles className="mr-1 h-4 w-4" />
                Most Popular
              </div>
            </div> */}

            <div className="text-center flex flex-col items-center">
              <div className="mb-6">
                <span className="text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  $5
                </span>
                <span className="text-gray-600">/month</span>
              </div>

              <Button className="mb-6 py-6 w-full bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black transition-all hover:scale-105 hover:shadow-xl rounded-2xl">
                <PencilLine className="mr-2 h-4 w-4" />
                Start Creating
              </Button>

              <ul className="mt-3 space-y-2 text-center text-gray-700 text-sm">
                <li>✔️ Unlimited playbooks, hosted & shareable</li>
                <li>✔️ No platform fees — your earnings are all yours</li>
              </ul>
            </div>
          </div>

          {/* Yearly Plan */}
          <div className="group relative rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-2xl transition-all hover:border-transparent hover:shadow-3xl hover:-translate-y-2">
            <div className="text-center flex flex-col items-center">
              <div className="mb-6">
                <span className="text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  $40
                </span>
                <span className="text-gray-600">/year</span>
              </div>

              <Button className="mb-6 py-6 w-full bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black transition-all hover:scale-105 hover:shadow-xl rounded-2xl">
                <PencilLine className="mr-2 h-4 w-4" />
                Get 4 Months Free
              </Button>

              <ul className="mt-3 space-y-2 text-center text-gray-700 text-sm">
                <li>✔️ Everything in monthly, billed yearly</li>
                <li>✔️ Save $20 — get 4 months free</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
