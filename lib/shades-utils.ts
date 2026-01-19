/**
 * Utility functions for handling "Shades Meaning" category posts
 */

export interface ShadeData {
  name: string;
  hex: string;
  rgb: string;
  cmyk: string;
  description: string;
  slug?: string;
}

/**
 * Check if a WordPress post belongs to the "Shades Meaning" category
 * @param categories - Array of category objects from WordPress API
 * @returns boolean indicating if the post is in the "Shades Meaning" category
 */
export function isShadesMeaningPost(categories: Array<{ name?: string; slug?: string }> = []): boolean {
  return categories.some(category => {
    return category.name?.toLowerCase().includes('shades meaning') || 
           category.slug?.toLowerCase().includes('shades-meaning');
  });
}

/**
 * Extract shade data from WordPress post content
 * This function parses the post content to identify shade information
 * @param content - HTML content of the WordPress post
 * @returns Array of ShadeData objects
 */
export function extractShadesFromContent(content: string): ShadeData[] {
  const shades: ShadeData[] = [];
  
  // Regular expression to match shade entries in the content
  // This looks for patterns that typically define shades with their properties
  const shadeRegex = /<h2[^>]*>(.*?)<\/h2>[\s\n]*<p[^>]*>(.*?)<\/p>/gi;
  let match;
  
  while ((match = shadeRegex.exec(content)) !== null) {
    const name = stripHtmlTags(match[1]?.trim());
    const description = stripHtmlTags(match[2]?.trim());
    
    if (name && description) {
      // Look for hex code near the name/description in the content
      const hexMatch = findHexNearPosition(content, match.index, name, description);
      
      if (hexMatch) {
        const hex = hexMatch.toUpperCase();
        
        // Create a simple RGB string from hex
        const rgb = hexToRgbString(hex);
        
        // Create a simple CMYK approximation
        const cmyk = rgbToCmykString(rgb);
        
        shades.push({
          name,
          hex,
          rgb,
          cmyk,
          description,
          slug: name.toLowerCase().replace(/\s+/g, '-')
        });
      }
    }
  }
  
  return shades;
}

/**
 * Find hex code near a specific position in content
 * @param content - The full content
 * @param position - Position to search around
 * @param name - Shade name
 * @param description - Shade description
 * @returns Found hex code or null
 */
function findHexNearPosition(content: string, position: number, name: string, description: string): string | null {
  // Search in the content around the matched position
  const searchStart = Math.max(0, position - 200);
  const searchEnd = Math.min(content.length, position + 200);
  const context = content.substring(searchStart, searchEnd);
  
  // Look for hex patterns in various forms
  const hexPatterns = [
    /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g, // Standard hex
    /([A-Fa-f0-9]{6})/g,                // Hex without # (in certain contexts)
  ];
  
  for (const pattern of hexPatterns) {
    let match;
    while ((match = pattern.exec(context)) !== null) {
      const hex = match[0];
      
      // Validate that this hex is likely associated with the shade
      // by checking if the name or other relevant content appears nearby
      const matchPosInContext = match.index;
      const nearbyText = context.substring(
        Math.max(0, matchPosInContext - 50), 
        Math.min(context.length, matchPosInContext + 50)
      );
      
      // Check if the shade name appears near the hex
      if (nearbyText.toLowerCase().includes(name.toLowerCase())) {
        return hex.startsWith('#') ? hex : '#' + hex;
      }
      
      // Check if the description appears near the hex
      if (nearbyText.toLowerCase().includes(description.toLowerCase().substring(0, 20))) {
        return hex.startsWith('#') ? hex : '#' + hex;
      }
    }
  }
  
  // Also check if hex appears in the name or description themselves
  const nameHexMatch = name.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);
  if (nameHexMatch) return nameHexMatch[0];
  
  const descHexMatch = description.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);
  if (descHexMatch) return descHexMatch[0];
  
  return null;
}

/**
 * Strip HTML tags from a string
 */
function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

/**
 * Convert hex to RGB string format
 */
function hexToRgbString(hex: string): string {
  // Remove the hash if present
  const cleanHex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Convert RGB string to CMYK string format (approximation)
 */
function rgbToCmykString(rgbStr: string): string {
  const match = rgbStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  
  if (!match) {
    return 'cmyk(0, 0, 0, 0)';
  }
  
  let r = parseInt(match[1], 10) / 255;
  let g = parseInt(match[2], 10) / 255;
  let b = parseInt(match[3], 10) / 255;
  
  const k = 1 - Math.max(r, g, b);
  
  if (k === 1) {
    return 'cmyk(0, 0, 0, 100)';
  }
  
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  
  return `cmyk(${Math.round(c * 100)}, ${Math.round(m * 100)}, ${Math.round(y * 100)}, ${Math.round(k * 100)})`;
}