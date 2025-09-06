"use client";

import { ArrowRight, BookOpen, FileText, Sparkles, Upload } from "lucide-react";
import { useState } from "react";
import { GoogleLoginButton } from "@/components/login/login-google";
import { PlanSelection } from "@/components/plan-selection";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DashboardPageProps {
  showPlanSelection?: boolean;
}

export function DashboardPage({
  showPlanSelection = false,
}: DashboardPageProps) {
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(showPlanSelection);

  return (
    <>
      <div className="bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
        <div className="z-10 mx-auto my-5 w-11/12 space-y-8 lg:my-10 lg:max-w-7xl">
          {/* Dashboard Header */}
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-row items-center justify-between gap-2">
                <h1 className="bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text font-bold text-2xl text-transparent tracking-tight sm:text-3xl lg:text-4xl">
                  Dashboard
                </h1>
              </div>
              <Button
                className="group relative w-full overflow-hidden rounded-xl bg-black text-white transition-all hover:scale-105 hover:bg-neutral-800 hover:shadow-2xl sm:w-auto"
                onClick={() => setIsPlanDialogOpen(true)}
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-black opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative">Create Page</span>
                <ArrowRight className="relative ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="space-y-6">
            <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-12 text-center">
              {/* Animated icon stack */}
              <div className="relative mb-8">
                <div className="absolute inset-0 animate-pulse">
                  <div className="h-20 w-20 rounded-full bg-black" />
                </div>
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-black">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Heading */}
              <h2 className="mb-3 font-bold text-3xl text-neutral-900 dark:text-neutral-100">
                {showPlanSelection
                  ? "Ready to create your first page?"
                  : "Welcome to Forged"}
              </h2>

              {/* Description */}
              <p className="mb-8 max-w-md text-lg text-neutral-600 leading-relaxed dark:text-neutral-400">
                {showPlanSelection
                  ? "Transform your PDFs into beautiful, sellable pages that generate passive income"
                  : "Sign in to your account to start creating and selling your content"}
              </p>

              {/* CTA Button */}
              {showPlanSelection ? (
                <Button
                  className="group relative mb-8 overflow-hidden rounded-xl bg-black text-white transition-all hover:bg-neutral-800"
                  onClick={() => setIsPlanDialogOpen(true)}
                  size="lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-black opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="relative">
                    Get Started - Choose Your Plan
                  </span>
                  <ArrowRight className="relative ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              ) : (
                <div className="mb-8">
                  <GoogleLoginButton />
                </div>
              )}

              {/* Feature highlights */}
              <div className="grid max-w-2xl gap-4 md:grid-cols-3">
                <div className="flex flex-col items-center rounded-lg border border-neutral-200/50 bg-white/50 p-4">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <Upload className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="mb-1 font-semibold text-neutral-900 dark:text-neutral-100">
                    Upload PDF
                  </h3>
                  <p className="text-center text-neutral-600 text-sm dark:text-neutral-400">
                    Simply drag and drop your PDF
                  </p>
                </div>

                <div className="flex flex-col items-center rounded-lg border border-neutral-200/50 bg-white/50 p-4">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                    <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="mb-1 font-semibold text-neutral-900 dark:text-neutral-100">
                    AI Transform
                  </h3>
                  <p className="text-center text-neutral-600 text-sm dark:text-neutral-400">
                    AI creates beautiful blog-style pages
                  </p>
                </div>

                <div className="flex flex-col items-center rounded-lg border border-neutral-200/50 bg-white/50 p-4">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-1 font-semibold text-neutral-900 dark:text-neutral-100">
                    Start Selling
                  </h3>
                  <p className="text-center text-neutral-600 text-sm dark:text-neutral-400">
                    Set your price and start earning
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog onOpenChange={setIsPlanDialogOpen} open={isPlanDialogOpen}>
        <DialogContent className="w-[500px]" showCloseButton={false}>
          <DialogHeader className="sr-only">
            <DialogTitle className="mb-6 text-center font-bold text-2xl">
              Choose Your Plan
            </DialogTitle>
          </DialogHeader>
          <PlanSelection />
        </DialogContent>
      </Dialog>
    </>
  );
}
