"use client"

import { useState } from "react"
import { ArrowUp, Check, Copy, ChevronDown, ChevronUp } from "lucide-react"
import { hexToRgb } from "@/lib/color-utils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Shade {
    name: string
    hex: string
    id: string
}

interface ShadesTOCProps {
    shades: Shade[]
    baseColorName: string
}

export function ShadesTOC({ shades, baseColorName }: ShadesTOCProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [limit, setLimit] = useState(10)
    const [copied, setCopied] = useState<string | null>(null)

    const toggleOpen = () => setIsOpen(!isOpen)

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(text)
        toast.success(`Copied ${text} to clipboard`)
        setTimeout(() => setCopied(null), 2000)
    }

    const handleShowMore = () => {
        setLimit(prev => Math.min(prev + 10, shades.length))
    }

    const scrollToTop = () => {
        const el = document.getElementById("shades-toc-container")
        if (el) {
            const headerOffset = 100
            const elementPosition = el.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset
            window.scrollTo({
                top: offsetPosition,
                behavior: "auto"
            })
        } else {
            window.scrollTo({ top: 0, behavior: "auto" }) // Fallback
        }
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

    const displayedShades = shades.slice(0, limit)

    return (
        <section id="shades-toc-container" className="mb-8 border border-border rounded-xl overflow-hidden shadow-sm bg-white">
            <div
                onClick={toggleOpen}
                className="bg-muted/30 p-4 cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between group"
            >
                <span className="font-semibold text-lg text-primary group-hover:underline">Jump to Shades</span>
                <span className="text-muted-foreground text-sm font-medium flex items-center">
                    {isOpen ? (
                        <>
                            <ChevronUp className="w-4 h-4 mr-1" /> Hide List
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4 mr-1" /> Show List
                        </>
                    )}
                </span>
            </div>

            {isOpen && (
                <div className="p-4 border-t border-border animate-in slide-in-from-top-2 duration-200">
                    <h3 className="font-bold text-xl mb-6 text-center text-foreground">List of Shades of {baseColorName}</h3>

                    <div className="overflow-x-auto pb-2">
                        <div className="min-w-[400px] grid grid-cols-[40px_1fr_80px_130px] md:grid-cols-[60px_1fr_1fr_1fr] gap-2 md:gap-4 mb-3 font-semibold text-sm text-foreground/70 border-b pb-2 px-2">
                            <div className="text-center">Color</div>
                            <div>Name</div>
                            <div>Hex Code</div>
                            <div>RGB Code</div>
                        </div>

                        <div className="divide-y divide-border/50">
                            {displayedShades.map((shade, idx) => {
                                const rgb = hexToRgb(shade.hex)
                                const rgbString = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "N/A"

                                return (
                                    <div key={`${shade.hex}-${idx}`} className="min-w-[400px] grid grid-cols-[40px_1fr_80px_130px] md:grid-cols-[60px_1fr_1fr_1fr] gap-2 md:gap-4 items-center text-sm py-3 hover:bg-muted/30 px-2 transition-colors">
                                        <div className="flex justify-center">
                                            <div
                                                className="w-8 h-8 rounded-full border-2 border-border shadow-sm"
                                                style={{ backgroundColor: shade.hex }}
                                                title={shade.hex}
                                            />
                                        </div>

                                        <button
                                            onClick={() => scrollToSection(shade.id, shade.name)}
                                            className="text-left font-semibold text-primary hover:underline hover:text-primary/80 truncate text-base"
                                            title="Jump to section"
                                        >
                                            {shade.name}
                                        </button>

                                        <button
                                            onClick={() => handleCopy(shade.hex)}
                                            className="text-left font-mono text-muted-foreground hover:text-foreground relative group/copy flex items-center gap-2 w-fit px-1 py-1 rounded hover:bg-muted"
                                            title="Click to copy"
                                        >
                                            {shade.hex}
                                            {copied === shade.hex ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 opacity-0 group-hover/copy:opacity-100 transition-opacity" />}
                                        </button>

                                        <button
                                            onClick={() => handleCopy(rgbString)}
                                            className="text-left font-mono text-muted-foreground hover:text-foreground relative group/copy flex items-center gap-2 w-fit px-2 py-1 rounded hover:bg-muted"
                                            title="Click to copy"
                                        >
                                            <span className="truncate">{rgbString}</span>
                                            {copied === rgbString ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 opacity-0 group-hover/copy:opacity-100 transition-opacity" />}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-6 relative">
                        {limit < shades.length && (
                            <Button onClick={handleShowMore} variant="outline" className="min-w-[120px]">
                                Show More
                            </Button>
                        )}

                        <button
                            onClick={scrollToTop}
                            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all hover:scale-110 absolute right-0 sm:static"
                            title="Go to Top"
                        >
                            <ArrowUp className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}
