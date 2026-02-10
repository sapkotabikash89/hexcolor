"use client"

import { useEffect, useRef } from "react"
import { stripHtmlComments } from "@/lib/color-linking-utils"

interface BlogContentProps {
  html: string
  className?: string
  style?: React.CSSProperties
}

export function BlogContent({ html, className = '', style }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    // Find all H2 elements
    const headings = contentRef.current.querySelectorAll('h2')
    headings.forEach((heading) => {
      // If heading doesn't have an id, create one from text
      if (!heading.id) {
        const text = (heading.textContent || '').toLowerCase()
        let id = ''

        // Smart ID generation to match BLOG_NAV_ITEMS
        if (/(definition|what is|meaning of)/.test(text)) id = "definition"
        else if (/history/.test(text)) id = "history"
        else if (/(symbolism|symbolize)/.test(text)) id = "symbolism"
        else if (/spiritual/.test(text)) id = "spiritual-meaning"
        else if (/psycholog/.test(text)) id = "psychology"
        else if (/(personality|traits)/.test(text)) id = "personality"
        else if (/(cultural|religious|biblical)/.test(text)) id = "cultural-meaning"
        else if (/dream/.test(text)) id = "dreams-meaning"
        else if (/(uses|how to use|application)/.test(text)) id = "uses"
        else if (/technical/.test(text)) id = "technical-information"
        else {
          // Fallback: sanitize text
          id = text
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }

        if (id) {
          heading.id = id
        }
      }
    })
  }, [html])

  return (
    <div
      ref={contentRef}
      className={`wp-content not-prose ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: stripHtmlComments(html) }}
    />
  )
}
