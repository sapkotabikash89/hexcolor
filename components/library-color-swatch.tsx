"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Heart, Copy } from "lucide-react"
import { hexToRgb, rgbToCmyk, getContrastColor } from "@/lib/color-utils"
import { getColorPageLink } from "@/lib/color-linking-utils"
import ColorSwatchLink from "@/components/color-swatch-link"
import { cn } from "@/lib/utils"

interface LibraryColorSwatchProps {
    name: string
    hex: string
}

export function LibraryColorSwatch({ name, hex }: LibraryColorSwatchProps) {
    const [loveCount, setLoveCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [copiedKey, setCopiedKey] = useState<string | null>(null)

    // Initialize with a random love count
    useEffect(() => {
        setLoveCount(Math.floor(Math.random() * 50) + 5)
    }, [])

    const rgb = hexToRgb(hex)
    const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : { c: 0, m: 0, y: 0, k: 0 }
    const contrastColor = getContrastColor(hex)

    const handleCopy = async (e: React.MouseEvent, text: string, key: string) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            await navigator.clipboard.writeText(text)
            setCopiedKey(key)
            setTimeout(() => setCopiedKey(null), 2000)
        } catch (err) {
            console.error("Failed to copy!", err)
        }
    }

    const handleLove = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isLiked) {
            setLoveCount((prev) => prev + 1)
            setIsLiked(true)
        } else {
            setLoveCount((prev) => Math.max(0, prev - 1))
            setIsLiked(false)
        }
    }

    const rgbString = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : ""
    const cmykString = `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`

    return (
        <ColorSwatchLink hex={hex} className="block">
            <Card
                className="group relative flex flex-col overflow-hidden border-2 border-border shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer aspect-square bg-white"
            >
                {/* Background Color Area - Square Shape */}
            <div
                className="flex-1 p-4 flex flex-col justify-end"
                style={{ backgroundColor: hex, color: contrastColor }}
            >
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs uppercase font-bold opacity-70">Hex</span>
                            <span className="font-mono font-bold text-sm sm:text-base">{hex.toUpperCase()}</span>
                            <button
                                onClick={(e) => handleCopy(e, hex.toUpperCase(), "hex")}
                                className="p-1.5 rounded-md hover:bg-black/10 transition-colors relative"
                                aria-label="Copy Hex"
                            >
                                <Copy className="w-3.5 h-3.5" />
                                {copiedKey === "hex" && (
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded font-sans whitespace-nowrap">Copied!</span>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold opacity-70">Rgb</span>
                        <span className="font-mono font-bold text-sm sm:text-base whitespace-nowrap">{rgbString}</span>
                        <button
                            onClick={(e) => handleCopy(e, rgbString, "rgb")}
                            className="p-1.5 rounded-md hover:bg-black/10 transition-colors relative"
                            aria-label="Copy RGB"
                        >
                            <Copy className="w-3.5 h-3.5" />
                            {copiedKey === "rgb" && (
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded font-sans whitespace-nowrap">Copied!</span>
                            )}
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold opacity-70">Cmyk</span>
                        <span className="font-mono font-bold text-sm sm:text-base whitespace-nowrap">{cmykString}</span>
                        <button
                            onClick={(e) => handleCopy(e, cmykString, "cmyk")}
                            className="p-1.5 rounded-md hover:bg-black/10 transition-colors relative"
                            aria-label="Copy CMYK"
                        >
                            <Copy className="w-3.5 h-3.5" />
                            {copiedKey === "cmyk" && (
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded font-sans whitespace-nowrap">Copied!</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Information Area - Love icon on the right of the name */}
            <div className="p-3 bg-white border-t flex items-center justify-between">
                <p className="text-sm font-bold truncate pr-4">{name}</p>
                <button
                    onClick={handleLove}
                    className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-300",
                        isLiked ? "bg-red-50 text-red-500 shadow-sm" : "bg-muted text-muted-foreground hover:bg-red-50 hover:text-red-400"
                    )}
                >
                    <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                    <span className="text-xs font-bold">{loveCount}</span>
                </button>
            </div>
            </Card>
        </ColorSwatchLink>
    )
}
