"use client"

import type React from "react"

import { useRef, useState } from "react"
import Link from "next/link"
import { useIsMobile } from "@/components/ui/use-mobile"
import { CopyButton } from "@/components/copy-button"
import { getColorPageLink } from "@/lib/color-linking-utils"
import ColorSwatchLink from "@/components/color-swatch-link"
import { cn } from "@/lib/utils"

interface ColorSwatchProps {
  color: string
  onClick?: () => void
  showHex?: boolean
  className?: string
  swatchClassName?: string
}

export function ColorSwatch({ color, onClick, showHex = false, className, swatchClassName }: ColorSwatchProps) {
  const isMobile = useIsMobile()
  const [showCopied, setShowCopied] = useState(false)
  const swatchRef = useRef<HTMLDivElement>(null)

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(color)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <ColorSwatchLink
        hex={color}
        className="block w-full"
        onClick={onClick ? (e) => { e.preventDefault(); onClick(); } : undefined}
      >
        <div
          className={cn(
            "relative w-full h-full aspect-square rounded-lg cursor-pointer hover:scale-105 transition-transform group overflow-hidden shadow-sm border border-black/5",
            swatchClassName
          )}
          style={{ backgroundColor: color }}
          ref={swatchRef}
        >
          {showCopied && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
              <span className="text-white text-xs font-bold">Copied!</span>
            </div>
          )}

          {showHex && (
            <button
              type="button"
              className="absolute bottom-1 left-0 right-0 mx-auto w-fit flex justify-center items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20 hover:bg-black/40 transition-colors z-10 backdrop-blur-[2px] text-white"
              onClick={handleCopy}
            >
              {color.toUpperCase()}
            </button>
          )}
        </div>
      </ColorSwatchLink>
    </div>
  )
}
