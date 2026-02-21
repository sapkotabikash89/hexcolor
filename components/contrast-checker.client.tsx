"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pipette } from "lucide-react"
import nextDynamic from "next/dynamic"
import { getContrastColor, getContrastRatio } from "@/lib/color-utils"

const CustomColorPicker = nextDynamic(() =>
  import("@/components/custom-color-picker").then((mod) => mod.CustomColorPicker)
)

interface ContrastCheckerClientProps {
  hex: string
  label: string
  shouldSyncBackgroundWithHex: boolean
}

export function ContrastCheckerClient({ hex, label, shouldSyncBackgroundWithHex }: ContrastCheckerClientProps) {
  const [foreground, setForeground] = useState("#FFFFFF")
  const [background, setBackground] = useState(hex)
  const [showForegroundPicker, setShowForegroundPicker] = useState(false)
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false)
  const [tempForeground, setTempForeground] = useState(foreground)
  const [tempBackground, setTempBackground] = useState(background)
  const [contrastForeground, setContrastForeground] = useState(foreground)
  const [contrastBackground, setContrastBackground] = useState(background)

  useEffect(() => {
    if (shouldSyncBackgroundWithHex) {
      setBackground(hex)
      setContrastBackground(hex)
    }
  }, [hex, shouldSyncBackgroundWithHex])

  const swapColors = () => {
    const temp = foreground
    setForeground(background)
    setBackground(temp)
    setContrastForeground(background)
    setContrastBackground(temp)
  }

  const contrastRatio = getContrastRatio(foreground, background)

  return (
    <>
      <p className="text-muted-foreground">
        Luminance contrast ratios for {label} against standard backgrounds ensure readable, accessible text following{" "}
        <Link href="/contrast-checker/" className="text-primary hover:underline">
          Contrast Checker
        </Link>{" "}
        and WCAG 2.1 AA/AAA standards.
      </p>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Foreground:</label>
          <button
            onClick={() => {
              setTempForeground(foreground)
              setShowForegroundPicker(true)
            }}
            className="w-16 h-10 rounded-md border-2 border-border cursor-pointer relative"
            style={{ backgroundColor: foreground }}
          >
            <Pipette
              className="absolute inset-0 m-auto w-4 h-4"
              style={{ color: getContrastColor(foreground) }}
            />
          </button>
          <span className="font-mono text-sm">{foreground}</span>
        </div>
        <Button variant="outline" size="sm" onClick={swapColors} className="gap-2 bg-transparent">
          Swap
        </Button>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Background:</label>
          <button
            onClick={() => {
              setTempBackground(background)
              setShowBackgroundPicker(true)
            }}
            className="w-16 h-10 rounded-md border-2 border-border cursor-pointer relative"
            style={{ backgroundColor: background }}
          >
            <Pipette
              className="absolute inset-0 m-auto w-4 h-4"
              style={{ color: getContrastColor(background) }}
            />
          </button>
          <span className="font-mono text-sm">{background}</span>
        </div>
      </div>
      <div className="p-8 rounded-lg" style={{ backgroundColor: background, color: foreground }}>
        <p className="text-3xl font-bold mb-2">Sample Text</p>
        <p className="text-lg">This is how your text will look with these colors.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ContrastResult label="Large Text (18pt+)" ratio={contrastRatio} aaThreshold={3} aaaThreshold={4.5} />
        <ContrastResult label="Normal Text" ratio={contrastRatio} aaThreshold={4.5} aaaThreshold={7} />
        <ContrastResult label="UI Components" ratio={contrastRatio} aaThreshold={3} aaaThreshold={4.5} />
      </div>

      {showForegroundPicker && (
        <CustomColorPicker
          value={tempForeground}
          onChange={setTempForeground}
          disableGlobalUpdate={true}
          onApply={(color) => {
            const finalColor = color || tempForeground
            setContrastForeground(finalColor)
            setForeground(finalColor)
            setShowForegroundPicker(false)
          }}
          onClose={() => {
            setShowForegroundPicker(false)
            setForeground(contrastForeground)
          }}
        />
      )}
      {showBackgroundPicker && (
        <CustomColorPicker
          value={tempBackground}
          onChange={setTempBackground}
          disableGlobalUpdate={true}
          onApply={(color) => {
            const finalColor = color || tempBackground
            setContrastBackground(finalColor)
            setBackground(finalColor)
            setShowBackgroundPicker(false)
          }}
          onClose={() => {
            setShowBackgroundPicker(false)
            setBackground(contrastBackground)
          }}
        />
      )}
    </>
  )
}

function ContrastResult({
  label,
  ratio,
  aaThreshold,
  aaaThreshold,
}: {
  label: string
  ratio: number
  aaThreshold: number
  aaaThreshold: number
}) {
  const passAA = ratio >= aaThreshold
  const passAAA = ratio >= aaaThreshold

  return (
    <div className="p-4 bg-muted rounded-lg space-y-2">
      <h3 className="font-medium">{label}</h3>
      <div className="text-2xl font-bold">{ratio.toFixed(2)}:1</div>
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span className={passAA ? "text-green-500" : "text-red-500"}>{passAA ? "✓" : "✗"}</span>
          <span>WCAG AA</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={passAAA ? "text-green-500" : "text-red-500"}>{passAAA ? "✓" : "✗"}</span>
          <span>WCAG AAA</span>
        </div>
      </div>
    </div>
  )
}

