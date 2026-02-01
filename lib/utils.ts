import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { getSortedKnownColors } from './color-utils'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Automatically link shade names in blog content for Shades Meaning category
 * Links Color Name (#HEX) patterns to appropriate destinations based on HEX value
 */
let callCount = 0;
let sectionCallCount = 0;

export function autoLinkShadeNames(html: string, isShadesMeaning: boolean = false): string {
  callCount++;
  
  // Check if this looks like a section (shorter content)
  if (html.length < 1000) {
    sectionCallCount++;
    console.log(`=== SECTION autoLinkShadeNames call #${sectionCallCount} ===`);
  } else {
    console.log(`=== MAIN autoLinkShadeNames call #${callCount} ===`);
  }
  
  console.log('isShadesMeaning:', isShadesMeaning);
  console.log('HTML length:', html.length);
  console.log('HTML preview:', html.substring(0, 100) + '...');
  
  if (!isShadesMeaning) {
    console.log('Not a Shades Meaning category, returning original HTML');
    return html;
  }
  
  // Get all known colors for lookup
  const knownColors = new Set(getSortedKnownColors().map((c: { hex: string }) => c.hex.replace('#', '').toUpperCase()))
  
  // Simple but effective pattern that matches "Color Name (#HEXCODE)" anywhere in the content
  // This handles both cases: standalone text and text that follows headings
  const shadePattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*\(#([0-9A-Fa-f]{6})\)/g
  
  console.log("Searching for pattern in HTML:", html.substring(0, 200) + "...");
  
  // Test if pattern matches anything
  const testMatches = html.match(shadePattern);
  console.log("Pattern matches found:", testMatches);
  
  // Replace all matches
  return html.replace(shadePattern, (match, colorName, hex) => {
    console.log("Found match:", { match, colorName, hex });
    
    const cleanHex = hex.toUpperCase()
    const linkColor = '#E0115F' // Default link color
    
    // Determine link destination
    let href: string
    if (knownColors.has(cleanHex)) {
      // Link to color page if HEX exists in known colors
      href = `/colors/${cleanHex.toLowerCase()}`
    } else {
      // Link to HTML color picker if HEX is not in known colors
      href = `/html-color-picker/?hex=${cleanHex}`
    }
    
    // Create the linked HTML with proper styling
    const result = `<a href="${href}" style="color: ${linkColor}; text-decoration: underline;" class="hover:opacity-80 transition-opacity">${colorName} (#${cleanHex})</a>`
    console.log("Generated link:", result);
    return result
  })
}
