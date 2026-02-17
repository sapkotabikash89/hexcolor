"use client"

import type React from "react"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useIsMobile } from "@/components/ui/use-mobile"
import { CopyButton } from "@/components/copy-button"
import { getColorPageLink } from "@/lib/color-linking-utils"

interface ColorSwatchProps {
  color: string
  onClick?: () => void
  showHex?: boolean
}

export function ColorSwatch({ color, onClick, showHex = false }: ColorSwatchProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [showCopied, setShowCopied] = useState(false)
  const swatchRef = useRef<HTMLAnchorElement>(null)

  const handleCopy = async (e?: React.MouseEvent) => {
    e?.stopPropagation()
    let success = false
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(color)
        success = true
      }
    } catch {
      success = false
    }
    if (!success) {
      try {
        const textarea = document.createElement("textarea")
        textarea.value = color
        textarea.setAttribute("readonly", "")
        textarea.style.position = "fixed"
        textarea.style.top = "-1000px"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        const ok = document.execCommand("copy")
        document.body.removeChild(textarea)
        success = ok
      } catch {
        success = false
      }
    }
    if (!success) return
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 1500)
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <a
        href={getColorPageLink(color)}
        className="relative w-20 h-20 rounded-lg cursor-pointer hover:scale-105 transition-transform group"
        style={{ backgroundColor: color }}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault()
            onClick()
          } else {
            // Let the standard link-click handling take over if no onClick
            // or we could dispatch our custom event
            window.dispatchEvent(new CustomEvent("colorUpdate", { detail: { color } }))
          }
        }}
        ref={swatchRef}
        aria-label={`View color ${color}`}
        title={`View color ${color}`}
      >
        {showCopied && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
            <span className="text-white text-xs font-bold">Copied!</span>
          </div>
        )}
      </a>
      {showHex && (
        <div className="relative">
          <CopyButton
            value={color}
            label={color}
            variant="ghost"
            size="sm"
            showIcon={false}
            className="text-xs font-mono hover:text-primary transition-colors px-2 py-1 -mx-2"
            anchorRef={swatchRef}
          />
        </div>
      )}
    </div>
  )
}
