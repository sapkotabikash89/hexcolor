"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { hexToRgb, rgbToHsv, hsvToRgb, rgbToHex, rgbToHsl } from "@/lib/color-utils"
import ColorSwatchLink from "@/components/color-swatch-link"
import { CopyButton } from "@/components/copy-button"

export function CompactColorPicker() {
    const [selectedColor, setSelectedColor] = useState("#a73991")
    const [hue, setHue] = useState(312)
    const [saturation, setSaturation] = useState(49)
    const [valueV, setValueV] = useState(44)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rectRef = useRef<DOMRect | null>(null)

    useEffect(() => {
        const updateRect = () => {
            if (canvasRef.current) {
                rectRef.current = canvasRef.current.getBoundingClientRect()
            }
        }

        updateRect()
        const resizeObserver = new ResizeObserver(updateRect)
        if (canvasRef.current) resizeObserver.observe(canvasRef.current)
        window.addEventListener("scroll", updateRect, { passive: true })
        window.addEventListener("resize", updateRect, { passive: true })

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener("scroll", updateRect)
            window.removeEventListener("resize", updateRect)
        }
    }, [])

    // Removed canvas rendering as we now use CSS gradients

    const drawColorSpace = () => {
        // Canvas rendering removed
    }

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const container = canvasRef.current
        if (!container) return

        let rect = rectRef.current
        if (!rect) {
            rect = container.getBoundingClientRect()
            rectRef.current = rect
        }

        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
        const newSaturation = (x / rect.width) * 100
        const newValueV = 100 - (y / rect.height) * 100
        setSaturation(Math.round(newSaturation))
        setValueV(Math.round(newValueV))
        const rgb = hsvToRgb(hue, newSaturation, newValueV)
        setSelectedColor(rgbToHex(rgb.r, rgb.g, rgb.b))
    }

    const rgb = hexToRgb(selectedColor)
    const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null

    return (
        <Card className="p-6 space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Live Color Picker</h2>
                <p className="text-sm text-muted-foreground">Pick your perfect color instantly</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="relative">
                        <div
                            ref={canvasRef as any}
                            className="w-full h-[200px] rounded-lg border-2 border-border cursor-crosshair overflow-hidden relative"
                            style={{
                                backgroundColor: `hsl(${hue}, 100%, 50%)`,
                                backgroundImage: `
                                    linear-gradient(to right, #fff, transparent),
                                    linear-gradient(to top, #000, transparent)
                                `
                            }}
                            onClick={handleCanvasClick}
                        />
                        <div
                            className="absolute w-4 h-4 border-2 border-white rounded-full pointer-events-none shadow-lg"
                            style={{
                                left: `${saturation}%`,
                                top: `${100 - valueV}%`,
                                transform: "translate(-50%, -50%)",
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Hue: {hue}°</label>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={hue}
                            onChange={(e) => {
                                const newHue = parseInt(e.target.value)
                                setHue(newHue)
                                const rgb = hsvToRgb(newHue, saturation, valueV)
                                setSelectedColor(rgbToHex(rgb.r, rgb.g, rgb.b))
                            }}
                            className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))`,
                            }}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <ColorSwatchLink
                        hex={selectedColor}
                        className="w-full h-32 rounded-lg border-2 border-border flex items-center justify-center font-mono font-bold text-lg block"
                        style={{
                            backgroundColor: selectedColor,
                            color: rgb && (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255 > 0.5 ? "#000" : "#fff",
                        }}
                    >
                        {selectedColor.toUpperCase()}
                    </ColorSwatchLink>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <div>
                                <span className="text-xs text-muted-foreground">HEX</span>
                                <p className="font-mono font-semibold">{selectedColor}</p>
                            </div>
                            <CopyButton value={selectedColor} />
                        </div>
                        {rgb && (
                            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                                <div>
                                    <span className="text-xs text-muted-foreground">RGB</span>
                                    <p className="font-mono text-sm">({rgb.r}, {rgb.g}, {rgb.b})</p>
                                </div>
                                <CopyButton value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
                            </div>
                        )}
                        {hsl && (
                            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                                <div>
                                    <span className="text-xs text-muted-foreground">HSL</span>
                                    <p className="font-mono text-sm">({hsl.h}°, {hsl.s}%, {hsl.l}%)</p>
                                </div>
                                <CopyButton value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="text-center pt-2">
                <Link href="/color-picker/" className="text-primary font-semibold hover:underline inline-flex items-center gap-2">
                    Open full Color Picker tool
                    <span className="text-xl">→</span>
                </Link>
            </div>
        </Card>
    )
}
