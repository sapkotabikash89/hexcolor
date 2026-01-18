/**
 * Updated deterministic, prioritized search logic for the sticky header search bar
 * Uses static data for compatibility with Cloudflare Pages
 */

// Import the static search functions
import { performStaticSearch, performSimpleSearch } from './static-search-utils';
import blogPostsData from './blog-posts-data.json';

// Main search function implementing all rules
// Maintains the same signature as the original for backward compatibility
export async function performDeterministicSearch(input: string): Promise<string | null> {
  // Use the static search with bundled blog post data
  const blogPosts = Array.isArray(blogPostsData) ? blogPostsData : [];
  
  return blogPosts.length > 0 
    ? performStaticSearch(input, blogPosts)
    : performSimpleSearch(input);
}

// Input normalization (Rule #1) - copied from static-search-utils to avoid circular imports
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

// Detect input type (Rule #2) - copied from static-search-utils to avoid circular imports
export function detectInputType(input: string): 'hex' | 'color-name' {
  const normalized = normalizeInput(input)
  
  // Check if it's a valid hex code (3 or 6 digits)
  if (/^[0-9a-f]{3}$/.test(normalized) || /^[0-9a-f]{6}$/.test(normalized)) {
    return 'hex'
  }
  
  // Otherwise treat as color name
  return 'color-name'
}

// Utility function to check if input is valid hex - copied from static-search-utils to avoid circular imports
export function isValidHex(input: string): boolean {
  const normalized = normalizeInput(input)
  return /^[0-9a-f]{3}$/.test(normalized) || /^[0-9a-f]{6}$/.test(normalized)
}