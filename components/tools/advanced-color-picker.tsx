"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShareButtons } from "@/components/share-buttons"
import { getColorPageLink } from "@/lib/color-linking-utils"
import dynamic from "next/dynamic"

const ColorPickerPageTool = dynamic(() => import("@/components/tools/color-picker-page-tool").then(mod => mod.ColorPickerPageTool), {
  loading: () => <div className="h-96 w-full animate-pulse bg-muted rounded-lg" />
})

const ColorPageContent = dynamic(() => import("@/components/color-page-content").then(mod => mod.ColorPageContent), {
  loading: () => <div className="h-96 w-full animate-pulse bg-muted rounded-lg" />
})

export function AdvancedColorPicker() {
  const router = useRouter()
  const [selectedColor, setSelectedColor] = useState("#11DF1B")

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <ColorPickerPageTool
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />
      </div>

      <div className="flex justify-center py-4">
        <ShareButtons title="Advanced Color Picker Tool - HexColorMeans" />
      </div>

      <ColorPageContent
        hex={selectedColor}
        name={undefined}
        mode="sectionsOnly"
      />
    </div>
  )
}
