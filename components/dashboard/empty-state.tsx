import { BookOpen, Upload, FileText, Sparkles } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[500px] bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-100">
      {/* Animated icon stack */}
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse">
          <div className="w-20 h-20 rounded-full bg-black" />
        </div>
        <div className="relative z-10 w-20 h-20 rounded-full bg-black flex items-center justify-center">
          <BookOpen className="h-10 w-10 text-white" />
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
      <div className="grid gap-4 md:grid-cols-3 max-w-2xl">
        <div className="flex flex-col items-center p-4 rounded-lg bg-white/50 border border-gray-200/50">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-3">
            <Upload className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Upload PDF</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Simply drag and drop your PDF
          </p>
        </div>
        
        <div className="flex flex-col items-center p-4 rounded-lg bg-white/50 border border-gray-200/50">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-3">
            <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">AI Transform</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            AI creates beautiful blog-style pages
          </p>
        </div>
        
        <div className="flex flex-col items-center p-4 rounded-lg bg-white/50 border border-gray-200/50">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Start Selling</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Set your price and start earning
          </p>
        </div>
      </div>
    </div>
  )
} 