import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, Zap, DollarSign, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 opacity-60" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />

      <div className="container relative mx-auto px-4 py-20 lg:py-32">
        <div className="text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm text-gray-600 transition-all hover:bg-white hover:shadow-lg hover:scale-105 cursor-default">
            <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
            Turn your knowledge into income
            <div className="ml-2 h-1 w-1 rounded-full bg-green-500 animate-pulse" />
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-black sm:text-6xl lg:text-7xl">
            Create & Sell Your Custom
            <br />
            <span className="relative">
              <span className="bg-gradient-to-r from-gray-900 via-black to-gray-700 bg-clip-text text-transparent">
                AI‑Powered Playbook
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black to-transparent opacity-20" />
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 sm:text-xl leading-relaxed">
            Upload your notes, generate beautifully formatted content, and start earning, no writing required.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button
                size="lg"
                className="group relative bg-black text-white hover:bg-gray-800 rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">Generate Playbook</span>
                <ArrowRight className="relative ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                icon: Upload,
                title: "Upload PDF",
                desc: "Simply drag and drop your notes or documents",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Zap,
                title: "AI Generation",
                desc: "Get structured courses with key points automatically",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: DollarSign,
                title: "Start Earning",
                desc: "Set your price and share your course with the world",
                color: "from-green-500 to-emerald-500",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group cursor-pointer rounded-2xl border border-gray-200 p-6 transition-all hover:border-gray-300 hover:shadow-xl hover:-translate-y-2 bg-white/50 backdrop-blur-sm"
              >
                <div
                  className={`mx-auto mb-4 h-12 w-12 rounded-xl bg-gradient-to-r ${item.color} p-3 transition-transform group-hover:scale-110 group-hover:rotate-3`}
                >
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 font-semibold text-black">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
