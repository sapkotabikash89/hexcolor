 "use client"

import React, { useState } from "react"
import { Pipette } from "lucide-react"
import { CustomColorPicker } from "@/components/custom-color-picker"
import { getColorPageLink } from "@/lib/color-linking-utils"
import { useRouter } from "next/navigation"

interface Shade {
    name: string
    hex: string
    id: string
}

interface ShadesSidebarTOCProps {
    currentHex: string
    shades: Shade[]
    baseColorName: string
}

export function ShadesSidebarTOC({ currentHex, shades, baseColorName }: ShadesSidebarTOCProps) {
    const router = useRouter()
    const [showPicker, setShowPicker] = useState(false)

    if (shades.length === 0) return null

    const handleColorApply = (color?: string) => {
        const selectedColor = typeof color === "string" ? color : currentHex
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("colorUpdate", { detail: { color: selectedColor } }))
        }
        const link = getColorPageLink(selectedColor)
        const relativeLink = link.replace("https://hexcolormeans.com", "")
        router.push(relativeLink)
        setShowPicker(false)
    }

    return (
        <nav className="sticky top-28 max-h-[calc(100vh-8rem)] w-full hidden lg:block">
            <div className="space-y-1">
                <div className="mb-6 p-4 rounded-lg bg-card border shadow-sm flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-md shadow-sm border border-border flex items-center justify-center cursor-pointer"
                        style={{ backgroundColor: currentHex }}
                        onClick={() => setShowPicker(true)}
                    >
                        <Pipette className="w-4 h-4 text-white mix-blend-difference" />
                    </div>
                    <span className="font-mono font-bold text-sm">{currentHex.replace('#', '').toUpperCase()}</span>
                </div>

                <div className="font-medium text-xs text-muted-foreground uppercase px-4 mb-2 tracking-wider">
                    Jump to Shades
                </div>

                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
                    <div className="space-y-1 pb-2">
                        {shades.map((shade, idx) => {
                            return (
                                <a
                                    key={`${shade.hex}-${idx}`}
                                    href={`#${shade.id}`}
                                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 group text-left text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                >
                                    <div
                                        className="w-4 h-4 rounded-full border border-border shadow-sm flex-shrink-0"
                                        style={{ backgroundColor: shade.hex }}
                                        title={shade.hex}
                                    />
                                    <span className="truncate">{shade.name}</span>
                                </a>
                            )
                        })}
                    </div>
                </div>

                {showPicker && (
                    <CustomColorPicker
                        value={currentHex}
                        onChange={() => {}}
                        onApply={handleColorApply}
                        onClose={() => setShowPicker(false)}
                    />
                )}
            </div>
        </nav>
    )
}
