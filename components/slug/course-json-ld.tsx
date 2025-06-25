interface CourseJsonLdProps {
  title: string
  description: string
  imageUrl: string
  author: string
  slug: string
  tags?: string[]
  price: number
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
  createdAt, 
  updatedAt 
}: CourseJsonLdProps) => {
  const jsonLd = {
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
        "url": "https://tryforged.vercel.app/logo.png"
      }
    },
    "datePublished": createdAt?.toISOString(),
    "dateModified": updatedAt?.toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://tryforged.vercel.app/${slug}`
    },
    "keywords": tags?.join(', '),
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default CourseJsonLd 