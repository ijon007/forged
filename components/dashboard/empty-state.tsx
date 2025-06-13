import { Button } from "@/components/ui/button"
import { CreateCourseDialog } from "@/components/create-course-dialog"
import { BookOpen, Upload, FileText, Sparkles } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[500px] bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/20">
      {/* Animated icon stack */}
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse">
          <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/20" />
        </div>
        <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <BookOpen className="h-10 w-10 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center animate-bounce">
          <Sparkles className="h-4 w-4 text-yellow-900" />
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        Your knowledge empire starts here
      </h2>
      
      {/* Description */}
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
        Transform your PDFs into beautiful, sellable pages that generate passive income
      </p>

      {/* Feature highlights */}
      <div className="grid gap-4 md:grid-cols-3 mb-10 max-w-2xl">
        <div className="flex flex-col items-center p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-3">
            <Upload className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Upload PDF</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Simply drag and drop your PDF
          </p>
        </div>
        
        <div className="flex flex-col items-center p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-3">
            <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">AI Transform</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            AI creates beautiful blog-style pages
          </p>
        </div>
        
        <div className="flex flex-col items-center p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-3">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Start Selling</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Set your price and start earning
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <CreateCourseDialog>
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <Upload className="mr-2 h-5 w-5" />
          Create Your First Page
        </Button>
      </CreateCourseDialog>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Free to start • No credit card required
      </p>
    </div>
  )
} 