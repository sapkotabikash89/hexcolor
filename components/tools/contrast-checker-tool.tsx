"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RefreshCw, Pipette } from "lucide-react"
import { hexToRgb, getContrastColor } from "@/lib/color-utils"
import { CustomColorPicker } from "@/components/custom-color-picker"
import { ShareButtons } from "@/components/share-buttons"

export function ContrastCheckerTool() {
  const [foreground, setForeground] = useState("#1E3A8A")
  const [background, setBackground] = useState("#DBEAFE")
  const [tempForeground, setTempForeground] = useState("#1E3A8A")
  const [tempBackground, setTempBackground] = useState("#DBEAFE")
  const [showForegroundPicker, setShowForegroundPicker] = useState(false)
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false)

  const contrastRatio = calculateContrastRatio(foreground, background)

  const swapColors = () => {
    const temp = foreground
    setForeground(background)
    setBackground(temp)
    setTempForeground(background)
    setTempBackground(temp)
  }

  const handleApplyForeground = (color?: string) => {
    const finalColor = color || tempForeground
    setForeground(finalColor)
    setTempForeground(finalColor)
    setShowForegroundPicker(false)
  }

  const handleApplyBackground = (color?: string) => {
    const finalColor = color || tempBackground
    setBackground(finalColor)
    setTempBackground(finalColor)
    setShowBackgroundPicker(false)
  }

  return (
    <div className="space-y-8">
      <Card className="p-4 sm:p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Check Contrast Ratio</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Test your color combinations against WCAG accessibility standards</p>
            </div>
          </div>

          {/* Color Pickers Section */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-3 items-center">
            {/* Foreground */}
            <div className="space-y-2 min-w-0">
              <label className="text-sm font-medium">Foreground (Text)</label>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowForegroundPicker(true)
                  }}
                  className="w-12 h-10 sm:w-14 sm:h-12 rounded-md border-2 border-border cursor-pointer flex-shrink-0 relative"
                  style={{ backgroundColor: foreground }}
                  aria-label="Select foreground color"
                >
                  <Pipette 
                    className="absolute inset-0 m-auto w-4 h-4" 
                    style={{ color: getContrastColor(foreground) }}
                  />
                </button>
                <input
                  type="text"
                  value={foreground}
                  onChange={(e) => {
                    setForeground(e.target.value)
                    setTempForeground(e.target.value)
                  }}
                  className="flex-1 min-w-0 px-2 sm:px-3 py-2 border rounded-md font-mono text-xs sm:text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* Swap Button - Centered between Foreground and Background */}
            <div className="flex justify-center items-end pb-0 md:pt-6">
              <Button variant="outline" size="icon" onClick={swapColors} aria-label="Swap colors" className="h-10 w-10">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {/* Background */}
            <div className="space-y-2 min-w-0">
              <label className="text-sm font-medium">Background</label>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowBackgroundPicker(true)
                  }}
                  className="w-12 h-10 sm:w-14 sm:h-12 rounded-md border-2 border-border cursor-pointer flex-shrink-0 relative"
                  style={{ backgroundColor: background }}
                  aria-label="Select background color"
                >
                  <Pipette 
                    className="absolute inset-0 m-auto w-4 h-4" 
                    style={{ color: getContrastColor(background) }}
                  />
                </button>
                <input
                  type="text"
                  value={background}
                  onChange={(e) => {
                    setBackground(e.target.value)
                    setTempBackground(e.target.value)
                  }}
                  className="flex-1 min-w-0 px-2 sm:px-3 py-2 border rounded-md font-mono text-xs sm:text-sm"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="p-8 sm:p-12 rounded-lg space-y-4 sm:space-y-6" style={{ backgroundColor: background, color: foreground }}>
            <h3 className="text-2xl sm:text-4xl font-bold">Large Text Sample</h3>
            <p className="text-lg sm:text-xl">Medium text at 20 pixels for testing readability</p>
            <p className="text-sm sm:text-base">
              Normal text at 16 pixels. This is how your regular body text will appear with these color combinations.
              Make sure it's readable and comfortable to read.
            </p>
            <p className="text-xs sm:text-sm">Small text at 14 pixels for detailed content</p>
          </div>

          {/* Contrast Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <ContrastResult
              label="Large Text"
              sublabel="18pt+ or 14pt+ Bold"
              ratio={contrastRatio}
              aaThreshold={3}
              aaaThreshold={4.5}
            />
            <ContrastResult
              label="Normal Text"
              sublabel="Under 18pt"
              ratio={contrastRatio}
              aaThreshold={4.5}
              aaaThreshold={7}
            />
            <ContrastResult
              label="UI Components"
              sublabel="Icons, Borders"
              ratio={contrastRatio}
              aaThreshold={3}
              aaaThreshold={4.5}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-center py-4">
        <ShareButtons title="Contrast Checker Tool - HexColorMeans" />
      </div>





      {showForegroundPicker && (
        <CustomColorPicker
          value={tempForeground}
          onChange={(c) => {
            setTempForeground(c)
            setForeground(c)
          }}
          onApply={handleApplyForeground}
          disableGlobalUpdate={true}
          onClose={() => {
            setShowForegroundPicker(false)
            setTempForeground(foreground)
          }}
        />
      )}
      {showBackgroundPicker && (
        <CustomColorPicker
          value={tempBackground}
          onChange={(c) => {
            setTempBackground(c)
            setBackground(c)
          }}
          onApply={handleApplyBackground}
          disableGlobalUpdate={true}
          onClose={() => {
            setShowBackgroundPicker(false)
            setTempBackground(background)
          }}
        />
      )}
    </div>
  )
}

function ContrastResult({
  label,
  sublabel,
  ratio,
  aaThreshold,
  aaaThreshold,
}: {
  label: string
  sublabel: string
  ratio: number
  aaThreshold: number
  aaaThreshold: number
}) {
  const passAA = ratio >= aaThreshold
  const passAAA = ratio >= aaaThreshold

  return (
    <div className="p-6 bg-muted rounded-lg space-y-3 text-center">
      <div>
        <h4 className="font-semibold text-lg">{label}</h4>
        <p className="text-sm text-muted-foreground">{sublabel}</p>
      </div>
      <div className="text-3xl font-bold">{ratio.toFixed(2)}:1</div>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 bg-background rounded">
          <span className="text-sm font-medium">WCAG AA</span>
          <span className={`text-lg ${passAA ? "text-green-500" : "text-red-500"}`}>
            {passAA ? "✓ Pass" : "✗ Fail"}
          </span>
        </div>
        <div className="flex items-center justify-between p-2 bg-background rounded">
          <span className="text-sm font-medium">WCAG AAA</span>
          <span className={`text-lg ${passAAA ? "text-green-500" : "text-red-500"}`}>
            {passAAA ? "✓ Pass" : "✗ Fail"}
          </span>
        </div>
      </div>
    </div>
  )
}

function calculateContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return 0

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
      const sRGB = val / 255
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}
