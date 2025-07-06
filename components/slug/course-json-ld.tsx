import { CONTENT_TYPES } from "@/db/schemas/course-schema"

interface CourseJsonLdProps {
  title: string
  description: string
  imageUrl: string
  author: string
  slug: string
  tags?: string[]
  price: number
  contentType?: string
  createdAt?: Date
  updatedAt?: Date
}

const CourseJsonLd = ({ 
  title, 
  description, 
  imageUrl, 
  author, 
  slug, 
  tags, 
  price, 
  contentType,
  createdAt, 
  updatedAt 
}: CourseJsonLdProps) => {
  const isListicle = contentType === CONTENT_TYPES.LISTICLE
  const isCourse = contentType === CONTENT_TYPES.COURSE
  
  // Enhanced schema for courses using Course type for better SEO
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": title,
    "description": description,
    "image": [imageUrl],
    "provider": {
      "@type": "Organization",
      "name": "Forged",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.tryforged.me/logo.png"
      }
    },
    "instructor": {
      "@type": "Person",
      "name": author,
    },
    "educationalLevel": "Beginner to Advanced",
    "courseMode": "Online",
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Online",
      "instructor": {
        "@type": "Person",
        "name": author,
      }
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": createdAt?.toISOString()
    },
    "datePublished": createdAt?.toISOString(),
    "dateModified": updatedAt?.toISOString(),
    "url": `https://www.tryforged.me/${slug}`,
    "keywords": tags?.join(', ') || 'course, education, learning, online course',
    "inLanguage": "en-US",
    "isAccessibleForFree": price === 0
  }
  
  // Enhanced schema for listicles using HowTo type for better SEO
  const listicleSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": description,
    "image": [imageUrl],
    "author": {
      "@type": "Person",
      "name": author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Forged",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.tryforged.me/logo.png"
      }
    },
    "datePublished": createdAt?.toISOString(),
    "dateModified": updatedAt?.toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.tryforged.me/${slug}`
    },
    "keywords": tags?.join(', ') || 'listicle, tips, guide, list, how-to',
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Knowledge and learning materials"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool", 
        "name": "Educational content and practical tips"
      }
    ],
    "totalTime": `PT${Math.max(1, Math.round((tags?.length || 5) * 2))}M`, // Estimated time based on content
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": price
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }
  
  // Default article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": [imageUrl],
    "author": {
      "@type": "Person",
      "name": author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Forged",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.tryforged.me/logo.png"
      }
    },
    "datePublished": createdAt?.toISOString(),
    "dateModified": updatedAt?.toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.tryforged.me/${slug}`
    },
    "keywords": tags?.join(', ') || 'article, blog, educational',
    "articleSection": "Blog",
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }
  
  // Select appropriate schema based on content type
  const jsonLd = isCourse ? courseSchema : (isListicle ? listicleSchema : articleSchema)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default CourseJsonLd 