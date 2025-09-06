import { BookOpen, FileText, Sparkles, Upload } from "lucide-react";

export function EmptyState() {
  return (
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
      <h2 className="mb-3 font-bold text-3xl text-gray-900 dark:text-gray-100">
        Your knowledge empire starts here
      </h2>

      {/* Description */}
      <p className="mb-8 max-w-md text-gray-600 text-lg leading-relaxed dark:text-gray-400">
        Transform your PDFs into beautiful, sellable pages that generate passive
        income
      </p>

      {/* Feature highlights */}
      <div className="grid max-w-2xl gap-4 md:grid-cols-3">
        <div className="flex flex-col items-center rounded-lg border border-gray-200/50 bg-white/50 p-4">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <Upload className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
            Upload PDF
          </h3>
          <p className="text-center text-gray-600 text-sm dark:text-gray-400">
            Simply drag and drop your PDF
          </p>
        </div>

        <div className="flex flex-col items-center rounded-lg border border-gray-200/50 bg-white/50 p-4">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
            <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
            AI Transform
          </h3>
          <p className="text-center text-gray-600 text-sm dark:text-gray-400">
            AI creates beautiful blog-style pages
          </p>
        </div>

        <div className="flex flex-col items-center rounded-lg border border-gray-200/50 bg-white/50 p-4">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
            Start Selling
          </h3>
          <p className="text-center text-gray-600 text-sm dark:text-gray-400">
            Set your price and start earning
          </p>
        </div>
      </div>
    </div>
  );
}
