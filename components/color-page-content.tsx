import { ColorPageContentClient } from "@/components/color-page-content.client"

interface ColorPageContentProps {
  hex: string
  mode?: "full" | "sectionsOnly"
  faqs?: { question: string; answer: string }[]
  colorInformation?: { paragraph1: string; paragraph2: string }
  name?: string
  colorExistsInDb?: boolean
  onColorChange?: (color: string) => void
  pageUrl?: string
}

export function ColorPageContent(props: ColorPageContentProps) {
  return <ColorPageContentClient {...props} />
}
