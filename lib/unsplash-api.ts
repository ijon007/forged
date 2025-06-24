export interface UnsplashImage {
  id: string
  url: string
  thumbnailUrl: string
  description: string | null
  alt_description: string | null
  photographer: string
  photographer_url: string
}

export interface UnsplashSearchResponse {
  total: number
  total_pages: number
  results: UnsplashPhoto[]
}

interface UnsplashPhoto {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  description: string | null
  alt_description: string | null
  user: {
    name: string
    links: {
      html: string
    }
  }
}

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

export async function searchUnsplashImages(query: string, page = 1, perPage = 12): Promise<UnsplashImage[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash access key not found, using fallback images')
    return getFallbackImages(query)
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    const data: UnsplashSearchResponse = await response.json()
    
    return data.results.map(photo => ({
      id: photo.id,
      url: `${photo.urls.regular}&w=800&h=400&fit=crop&q=80`,
      thumbnailUrl: `${photo.urls.small}&w=300&h=200&fit=crop&q=80`,
      description: photo.description,
      alt_description: photo.alt_description,
      photographer: photo.user.name,
      photographer_url: photo.user.links.html
    }))
  } catch (error) {
    console.error('Error fetching from Unsplash:', error)
    return getFallbackImages(query)
  }
}

export async function getFeaturedImages(category: string): Promise<UnsplashImage[]> {
  const collectionIds: Record<string, string> = {
    technology: '4602100', // Tech collection
    business: '3224200', // Business collection
    education: '1293730', // Education collection
    science: '4173501', // Science collection
    design: '3344721', // Design collection
    productivity: '4602100', // Productivity collection
    finance: '3224200', // Finance collection
    health: '4173501', // Health collection
  }

  const collectionId = collectionIds[category.toLowerCase()] || '4602100'

  if (!UNSPLASH_ACCESS_KEY) {
    return getFallbackImages(category)
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/collections/${collectionId}/photos?page=1&per_page=12&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    const photos: UnsplashPhoto[] = await response.json()
    
    return photos.map(photo => ({
      id: photo.id,
      url: `${photo.urls.regular}&w=800&h=400&fit=crop&q=80`,
      thumbnailUrl: `${photo.urls.small}&w=300&h=200&fit=crop&q=80`,
      description: photo.description,
      alt_description: photo.alt_description,
      photographer: photo.user.name,
      photographer_url: photo.user.links.html
    }))
  } catch (error) {
    console.error('Error fetching featured images:', error)
    return getFallbackImages(category)
  }
}

export async function autoSelectImageFromTitle(title: string): Promise<string> {
  const keywords = extractKeywords(title)
  const searchQuery = keywords.slice(0, 3).join(' ') || title

  try {
    const images = await searchUnsplashImages(searchQuery, 1, 1)
    return images[0]?.url || getFallbackImageUrl()
  } catch (error) {
    console.error('Error auto-selecting image:', error)
    return getFallbackImageUrl()
  }
}

function extractKeywords(title: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'how', 'what', 'when', 'where', 'why'])
  
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 5) // Take first 5 meaningful words
}

function getFallbackImages(query: string): UnsplashImage[] {
  const categoryImages: Record<string, string[]> = {
    technology: [
      'photo-1518709268805-4e9042af2176',
      'photo-1531297484001-80022131f5a1',
      'photo-1516321318423-f06f85e504b3',
      'photo-1504384308090-c894fdcc538d'
    ],
    business: [
      'photo-1507003211169-0a1dd7228f2d',
      'photo-1521737604893-d14cc237f11d',
      'photo-1552664730-d307ca884978',
      'photo-1556155092-490a1ba16284'
    ],
    education: [
      'photo-1513475382585-d06e58bcb0e0',
      'photo-1434030216411-0b793f4b4173',
      'photo-1427504494785-3a9ca7044f45',
      'photo-1522202176988-66273c2fd55f'
    ],
    science: [
      'photo-1532094349884-543bc11b234d',
      'photo-1576086213369-97a306d36557',
      'photo-1581093458791-9d42e6c4e1da',
      'photo-1559757148-5c350d0d3c56'
    ]
  }

  const lowerQuery = query.toLowerCase()
  let selectedImages = categoryImages.technology // default

  for (const [category, images] of Object.entries(categoryImages)) {
    if (lowerQuery.includes(category) || category.includes(lowerQuery)) {
      selectedImages = images
      break
    }
  }

  return selectedImages.map((photoId, index) => ({
    id: `fallback-${query}-${index}`,
    url: `https://images.unsplash.com/${photoId}?w=800&h=400&fit=crop&q=80&auto=format&fm=jpg`,
    thumbnailUrl: `https://images.unsplash.com/${photoId}?w=300&h=200&fit=crop&q=80&auto=format&fm=jpg`,
    description: `${query} related image`,
    alt_description: `Professional ${query} image`,
    photographer: "Unsplash Photographer",
    photographer_url: "https://unsplash.com"
  }))
}

function getFallbackImageUrl(): string {
  return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&q=80&auto=format&fm=jpg"
} 