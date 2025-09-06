import { Clock, Quote, Star } from "lucide-react";
import Image from "next/image";
import { testimonials } from "@/constants/testimonials";

const TestimonialBlogCard = ({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) => {
  return (
    <div className="group hover:-translate-y-2 relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:shadow-2xl">
      <div className="border-gray-100 border-b p-6">
        <Quote className="absolute top-4 right-4 h-6 w-6 text-gray-300 transition-colors group-hover:text-gray-400" />

        <div className="mb-4 flex items-center gap-4">
          <Image
            alt={testimonial.name}
            className="h-12 w-12 rounded-full border-2 border-white shadow-md"
            height={48}
            src={testimonial.avatar}
            width={48}
          />
          <div>
            <h1 className="font-semibold text-black">{testimonial.name}</h1>
            <p className="text-gray-600 text-sm">{testimonial.role}</p>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-1">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" key={i} />
          ))}
        </div>

        <p className="text-gray-700 leading-relaxed">{testimonial.content}</p>
      </div>

      <div className="border-gray-100 border-t bg-white p-6">
        <div className="space-y-4">
          <div className="space-y-3">
            <h3 className="font-bold text-lg leading-tight transition-colors group-hover:text-blue-600">
              {testimonial.previewData.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {testimonial.previewData.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-gray-500 text-xs">
            <span>By {testimonial.previewData.author}</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{testimonial.previewData.readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Testimonials() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-24"
      id="testimonials"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.05),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-4xl">Success Stories</h2>
          <p className="mx-auto max-w-3xl text-gray-600 text-xl">
            See how creators are transforming their knowledge into profitable
            courses
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialBlogCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
