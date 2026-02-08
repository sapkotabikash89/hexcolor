"use client"

import { useState } from "react"
import { getContrastColor } from "@/lib/color-utils"
import ColorSwatchLink from "@/components/color-swatch-link"

interface RelatedColorSwatchProps {
    color: { hex: string; name: string }
    className?: string
}

export function RelatedColorSwatch({ color, className }: RelatedColorSwatchProps) {
    const [showCopied, setShowCopied] = useState(false)

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText(color.hex)
        setShowCopied(true)
        setTimeout(() => setShowCopied(false), 2000)
    }

    return (
        <ColorSwatchLink
            hex={color.hex}
            className={className}
            title={color.name}
        >
            <div
                className="w-full aspect-square rounded-lg border border-border shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: color.hex }}
            >
                {showCopied && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                        <span className="text-white text-xs font-bold">Copied!</span>
                    </div>
                )}
                <button
                    type="button"
                    className="font-mono text-xs font-bold px-2 py-1 rounded hover:bg-black/10 transition-colors z-10"
                    style={{ color: getContrastColor(color.hex) }}
                    onClick={handleCopy}
                >
                    {color.hex.toUpperCase()}
                </button>
            </div>
            <div className="text-center">
                <span className="font-medium text-xs sm:text-sm block leading-tight truncate px-1" title={color.name}>
                    {color.name}
                </span>
            </div>
        </ColorSwatchLink>
    )
}
