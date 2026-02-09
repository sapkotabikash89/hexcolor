"use client"
// Force rebuild

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
    BookOpen,
    ArrowRightLeft,
    Layers,
    Palette,
    Eye, // For Contrast
    EyeOff, // For Blindness
    Code,
    Grid,
    Smile, // Icons
    LayoutTemplate, // Mockups
    Link as LinkIcon, // Related
    HelpCircle,
    FileText,
    Pipette,
    Hash,
    History,
    Sparkles,
    Brain,
    User,
    Globe,
    Moon,
    Hammer,
    Info
} from "lucide-react"
import { CustomColorPicker } from "@/components/custom-color-picker"
import { getColorPageLink } from "@/lib/color-linking-utils"

interface TableOfContentsProps {
    currentHex: string
    mobileOnly?: boolean
    hideFaqs?: boolean
    items?: Array<{ id: string; label: string; icon?: any }>
}

const BLOG_ICONS: Record<string, any> = {
    "definition": BookOpen,
    "history": History,
    "symbolism": Sparkles,
    "spiritual-meaning": Hash,
    "psychology": Brain,
    "personality": User,
    "cultural-meaning": Globe,
    "dreams-meaning": Moon,
    "uses": Hammer,
    "technical-information": Info,
}

export function TableOfContents({ currentHex, mobileOnly = false, hideFaqs = false, items }: TableOfContentsProps) {
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

    let navItems = items || [
        { id: "information", label: "Color Codes", icon: FileText },
        { id: "meaning", label: "Meaning", icon: BookOpen },
        { id: "conversion", label: "Conversion", icon: ArrowRightLeft },
        { id: "variations", label: "Shades & Tints", icon: Layers },
        { id: "harmonies", label: "Palettes", icon: Palette },
        { id: "contrast-checker", label: "Contrast", icon: Eye },
        { id: "blindness-simulator", label: "Blindness", icon: EyeOff },
        { id: "css-examples", label: "CSS & Styles", icon: Code },
        { id: "patterns", label: "Patterns", icon: Grid },
        { id: "icons", label: "Icons", icon: Smile },
        { id: "mockups", label: "Mockups", icon: LayoutTemplate },
        { id: "related-colors", label: "Related", icon: LinkIcon },
        { id: "faqs", label: "FAQs", icon: HelpCircle },
    ]

    if (!items && hideFaqs) {
        navItems = navItems.filter(item => item.id !== "faqs")
    }

    // Filter out FAQs if they don't exist in the page content (dynamic check ideally, but static for now)
    // We can rely on the fact that the section won't exist in DOM if excluded, but the link will just do nothing if clicked.
    // For now we keep it generic.

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

    if (mobileOnly) {
        return (
            <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
                <div className="flex overflow-x-auto no-scrollbar items-center whitespace-nowrap py-3 px-4 gap-4">
                    {navItems.map((item) => {
                        const Icon = item.icon || BLOG_ICONS[item.id] || Hash
                        const isActive = activeSection === item.id

                        return (
                            <button
                                key={`mobile-${item.id}`}
                                onClick={() => handleScroll(item.id)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 shrink-0",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {item.label}
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <nav className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 hidden lg:block w-full">
            <div className="space-y-1">
                {/* Current Color Header */}
                <div className="mb-6 p-4 rounded-lg bg-card border shadow-sm flex items-center gap-3">
                    <button
                        onClick={() => setShowCustomPicker(true)}
                        className="w-8 h-8 rounded-md shadow-sm border border-border flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                        style={{ backgroundColor: currentHex }}
                        title="Pick a color"
                        aria-label="Pick a color"
                    >
                        <Pipette className="w-4 h-4 text-white mix-blend-difference" />
                    </button>
                    <span className="font-mono font-bold text-sm">{currentHex.replace('#', '').toUpperCase()}</span>
                </div>

                <div className="font-medium text-xs text-muted-foreground uppercase px-4 mb-2 tracking-wider">
                    On this page
                </div>

                {navItems.map((item) => {
                    const Icon = item.icon || BLOG_ICONS[item.id] || Hash
                    const isActive = activeSection === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleScroll(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 group text-left",
                                isActive
                                    ? "bg-muted font-medium text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <Icon className={cn("w-4 h-4", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                            {item.label}
                        </button>
                    )
                })}
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
