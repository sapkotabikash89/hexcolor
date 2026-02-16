"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { simulateColorBlindness, getContrastColor } from "@/lib/color-utils"
import { Pipette } from "lucide-react"
import { CustomColorPicker } from "@/components/custom-color-picker"
import { ShareButtons } from "@/components/share-buttons"

export function ColorBlindnessSimulatorTool() {
  const [color, setColor] = useState("#E0115F")
  const [tempColor, setTempColor] = useState("#E0115F")
  const [selectedType, setSelectedType] = useState("protanopia")
  const [showCustomPicker, setShowCustomPicker] = useState(false)

  const visionTypes = [
    { value: "protanopia", label: "Protanopia (Red-Blind)", description: "Missing red cones" },
    { value: "protanomaly", label: "Protanomaly (Red-Weak)", description: "Reduced red sensitivity" },
    { value: "deuteranopia", label: "Deuteranopia (Green-Blind)", description: "Missing green cones" },
    { value: "deuteranomaly", label: "Deuteranomaly (Green-Weak)", description: "Reduced green sensitivity" },
    { value: "tritanopia", label: "Tritanopia (Blue-Blind)", description: "Missing blue cones" },
    { value: "tritanomaly", label: "Tritanomaly (Blue-Weak)", description: "Reduced blue sensitivity" },
    { value: "achromatopsia", label: "Achromatopsia (Total Color Blind)", description: "No color perception" },
    { value: "achromatomaly", label: "Achromatomaly (Partial Color Blind)", description: "Reduced color perception" },
  ]

  const handleApplyColor = (nextColor: string) => {
    setColor(nextColor)
    setTempColor(nextColor)
    setShowCustomPicker(false)
  }

  return (
    <div className="space-y-8 text-left">
      <Card className="p-1 sm:p-6 space-y-6">
        <div className="space-y-4 px-3 py-3 sm:px-0 sm:py-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold hidden sm:block">Color Blindness Simulation Preview</h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <label className="font-medium">Select Color:</label>
            <button
              onClick={() => setShowCustomPicker(true)}
              className="w-20 h-12 rounded-md border-2 border-border cursor-pointer relative transition-transform hover:scale-105"
              style={{ backgroundColor: color }}
              aria-label="Pick a color to simulate"
            >
              <Pipette 
                className="absolute inset-0 m-auto w-5 h-5" 
                style={{ color: getContrastColor(color) }}
              />
            </button>
            <span className="font-mono font-bold text-lg">{color.toUpperCase()}</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Deficiency Type:</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full h-12 text-lg" aria-label="Select color blindness type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {visionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-3">
              <h3 className="font-bold text-center text-lg">Normal Vision</h3>
              <div
                className="w-full h-56 rounded-2xl border-2 border-border flex flex-col items-center justify-center gap-2 shadow-inner"
                style={{ backgroundColor: color, color: getContrastColor(color) }}
              >
                <div className="text-6xl font-bold drop-shadow-sm">Aa</div>
                <div className="font-mono text-xl font-bold">{color.toUpperCase()}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-center text-lg">{visionTypes.find((t) => t.value === selectedType)?.label}</h3>
              <div
                className="w-full h-56 rounded-2xl border-2 border-border flex flex-col items-center justify-center gap-2 shadow-inner"
                style={{
                  backgroundColor: simulateColorBlindness(color, selectedType),
                  color: getContrastColor(simulateColorBlindness(color, selectedType)),
                }}
              >
                <div className="text-6xl font-bold drop-shadow-sm">Aa</div>
                <div className="font-mono text-xl font-bold">{simulateColorBlindness(color, selectedType).toUpperCase()}</div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-5 rounded-xl border border-primary/10">
            <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {visionTypes.find((t) => t.value === selectedType)?.label}
            </h4>
            <p className="text-muted-foreground font-medium">
              {visionTypes.find((t) => t.value === selectedType)?.description}
            </p>
          </div>
        </div>
      </Card>

      {showCustomPicker && (
        <CustomColorPicker
          value={tempColor}
          onChange={setTempColor}
          onApply={handleApplyColor}
          onClose={() => setShowCustomPicker(false)}
        />
      )}

      <div className="flex justify-center py-4">
        <ShareButtons title="Color Blindness Simulator Tool - HexColorMeans" />
      </div>
    </div>
  )
}
