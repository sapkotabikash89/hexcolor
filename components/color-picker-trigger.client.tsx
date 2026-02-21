"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Pipette } from "lucide-react"
import { CustomColorPicker } from "@/components/custom-color-picker"
import { getColorPageLink } from "@/lib/color-linking-utils"

export function ColorPickerTrigger() {
  const router = useRouter()
  const [pickerColor, setPickerColor] = useState("#E0115F")
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [tempColor, setTempColor] = useState("#E0115F")

  useEffect(() => {
    const handleColorUpdate = (e: CustomEvent) => {
      if (!e.detail?.color) return
      setPickerColor(e.detail.color)
    }

    window.addEventListener("colorUpdate", handleColorUpdate as EventListener)
    return () => window.removeEventListener("colorUpdate", handleColorUpdate as EventListener)
  }, [])

  const handleColorChange = (color: string) => {
    setTempColor(color)
  }

  const handleColorApply = (color?: string) => {
    const selectedColor = typeof color === "string" ? color : tempColor
    setPickerColor(selectedColor)
    setShowCustomPicker(false)

    window.dispatchEvent(new CustomEvent("colorUpdate", { detail: { color: selectedColor } }))

    const link = getColorPageLink(selectedColor)
    const relativeLink = link.replace("https://hexcolormeans.com", "")
    router.push(relativeLink)
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowCustomPicker(true)}
          className="w-10 h-10 md:w-9 md:h-9 rounded-md border-2 border-border cursor-pointer flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: pickerColor }}
          title="Pick a color"
          aria-label="Pick a color"
        >
          <Pipette className="w-5 h-5 text-white mix-blend-difference" />
        </button>
      </div>

      {showCustomPicker && (
        <CustomColorPicker
          value={pickerColor}
          onChange={handleColorChange}
          onApply={handleColorApply}
          onClose={() => setShowCustomPicker(false)}
        />
      )}
    </>
  )
}

