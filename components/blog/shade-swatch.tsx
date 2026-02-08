"use client"

import { useState, useEffect } from "react"
import { Copy, Check, Heart } from "lucide-react"
import { toast } from "sonner"
import { getContrastColor } from "@/lib/color-utils"
import ColorSwatchLink from "@/components/color-swatch-link"

interface ShadeSwatchProps {
    hex: string
    rgb?: string
    cmyk?: string
}

export function ShadeSwatch({ hex, rgb, cmyk }: ShadeSwatchProps) {
    const [loveCount, setLoveCount] = useState(0)
    const [liked, setLiked] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)

    // Contrast calculation
    const textColor = getContrastColor(hex)

    // Persistence Key
    const storageKey = `love_shade_${hex.replace("#", "")}`

    useEffect(() => {
        // Load persisted love state
        try {
            const stored = localStorage.getItem(storageKey)
            if (stored) {
                const data = JSON.parse(stored)
                setLiked(data.liked)
                setLoveCount(data.count || Math.floor(Math.random() * 50) + 10)
            } else {
                // Initialize with pseudo-random count based on hex
                const pseudoRandom = parseInt(hex.slice(1, 4), 16) % 50 + 5
                setLoveCount(pseudoRandom)
            }
        } catch { }
    }, [storageKey, hex])

    const handleLove = () => {
        const nextLiked = !liked
        const nextCount = nextLiked ? loveCount + 1 : Math.max(0, loveCount - 1)

        setLiked(nextLiked)
        setLoveCount(nextCount)

        try {
            localStorage.setItem(storageKey, JSON.stringify({ liked: nextLiked, count: nextCount }))
        } catch { }
    }

    const handleCopy = (e: React.MouseEvent, text: string, label: string) => {
        e.preventDefault()
        e.stopPropagation()
        if (!text) return
        navigator.clipboard.writeText(text)
        setCopied(label)
        toast.success(`Copied ${label}`)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <ColorSwatchLink hex={hex} className="block my-6 rounded-xl overflow-hidden shadow-sm border border-border transition-all hover:shadow-md">
            <div
                className="w-full h-full"
                style={{ backgroundColor: hex }}
            >
                <div className="p-4 sm:p-6 relative min-h-[120px] sm:min-h-[140px]">

                    {/* Values Container */}
                    <div className="space-y-3 w-full pr-16 text-left">
                        {/* HEX */}
                        <div
                            className="flex items-center gap-2 sm:gap-3 group cursor-pointer w-fit"
                            onClick={(e) => handleCopy(e, hex, "HEX")}
                            style={{ color: textColor }}
                            role="button"
                        >
                            <span className="font-bold text-base sm:text-lg min-w-[48px] sm:min-w-[60px]">HEX</span>
                            <span className="font-mono text-base sm:text-lg opacity-90">{hex}</span>
                            <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                                {copied === "HEX" ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                            </div>
                        </div>

                        {/* RGB */}
                        {rgb && (
                            <div
                                className="flex items-center gap-2 sm:gap-3 group cursor-pointer w-fit"
                                onClick={(e) => handleCopy(e, rgb, "RGB")}
                                style={{ color: textColor }}
                                role="button"
                            >
                                <span className="font-bold text-sm sm:text-base min-w-[48px] sm:min-w-[60px] opacity-90">RGB</span>
                                <span className="font-mono text-sm sm:text-base opacity-90">{rgb}</span>
                                <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                                    {copied === "RGB" ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                </div>
                            </div>
                        )}

                        {/* CMYK */}
                        {cmyk && (
                            <div
                                className="flex items-center gap-2 sm:gap-3 group cursor-pointer w-fit"
                                onClick={(e) => handleCopy(e, cmyk, "CMYK")}
                                style={{ color: textColor }}
                                role="button"
                            >
                                <span className="font-bold text-sm sm:text-base min-w-[48px] sm:min-w-[60px] opacity-90">CMYK</span>
                                <span className="font-mono text-sm sm:text-base opacity-90">{cmyk}</span>
                                <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                                    {copied === "CMYK" ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Love Interaction - Absolute Top Right */}
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col items-center gap-1">
                        <div
                            role="button"
                            onClick={handleLove}
                            className="group relative p-2.5 sm:p-3 rounded-full transition-all hover:scale-110 active:scale-95 bg-white/10 backdrop-blur-sm border border-white/20 cursor-pointer"
                            title="Love this color"
                            style={{ color: textColor }}
                        >
                            <Heart className="w-5 h-5 sm:w-6 sm:h-6" fill={liked ? "currentColor" : "none"} />
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold font-mono shadow-sm" style={{ color: textColor }}>
                            {loveCount}
                        </span>
                    </div>
                </div>
            </div>
        </ColorSwatchLink>
    )
}
