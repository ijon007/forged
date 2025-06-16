import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, FileText, Zap, DollarSign, Code, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white min-h-screen flex items-center">
      {/* Enhanced background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse opacity-30" />

      {/* Multiple floating orbs with different sizes and animations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse animation-delay-2000" />
      <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full mix-blend-multiply filter blur-2xl opacity-35 animate-pulse animation-delay-1000" />

      {/* Floating elements representing the product - Hidden on mobile, visible and positioned on lg+ */}
      <div className="hidden lg:block absolute top-32 left-12 lg:left-16 xl:left-24 animate-float">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-7 shadow-xl border border-gray-200/50 rotate-12 hover:rotate-6 transition-transform duration-700">
          <FileText className="h-11 w-11 text-gray-700 mb-3" />
          <div className="w-22 h-3 bg-gray-200 rounded mb-2" />
          <div className="w-18 h-3 bg-gray-100 rounded" />
        </div>
      </div>

      <div className="hidden lg:block absolute top-48 right-12 lg:right-16 xl:right-24 animate-float animation-delay-1000">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-7 shadow-xl border border-gray-200/50 -rotate-12 hover:-rotate-6 transition-transform duration-700">
          <Zap className="h-11 w-11 text-purple-600 mb-3" />
          <div className="w-26 h-3 bg-purple-100 rounded mb-2" />
          <div className="w-22 h-3 bg-purple-50 rounded" />
        </div>
      </div>

      <div className="hidden lg:block absolute bottom-40 right-12 lg:right-16 xl:right-24 animate-float animation-delay-2000">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-7 shadow-xl border border-gray-200/50 rotate-6 hover:rotate-3 transition-transform duration-700">
          <DollarSign className="h-11 w-11 text-green-600 mb-3" />
          <div className="w-20 h-3 bg-green-100 rounded mb-2" />
          <div className="w-24 h-3 bg-green-50 rounded" />
        </div>
      </div>

      {/* Animated code snippet */}
      <div className="hidden lg:block absolute top-60 left-12 lg:left-16 xl:left-24 animate-float animation-delay-400">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-5 shadow-2xl border border-gray-700/50 rotate-3 hover:rotate-1 transition-transform duration-700">
          <div className="flex items-center mb-3">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-2" />
            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2" />
            <div className="w-3 h-3 bg-green-400 rounded-full" />
          </div>
          <Code className="h-7 w-7 text-green-400 mb-2" />
          <div className="w-22 h-2 bg-green-400/60 rounded mb-2" />
          <div className="w-18 h-2 bg-blue-400/60 rounded mb-2" />
          <div className="w-20 h-2 bg-purple-400/60 rounded" />
        </div>
      </div>

      {/* Floating book/course representation */}
      <div className="hidden lg:block absolute bottom-32 left-12 lg:left-16 xl:left-24 animate-float animation-delay-1500">
        <div className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm rounded-2xl p-7 shadow-xl border border-gray-200/50 -rotate-6 hover:-rotate-3 transition-transform duration-700">
          <BookOpen className="h-11 w-11 text-blue-600 mb-3" />
          <div className="w-24 h-3 bg-blue-100 rounded mb-2" />
          <div className="w-22 h-3 bg-blue-50 rounded mb-2" />
          <div className="w-20 h-3 bg-gray-100 rounded" />
        </div>
      </div>

      {/* Trending/earnings indicator */}
      <div className="hidden lg:block absolute top-80 right-12 lg:right-16 xl:right-24 animate-float animation-delay-800">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-gray-200/50 rotate-12 hover:rotate-6 transition-transform duration-700">
          <TrendingUp className="h-9 w-9 text-emerald-600 mb-2" />
          <div className="flex space-x-2">
            <div className="w-2 h-6 bg-emerald-200 rounded" />
            <div className="w-2 h-8 bg-emerald-300 rounded" />
            <div className="w-2 h-10 bg-emerald-400 rounded" />
            <div className="w-2 h-8 bg-emerald-300 rounded" />
            <div className="w-2 h-12 bg-emerald-500 rounded" />
          </div>
        </div>
      </div>

      {/* Animated connecting lines - Hidden on mobile */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-10">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <path
            d="M 200 300 Q 400 200 600 350 T 800 300"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M 150 500 Q 350 400 550 550 T 750 500"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse animation-delay-1000"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="container relative mx-auto px-4 py-20 lg:py-32 z-10">
        <div className="text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm px-6 py-3 text-sm text-gray-600 transition-all hover:bg-white hover:shadow-xl hover:scale-105 cursor-default shadow-lg">
            <Sparkles className="mr-2 h-4 w-4 text-yellow-500 animate-pulse" />
            Turn your knowledge into income
            <div className="ml-3 flex space-x-1">
              <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
              <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse animation-delay-200" />
              <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse animation-delay-400" />
            </div>
          </div>

          <h1 className="mb-6 text-3xl font-bold tracking-tight text-black sm:text-5xl lg:text-6xl xl:text-7xl relative">
            <span className="inline-block animate-fade-in-up">Create & Sell Your Custom</span>
            <br />
            <span className="relative inline-block animate-fade-in-up animation-delay-200">
              <span className="bg-gradient-to-r from-gray-900 via-black to-gray-700 bg-clip-text text-transparent animate-gradient">
                AI‑Powered Playbook
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black to-transparent opacity-20 animate-pulse" />

              {/* Floating sparkles around the text */}
              <div className="absolute -top-4 -right-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
              <div className="absolute -bottom-4 -left-4 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-1000" />
              <div className="absolute top-1/2 -right-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping animation-delay-2000" />
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base text-gray-600 sm:text-lg lg:text-xl leading-relaxed animate-fade-in-up animation-delay-400">
            Upload your notes, generate beautifully formatted content, and start earning, no writing required.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up animation-delay-600">
            <Link href="/login">
            <Button
              size="lg"
              className="group relative bg-black text-white hover:bg-gray-800 rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl w-full py-6 px-10 sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">Generate Playbook</span>
              <ArrowRight className="relative ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
