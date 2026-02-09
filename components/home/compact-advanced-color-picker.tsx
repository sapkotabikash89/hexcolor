"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/copy-button"
import { ColorSwatch as Swatch } from "@/components/color-swatch"
import ColorSwatchLink from "@/components/color-swatch-link"
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex, isValidHex } from "@/lib/color-utils"
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
    const [lightness, setLightness] = useState(44)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rectRef = useRef<DOMRect | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const isInternalChange = useRef(false)

    // Sync with external color prop
    useEffect(() => {
        if (color && isValidHex(color) && color.toLowerCase() !== selectedColor.toLowerCase()) {
            const rgb = hexToRgb(color)
            if (rgb) {
                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
                // Set flag to false so we don't trigger onChange/dispatch back
                isInternalChange.current = false
                setHue(hsl.h)
                setSaturation(hsl.s)
                setLightness(hsl.l)
                setSelectedColor(color)
            }
        }
    }, [color])

    // Initial setup if color prop is provided but HSL defaults were used
    useEffect(() => {
        if (color && isValidHex(color)) {
            const rgb = hexToRgb(color)
            if (rgb) {
                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
                // Only update if significantly different to avoid loops
                if (Math.abs(hsl.h - hue) > 1 || Math.abs(hsl.s - saturation) > 1 || Math.abs(hsl.l - lightness) > 1) {
                    setHue(hsl.h)
                    setSaturation(hsl.s)
                    setLightness(hsl.l)
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

    useEffect(() => {
        drawColorSpace()
    }, [hue])

    const drawColorSpace = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const width = canvas.width
        const height = canvas.height

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const s = (x / width) * 100
                const l = 100 - (y / height) * 100
                const rgb = hslToRgb(hue, s, l)
                const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
                ctx.fillStyle = hex
                ctx.fillRect(x, y, 1, 1)
            }
        }
    }

    const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        let rect = rectRef.current
        if (!rect) {
            rect = canvas.getBoundingClientRect()
            rectRef.current = rect
        }

        let clientX: number, clientY: number

        if ("touches" in e) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else {
            clientX = e.clientX
            clientY = e.clientY
        }

        const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
        const y = Math.max(0, Math.min(clientY - rect.top, rect.height))

        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const canvasX = x * scaleX
        const canvasY = y * scaleY

        const newSaturation = (canvasX / canvas.width) * 100
        const newLightness = 100 - (canvasY / canvas.height) * 100

        setSaturation(Math.max(0, Math.min(100, Math.round(newSaturation))))
        setLightness(Math.max(0, Math.min(100, Math.round(newLightness))))

        const rgb = hslToRgb(hue, newSaturation, newLightness)
        isInternalChange.current = true
        setSelectedColor(rgbToHex(rgb.r, rgb.g, rgb.b))
    }

    const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHue = Number.parseInt(e.target.value)
        setHue(newHue)
        const rgb = hslToRgb(newHue, saturation, lightness)
        isInternalChange.current = true
        setSelectedColor(rgbToHex(rgb.r, rgb.g, rgb.b))
    }

    const handleSaturationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSaturation = Number.parseInt(e.target.value)
        setSaturation(newSaturation)
        const rgb = hslToRgb(hue, newSaturation, lightness)
        isInternalChange.current = true
        setSelectedColor(rgbToHex(rgb.r, rgb.g, rgb.b))
    }

    const handleLightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newLightness = Number.parseInt(e.target.value)
        setLightness(newLightness)
        const rgb = hslToRgb(hue, saturation, newLightness)
        isInternalChange.current = true
        setSelectedColor(rgbToHex(rgb.r, rgb.g, rgb.b))
    }

    const rgb = hexToRgb(selectedColor)
    const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null

    const pickerX = `${Math.max(0, Math.min(100, saturation))}%`
    const pickerY = `${Math.max(0, Math.min(100, 100 - lightness))}%`

    const pickerWidthClass = narrowPicker
        ? "max-w-[280px] sm:max-w-[320px]"
        : "max-w-[320px] sm:max-w-[400px]"

    return (
        <Card className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row gap-8 md:items-start lg:items-center xl:items-start">
                {/* Color Space Canvas and Hue Slider */}
                <div className="flex flex-col items-center space-y-3 sm:space-y-4 md:w-auto lg:w-full xl:w-auto flex-shrink-0">
                    <div className={`relative w-full ${pickerWidthClass}`}>
                        <canvas
                            ref={canvasRef}
                            width={400}
                            height={280}
                            className="w-full h-auto aspect-[10/7] rounded-lg border-2 border-border cursor-crosshair touch-none"
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
                            className="absolute w-4 h-4 sm:w-5 sm:h-5 border-2 border-white rounded-full pointer-events-none"
                            style={{
                                left: pickerX,
                                top: pickerY,
                                transform: "translate(-50%, -50%)",
                                boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
                            }}
                        />
                    </div>

                    {/* Sliders */}
                    <div className={`space-y-4 w-full ${pickerWidthClass}`}>
                        {/* Hue Slider */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hue: {hue}°</label>
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={hue}
                                onChange={handleHueChange}
                                className="w-full h-3 sm:h-4 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_rgba(0,0,0,0.2)] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
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
                            <label className="text-sm font-medium">Saturation: {saturation}%</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={saturation}
                                onChange={handleSaturationChange}
                                className="w-full h-3 sm:h-4 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_rgba(0,0,0,0.2)] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
                                style={{
                                    background: `linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`,
                                }}
                            />
                        </div>

                        {/* Lightness Slider */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Lightness: {lightness}%</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={lightness}
                                onChange={handleLightnessChange}
                                className="w-full h-3 sm:h-4 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_rgba(0,0,0,0.2)] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
                                style={{
                                    background: `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Color Display and Values */}
                <div className="flex-1 min-w-0 w-full lg:w-full xl:flex-1 xl:min-w-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-4 sm:gap-6 w-full">
                        {/* Left Column: Color Preview */}
                        <div className="space-y-3">
                            <ColorSwatchLink
                                hex={selectedColor}
                                className="w-full h-24 sm:h-32 rounded-lg border-2 border-border flex items-center justify-center font-mono font-semibold text-base sm:text-lg block"
                                style={{ backgroundColor: selectedColor, color: getContrastColor(selectedColor) }}
                            >
                                {selectedColor.toUpperCase()}
                            </ColorSwatchLink>

                            {!hideExploreButton && (
                                <Button asChild className="w-full" size="lg">
                                    <Link href={getColorPageLink(selectedColor)}>Explore This Color</Link>
                                </Button>
                            )}
                        </div>

                        {/* Right Column: Color Values */}
                        <div className="space-y-3 w-full">
                            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                                <div className="min-w-0 flex-1">
                                    <span className="text-xs sm:text-sm text-muted-foreground">HEX</span>
                                    <p className="font-mono font-semibold text-sm truncate">{selectedColor}</p>
                                </div>
                                <CopyButton value={selectedColor} />
                            </div>
                            {rgb && (
                                <>
                                    <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                                        <div className="min-w-0 flex-1">
                                            <span className="text-xs sm:text-sm text-muted-foreground">RGB</span>
                                            <p className="font-mono text-sm truncate">
                                                ({rgb.r}, {rgb.g}, {rgb.b})
                                            </p>
                                        </div>
                                        <CopyButton value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
                                    </div>
                                    {hsl && (
                                        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                                            <div className="min-w-0 flex-1">
                                                <span className="text-xs sm:text-sm text-muted-foreground">HSL</span>
                                                <p className="font-mono text-sm truncate">
                                                    ({hsl.h}°, {hsl.s}%, {hsl.l}%)
                                                </p>
                                            </div>
                                            <CopyButton value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
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
