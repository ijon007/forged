"use client"

import { useState, useEffect } from "react"
import { Sparkles, Edit3, Globe, BarChart3, DollarSign, ArrowRight, FileText, Eye } from "lucide-react"
import { features } from "@/constants/features"
import { Button } from "./ui/button"
import Link from "next/link"

export function Features() {
  const VisualDemo = ({ type }: { type: string }) => {
    // Monetize number animation state
    const [monetizeAmount, setMonetizeAmount] = useState(0);
    const [isMonetizeHovered, setIsMonetizeHovered] = useState(false);

    useEffect(() => {
      if (!isMonetizeHovered) {
        setMonetizeAmount(0);
        return;
      }
      let start = 0;
      const end = 1247;
      const duration = 700;
      const stepTime = 16;
      const steps = Math.ceil(duration / stepTime);
      let currentStep = 0;
      const increment = end / steps;
      const interval = setInterval(() => {
        currentStep++;
        setMonetizeAmount((prev) => {
          const next = prev + increment;
          if (currentStep >= steps) {
            clearInterval(interval);
            return end;
          }
          return next;
        });
      }, stepTime);
      return () => clearInterval(interval);
    }, [isMonetizeHovered]);

    return (
      <div className="relative w-full h-80">
        <div className="group/card bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl p-8 w-full h-full flex items-center justify-center overflow-hidden transition-all duration-500 hover:scale-105 will-change-transform">
          {/* Upload Demo */}
          {type === "upload" && (
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg border border-gray-200 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <div className="space-y-3 w-full">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-900 text-sm font-medium">document.pdf</span>
                  <div className="ml-auto w-2 h-2 rounded-full bg-gray-300 group-hover/card:bg-green-500 group-hover/card:animate-pulse transition-all duration-300" />
                </div>
                {/* Chips animate in on hover */}
                <div className="flex gap-2 mt-2 opacity-0 translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-500">
                  <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">Blog</div>
                  <div className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">Course</div>
                  <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">Listicle</div>
                </div>
                {/* Processing text animates in on hover */}
                <div className="text-xs text-gray-500 mt-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 delay-100">Processing...</div>
              </div>
            </div>
          )}
          {/* Generate Demo */}
          {type === "generate" && (
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg border border-gray-200 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-900 text-sm font-medium">AI Generation</span>
              </div>
              <div className="space-y-3 w-full">
                <div className="h-2 bg-gray-200 rounded w-full animate-pulse group-hover/card:animate-none transition-all duration-500" />
                <div className="h-2 bg-gray-200 rounded w-3/4 animate-pulse group-hover/card:animate-none transition-all duration-500" />
                <div className="h-2 bg-gray-200 rounded w-1/2 animate-pulse group-hover/card:animate-none transition-all duration-500" />
                {/* Animated content on hover */}
                <div className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 delay-100">
                  <div className="h-2 bg-gray-900 rounded w-full mt-2" />
                  <div className="h-2 bg-gray-900 rounded w-4/5 mt-2" />
                  <div className="text-xs text-green-600 mt-2 font-medium">✓ Content generated</div>
                </div>
              </div>
            </div>
          )}
          {/* Edit Demo */}
          {type === "edit" && (
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg border border-gray-200 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <Edit3 className="w-5 h-5 text-blue-500" />
                <span className="text-gray-900 text-sm font-medium">Live Editor</span>
                <div className="ml-auto">
                  <Eye className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <div className="space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="h-2 bg-gray-200 rounded flex-1" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full" />
                  <div className="h-2 bg-gray-200 rounded flex-1" />
                </div>
                {/* Animated bar on hover */}
                <div className="flex items-center gap-2 opacity-0 -translate-x-4 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <div className="h-2 bg-gray-900 rounded flex-1" />
                </div>
              </div>
            </div>
          )}
          {/* Publish Demo */}
          {type === "publish" && (
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg border border-gray-200 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-green-500" />
                <span className="text-gray-900 text-sm font-medium">Publishing</span>
              </div>
              <div className="space-y-3 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">Status</span>
                  <div className="flex items-center gap-2 text-red-500 group-hover/card:text-green-600 transition-colors duration-500">
                    <div className="w-2 h-2 rounded-full bg-red-500 group-hover/card:bg-green-500 group-hover/card:animate-pulse transition-all duration-500" />
                    <span className="text-xs font-medium group-hover/card:hidden">Draft</span>
                    <span className="text-xs font-medium hidden group-hover/card:inline">Live</span>
                  </div>
                </div>
                {/* URL box animates in on hover */}
                <div className="opacity-0 translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-500">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mt-2">
                    <div className="text-xs text-gray-500">Your URL:</div>
                    <div className="text-xs text-gray-900 font-medium">yoursite.com/course</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Analytics Demo */}
          {type === "analytics" && (
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg border border-gray-200 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span className="text-gray-900 text-sm font-medium">Analytics</span>
              </div>
              <div className="space-y-4 w-full">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-xs">Sales</span>
                  <span className="text-gray-900 text-sm font-medium">1,247</span>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {[30, 45, 60, 80, 35, 90, 70].map((height, i) => (
                    <div
                      key={i}
                      className="w-4 bg-blue-500 rounded-t transition-all duration-300 opacity-30 group-hover/card:opacity-100 group-hover/card:scale-110"
                      style={{ height: `${height}%`, transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Monetize Demo */}
          {type === "monetize" && (
            <div
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg border border-gray-200 flex flex-col items-center"
              onMouseEnter={() => setIsMonetizeHovered(true)}
              onMouseLeave={() => setIsMonetizeHovered(false)}
            >
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="text-gray-900 text-sm font-medium">Earnings</span>
              </div>
              <div className="space-y-4 w-full">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 transition-all duration-500 group-hover/card:scale-110">
                    ${Math.round(monetizeAmount).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">This month</div>
                </div>
                {/* Earnings details animate in on hover */}
                <div className="opacity-0 translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-500">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Platform fee</span>
                    <span className="text-green-600 font-medium">$0</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <section id="features" className="relative bg-white py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Forged allows you to create valuable content in seconds and monetize it with ease.
          </p>
        </div>
        {/* Features */}
        <div className="space-y-32 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`flex items-center gap-16 ${feature.reverse ? "flex-row-reverse" : ""} transition-transform duration-300`}
            >
              {/* Visual */}
              <div className="flex-1">
                <VisualDemo type={feature.visual} />
              </div>
              {/* Content */}
              <div className="flex-1 space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold text-black leading-tight">{feature.title}</h3>
                <p className="text-lg text-gray-600 leading-relaxed">{feature.description}</p>
                <Link href="/login">
                  <Button className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-5 rounded-full font-medium transition-all duration-200 hover:scale-105">
                    {feature.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
