"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Pipette } from "lucide-react"
import { CustomColorPicker } from "@/components/custom-color-picker"
import ColorSwatchLink from "@/components/color-swatch-link"
import { getColorPageLink } from "@/lib/color-linking-utils"

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
    const [activeSection, setActiveSection] = useState("")
    const [showCustomPicker, setShowCustomPicker] = useState(false)
    const [tempColor, setTempColor] = useState(currentHex)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id)
                    }
                })
            },
            { rootMargin: "-10% 0px -40% 0px" }
        )

        const sections = document.querySelectorAll("section[id], div[id], article[id], h2[id]")
        sections.forEach((section) => observer.observe(section))

        return () => sections.forEach((section) => observer.unobserve(section))
    }, [])

    useEffect(() => {
        if (showCustomPicker) {
            setTempColor(currentHex)
        }
    }, [showCustomPicker, currentHex])

    const handleScroll = (id: string) => {
        const el = document.getElementById(id)
        if (el) {
            const offset = 100 // Height of header + mobile nav
            const bodyRect = document.body.getBoundingClientRect().top
            const elementRect = el.getBoundingClientRect().top
            const elementPosition = elementRect - bodyRect
            const offsetPosition = elementPosition - offset

            window.scrollTo({
                top: offsetPosition,
                behavior: "auto"
            })
        }
    }

    const handleColorChange = (color: string) => {
        setTempColor(color)
    }

    const handleColorApply = (color?: string) => {
        setShowCustomPicker(false)
    }

    const scrollToSection = (id: string, name: string) => {
        // Try to find element by ID. If not found, try finding by text content of h2s
        let el = document.getElementById(id)
        if (!el) {
            // Fallback: try to find h2 with the text
            const h2s = document.querySelectorAll('h2')
            for (const h2 of h2s) {
                // Normalize logic: strict match or match with stripped whitespace
                const text = h2.textContent?.trim() || ""
                if (text === name || text.toLowerCase() === name.toLowerCase()) {
                    el = h2
                    break
                }
            }
        }

        if (el) {
            const headerOffset = 100
            const elementPosition = el.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset
            window.scrollTo({
                top: offsetPosition,
                behavior: "auto"
            })
        }
    }

    if (shades.length === 0) return null

    return (
        <nav className="sticky top-28 max-h-[calc(100vh-8rem)] w-full hidden lg:block">
            <div className="space-y-1">
                {/* Current Color Header */}
                <div className="mb-6 p-4 rounded-lg bg-card border shadow-sm flex items-center gap-3">
                    <div
                        onClick={(e) => {
                            e.preventDefault()
                            setShowCustomPicker(true)
                        }}
                        className="w-8 h-8 rounded-md shadow-sm border border-border flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all block relative"
                        style={{ backgroundColor: currentHex }}
                        title="Pick a color"
                        role="button"
                        tabIndex={0}
                    >
                        <Pipette className="w-4 h-4 text-white mix-blend-difference absolute inset-0 m-auto" />
                        <span className="sr-only">Pick a color</span>
                    </div>
                    <span className="font-mono font-bold text-sm">{currentHex.replace('#', '').toUpperCase()}</span>
                </div>

                {/* Jump to Shades Section */}
                <div className="font-medium text-xs text-muted-foreground uppercase px-4 mb-2 tracking-wider">
                    Jump to Shades
                </div>

                {/* Shades List with Scrollable Area */}
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
                    <div className="space-y-1 pb-2">
                        {shades.map((shade, idx) => {
                            const isActive = activeSection === shade.id

                            return (
                                <div
                                    key={`${shade.hex}-${idx}`}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 group text-left",
                                        isActive
                                            ? "bg-muted font-medium text-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <ColorSwatchLink
                                        hex={shade.hex}
                                        className="w-4 h-4 rounded-full border border-border shadow-sm flex-shrink-0 block"
                                        style={{ backgroundColor: shade.hex }}
                                        title={shade.hex}
                                    >
                                        <span className="sr-only">Color {shade.hex}</span>
                                    </ColorSwatchLink>
                                    <button
                                        onClick={() => scrollToSection(shade.id, shade.name)}
                                        className="truncate hover:underline text-left flex-1"
                                    >
                                        {shade.name}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Custom Color Picker Dialog */}
            {showCustomPicker && (
                <CustomColorPicker
                    value={tempColor}
                    onChange={handleColorChange}
                    onApply={handleColorApply}
                    getApplyLink={getColorPageLink}
                    onClose={() => setShowCustomPicker(false)}
                />
            )}
        </nav>
    )
}