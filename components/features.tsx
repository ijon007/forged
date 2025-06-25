import { FileText, ImageIcon, Link, DollarSign, Zap, Users } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: FileText,
      title: "Smart Content Extraction",
      description: "AI automatically identifies and structures key information from your PDFs",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: ImageIcon,
      title: "Visual Enhancement",
      description: "Add custom images to make your courses more engaging and professional",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Link,
      title: "Instant Sharing",
      description: "Get a unique URL for each course that you can share anywhere",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: DollarSign,
      title: "Flexible Pricing",
      description: "Set your own course prices and keep full control of your earnings",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate complete courses in minutes, not hours or days",
      gradient: "from-red-500 to-pink-500",
    },
    {
      icon: Users,
      title: "Built for Creators",
      description: "Perfect for educators, consultants, and knowledge workers",
      gradient: "from-indigo-500 to-purple-500",
    },
  ]

  return (
    <section className="relative bg-white py-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] [background-size:20px_20px]" />

      <div className="container relative mx-auto px-4">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl">Why Choose Forged?</h2>
          <p className="mx-auto mb-16 max-w-2xl text-lg text-gray-600">
            No more boring PDFs written by ChatGPT. Create full-fledged courses that people actually want to buy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-gray-200 p-6 transition-all hover:border-transparent hover:shadow-2xl hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
            >
              {/* Gradient border on hover */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-sm`}
              />

              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} text-white transition-transform group-hover:scale-110 group-hover:rotate-3`}
              >
                <feature.icon className="h-6 w-6" />
              </div>

              <h3 className="mb-3 text-lg font-semibold text-black">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
