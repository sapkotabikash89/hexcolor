"use client"

import { useEffect, useRef } from "react"

interface BlogContentProps {
  html: string
  isShadesMeaning?: boolean
  className?: string
  style?: React.CSSProperties
}

export function BlogContent({ html, isShadesMeaning, className = '', style }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    const headings = contentRef.current.querySelectorAll('h2')
    const usedIds = new Set<string>()

    headings.forEach((heading) => {
      if (heading.id) {
        let currentId = heading.id
        if (usedIds.has(currentId)) {
          const baseId = currentId
          let counter = 2
          while (usedIds.has(currentId)) {
            currentId = `${baseId}-${counter}`
            counter += 1
          }
          heading.id = currentId
        }
        usedIds.add(currentId)
        return
      }

      const text = (heading.textContent || '').toLowerCase()
      let id = ''

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
        id = text
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      }

      if (!id) return

      let uniqueId = id
      let counter = 2
      while (usedIds.has(uniqueId)) {
        uniqueId = `${id}-${counter}`
        counter += 1
      }
      heading.id = uniqueId
      usedIds.add(uniqueId)
    })
  }, [html])

  return (
    <div
      ref={contentRef}
      className={`wp-content not-prose ${className} ${isShadesMeaning ? 'shades-meaning-content' : ''}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
