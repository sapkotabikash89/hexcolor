"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Palette, Shuffle, Pipette } from "lucide-react"
import { hexToRgb, rgbToHsv, hsvToRgb, rgbToHex, rgbToHsl } from "@/lib/color-utils"
import Link from "next/link"
import { getColorPageLink, getColorLinkRel } from "@/lib/color-linking-utils"
import { CopyButton } from "@/components/copy-button"

export function HomeColorPicker() {
  const [selectedColor, setSelectedColor] = useState("#a73991")
  const [hue, setHue] = useState(312)
  const [saturation, setSaturation] = useState(49)
  const [valueV, setValueV] = useState(44)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const [isDragging, setIsDragging] = useState(false)

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
    const event = new CustomEvent("colorUpdate", { detail: { color: selectedColor } })
    window.dispatchEvent(event)
  }, [selectedColor])

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

    let clientX: number
    let clientY: number

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
    const newColor = rgbToHex(rgb.r, rgb.g, rgb.b)
    setSelectedColor(newColor)

    const event = new CustomEvent("colorUpdate", { detail: { color: newColor } })
    window.dispatchEvent(event)
  }

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = Number.parseInt(e.target.value)
    setHue(newHue)
    const rgb = hsvToRgb(newHue, saturation, valueV)
    const newColor = rgbToHex(rgb.r, rgb.g, rgb.b)
    setSelectedColor(newColor)

    const event = new CustomEvent("colorUpdate", { detail: { color: newColor } })
    window.dispatchEvent(event)
  }

  const handleSaturationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSaturation = Number.parseInt(e.target.value)
    setSaturation(newSaturation)
    const rgb = hsvToRgb(hue, newSaturation, valueV)
    const newColor = rgbToHex(rgb.r, rgb.g, rgb.b)
    setSelectedColor(newColor)

    const event = new CustomEvent("colorUpdate", { detail: { color: newColor } })
    window.dispatchEvent(event)
  }

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValueV = Number.parseInt(e.target.value)
    setValueV(newValueV)
    const rgb = hsvToRgb(hue, saturation, newValueV)
    const newColor = rgbToHex(rgb.r, rgb.g, rgb.b)
    setSelectedColor(newColor)

    const event = new CustomEvent("colorUpdate", { detail: { color: newColor } })
    window.dispatchEvent(event)
  }

  const handleRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const rgb = hexToRgb(randomHex)
    if (rgb) {
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
      setHue(hsv.h)
      setSaturation(hsv.s)
      setValueV(hsv.v)
      setSelectedColor(randomHex)
    }
  }

  const rgb = hexToRgb(selectedColor)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null

  const pickerX = `${Math.max(0, Math.min(100, saturation))}%`
  const pickerY = `${Math.max(0, Math.min(100, 100 - valueV))}%`

  return (
    <Card className="p-2 sm:p-6 space-y-4 sm:space-y-6">
      <div className="space-y-2 px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold">Interactive Color Picker</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Choose your perfect color and explore its properties instantly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 px-1 sm:px-0 w-full">
        {/* Left Column: Color picker area (Picker Square + Sliders) */}
        <div className="space-y-6 w-full">
          <div className="relative w-full">
            <div
              ref={canvasRef as any}
              className="w-full h-[240px] sm:h-[300px] rounded-xl border-2 border-border cursor-crosshair touch-none overflow-hidden relative shadow-inner"
              style={{
                backgroundColor: `hsl(${hue}, 100%, 50%)`,
                backgroundImage: `
                  linear-gradient(to right, #fff, transparent),
                  linear-gradient(to top, #000, transparent)
                `
              }}
              onClick={handleCanvasInteraction}
              onMouseMove={(e) => {
                if (isDragging) {
                  handleCanvasInteraction(e);
                  e.preventDefault();
                }
              }}
              onMouseDown={(e) => {
                setIsDragging(true);
                handleCanvasInteraction(e);
                e.preventDefault();
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onTouchStart={(e) => {
                setIsDragging(true);
                handleCanvasInteraction(e);
                e.preventDefault();
              }}
              onTouchMove={(e) => {
                if (isDragging) {
                  handleCanvasInteraction(e);
                  e.preventDefault();
                }
              }}
              onTouchEnd={() => setIsDragging(false)}
            />
            <div
              className="absolute w-5 h-5 border-2 border-white rounded-full pointer-events-none"
              style={{
                left: pickerX,
                top: pickerY,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
          </div>

          <div className="space-y-5">
            {/* Hue Slider */}
            <div className="space-y-2 w-full">
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
            <div className="space-y-2 w-full">
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
                  background: `linear-gradient(to right, #808080, hsl(${hue}, 100%, 50%))`
                }}
              />
            </div>

            {/* Brightness/Value Slider */}
            <div className="space-y-2 w-full">
              <label className="text-sm font-semibold flex justify-between">
                <span>Brightness</span>
                <span>{valueV}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={valueV}
                onChange={handleBrightnessChange}
                className="w-full h-4 rounded-full appearance-none cursor-pointer border border-border shadow-sm"
                style={{
                  background: `linear-gradient(to right, #000, hsl(${hue}, ${saturation}%, 50%))`
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Color Display and Action Area */}
        <div className="flex flex-col gap-4 w-full">
          {/* Main Color Swatch */}
          <div
            className="w-full aspect-[2/1] sm:aspect-auto sm:h-36 rounded-xl border-2 border-border flex items-center justify-center font-mono text-xl sm:text-2xl font-bold shadow-md"
            style={{
              backgroundColor: selectedColor,
              color: getContrastColor(selectedColor),
            }}
          >
            {selectedColor.toUpperCase()}
          </div>

          {getColorLinkRel(selectedColor) !== "nofollow" ? (
            <Button asChild size="lg" className="w-full gap-2 text-sm sm:text-base font-bold h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-sm transition-all active:scale-[0.98]">
              <Link href={getColorPageLink(selectedColor)}>
                Explore This Color
              </Link>
            </Button>
          ) : (
            <Button size="lg" className="w-full gap-2 text-sm sm:text-base font-bold h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-sm transition-all active:scale-[0.98]" disabled>
              Explore This Color
            </Button>
          )}

          {/* Color Values Boxes */}
          <div className="space-y-3">
            <div className="p-3 bg-muted/40 border border-border/50 rounded-xl relative group font-mono">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">HEX</span>
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-bold">{selectedColor.toUpperCase()}</span>
                <CopyButton value={selectedColor.toUpperCase()} />
              </div>
            </div>
            {rgb && (
              <div className="p-3 bg-muted/40 border border-border/50 rounded-xl relative group font-mono">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">RGB</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold">({rgb.r}, {rgb.g}, {rgb.b})</span>
                  <CopyButton value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
                </div>
              </div>
            )}
            {hsl && (
              <div className="p-3 bg-muted/40 border border-border/50 rounded-xl relative group font-mono">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">HSL</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold">({hsl.h}°, {hsl.s}%, {hsl.l}%)</span>
                  <CopyButton value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Buttons Area */}
      <div className="flex justify-center pt-2 sm:pt-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={handleRandomColor}
            variant="outline"
            size="lg"
            className="gap-2 bg-white border-border hover:bg-muted font-bold h-12 px-6 rounded-xl shadow-sm transition-all active:scale-95"
          >
            <Shuffle className="w-4 h-4" />
            Random Color
          </Button>
          <Link href="/image-color-picker/">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 bg-white border-border hover:bg-muted font-bold h-12 px-6 rounded-xl shadow-sm transition-all active:scale-95"
            >
              <Pipette className="w-4 h-4" />
              Image Color Picker
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

// Helper function to get contrasting text color
function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return "#000000"

  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}
