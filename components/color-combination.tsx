"use client"

import { useState } from "react"
import Link from "next/link"
import { getContrastColor } from "@/lib/color-utils"
import { getColorPageLink } from "@/lib/color-linking-utils"
import ColorSwatchLink from "@/components/color-swatch-link"

export function ColorCombination({
  colors,
  baseHex,
  height = 64,
  onColorChange,
  vertical = false,
  className = "",
}: {
  colors: string[]
  baseHex?: string
  height?: number | string
  onColorChange?: (color: string) => void
  vertical?: boolean
  className?: string
}) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  return (
    <div 
      className={`w-full rounded-2xl overflow-hidden flex ${vertical ? "flex-col" : "flex-row"} ${className}`} 
      style={{ height: vertical ? (typeof height === 'number' ? `${height}px` : height) : height, minHeight: vertical ? (typeof height === 'number' ? `${height}px` : "300px") : undefined }}
    >
      {colors.map((hex, i) => {
        const isOriginal = baseHex && hex.toUpperCase() === baseHex.toUpperCase()
        const contrast = getContrastColor(hex)
        const commonClassName = `relative ${vertical ? "w-full flex-1" : "h-full flex-1"}`
        const commonStyle = { backgroundColor: hex, border: "1px solid white", minHeight: vertical ? "50px" : undefined }

        const handleCopy = async (e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          navigator.clipboard.writeText(hex)
          setCopiedIndex(i)
          setTimeout(() => setCopiedIndex(null), 1500)
        }

        const content = (
          <>
            {isOriginal ? (
              <span
                className="absolute top-1 right-1 text-[10px] font-bold"
                style={{ color: contrast }}
              >
                o
              </span>
            ) : null}
            <div className="absolute bottom-1 left-0 right-0 flex justify-center z-10">
              <button
                type="button"
                onClick={handleCopy}
                className="text-[10px] font-mono px-1 rounded bg-black/30 text-white hover:bg-black/50 transition-colors"
                style={{ color: contrast === "#000000" ? "#000" : "#fff", backgroundColor: contrast === "#000000" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)" }}
              >
                {hex.toUpperCase()}
              </button>
            </div>
            {copiedIndex === i && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-foreground text-background px-2 py-1 rounded text-xs font-medium z-20">
                Copied!
              </div>
            )}
          </>
        )

        return (
          <div key={`${hex}-${i}`} className={commonClassName} style={commonStyle}>
            <ColorSwatchLink 
              hex={hex} 
              className="block w-full h-full relative"
              onClick={onColorChange ? (e) => { e.preventDefault(); onColorChange(hex); } : undefined}
            >
              {content}
            </ColorSwatchLink>
          </div>
        )
      })}
    </div>
  )
}
