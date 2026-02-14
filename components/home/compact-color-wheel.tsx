"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getColorHarmony, hslToRgb, rgbToHex, hexToRgb, rgbToHsl, rgbToCmyk } from "@/lib/color-utils"
import { CustomColorPicker } from "@/components/custom-color-picker"
import { ColorCombination } from "@/components/color-combination"
import { getColorPageLink } from "@/lib/color-linking-utils"
import { ColorExportDialog } from "@/components/color-export-dialog"
import ColorSwatchLink from "@/components/color-swatch-link"
import Link from "next/link"
import { Share, Shuffle, Pipette } from "lucide-react"

export function CompactColorWheel() {
    const [baseColor, setBaseColor] = useState("#E0115F")
    const [harmonyType, setHarmonyType] = useState("complementary")
    const [colorValueType, setColorValueType] = useState("hex") // State for dropdown - default to hex

    // Update harmony type setter to clear random palette when harmony type changes
    const setHarmonyTypeAndClearRandom = (newHarmonyType: string) => {
        setHarmonyType(newHarmonyType);
        setShowRandomPalette(false); // Clear random palette when changing harmony type
    }
    const [randomPalette, setRandomPalette] = useState<string[]>([]) // State for random palette
    const [showRandomPalette, setShowRandomPalette] = useState(false) // State to show random palette
    const [showCustomPicker, setShowCustomPicker] = useState(false) // State for custom color picker
    const [tempColor, setTempColor] = useState(baseColor) // Temporary color for picker
    const [copiedValue, setCopiedValue] = useState<string | null>(null) // State for copy notification
    const [exportOpen, setExportOpen] = useState(false) // State for export dialog
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [canvasSize, setCanvasSize] = useState(450)
    const staticCanvasRef = useRef<HTMLCanvasElement | null>(null)
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

    useEffect(() => {
        const event = new CustomEvent("colorUpdate", { detail: { color: baseColor } })
        window.dispatchEvent(event)
    }, [baseColor])

    useEffect(() => {
        const updateLayout = () => {
            const width = window.innerWidth

            if (width < 640) {
                const size = Math.min(width - 40, 360)
                setCanvasSize(size)
            } else if (width < 1024) {
                setCanvasSize(380)
            } else {
                setCanvasSize(450)
            }
        }

        updateLayout()
        window.addEventListener("resize", updateLayout)
        return () => window.removeEventListener("resize", updateLayout)
    }, [])

    useEffect(() => {
        drawStaticWheel()
        drawOverlay()
    }, [canvasSize])

    useEffect(() => {
        drawOverlay()
    }, [baseColor, harmonyType])

    const drawStaticWheel = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const outerRadius = Math.min(centerX, centerY) - 40

        const offscreen = document.createElement("canvas")
        offscreen.width = canvas.width
        offscreen.height = canvas.height
        const offCtx = offscreen.getContext("2d")
        if (!offCtx) return

        offCtx.clearRect(0, 0, offscreen.width, offscreen.height)

        for (let angle = 0; angle < 360; angle++) {
            const startAngle = (angle - 90) * (Math.PI / 180)
            const endAngle = (angle + 1 - 90) * (Math.PI / 180)

            for (let r = 0; r <= outerRadius; r += 1) {
                const saturation = (r / outerRadius) * 100
                const lightness = 100 - (r / outerRadius) * 50
                const rgb = hslToRgb(angle, saturation, lightness)
                const hex = rgbToHex(rgb.r, rgb.g, rgb.b)

                offCtx.beginPath()
                offCtx.arc(centerX, centerY, r, startAngle, endAngle)
                offCtx.strokeStyle = hex
                offCtx.lineWidth = 1.5
                offCtx.stroke()
            }
        }

        staticCanvasRef.current = offscreen
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(offscreen, 0, 0)
    }

    const drawOverlay = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const outerRadius = Math.min(centerX, centerY) - 40

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        if (staticCanvasRef.current) {
            ctx.drawImage(staticCanvasRef.current, 0, 0)
        }

        const ringInner = outerRadius + 10
        const ringOuter = outerRadius + 30

        const baseRgb = hexToRgb(baseColor)
        if (baseRgb) {
            const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b)

            for (let angle = 0; angle < 360; angle++) {
                const startAngle = (angle - 90) * (Math.PI / 180)
                const endAngle = (angle + 1 - 90) * (Math.PI / 180)

                const lightness = (angle / 360) * 100
                const rgb = hslToRgb(baseHsl.h, baseHsl.s, lightness)
                const hex = rgbToHex(rgb.r, rgb.g, rgb.b)

                for (let r = ringInner; r <= ringOuter; r += 1) {
                    ctx.beginPath()
                    ctx.arc(centerX, centerY, r, startAngle, endAngle)
                    ctx.strokeStyle = hex
                    ctx.lineWidth = 1
                    ctx.stroke()
                }
            }
        }

        const baseRgb2 = hexToRgb(baseColor)
        if (baseRgb2) {
            const baseHsl = rgbToHsl(baseRgb2.r, baseRgb2.g, baseRgb2.b)
            const angle = (baseHsl.h - 90) * (Math.PI / 180)
            const distance = (baseHsl.s / 100) * outerRadius

            const x = centerX + Math.cos(angle) * distance
            const y = centerY + Math.sin(angle) * distance

            ctx.beginPath()
            ctx.arc(x, y, 12, 0, 2 * Math.PI)
            ctx.fillStyle = "#FFFFFF"
            ctx.fill()
            ctx.strokeStyle = "#000000"
            ctx.lineWidth = 4
            ctx.stroke()

            ctx.beginPath()
            ctx.arc(x, y, 7, 0, 2 * Math.PI)
            ctx.fillStyle = baseColor
            ctx.fill()
        }

        const harmonies = getColorHarmony(baseColor, harmonyType)
        harmonies.forEach((color) => {
            if (color !== baseColor) {
                drawColorMarker(ctx, centerX, centerY, outerRadius, color, false)
            }
        })
    }

    const drawColorMarker = (
        ctx: CanvasRenderingContext2D,
        centerX: number,
        centerY: number,
        radius: number,
        color: string,
        isBase = false,
    ) => {
        const rgb = hexToRgb(color)
        if (!rgb) return

        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
        const angle = (hsl.h - 90) * (Math.PI / 180)
        const distance = (hsl.s / 100) * radius

        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance

        ctx.beginPath()
        ctx.arc(x, y, 10, 0, 2 * Math.PI)
        ctx.fillStyle = "#FFFFFF"
        ctx.fill()
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(x, y, 6, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.fill()
    }

    const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        // Use cached rect if available (during drag), otherwise get fresh rect (click)
        let rect = rectRef.current
        if (!rect || (!isDragging && e.type !== 'mousemove' && e.type !== 'touchmove')) {
            rect = canvas.getBoundingClientRect()
            rectRef.current = rect
        }

        let clientX: number
        let clientY: number

        if ("touches" in e) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else {
            clientX = (e as React.MouseEvent).clientX
            clientY = (e as React.MouseEvent).clientY
        }

        const x = clientX - rect.left
        const y = clientY - rect.top

        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const canvasX = x * scaleX
        const canvasY = y * scaleY

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const outerRadius = Math.min(centerX, centerY) - 40

        const dx = canvasX - centerX
        const dy = canvasY - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > outerRadius) return

        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90
        const normalizedAngle = angle < 0 ? angle + 360 : angle

        const saturation = (distance / outerRadius) * 100
        const lightness = 100 - (distance / outerRadius) * 50

        const rgb = hslToRgb(normalizedAngle, saturation, lightness)
        const newColor = rgbToHex(rgb.r, rgb.g, rgb.b)
        setBaseColor(newColor)
    }

    // Utility function to convert RGB to CMYK
    const rgbToCmyk = (r: number, g: number, b: number) => {
        const rPercent = r / 255
        const gPercent = g / 255
        const bPercent = b / 255

        const k = 1 - Math.max(rPercent, gPercent, bPercent)

        if (k === 1) {
            return { c: 0, m: 0, y: 0, k: 1 }
        }

        const c = (1 - rPercent - k) / (1 - k)
        const m = (1 - gPercent - k) / (1 - k)
        const y = (1 - bPercent - k) / (1 - k)

        return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) }
    }

    // Utility function to get color value based on selected type
    const getColorValue = (hex: string) => {
        const rgb = hexToRgb(hex)
        if (!rgb) return hex

        switch (colorValueType) {
            case "hex":
                return hex.toUpperCase()
            case "rgb":
                return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
            case "hsl":
                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
                return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
            case "cmyk":
                const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)
                return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
            default:
                return hex.toUpperCase()
        }
    }

    // Function to copy color value to clipboard
    const copyToClipboard = async (value: string, e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            await navigator.clipboard.writeText(value)
            setCopiedValue(value)
            setTimeout(() => setCopiedValue(null), 2000) // Clear after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    // Function to get contrast color for the color picker icon
    const getContrastColor = (hex: string): string => {
        const rgb = hexToRgb(hex)
        if (!rgb) return "#000000"
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
        return brightness > 128 ? "#000000" : "#FFFFFF"
    }

    // Function to generate random palette
    const generateRandomPalette = () => {
        // Randomly select a harmony type
        const harmonyTypes = ['complementary', 'analogous', 'triadic', 'tetradic', 'split-complementary', 'square', 'monochromatic'];
        const randomHarmonyType = harmonyTypes[Math.floor(Math.random() * harmonyTypes.length)];

        // Generate a random base color
        const randomHue = Math.floor(Math.random() * 360);
        const randomSaturation = 50 + Math.floor(Math.random() * 50); // 50-100 for vibrant colors
        const randomLightness = 30 + Math.floor(Math.random() * 50); // 30-80 for good visibility

        const rgb = hslToRgb(randomHue, randomSaturation, randomLightness);
        const randomBaseColor = rgbToHex(rgb.r, rgb.g, rgb.b);

        // Generate the harmony based on the random color and random harmony type
        const palette = getColorHarmony(randomBaseColor, randomHarmonyType);

        // Set the base color and harmony type to match the random palette
        setBaseColor(randomBaseColor);
        setHarmonyType(randomHarmonyType);

        setRandomPalette(palette);
        setShowRandomPalette(true);
    };

    const harmonies = getColorHarmony(baseColor, harmonyType)

    return (
        <Card className="p-2 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row gap-8 md:items-stretch lg:items-center xl:items-stretch min-h-[400px] md:min-h-[350px] lg:min-h-[400px] xl:min-h-[350px]">
                {/* Color Wheel - Centered */}
                <div className="flex flex-col justify-center items-center md:w-auto lg:w-full xl:w-auto flex-shrink-0 gap-4">
                    <canvas
                        ref={canvasRef}
                        width={canvasSize}
                        height={canvasSize}
                        aria-label="Interactive color wheel: click or drag to select a base color"
                        role="img"
                        className="border-2 border-border rounded-lg cursor-crosshair"
                        style={{
                            width: `${canvasSize}px`,
                            height: `${canvasSize}px`,
                            aspectRatio: "1/1",
                            touchAction: "none",
                        }}
                        onClick={handleCanvasInteraction}
                        onMouseMove={(e) => isDragging && handleCanvasInteraction(e)}
                        onMouseDown={(e) => {
                            if (canvasRef.current) rectRef.current = canvasRef.current.getBoundingClientRect()
                            setIsDragging(true)
                        }}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseLeave={() => setIsDragging(false)}
                        onTouchStart={(e) => {
                            if (canvasRef.current) rectRef.current = canvasRef.current.getBoundingClientRect()
                            setIsDragging(true)
                            handleCanvasInteraction(e)
                        }}
                        onTouchMove={(e) => {
                            e.preventDefault()
                            if (isDragging) handleCanvasInteraction(e)
                        }}
                        onTouchEnd={() => setIsDragging(false)}
                    />
                    {/* Base Color Info - Moved below wheel */}
                    <div className="w-full space-y-2" style={{ maxWidth: `${canvasSize}px` }}>
                        <label className="font-medium text-sm sm:text-base">Base Color:</label>
                        <div className="flex items-center gap-3 px-3 py-2 border border-input rounded-md shadow-xs">
                            <ColorSwatchLink
                                hex={baseColor}
                                className="w-12 h-8 sm:w-16 sm:h-10 rounded-md border-2 border-border cursor-pointer relative block"
                                style={{ backgroundColor: baseColor }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setTempColor(baseColor);
                                    setShowCustomPicker(true);
                                }}
                                title={`Open color picker for base color ${baseColor.toUpperCase()}`}
                            >
                                <Pipette
                                    className="absolute inset-0 m-auto w-4 h-4"
                                    style={{ color: getContrastColor(baseColor) }}
                                />
                                <span className="sr-only">Open color picker for base color {baseColor}</span>
                            </ColorSwatchLink>
                            <div className="flex-1 flex items-center gap-2">
                                <Select value={colorValueType} onValueChange={setColorValueType}>
                                    <SelectTrigger className="w-24 h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hex">HEX</SelectItem>
                                        <SelectItem value="rgb">RGB</SelectItem>
                                        <SelectItem value="hsl">HSL</SelectItem>
                                        <SelectItem value="cmyk">CMYK</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span
                                    className="font-mono font-semibold text-sm sm:text-base truncate hidden md:block"
                                    style={{ color: getContrastColor(baseColor) }}
                                >
                                    {getColorValue(baseColor)}
                                </span>
                            </div>
                            <button
                                onClick={(e) => copyToClipboard(getColorValue(baseColor), e)}
                                className="p-1.5 rounded-md hover:bg-accent transition-colors relative"
                                aria-label="Copy color value"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                                {copiedValue === getColorValue(baseColor) && (
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded font-sans whitespace-nowrap">
                                        Copied!
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Mobile view: Show selected color value below base color box */}
                        <div className="md:hidden mt-2 text-center">
                            <span className="text-xs text-muted-foreground block mb-1">Selected Value</span>
                            <span
                                className="font-mono font-semibold text-sm"
                                style={{ color: getContrastColor(baseColor) }}
                            >
                                {getColorValue(baseColor)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex-1 min-w-0 h-full flex flex-col w-full lg:w-full xl:flex-1 xl:min-w-0">
                    <div className="flex flex-col gap-4 flex-1 min-h-0">
                        {/* Harmony Type */}
                        <div className="space-y-2 flex-shrink-0">
                            <label className="font-medium text-sm sm:text-base">Harmony Type:</label>
                            <Select value={harmonyType} onValueChange={setHarmonyTypeAndClearRandom}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="complementary">Complementary</SelectItem>
                                    <SelectItem value="analogous">Analogous</SelectItem>
                                    <SelectItem value="triadic">Triadic</SelectItem>
                                    <SelectItem value="tetradic">Tetradic</SelectItem>
                                    <SelectItem value="split-complementary">Split Complementary</SelectItem>
                                    <SelectItem value="square">Square</SelectItem>
                                    <SelectItem value="double-split-complementary">Double Split Complementary</SelectItem>
                                    <SelectItem value="monochromatic">Monochromatic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Color Harmony */}
                        <div className="flex flex-col gap-3 flex-1 min-h-0 w-full">
                            <div className="flex items-center justify-between flex-shrink-0">
                                <h3 className="font-semibold text-sm sm:text-base">Color Harmony</h3>
                                <Button size="sm" variant="ghost" className="gap-2" onClick={() => setExportOpen(true)}>
                                    <Share className="w-4 h-4" />
                                    Export
                                </Button>
                            </div>
                            <ColorCombination
                                colors={showRandomPalette ? randomPalette : harmonies}
                                baseHex={baseColor}
                                height="100%"
                                vertical={true}
                                className="flex-1 w-full"
                            />

                            {/* Random Palette Box - Equal height to base color box */}
                            <div className="mt-4">
                                <Button
                                    onClick={generateRandomPalette}
                                    className="w-full h-12 flex items-center gap-2"
                                    variant="outline"
                                >
                                    <Shuffle className="w-4 h-4" />
                                    Random Palette
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Link to Full Tool */}
            <div className="pt-4 flex justify-center border-t mt-6">
                <Link
                    href="/color-wheel/"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md mt-4 text-sm"
                >
                    Open Color Wheel
                    <span className="text-lg">→</span>
                </Link>
            </div>
            {showCustomPicker && (
                <CustomColorPicker
                    value={tempColor}
                    onChange={(c) => {
                        setTempColor(c)
                        setBaseColor(c)
                    }}
                    onClose={() => setShowCustomPicker(false)}
                    onApply={(color) => {
                        setBaseColor(color || tempColor)
                        setShowCustomPicker(false)
                    }}
                />
            )}

            <ColorExportDialog
                open={exportOpen}
                onOpenChange={setExportOpen}
                title={`Export ${showRandomPalette ? 'Random Palette' : harmonyType}`}
                colors={showRandomPalette ? randomPalette : harmonies}
                baseHex={baseColor}
                filenameLabel={showRandomPalette ? 'random-palette' : harmonyType}
            />
        </Card>
    )
}
