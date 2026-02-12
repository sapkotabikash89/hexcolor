"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import ReactDOM from "react-dom"
import { Button } from "@/components/ui/button"
import ColorSwatchLink from "@/components/color-swatch-link"
import Link from "next/link"
import { X } from "lucide-react"
import { hexToRgb, rgbToHsv, hsvToRgb, rgbToHex } from "@/lib/color-utils"
import { getColorLinkRel } from "@/lib/color-linking-utils"

interface CustomColorPickerProps {
  value: string
  onChange: (color: string) => void
  onApply?: (color: string) => void
  getApplyLink?: (color: string) => string
  onClose: () => void
  disableGlobalUpdate?: boolean
}

export function CustomColorPicker({ value = "#a73991", onChange, onApply, getApplyLink, onClose, disableGlobalUpdate = false }: CustomColorPickerProps) {
  const [hue, setHue] = useState(() => {
    const rgb = hexToRgb(value)
    return rgb ? rgbToHsv(rgb.r, rgb.g, rgb.b).h : 0
  })
  const [saturation, setSaturation] = useState(() => {
    const rgb = hexToRgb(value)
    return rgb ? rgbToHsv(rgb.r, rgb.g, rgb.b).s : 0
  })
  const [value_v, setValueV] = useState(() => {
    const rgb = hexToRgb(value)
    return rgb ? rgbToHsv(rgb.r, rgb.g, rgb.b).v : 0
  })
  const [hexInput, setHexInput] = useState(value)
  const [tempColor, setTempColor] = useState(value)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (isDragging) return

    const rgb = hexToRgb(value)
    if (rgb) {
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
      setHue(hsv.h)
      setSaturation(hsv.s)
      setValueV(hsv.v)
      setHexInput(value)
      setTempColor(value)
    }
  }, [value, isDragging])

  // Removed canvas rendering as we now use CSS gradients

  const handleCanvasInteraction = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if (e.cancelable) e.preventDefault()

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
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    setHexInput(hex)
    setTempColor(hex)
    onChange(hex)

    if (!disableGlobalUpdate) {
      const event = new CustomEvent("colorUpdate", { detail: { color: hex } })
      window.dispatchEvent(event)
    }
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMove = (e: MouseEvent | TouchEvent) => {
      handleCanvasInteraction(e)
    }

    const handleEnd = () => {
      setIsDragging(false)
      rectRef.current = null
    }

    window.addEventListener("mousemove", handleMove, { passive: false })
    window.addEventListener("mouseup", handleEnd)
    window.addEventListener("touchmove", handleMove, { passive: false })
    window.addEventListener("touchend", handleEnd)

    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseup", handleEnd)
      window.removeEventListener("touchmove", handleMove)
      window.removeEventListener("touchend", handleEnd)
    }
  }, [isDragging, hue, saturation, value_v, onChange, disableGlobalUpdate])

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = Number.parseInt(e.target.value)
    setHue(newHue)
    const rgb = hsvToRgb(newHue, saturation, value_v)
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    setHexInput(hex)
    setTempColor(hex)
    onChange(hex)

    // Dispatch color update event for sidebar
    if (!disableGlobalUpdate) {
      const event = new CustomEvent("colorUpdate", { detail: { color: hex } })
      window.dispatchEvent(event)
    }
  }

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setHexInput(input)
    if (/^#[0-9A-F]{6}$/i.test(input)) {
      setTempColor(input)
      onChange(input)
      const rgb = hexToRgb(input)
      if (rgb) {
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
        setHue(hsv.h)
        setSaturation(hsv.s)
        setValueV(hsv.v)
      }
    }
  }

  const pickerX = `${Math.max(0, Math.min(100, saturation))}%`
  const pickerY = `${Math.max(0, Math.min(100, 100 - value_v))}%`

  const handleDone = () => {
    onChange(tempColor)
    if (onApply) {
      onApply(tempColor)
    } else {
      onClose()
    }
  }

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    // Lock body scroll when picker is open
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      setMounted(false)
      document.body.style.overflow = originalOverflow
    }
  }, [])

  if (!mounted) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" onClick={onClose}>
      <div className="bg-background rounded-lg p-4 shadow-xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Pick a Color</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div
            className="relative w-full h-[200px] rounded-lg border-2 border-border cursor-crosshair touch-none overflow-hidden"
            ref={canvasRef as any}
            onMouseDown={(e) => {
              e.preventDefault()
              if (canvasRef.current) rectRef.current = canvasRef.current.getBoundingClientRect()
              setIsDragging(true)
              handleCanvasInteraction(e)
            }}
            onTouchStart={(e) => {
              if (e.cancelable) e.preventDefault()
              if (canvasRef.current) rectRef.current = canvasRef.current.getBoundingClientRect()
              setIsDragging(true)
              handleCanvasInteraction(e)
            }}
            style={{
              backgroundColor: `hsl(${hue}, 100%, 50%)`,
              backgroundImage: `
                linear-gradient(to right, #fff, transparent),
                linear-gradient(to top, #000, transparent)
              `
            }}
          >

            <div
              className="absolute w-4 h-4 border-2 border-white rounded-full pointer-events-none"
              style={{
                left: pickerX,
                top: pickerY,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
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
              onChange={handleHueChange}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
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
              onMouseDown={() => {
                // Start dragging state to optimize performance during hue change
                setIsDragging(true);
              }}
              onMouseUp={() => {
                // End dragging state
                setIsDragging(false);
              }}
              onMouseLeave={() => {
                // End dragging state
                setIsDragging(false);
              }}
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium">Hex</label>
              <input
                type="text"
                value={hexInput}
                onChange={handleHexInputChange}
                className="w-full px-3 py-2 border border-border rounded-md font-mono uppercase"
              />
            </div>
            <div className="w-12 flex flex-col justify-end">
              <ColorSwatchLink
                hex={tempColor}
                className="w-full h-10 rounded-md border border-border block"
                style={{ backgroundColor: tempColor }}
                aria-label={`Current color: ${tempColor}`}
              >
                <span className="sr-only">{tempColor}</span>
              </ColorSwatchLink>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            {getApplyLink && getColorLinkRel(tempColor) !== "nofollow" ? (
              <Link
                href={getApplyLink(tempColor)}
                className="flex-1"
              >
                <Button className="w-full" onClick={handleDone}>
                  Apply
                </Button>
              </Link>
            ) : (
              <Button className="flex-1" onClick={handleDone}>
                Apply
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
