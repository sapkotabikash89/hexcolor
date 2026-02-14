/**
 * Centralized hex validation and linking logic for color pages
 * This utility determines whether to link to static color pages or the universal picker
 */

import { KNOWN_COLOR_HEXES } from './known-colors-complete';
import { HEX_REDIRECTS } from './hex-redirects';

// Use the existing known color set

/**
 * Check if a hex color exists in our static color database
 * @param hex - Hex color code (with or without #)
 * @returns true if color exists in static pages, false otherwise
 */
export function isStaticColor(hex: string): boolean {
  const cleanHex = hex.replace('#', '').toUpperCase();
  // If it has a blog post, it's effectively NOT a standard static color page 
  // (it's a blog post page), but for validity checks it might still be "known".
  // However, this function is often used to decide whether to show a link to /colors/
  // or handle it differently.
  return KNOWN_COLOR_HEXES.has(cleanHex);
}

/**
 * Generate the appropriate link for a hex color
 * @param hex - Hex color code (with or without #)
 * @returns URL for the color page
 */
export function getColorPageLink(hex: string): string {
  const cleanHex = hex.replace('#', '').toUpperCase();

  // Check if we have a blog post for this hex
  if (HEX_REDIRECTS[cleanHex]) {
    return HEX_REDIRECTS[cleanHex];
  }

  if (isStaticColor(hex)) {
    // Link to static color page - normalize to lowercase for URL consistency
    return `/colors/${cleanHex.toLowerCase()}/`;
  } else {
    // Also link to individual color pages for consistency, assuming dynamic handling or future static generation
    return `/colors/${cleanHex.toLowerCase()}/`;
  }
}

/**
 * Generate the appropriate link for color swatches that should update in-place
 * @param hex - Hex color code (with or without #)
 * @returns URL for in-place updates (always points to current page with query param)
 */
export function getInPlaceColorLink(hex: string): string {
  const cleanHex = hex.replace('#', '').toLowerCase();
  // For in-place updates, always use the current page with query parameter
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('hex', cleanHex);
    return newUrl.toString();
  }
  return `/colors/${cleanHex}`;
}

/**
 * Get the display name for a color
 * @param hex - Hex color code
 * @param staticName - Name from static data if available
 * @returns Display name for the color
 */
export function getColorDisplayName(hex: string, staticName?: string): string {
  if (staticName) {
    return `${staticName} (${hex})`;
  }
  return hex;
}

/**
 * Determine if a color page should be indexed by search engines
 * @param hex - Hex color code
 * @returns true for static colors, false for dynamic/universal picker
 */
export function shouldIndexColorPage(hex: string): boolean {
  return isStaticColor(hex);
}

// Export the known hex set for other utilities that might need it
export { KNOWN_COLOR_HEXES as KNOWN_HEX_SET };

// Export count of known static colors
export const STATIC_COLOR_COUNT = KNOWN_COLOR_HEXES.size;

/**
 * Get the appropriate rel attribute for a color link based on SEO rules
 * @param targetHex - The hex of the color being linked to
 * @returns "nofollow" if the target is an unknown color, undefined otherwise
 */
export function getColorLinkRel(targetHex: string): string | undefined {
  if (!isStaticColor(targetHex)) {
    return "nofollow";
  }
  return undefined;
}

/**
 * Remove empty HTML comments from a string
 * @param html - The HTML content to clean
 * @returns HTML without empty comment nodes
 */
export function stripHtmlComments(html: string): string {
  if (!html) return html;
  // This regex matches empty comments like <!-- --> or comments with only whitespace
  // It also matches ones without spaces like <!---->
  return html.replace(/<!--\s*-->/g, '');
}

/**
 * Process an HTML string to remove any links pointing to unknown color pages
 * (which would previously have been marked as rel="nofollow")
 * and strip empty HTML comments.
 * @param html - The HTML content to process
 * @returns Processed HTML with unknown color links removed (leaving content) and no empty comments
 */
export function processHtmlColorLinks(html: string): string {
  if (!html) return html;

  // First strip empty comments as requested
  let processedHtml = stripHtmlComments(html);

  // Regex to find anchor tags that link to /colors/HEX
  // Matches the entire anchor tag block <a ...>...</a>
  // We use a non-greedy match for the content to handle multiple links correctly
  return processedHtml.replace(/<a\s+[^>]*?href=["']((?:https?:\/\/(?:www\.)?hexcolormeans\.com)?\/colors\/([0-9a-fA-F]{3,6}))(?:\/|["']|[\?#])[^>]*?>([\s\S]*?)<\/a>/gi, (match, fullHref, hex, content) => {
    const rel = getColorLinkRel(hex);

    if (rel === "nofollow") {
      // If nofollow is needed, remove the anchor tag entirely and just return the content
      return content;
    }

    return match;
  });
}
