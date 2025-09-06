"use client";

import {
  ArrowRight,
  BarChart3,
  DollarSign,
  Edit3,
  Eye,
  FileText,
  Globe,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { features } from "@/constants/features";
import { Button } from "./ui/button";

export function Features({ page = false }: { page?: boolean }) {
  const VisualDemo = ({ type }: { type: string }) => {
    // Monetize number animation state
    const [monetizeAmount, setMonetizeAmount] = useState(0);
    const [isMonetizeHovered, setIsMonetizeHovered] = useState(false);

    useEffect(() => {
      if (!isMonetizeHovered) {
        setMonetizeAmount(0);
        return;
      }
      const start = 0;
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
      <div className="relative h-80 w-full">
        <div className="group/card flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 p-8 transition-all duration-500 will-change-transform hover:scale-105">
          {/* Upload Demo */}
          {type === "upload" && (
            <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="w-full space-y-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-orange-500" />
                  <span className="font-medium text-gray-900 text-sm">
                    document.pdf
                  </span>
                  <div className="ml-auto h-2 w-2 rounded-full bg-gray-300 transition-all duration-300 group-hover/card:animate-pulse group-hover/card:bg-green-500" />
                </div>
                {/* Chips animate in on hover */}
                <div className="mt-2 flex translate-y-4 gap-2 opacity-0 transition-all duration-500 group-hover/card:translate-y-0 group-hover/card:opacity-100">
                  <div className="rounded-md bg-blue-100 px-2 py-1 font-medium text-blue-700 text-xs">
                    Blog
                  </div>
                  <div className="rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-700 text-xs">
                    Course
                  </div>
                  <div className="rounded-md bg-green-100 px-2 py-1 font-medium text-green-700 text-xs">
                    Listicle
                  </div>
                </div>
                {/* Processing text animates in on hover */}
                <div className="mt-2 text-gray-500 text-xs opacity-0 transition-opacity delay-100 duration-500 group-hover/card:opacity-100">
                  Processing...
                </div>
              </div>
            </div>
          )}
          {/* Generate Demo */}
          {type === "generate" && (
            <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <span className="font-medium text-gray-900 text-sm">
                  AI Generation
                </span>
              </div>
              <div className="w-full space-y-3">
                <div className="h-2 w-full animate-pulse rounded bg-gray-200 transition-all duration-500 group-hover/card:animate-none" />
                <div className="h-2 w-3/4 animate-pulse rounded bg-gray-200 transition-all duration-500 group-hover/card:animate-none" />
                <div className="h-2 w-1/2 animate-pulse rounded bg-gray-200 transition-all duration-500 group-hover/card:animate-none" />
                {/* Animated content on hover */}
                <div className="opacity-0 transition-opacity delay-100 duration-500 group-hover/card:opacity-100">
                  <div className="mt-2 h-2 w-full rounded bg-gray-900" />
                  <div className="mt-2 h-2 w-4/5 rounded bg-gray-900" />
                  <div className="mt-2 font-medium text-green-600 text-xs">
                    ✓ Content generated
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Edit Demo */}
          {type === "edit" && (
            <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-gray-900 text-sm">
                  Live Editor
                </span>
                <div className="ml-auto">
                  <Eye className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="w-full space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <div className="h-2 flex-1 rounded bg-gray-200" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gray-300" />
                  <div className="h-2 flex-1 rounded bg-gray-200" />
                </div>
                {/* Animated bar on hover */}
                <div className="-translate-x-4 flex items-center gap-2 opacity-0 transition-all duration-500 group-hover/card:translate-x-0 group-hover/card:opacity-100">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <div className="h-2 flex-1 rounded bg-gray-900" />
                </div>
              </div>
            </div>
          )}
          {/* Publish Demo */}
          {type === "publish" && (
            <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-500" />
                <span className="font-medium text-gray-900 text-sm">
                  Publishing
                </span>
              </div>
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">Status</span>
                  <div className="flex items-center gap-2 text-red-500 transition-colors duration-500 group-hover/card:text-green-600">
                    <div className="h-2 w-2 rounded-full bg-red-500 transition-all duration-500 group-hover/card:animate-pulse group-hover/card:bg-green-500" />
                    <span className="font-medium text-xs group-hover/card:hidden">
                      Draft
                    </span>
                    <span className="hidden font-medium text-xs group-hover/card:inline">
                      Live
                    </span>
                  </div>
                </div>
                {/* URL box animates in on hover */}
                <div className="translate-y-4 opacity-0 transition-all duration-500 group-hover/card:translate-y-0 group-hover/card:opacity-100">
                  <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="text-gray-500 text-xs">Your URL:</div>
                    <div className="font-medium text-gray-900 text-xs">
                      yoursite.com/course
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Analytics Demo */}
          {type === "analytics" && (
            <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-gray-900 text-sm">
                  Analytics
                </span>
              </div>
              <div className="w-full space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-xs">Sales</span>
                  <span className="font-medium text-gray-900 text-sm">
                    1,247
                  </span>
                </div>
                <div className="flex h-16 items-end gap-1">
                  {[30, 45, 60, 80, 35, 90, 70].map((height, i) => (
                    <div
                      className="w-4 rounded-t bg-blue-500 opacity-30 transition-all duration-300 group-hover/card:scale-110 group-hover/card:opacity-100"
                      key={i}
                      style={{
                        height: `${height}%`,
                        transitionDelay: `${i * 50}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Monetize Demo */}
          {type === "monetize" && (
            <div
              className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
              onMouseEnter={() => setIsMonetizeHovered(true)}
              onMouseLeave={() => setIsMonetizeHovered(false)}
            >
              <div className="mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="font-medium text-gray-900 text-sm">
                  Earnings
                </span>
              </div>
              <div className="w-full space-y-4">
                <div className="text-center">
                  <div className="font-bold text-3xl text-gray-900 transition-all duration-500 group-hover/card:scale-110">
                    ${Math.round(monetizeAmount).toLocaleString()}
                  </div>
                  <div className="text-gray-500 text-xs">This month</div>
                </div>
                {/* Earnings details animate in on hover */}
                <div className="translate-y-4 opacity-0 transition-all duration-500 group-hover/card:translate-y-0 group-hover/card:opacity-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Platform fee</span>
                    <span className="font-medium text-green-600">$0</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="relative bg-white py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-20 text-center">
          <h2 className="mb-6 font-bold text-4xl text-black md:text-5xl">
            Features
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 text-xl">
            Forged allows you to create valuable content in seconds and monetize
            it with ease.
          </p>
        </div>
        {/* Features */}
        <div className="mx-auto max-w-5xl space-y-32">
          {features.map((feature, index) => (
            <div
              className={`flex ${page ? "flex-col" : `flex-col lg:flex-row ${feature.reverse ? "lg:flex-row-reverse" : ""}`} items-center gap-16 transition-transform duration-300`}
              key={feature.id}
            >
              {/* Visual */}
              <div className="w-full flex-1">
                <VisualDemo type={feature.visual} />
              </div>
              {/* Content */}
              <div className="flex-1 space-y-6">
                <h3 className="font-bold text-3xl text-black leading-tight md:text-4xl">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {page ? feature.longDescription : feature.description}
                </p>
                <Link href="/dashboard">
                  <Button className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-5 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-gray-800">
                    {feature.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
