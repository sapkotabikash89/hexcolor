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
  
  const shadePattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*\(#([0-9A-Fa-f]{6})\)/g

  const processed = html.replace(shadePattern, (match, colorName, hex) => {
    const cleanHex = hex.toUpperCase()
    const linkColor = '#E0115F' // Default link color
    
    if (!knownColors.has(cleanHex)) {
      return match
    }

    const href = `/colors/${cleanHex.toLowerCase()}/`
    return `<a href="${href}" style="color: ${linkColor}; text-decoration: underline;" class="hover:opacity-80 transition-opacity">${colorName} (#${cleanHex})</a>`
  })

  return processed.replace(/<a([^>]+href="[^"]*html-color-picker[^"]*"[^>]*)>(.*?)<\/a>/gi, "$2")
}
