import {
  ArrowRight,
  BookOpen,
  Code,
  DollarSign,
  FileText,
  PhoneCall,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-white">
      {/* Enhanced background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />

      {/* Animated grid pattern */}
      <div className="absolute inset-0 animate-pulse bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />

      {/* Multiple floating orbs with different sizes and animations */}
      <div className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-gradient-to-r from-purple-200 to-pink-200 opacity-40 mix-blend-multiply blur-2xl filter" />
      <div className="animation-delay-2000 absolute top-40 right-10 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 opacity-30 mix-blend-multiply blur-2xl filter" />
      <div className="animation-delay-1000 absolute bottom-20 left-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-green-200 to-emerald-200 opacity-35 mix-blend-multiply blur-2xl filter" />

      {/* Floating elements representing the product - Hidden on mobile, visible and positioned on lg+ */}
      <div className="absolute top-32 left-12 hidden animate-float lg:left-16 lg:block xl:left-24">
        <div className="rotate-12 rounded-2xl border border-gray-200/50 bg-white/80 p-7 shadow-xl backdrop-blur-sm transition-transform duration-700 hover:rotate-6">
          <FileText className="mb-3 h-11 w-11 text-gray-700" />
          <div className="mb-2 h-3 w-22 rounded bg-gray-200" />
          <div className="h-3 w-18 rounded bg-gray-100" />
        </div>
      </div>

      <div className="animation-delay-1000 absolute top-48 right-12 hidden animate-float lg:right-16 lg:block xl:right-24">
        <div className="-rotate-12 hover:-rotate-6 rounded-2xl border border-gray-200/50 bg-white/80 p-7 shadow-xl backdrop-blur-sm transition-transform duration-700">
          <Zap className="mb-3 h-11 w-11 text-purple-600" />
          <div className="mb-2 h-3 w-26 rounded bg-purple-100" />
          <div className="h-3 w-22 rounded bg-purple-50" />
        </div>
      </div>

      <div className="animation-delay-2000 absolute right-12 bottom-40 hidden animate-float lg:right-16 lg:block xl:right-24">
        <div className="rotate-6 rounded-2xl border border-gray-200/50 bg-white/80 p-7 shadow-xl backdrop-blur-sm transition-transform duration-700 hover:rotate-3">
          <DollarSign className="mb-3 h-11 w-11 text-green-600" />
          <div className="mb-2 h-3 w-20 rounded bg-green-100" />
          <div className="h-3 w-24 rounded bg-green-50" />
        </div>
      </div>

      {/* Animated code snippet */}
      <div className="animation-delay-400 absolute top-60 left-12 hidden animate-float lg:left-16 lg:block xl:left-24">
        <div className="rotate-3 rounded-xl border border-gray-700/50 bg-gray-900/90 p-5 shadow-2xl backdrop-blur-sm transition-transform duration-700 hover:rotate-1">
          <div className="mb-3 flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-red-400" />
            <div className="mr-2 h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <Code className="mb-2 h-7 w-7 text-green-400" />
          <div className="mb-2 h-2 w-22 rounded bg-green-400/60" />
          <div className="mb-2 h-2 w-18 rounded bg-blue-400/60" />
          <div className="h-2 w-20 rounded bg-purple-400/60" />
        </div>
      </div>

      {/* Floating book/course representation */}
      <div className="animation-delay-1500 absolute bottom-32 left-12 hidden animate-float lg:left-16 lg:block xl:left-24">
        <div className="-rotate-6 hover:-rotate-3 rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50 p-7 shadow-xl backdrop-blur-sm transition-transform duration-700">
          <BookOpen className="mb-3 h-11 w-11 text-blue-600" />
          <div className="mb-2 h-3 w-24 rounded bg-blue-100" />
          <div className="mb-2 h-3 w-22 rounded bg-blue-50" />
          <div className="h-3 w-20 rounded bg-gray-100" />
        </div>
      </div>

      {/* Trending/earnings indicator */}
      <div className="animation-delay-800 absolute top-80 right-12 hidden animate-float lg:right-16 lg:block xl:right-24">
        <div className="rotate-12 rounded-2xl border border-gray-200/50 bg-white/90 p-5 shadow-xl backdrop-blur-sm transition-transform duration-700 hover:rotate-6">
          <TrendingUp className="mb-2 h-9 w-9 text-emerald-600" />
          <div className="flex space-x-2">
            <div className="h-6 w-2 rounded bg-emerald-200" />
            <div className="h-8 w-2 rounded bg-emerald-300" />
            <div className="h-10 w-2 rounded bg-emerald-400" />
            <div className="h-8 w-2 rounded bg-emerald-300" />
            <div className="h-12 w-2 rounded bg-emerald-500" />
          </div>
        </div>
      </div>

      {/* Animated connecting lines - Hidden on mobile */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <svg className="h-full w-full opacity-10">
          <defs>
            <linearGradient
              id="lineGradient"
              x1="0%"
              x2="100%"
              y1="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <path
            className="animate-pulse"
            d="M 200 300 Q 400 200 600 350 T 800 300"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
          />
          <path
            className="animation-delay-1000 animate-pulse"
            d="M 150 500 Q 350 400 550 550 T 750 500"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="container relative z-10 mx-auto px-4 py-20 lg:py-32">
        <div className="text-center">
          <Link
            className="mb-8 inline-flex cursor-pointer items-center rounded-full border border-gray-200 bg-white/90 px-6 py-3 text-gray-600 text-sm shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white hover:shadow-xl"
            href="https://cal.com/ijon4/15min"
            target="_blank"
          >
            <Sparkles className="mr-2 h-4 w-4 animate-pulse text-yellow-500" />
            Book a 15 min call
            <ArrowRight className="ml-2" size={16} />
          </Link>

          <h1 className="relative mb-6 text-start font-bold text-5xl text-black tracking-tight sm:text-center lg:text-6xl xl:text-7xl">
            <span className="inline-block animate-fade-in-up">
              Create & Sell Your Custom
            </span>
            <br />
            <span className="animation-delay-200 relative inline-block animate-fade-in-up">
              <span className="animate-gradient bg-gradient-to-r from-gray-900 via-black to-gray-700 bg-clip-text text-transparent">
                AI‑Powered Playbook
              </span>
              <div className="-bottom-2 absolute right-0 left-0 h-1 animate-pulse bg-gradient-to-r from-transparent via-black to-transparent opacity-20" />

              {/* Floating sparkles around the text */}
              <div className="-top-4 -right-4 absolute h-2 w-2 animate-ping rounded-full bg-yellow-400" />
              <div className="-bottom-4 -left-4 animation-delay-1000 absolute h-1 w-1 animate-ping rounded-full bg-purple-400" />
              <div className="-right-8 animation-delay-2000 absolute top-1/2 h-1.5 w-1.5 animate-ping rounded-full bg-blue-400" />
            </span>
          </h1>

          <p className="animation-delay-400 mx-auto mb-8 max-w-2xl animate-fade-in-up text-start text-gray-600 text-lg leading-relaxed sm:text-center sm:text-lg lg:text-xl">
            Upload your notes, generate beautifully formatted content, and start
            earning, no writing required.
          </p>

          <div className="animation-delay-600 flex animate-fade-in-up flex-col items-start justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button
                className="group relative w-full overflow-hidden rounded-2xl bg-black px-10 py-6 text-white transition-all hover:scale-105 hover:bg-gray-800 hover:shadow-2xl sm:w-auto"
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative">Generate Playbook</span>
                <ArrowRight className="relative ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
