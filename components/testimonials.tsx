import { Star, Quote, Eye, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const testimonials = [
  {
    id: 1,
    name: "Rea",
    role: "Marketing Consultant",
    avatar: "https://avatar.vercel.sh/sarah",
    content: "Knowledgesmith transformed my scattered notes into a professional marketing course! Can't wait to see how it goes!",
    rating: 5,
    previewData: {
      title: "Digital Marketing Fundamentals: From Zero to Hero",
      generatedContent: `# Introduction to Digital Marketing

Digital marketing has revolutionized how businesses connect with customers. This comprehensive guide covers all essential aspects.

## Key Components

### 1. Search Engine Optimization (SEO)
- On-page optimization techniques
- Keyword research strategies`,
      author: "Rea",
      readTime: "12 min read",
      views: 2847,
      price: 89,
      description: "Master digital marketing with proven strategies and real-world examples"
    }
  },
  {
    id: 2,
    name: "Riad",
    role: "Software Engineer",
    avatar: "https://avatar.vercel.sh/marcus",
    content: "Incredible platform! My coding notes became a structured programming course. The AI understood my technical concepts perfectly.",
    rating: 5,
    previewData: {
      title: "Advanced React Patterns: Building Scalable Applications",
      generatedContent: `# Advanced React Patterns

Learn sophisticated patterns for building maintainable React applications.

## Core Patterns

### 1. Compound Components
\`\`\`jsx
const Modal = ({ children }) => {
  return <div className="modal">{children}</div>
}
\`\`\``,
      author: "Riad",
      readTime: "18 min read",
      views: 4321,
      price: 149,
      description: "Advanced React patterns for experienced developers"
    }
  },
  {
    id: 3,
    name: "Emily",
    role: "UX Designer",
    avatar: "https://avatar.vercel.sh/emily",
    content: "From my design process notes to a complete UX course in minutes. The generated content maintained all my methodologies perfectly.",
    rating: 5,
    previewData: {
      title: "User Experience Design: A Complete Process Guide",
      generatedContent: `# UX Design Process

A comprehensive guide to creating exceptional user experiences through systematic design thinking.

## Research Phase

### User Research Methods
- User interviews and surveys
- Competitive analysis`,
      author: "Emily",
      readTime: "15 min read",
      views: 3654,
      price: 119,
      description: "Complete UX design process from research to implementation"
    }
  }
]

const TestimonialBlogCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-gray-300 hover:-translate-y-2">
      <div className="p-6 border-b border-gray-100">
        <Quote className="absolute top-4 right-4 h-6 w-6 text-gray-300 group-hover:text-gray-400 transition-colors" />
        
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name}
            className="h-12 w-12 rounded-full border-2 border-white shadow-md"
          />
          <div>
            <h4 className="font-semibold text-black">{testimonial.name}</h4>
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
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
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