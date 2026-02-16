
import categoryData from './color-categories.json'
import { hexToRgb, rgbToHsl, getColorHarmony } from './color-utils'
import colorData from './color-meaning.json'
import { COLOR_FAMILIES, type ColorFamilyData } from './faqs/faq-generator'

export interface ColorCategory {
  id: number
  name: string
  hueRange: string
  saturation: string
  lightness: string
  spiritualMeaning: string
  psychologicalEffect: string
  culturalSignificance: string
  designBrandingUse: string
  artUse: string
}

const categories = categoryData.colorCategories as ColorCategory[]

// Precomputed category cache to avoid repeated calculations
const categoryCache = new Map<string, ColorCategory>()
// Precompute parsed hue ranges for all categories
const parsedRanges = categories.map(cat => ({
  category: cat,
  parsed: parseHueRange(cat.hueRange),
  targetS: getValueFromDescriptor(cat.saturation),
  targetL: getValueFromDescriptor(cat.lightness)
}))

export function getRelatedColorsByCategory(hex: string, limit: number = 8): any[] {
  const currentRgb = hexToRgb(hex)
  if (!currentRgb) return []
  const currentHsl = rgbToHsl(currentRgb.r, currentRgb.g, currentRgb.b)
  const currentCategory = getCategory(currentHsl.h, currentHsl.s, currentHsl.l)

  const related: any[] = []
  const keys = Object.keys(colorData)
  
  // Shuffle keys to get random related colors from the same category
  // A simple shuffle to ensure variety on page refreshes or builds
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }
  
  for (const key of keys) {
    if (related.length >= limit) break
    const entry = colorData[key as keyof typeof colorData]
    if (entry.hex.toUpperCase() === hex.toUpperCase()) continue
    
    const rgb = hexToRgb(entry.hex)
    if (!rgb) continue
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    const cat = getCategory(hsl.h, hsl.s, hsl.l)
    
    if (cat.id === currentCategory.id) {
      related.push(entry)
    }
  }
  return related
}

function parseHueRange(rangeStr: string): { start: number; end: number; isFull: boolean } {
  if (rangeStr.includes("0–360") || rangeStr.includes("achromatic")) {
    return { start: 0, end: 360, isFull: true }
  }
  const parts = rangeStr.split('–') // En dash
  if (parts.length !== 2) {
      const partsHyphen = rangeStr.split('-') // Hyphen
      if (partsHyphen.length === 2) {
          return { start: parseInt(partsHyphen[0]), end: parseInt(partsHyphen[1]), isFull: false }
      }
      return { start: 0, end: 360, isFull: true } // Fallback
  }
  return { start: parseInt(parts[0]), end: parseInt(parts[1]), isFull: false }
}

function getValueFromDescriptor(desc: string): number {
  const d = desc.toLowerCase()
  if (d.includes('none')) return 0
  if (d.includes('lowest')) return 2
  if (d.includes('very low')) return 12
  if (d.includes('low-medium')) return 35
  if (d.includes('medium-low')) return 40
  if (d.includes('very high')) return 90
  if (d.includes('medium-high')) return 65
  if (d.includes('high')) return 75
  if (d.includes('low')) return 30
  if (d.includes('medium')) return 50
  return 50
}

function isHueMatch(h: number, start: number, end: number, isFull: boolean): boolean {
  if (isFull) return true
  if (start <= end) {
    return h >= start && h <= end
  } else {
    // Wrap around (e.g. 350-10)
    return h >= start || h <= end
  }
}

// OPTIMIZATION: Cache category lookups and use precomputed values
export function getCategory(h: number, s: number, l: number): ColorCategory {
  // Create cache key from HSL values
  const cacheKey = `${Math.round(h)}_${Math.round(s)}_${Math.round(l)}`
  
  // Check cache first
  if (categoryCache.has(cacheKey)) {
    return categoryCache.get(cacheKey)!
  }

  let bestCat = categories[0]
  let bestScore = -Infinity

  // OPTIMIZATION: Use precomputed parsed ranges instead of calculating each time
  for (const { category: cat, parsed: hueParsed, targetS, targetL } of parsedRanges) {
    let score = 0
    
    // Hue check
    if (isHueMatch(h, hueParsed.start, hueParsed.end, hueParsed.isFull)) {
      score += 1000
    } else {
        // OPTIMIZATION: Simplified distance calculation
        let dist = Math.min(Math.abs(h - hueParsed.start), Math.abs(h - hueParsed.end))
        if (hueParsed.start > hueParsed.end) {
             // Handle wrap-around ranges more efficiently
             const dist1 = Math.abs(h - hueParsed.start)
             const dist2 = Math.abs(h - hueParsed.end)
             const dist3 = Math.abs(h - (hueParsed.start - 360))
             const dist4 = Math.abs(h - (hueParsed.end + 360))
             dist = Math.min(dist1, dist2, dist3, dist4)
        }
        score -= dist * 2
    }

    // Saturation/Lightness distance
    // Special case for achromatic/black/white
    if (cat.name.includes("Void") || cat.name.includes("Black")) {
         if (l < 10) score += 500
    }
    if (cat.name.includes("White")) {
        if (l > 90) score += 500
    }

    const distS = Math.abs(s - targetS)
    const distL = Math.abs(l - targetL)
    
    score -= (distS + distL)

    if (score > bestScore) {
      bestScore = score
      bestCat = cat
    }
  }
  
  // Cache the result
  categoryCache.set(cacheKey, bestCat)
  
  // Limit cache size to prevent memory issues
  if (categoryCache.size > 1000) {
    const firstKey = categoryCache.keys().next().value
    if (firstKey) {
      categoryCache.delete(firstKey)
    }
  }
  
  return bestCat
}

export interface FAQItem {
  question: string
  answer: string
}

function getBroadFamily(h: number, s: number, l: number): string {
  // Achromatic checks
  if (l < 12) return 'black'
  if (l > 93) return 'white'
  if (s < 10) return 'gray'

  // Hue checks
  if (h >= 345 || h < 15) return 'red'
  if (h >= 15 && h < 45) return 'orange'
  if (h >= 45 && h < 70) return 'yellow'
  if (h >= 70 && h < 165) return 'green'
  if (h >= 165 && h < 195) return 'teal'
  if (h >= 195 && h < 255) return 'blue'
  if (h >= 255 && h < 300) return 'purple'
  if (h >= 300 && h < 345) return 'pink'
  
  return 'gray'
}

export function generateFAQs(hex: string, rgb: { r: number, g: number, b: number }, hsl: { h: number, s: number, l: number }, name?: string): FAQItem[] {
  const familyKey = getBroadFamily(hsl.h, hsl.s, hsl.l)
  const data = COLOR_FAMILIES[familyKey] || COLOR_FAMILIES['gray']
  
  const hexText = hex.toUpperCase()
  const displayName = name ? `${name} (${hexText})` : hexText

  const q1 = `What is the meaning and symbolism of ${displayName} color?`
  const a1 = `${displayName} is a specific shade that belongs to the ${familyKey} color family. It represents ${data.keywords}. As a variant of ${familyKey}, it signifies ${data.psychology}. In color psychology, ${displayName} is often associated with these qualities, offering a unique balance of saturation and light that conveys ${data.keywords.split(',')[0].trim()} and ${data.keywords.split(',')[1].trim()}.`

  const q2 = `What is the spiritual meaning of ${displayName} color?`
  const a2 = `Spiritually, the color ${displayName} symbolizes ${data.spiritual}. It is believed to bring a sense of ${data.psychology} to the spirit. Many traditions view ${displayName} as a sign of ${data.spiritual.split(',')[0].trim()}, serving as a bridge between the physical world and spiritual realms. Its specific vibration is thought to enhance ${data.chakraMeaning}.`

  const q3 = `What chakra is connected to the color ${displayName}?`
  const a3 = `${displayName} is linked to the ${data.chakra} Chakra, known in Sanskrit as ${data.chakraSanskrit}. This energy center governs ${data.chakraMeaning}. Balancing this chakra with the color ${displayName} can help improve emotional well-being and spiritual alignment, allowing for better ${data.chakraMeaning.split(',')[0].trim()}.`

  const q4 = `What does ${displayName} mean in personality?`
  const a4 = `A personality type attracted to ${displayName} is typically ${data.personality}. People who resonate with this specific hue often value ${data.keywords.split(',')[0].trim()} and ${data.keywords.split(',')[1].trim()}. They are frequently seen as ${data.personality.split(',')[0].trim()} individuals who bring a unique, ${familyKey}-influenced energy to their surroundings.`

  const q5 = `What does the color ${displayName} symbolize in the Bible?`
  const a5 = `In the Bible, colors related to ${displayName} symbolize ${data.bible}. It appears in scriptures to represent these spiritual truths. The color ${displayName} is often used to signify ${data.bible.split(',')[0].trim()} and divine messages, reflecting the deeper biblical meanings associated with the ${familyKey} spectrum.`

  return [
    { question: q1, answer: a1 },
    { question: q2, answer: a2 },
    { question: q3, answer: a3 },
    { question: q4, answer: a4 },
    { question: q5, answer: a5 },
  ]
}
