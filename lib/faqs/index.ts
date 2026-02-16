
import type { FAQItem } from "@/components/faq-section"
import { generateFaqs } from "./faq-generator"

// We keep the registry structure type but don't need the JSON imports anymore
// as we generate FAQs dynamically for better consistency and SEO.

export const FAQ_REGISTRY: Record<string, FAQItem[]> = {}

export function getFaqsByColorSlug(slug?: string | null): FAQItem[] {
  if (!slug) return []
  const key = String(slug).trim().toLowerCase()
  
  // Use the dynamic generator
  return generateFaqs(key)
}
