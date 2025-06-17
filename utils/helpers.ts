export function getURL(path = "") {
    // Check if we're in production
    let url =
      process.env.NEXT_PUBLIC_SITE_URL ?? // Set this to your production URL
      process.env.NEXT_PUBLIC_VERCEL_URL ?? // Vercel auto-sets this
      process.env.VERCEL_URL ?? // Fallback for Vercel
      "http://localhost:3000" // Local development fallback
  
    // Make sure to include `https://` when not localhost
    url = url.includes("http") ? url : `https://${url}`
  
    // Remove trailing slash if present
    url = url.replace(/\/$/, "")
  
    // Add the path
    return path ? `${url}${path.startsWith("/") ? "" : "/"}${path}` : url
  }
  