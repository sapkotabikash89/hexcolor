"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/copy-button"
import { ColorSwatch as Swatch } from "@/components/color-swatch"
import ColorSwatchLink from "@/components/color-swatch-link"
import { hexToRgb, rgbToHsv, hsvToRgb, rgbToHex, isValidHex, rgbToHsl } from "@/lib/color-utils"
import { getColorPageLink } from "@/lib/color-linking-utils"
import Link from "next/link"

interface CompactAdvancedColorPickerProps {
    color?: string
    onChange?: (color: string) => void
    hideLink?: boolean
    footer?: React.ReactNode
    hideExploreButton?: boolean
    narrowPicker?: boolean
}

export function CompactAdvancedColorPicker({
    color,
    onChange,
    hideLink = false,
    footer,
    hideExploreButton = false,
    narrowPicker = false
}: CompactAdvancedColorPickerProps = {}) {
    const [selectedColor, setSelectedColor] = useState(color || "#a73991")
    const [hue, setHue] = useState(312)
    const [saturation, setSaturation] = useState(49)
    const [valueV, setValueV] = useState(44)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rectRef = useRef<DOMRect | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const isInternalChange = useRef(false)

    // Sync with external color prop
    useEffect(() => {
        if (color && isValidHex(color) && color.toLowerCase() !== selectedColor.toLowerCase()) {
            const rgb = hexToRgb(color)
            if (rgb) {
                const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
                // Set flag to false so we don't trigger onChange/dispatch back
                isInternalChange.current = false
                setHue(hsv.h)
                setSaturation(hsv.s)
                setValueV(hsv.v)
                setSelectedColor(color)
            }
        }
    }, [color])

    // Initial setup if color prop is provided but HSL defaults were used
    useEffect(() => {
        if (color && isValidHex(color)) {
            const rgb = hexToRgb(color)
            if (rgb) {
                const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
                // Only update if significantly different to avoid loops
                if (Math.abs(hsv.h - hue) > 1 || Math.abs(hsv.s - saturation) > 1 || Math.abs(hsv.v - valueV) > 1) {
                    setHue(hsv.h)
                    setSaturation(hsv.s)
                    setValueV(hsv.v)
                }
            }
        }
    }, [])

    useEffect(() => {
        const updateRect = () => {
            if (canvasRef.current) {
                rectRef.current = canvasRef.current.getBoundingClientRect()
            }
        }

        // Initial update
        updateRect()

        // Update on resize and scroll
        const resizeObserver = new ResizeObserver(updateRect)
        if (canvasRef.current) {
            resizeObserver.observe(canvasRef.current)
        }
        window.addEventListener('scroll', updateRect, { passive: true })
        window.addEventListener('resize', updateRect, { passive: true })

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener('scroll', updateRect)
            window.removeEventListener('resize', updateRect)
        }
    }, [])

    useEffect(() => {
        if (isInternalChange.current) {
            const event = new CustomEvent("colorUpdate", { detail: { color: selectedColor } })
            window.dispatchEvent(event)
            if (onChange) {
                onChange(selectedColor)
            }
        }
        // Reset flag after processing
        // We don't reset to false here because we might have multiple updates in a row from interaction
        // But actually, we only want to block the INITIAL sync or PROP sync.
        // If the user interacts, we set true. If props update, we set false.
    }, [selectedColor, onChange])

    // Removed canvas rendering as we now use CSS gradients

    const drawColorSpace = () => {
        // Canvas rendering removed
    }

    const handleCanvasInteraction = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        const container = canvasRef.current
        if (!container) return

        let rect = rectRef.current
        if (!rect) {
            rect = container.getBoundingClientRect()
            rectRef.current = rect
        }

        let clientX: number, clientY: number

        if ("touches" in e) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else {
            clientX = (e as any).clientX
            clientY = (e as any).clientY
        }

        const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
        const y = Math.max(0, Math.min(clientY - rect.top, rect.height))

        const newSaturation = (x / rect.width) * 100
        const newValueV = 100 - (y / rect.height) * 100

        setSaturation(Math.max(0, Math.min(100, Math.round(newSaturation))))
        setValueV(Math.max(0, Math.min(100, Math.round(newValueV))))

        const rgb = hsvToRgb(hue, newSaturation, newValueV)
        isInternalChange.current = true
        setSelectedColor(rgbToHex(rgb.r, rgb.g, rgb.b))
    }

    const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHue = Number.parseInt(e.target.value)
        setHue(newHue)
        const rgb = hsvToRgb(newHue, saturation, valueV)
        isInternalChange.current = true
        setSelectedColor(rgbToHex(rgb.r, rgb.g, rgb.b))
    }

    const handleSaturationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSaturation = Number.parseInt(e.target.value)
        setSaturation(newSaturation)
        const rgb = hsvToRgb(hue, newSaturation, valueV)
        isInternalChange.current = true
        setSelectedColor(rgbToHex(rgb.r, rgb.g, rgb.b))
    }

    const handleLightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValueV = Number.parseInt(e.target.value)
        setValueV(newValueV)
        const rgb = hsvToRgb(hue, saturation, newValueV)
        isInternalChange.current = true
        setSelectedColor(rgbToHex(rgb.r, rgb.g, rgb.b))
    }

    const rgb = hexToRgb(selectedColor)
    const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null

    const pickerX = `${Math.max(0, Math.min(100, saturation))}%`
    const pickerY = `${Math.max(0, Math.min(100, 100 - valueV))}%`

    // Removed pickerWidthClass logic as we now use full width in grid

    return (
        <Card className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left Column: Color Space Canvas and Sliders */}
                <div className="space-y-6 w-full">
                    <div className="relative w-full aspect-[4/3] sm:aspect-square md:aspect-[4/3] max-w-full mx-auto shadow-sm">
                        <div
                            ref={canvasRef as any}
                            className="w-full h-full rounded-xl border-2 border-border cursor-crosshair touch-none overflow-hidden relative shadow-inner"
                            style={{
                                backgroundColor: `hsl(${hue}, 100%, 50%)`,
                                backgroundImage: `
                                    linear-gradient(to right, #fff, transparent),
                                    linear-gradient(to top, #000, transparent)
                                `
                            }}
                            onClick={handleCanvasInteraction}
                            onMouseMove={(e) => isDragging && handleCanvasInteraction(e)}
                            onMouseDown={(e) => {
                                setIsDragging(true)
                                handleCanvasInteraction(e)
                            }}
                            onMouseUp={() => setIsDragging(false)}
                            onMouseLeave={() => setIsDragging(false)}
                            onTouchStart={(e) => {
                                setIsDragging(true)
                                handleCanvasInteraction(e)
                            }}
                            onTouchMove={(e) => {
                                e.preventDefault()
                                handleCanvasInteraction(e)
                            }}
                            onTouchEnd={() => setIsDragging(false)}
                        />
                        <div
                            className="absolute w-5 h-5 border-2 border-white rounded-full pointer-events-none shadow-md"
                            style={{
                                left: pickerX,
                                top: pickerY,
                                transform: "translate(-50%, -50%)",
                            }}
                        />
                    </div>

                    {/* Sliders Container */}
                    <div className="space-y-5 w-full">
                        {/* Hue Slider */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex justify-between">
                                <span>Hue</span>
                                <span>{hue}°</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={hue}
                                onChange={handleHueChange}
                                className="w-full h-4 rounded-full appearance-none cursor-pointer border border-border shadow-sm"
                                style={{
                                    background: `linear-gradient(to right, 
                                        hsl(0, 100%, 50%), 
                                        hsl(60, 100%, 50%), 
                                        hsl(120, 100%, 50%), 
                                        hsl(180, 100%, 50%), 
                                        hsl(240, 100%, 50%), 
                                        hsl(300, 100%, 50%), 
                                        hsl(360, 100%, 50%))`,
                                }}
                            />
                        </div>

                        {/* Saturation Slider */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex justify-between">
                                <span>Saturation</span>
                                <span>{saturation}%</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={saturation}
                                onChange={handleSaturationChange}
                                className="w-full h-4 rounded-full appearance-none cursor-pointer border border-border shadow-sm"
                                style={{
                                    background: `linear-gradient(to right, #808080, hsl(${hue}, 100%, 50%))`,
                                }}
                            />
                        </div>

                        {/* Brightness (Value) Slider */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex justify-between">
                                <span>Brightness</span>
                                <span>{valueV}%</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={valueV}
                                onChange={handleLightnessChange}
                                className="w-full h-4 rounded-full appearance-none cursor-pointer border border-border shadow-sm"
                                style={{
                                    background: `linear-gradient(to right, #000, hsl(${hue}, ${saturation}%, 50%))`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Color Display and Values */}
                <div className="flex flex-col gap-4 w-full h-full">
                    {/* Main Color Swatch */}
                    <ColorSwatchLink
                        hex={selectedColor}
                        className="w-full aspect-[2/1] md:aspect-auto md:h-36 rounded-xl border-2 border-border flex items-center justify-center font-mono text-xl md:text-2xl font-bold shadow-md"
                        style={{ backgroundColor: selectedColor, color: getContrastColor(selectedColor) }}
                    >
                        {selectedColor.toUpperCase()}
                    </ColorSwatchLink>

                    {!hideExploreButton && (
                        <Button asChild className="w-full gap-2 text-sm md:text-base font-bold h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-sm transition-all active:scale-[0.98]" size="lg">
                            <Link href={getColorPageLink(selectedColor)}>Explore This Color</Link>
                        </Button>
                    )}

                    {/* Color Values Boxes */}
                    <div className="space-y-3">
                        <div className="p-3 bg-muted/40 border border-border/50 rounded-xl relative group font-mono">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">HEX</span>
                            <div className="flex items-center justify-between">
                                <span className="text-sm md:text-base font-bold">{selectedColor.toUpperCase()}</span>
                                <CopyButton value={selectedColor.toUpperCase()} />
                            </div>
                        </div>

                        {rgb && (
                            <div className="p-3 bg-muted/40 border border-border/50 rounded-xl relative group font-mono">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">RGB</span>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm md:text-base font-bold">({rgb.r}, {rgb.g}, {rgb.b})</span>
                                    <CopyButton value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
                                </div>
                            </div>
                        )}

                        {hsl && (
                            <div className="p-3 bg-muted/40 border border-border/50 rounded-xl relative group font-mono">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">HSL</span>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm md:text-base font-bold">({hsl.h}°, {hsl.s}%, {hsl.l}%)</span>
                                    <CopyButton value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Link to Full Tool */}
            {footer ? (
                footer
            ) : !hideLink && (
                <div className="pt-4 flex justify-center border-t mt-6">
                    <Link
                        href="/color-picker"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md mt-4 text-sm"
                    >
                        Open Color Picker
                        <span className="text-lg">→</span>
                    </Link>
                </div>
            )}
        </Card>
    )
}

function getContrastColor(hex: string): string {
    const rgb = hexToRgb(hex)
    if (!rgb) return "#000000"
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    return brightness > 128 ? "#000000" : "#FFFFFF"
}
