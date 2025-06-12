import { Upload, Brain, Share2 } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your PDF",
      description: "Drop your notes, documents, or any PDF with valuable knowledge",
      step: "01",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: "AI Extracts Key Points",
      description:
        "Our AI analyzes your content and creates structured courses with titles, summaries, and bullet points",
      step: "02",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Share2,
      title: "Share & Earn",
      description: "Set your pricing, add images, and share your course with a unique URL",
      step: "03",
      gradient: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl">How It Works</h2>
          <p className="mx-auto mb-16 max-w-2xl text-lg text-gray-600">
            Transform your knowledge into income in just three simple steps
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              <div className="relative rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-4 border border-gray-100">
                <div className="mb-6 flex items-center">
                  <div
                    className={`mr-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${step.gradient} text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <step.icon className="h-8 w-8" />
                  </div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                    {step.step}
                  </span>
                </div>

                <h3 className="mb-4 text-xl font-semibold text-black">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>

                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-200 via-white to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-sm" />
              </div>

              {/* Animated connection line */}
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden h-px w-8 -translate-y-1/2 translate-x-full md:block">
                  <div className="h-full w-full bg-gradient-to-r from-gray-300 to-gray-400 animate-pulse" />
                  <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1 rounded-full bg-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
