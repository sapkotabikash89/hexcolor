/**
 * Utility to detect if a valid color code exists in a blog post title
 * Only this utility may determine conditional rendering for navigation, Technical Information, and FAQs sections
 */

/**
 * Detects if a valid color code exists in the provided title
 * @param title The blog post title to check
 * @returns The detected hex color code if found, otherwise null
 */
export function detectColorInTitle(title: string): string | null {
  if (!title) return null;

  // First check for hex codes (both with and without #, 3-digit and 6-digit)
  
  // Check for 6-digit hex with #
  const hex6Match = title.match(/#([0-9a-f]{6})/i);
  if (hex6Match) return `#${hex6Match[1].toUpperCase()}`;
  
  // Check for 3-digit hex with #
  const hex3Match = title.match(/#([0-9a-f]{3})/i);
  if (hex3Match) {
    const hex3 = hex3Match[1].toUpperCase();
    return `#${hex3[0]}${hex3[0]}${hex3[1]}${hex3[1]}${hex3[2]}${hex3[2]}`;
  }
  
  // Check for 6-digit hex without # (must be bounded by word boundaries or spaces)
  const hex6NoHashMatch = title.match(/\b([0-9a-f]{6})\b/i);
  if (hex6NoHashMatch) return `#${hex6NoHashMatch[1].toUpperCase()}`;
  
  // Check for 3-digit hex without # (must be bounded by word boundaries or spaces)
  const hex3NoHashMatch = title.match(/\b([0-9a-f]{3})\b/i);
  if (hex3NoHashMatch) {
    const hex3 = hex3NoHashMatch[1].toUpperCase();
    return `#${hex3[0]}${hex3[0]}${hex3[1]}${hex3[1]}${hex3[2]}${hex3[2]}`;
  }
  
  // Check for named colors
  const lower = title.toLowerCase();
  const map: Record<string, string> = {
    green: "#008000",
    red: "#FF0000",
    blue: "#0000FF",
    yellow: "#FFFF00",
    orange: "#FFA500",
    purple: "#800080",
    violet: "#EE82EE",
    cyan: "#00FFFF",
    magenta: "#FF00FF",
    pink: "#FFC0CB",
    black: "#000000",
    white: "#FFFFFF",
    gray: "#808080",
    brown: "#A52A2A",
    maroon: "#800000",
    burgundy: "#800020",
  };

  for (const key of Object.keys(map)) {
    if (lower.includes(key)) return map[key];
  }

  return null;
}

/**
 * Detects if an explicit hex color code exists in the provided title (not just color names)
 * @param title The blog post title to check
 * @returns The detected hex color code if found, otherwise null
 */
export function detectExplicitHexInTitle(title: string): string | null {
  if (!title) return null;

  // Check for hex codes (both with and without #, 3-digit and 6-digit)
  
  // Check for 6-digit hex with #
  const hex6Match = title.match(/#([0-9a-f]{6})/i);
  if (hex6Match) return `#${hex6Match[1].toUpperCase()}`;
  
  // Check for 3-digit hex with #
  const hex3Match = title.match(/#([0-9a-f]{3})/i);
  if (hex3Match) {
    const hex3 = hex3Match[1].toUpperCase();
    return `#${hex3[0]}${hex3[0]}${hex3[1]}${hex3[1]}${hex3[2]}${hex3[2]}`;
  }
  
  // Check for 6-digit hex without # (must be bounded by word boundaries or spaces)
  const hex6NoHashMatch = title.match(/\b([0-9a-f]{6})\b/i);
  if (hex6NoHashMatch) return `#${hex6NoHashMatch[1].toUpperCase()}`;
  
  // Check for 3-digit hex without # (must be bounded by word boundaries or spaces)
  const hex3NoHashMatch = title.match(/\b([0-9a-f]{3})\b/i);
  if (hex3NoHashMatch) {
    const hex3 = hex3NoHashMatch[1].toUpperCase();
    return `#${hex3[0]}${hex3[0]}${hex3[1]}${hex3[1]}${hex3[2]}${hex3[2]}`;
  }
  
  return null;
}

/**
 * Checks if a title contains a valid color code (including named colors)
 * @param title The blog post title to check
 * @returns True if a valid color code exists in the title, otherwise false
 */
export function hasColorInTitle(title: string): boolean {
  return detectColorInTitle(title) !== null;
}

/**
 * Checks if a title contains an explicit hex color code (not just color names)
 * @param title The blog post title to check
 * @returns True if an explicit hex color code exists in the title, otherwise false
 */
export function hasExplicitHexInTitle(title: string): boolean {
  return detectExplicitHexInTitle(title) !== null;
}