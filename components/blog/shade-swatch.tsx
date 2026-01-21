"use client"

import { useState, useEffect } from "react"
import { Copy, Check, Heart } from "lucide-react"
import { toast } from "sonner"
import { getContrastColor } from "@/lib/color-utils"

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

    const handleCopy = (text: string, label: string) => {
        if (!text) return
        navigator.clipboard.writeText(text)
        setCopied(label)
        toast.success(`Copied ${label}`)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <div
            className="my-6 rounded-xl overflow-hidden shadow-sm border border-border transition-all hover:shadow-md"
            style={{ backgroundColor: hex }}
        >
            <div className="p-6 relative min-h-[140px]">

                {/* Values Container */}
                <div className="space-y-3 w-full pr-16 text-left">
                    {/* HEX */}
                    <div
                        className="flex items-center gap-3 group cursor-pointer w-fit"
                        onClick={() => handleCopy(hex, "HEX")}
                        style={{ color: textColor }}
                    >
                        <span className="font-bold text-lg min-w-[60px]">HEX</span>
                        <span className="font-mono text-lg opacity-90">{hex}</span>
                        <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                            {copied === "HEX" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </div>
                    </div>

                    {/* RGB */}
                    {rgb && (
                        <div
                            className="flex items-center gap-3 group cursor-pointer w-fit"
                            onClick={() => handleCopy(rgb, "RGB")}
                            style={{ color: textColor }}
                        >
                            <span className="font-bold text-base min-w-[60px] opacity-90">RGB</span>
                            <span className="font-mono text-base opacity-90">{rgb}</span>
                            <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                                {copied === "RGB" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </div>
                        </div>
                    )}

                    {/* CMYK */}
                    {cmyk && (
                        <div
                            className="flex items-center gap-3 group cursor-pointer w-fit"
                            onClick={() => handleCopy(cmyk, "CMYK")}
                            style={{ color: textColor }}
                        >
                            <span className="font-bold text-base min-w-[60px] opacity-90">CMYK</span>
                            <span className="font-mono text-base opacity-90">{cmyk}</span>
                            <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                                {copied === "CMYK" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </div>
                        </div>
                    )}
                </div>

                {/* Love Interaction - Absolute Top Right */}
                <div className="absolute top-6 right-6 flex flex-col items-center gap-1">
                    <button
                        onClick={handleLove}
                        className="group relative p-3 rounded-full transition-all hover:scale-110 active:scale-95 bg-white/10 backdrop-blur-sm border border-white/20"
                        title="Love this color"
                        style={{ color: textColor }}
                    >
                        <Heart className={`w-6 h-6 ${liked ? "fill-current" : ""}`} />
                    </button>
                    <span className="text-xs font-bold font-mono shadow-sm" style={{ color: textColor }}>
                        {loveCount}
                    </span>
                </div>
            </div>
        </div>
    )
}
