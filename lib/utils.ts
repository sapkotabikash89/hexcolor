import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { getSortedKnownColors } from './color-utils'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function autoLinkShadeNames(html: string, isShadesMeaning: boolean = false): string {
  if (!isShadesMeaning) {
    return html;
  }

  // Get all known colors for lookup
  const knownColors = new Set(getSortedKnownColors().map((c: { hex: string }) => c.hex.replace('#', '').toUpperCase()))

  // Regex for Name (#HEX)
  // Use a more sophisticated approach to avoid matching inside existing tags
  // This regex matches existing <a> tags OR the shade pattern
  const pattern = /<a\b[^>]*>.*?<\/a>|(\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*\(#([0-9A-Fa-f]{6})\)/g

  const processed = html.replace(pattern, (match, colorName, hex) => {
    // If colorName is undefined, it means we matched an <a> tag - return it as is
    if (!colorName) return match

    const cleanHex = hex.toUpperCase()
    if (!knownColors.has(cleanHex)) {
      return match
    }

    const href = `/colors/${cleanHex.toLowerCase()}/`
    const linkColor = isShadesMeaning ? "#E0115F" : `#${cleanHex}`

    return `<a href="${href}" style="color: ${linkColor}; text-decoration: underline;" class="hover:opacity-80 transition-opacity">${colorName} (#${cleanHex})</a>`
  })

  return processed.replace(/<a([^>]+href="[^"]*html-color-picker[^"]*"[^>]*)>(.*?)<\/a>/gi, "$2")
}
