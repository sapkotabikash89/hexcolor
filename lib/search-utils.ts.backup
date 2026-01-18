/**
 * Deterministic, prioritized search logic for the sticky header search bar
 */

import colorMeaningJson from './color-meaning.json'

// Type definitions
interface BlogPost {
  title: string
  uri: string
  content?: string
}

interface ColorEntry {
  name: string
  hex: string
  meaning: string
}

// Input normalization (Rule #1)
export function normalizeInput(input: string): string {
  // Trim leading/trailing spaces
  let normalized = input.trim()
  
  // Convert to lowercase
  normalized = normalized.toLowerCase()
  
  // Remove leading # only for hex comparisons
  if (normalized.startsWith('#')) {
    normalized = normalized.substring(1)
  }
  
  return normalized
}

// Detect input type (Rule #2)
export function detectInputType(input: string): 'hex' | 'color-name' {
  const normalized = normalizeInput(input)
  
  // Check if it's a valid hex code (3 or 6 digits)
  if (/^[0-9a-f]{3}$/.test(normalized) || /^[0-9a-f]{6}$/.test(normalized)) {
    return 'hex'
  }
  
  // Otherwise treat as color name
  return 'color-name'
}

// Fetch blog posts for search (helper function)
async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch("https://cms.colormean.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query GetAllPosts {
            posts(first: 1000) {
              nodes {
                title
                uri
              }
            }
          }
        `,
      }),
      next: { revalidate: 3600 },
    })
    const json = await res.json()
    return json?.data?.posts?.nodes ?? []
  } catch {
    return []
  }
}

// Search blog posts for color matches (Rule #3)
async function searchBlogPosts(input: string, inputType: 'hex' | 'color-name'): Promise<BlogPost | null> {
  const posts = await fetchBlogPosts()
  const normalizedInput = normalizeInput(input)
  
  // For hex input, look for blog posts with titles containing the hex pattern
  if (inputType === 'hex') {
    // Look for patterns like "color-XXXXXX-meaning" or hex codes in titles
    const hexPattern = normalizedInput.toUpperCase()
    
    for (const post of posts) {
      const titleLower = post.title.toLowerCase()
      
      // Check for hex in title (e.g., "FFA500 Color Orange Meaning")
      if (titleLower.includes(normalizedInput) || titleLower.includes(hexPattern)) {
        return post
      }
      
      // Check if the URI contains the hex pattern (e.g., /color-ffa500-meaning/)
      if (post.uri.toLowerCase().includes(normalizedInput) || post.uri.toLowerCase().includes(hexPattern)) {
        return post
      }
    }
  }
  
  // For color name input, look for exact or partial matches in blog post titles
  if (inputType === 'color-name') {
    // First try exact match - look for color name in the title
    for (const post of posts) {
      const titleLower = post.title.toLowerCase()
      // Match whole word or part of title
      if (titleLower.includes(normalizedInput)) {
        return post
      }
    }
    
    // If no exact match, try partial match with common color patterns
    for (const post of posts) {
      const titleLower = post.title.toLowerCase()
      // Check for patterns like "blue color", "blue meaning", etc.
      if (titleLower.includes(`${normalizedInput} color`) || 
          titleLower.includes(`color ${normalizedInput}`) ||
          titleLower.includes(`${normalizedInput} meaning`)) {
        return post
      }
    }
    
    // Finally check if the URI contains the color name pattern (e.g., /color-blue-meaning/)
    for (const post of posts) {
      if (post.uri.toLowerCase().includes(`color-${normalizedInput}-meaning`)) {
        return post
      }
    }
  }
  
  return null
}

// Search color-meaning.json (Rule #3)
function searchColorJson(input: string, inputType: 'hex' | 'color-name'): ColorEntry | null {
  const normalizedInput = normalizeInput(input)
  const colorData = colorMeaningJson as Record<string, ColorEntry>
  
  if (inputType === 'hex') {
    // Direct hex lookup (uppercase)
    const hexKey = normalizedInput.toUpperCase()
    if (colorData[hexKey]) {
      return colorData[hexKey]
    }
    
    // Also check if normalized input matches any hex key
    for (const [hex, colorInfo] of Object.entries(colorData)) {
      if (hex.toLowerCase() === normalizedInput.toLowerCase()) {
        return colorInfo
      }
    }
  }
  
  if (inputType === 'color-name') {
    // Search by color name
    for (const [, colorInfo] of Object.entries(colorData)) {
      if (colorInfo.name.toLowerCase() === normalizedInput) {
        return colorInfo
      }
    }
    
    // Partial match fallback
    for (const [, colorInfo] of Object.entries(colorData)) {
      if (colorInfo.name.toLowerCase().includes(normalizedInput)) {
        return colorInfo
      }
    }
  }
  
  return null
}

// Generate color page slug from hex (Rule #4)
function generateColorSlug(hex: string): string {
  return `/colors/${hex.toLowerCase()}/`
}

// Main search function implementing all rules
export async function performDeterministicSearch(input: string): Promise<string | null> {
  // Rule #1: Input normalization (always first)
  const normalizedInput = normalizeInput(input)
  
  // Handle empty/invalid input
  if (!normalizedInput) {
    return null
  }
  
  // Rule #2: Detect input type
  const inputType = detectInputType(input)
  
  // Rule #3: Priority rules - Blog post match first
  const blogMatch = await searchBlogPosts(input, inputType)
  if (blogMatch) {
    // Return the blog post URL directly
    // Ensure the URI starts with / for proper URL construction
    const uri = blogMatch.uri.startsWith('/') ? blogMatch.uri : `/${blogMatch.uri}`
    const baseUrl = "https://colormean.com"
    return new URL(uri, baseUrl).toString()
  }
  
  // Rule #3: Known color JSON match second
  const jsonMatch = searchColorJson(input, inputType)
  if (jsonMatch) {
    // Return color page URL
    return `https://colormean.com${generateColorSlug(jsonMatch.hex.replace('#', ''))}`
  }
  
  // Rule #3: Unknown color fallback (last) - only for hex input
  if (inputType === 'hex') {
    // Validate hex format
    if (/^[0-9a-f]{3}$/.test(normalizedInput) || /^[0-9a-f]{6}$/.test(normalizedInput)) {
      return `https://colormean.com/html-color-picker/?hex=${normalizedInput}`
    }
  }
  
  // No matches found
  return null
}

// Utility function to check if input is valid hex
export function isValidHex(input: string): boolean {
  const normalized = normalizeInput(input)
  return /^[0-9a-f]{3}$/.test(normalized) || /^[0-9a-f]{6}$/.test(normalized)
}