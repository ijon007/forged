import { testimonials } from "@/constants/testimonials"
import { Star, Quote, Clock } from "lucide-react"
import Image from "next/image"

const TestimonialBlogCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-gray-300 hover:-translate-y-2">
      <div className="p-6 border-b border-gray-100">
        <Quote className="absolute top-4 right-4 h-6 w-6 text-gray-300 group-hover:text-gray-400 transition-colors" />
        
        <div className="flex items-center gap-4 mb-4">
          <Image 
            src={testimonial.avatar} 
            alt={testimonial.name}
            className="h-12 w-12 rounded-full border-2 border-white shadow-md"
            width={48}
            height={48}
          />
          <div>
            <h1 className="font-semibold text-black">{testimonial.name}</h1>
            <p className="text-sm text-gray-600">{testimonial.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        <p className="text-gray-700 leading-relaxed">{testimonial.content}</p>
      </div>

      <div className="p-6 border-t border-gray-100 bg-white">
        <div className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-lg font-bold leading-tight group-hover:text-blue-600 transition-colors">
              {testimonial.previewData.title}
            </h3>
            <p className="text-sm text-gray-600">{testimonial.previewData.description}</p>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>By {testimonial.previewData.author}</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{testimonial.previewData.readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how creators are transforming their knowledge into profitable courses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialBlogCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
} 