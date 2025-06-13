/**
 * Generate a SEO-friendly slug from a title
 * @param title - The title to convert to a slug
 * @returns A URL-safe slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and multiple spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w\-]/g, '')
    // Remove multiple consecutive hyphens
    .replace(/\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
}

/**
 * Generate a unique slug by adding a timestamp suffix if needed
 * @param title - The title to convert to a slug
 * @returns A unique slug with timestamp suffix
 */
export function generateUniqueSlug(title: string): string {
  const baseSlug = generateSlug(title)
  const timestamp = Date.now().toString().slice(-6) // Last 6 digits for uniqueness
  
  return `${baseSlug}-${timestamp}`
} 