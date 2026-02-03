"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShareButtons } from "@/components/share-buttons"
import { getColorPageLink } from "@/lib/color-linking-utils"
import dynamic from "next/dynamic"

const InteractiveColorPicker = dynamic(() => import("@/components/tools/interactive-color-picker").then(mod => mod.InteractiveColorPicker), {
  loading: () => <div className="h-96 w-full animate-pulse bg-muted rounded-lg" />
})

const ColorPageContent = dynamic(() => import("@/components/color-page-content").then(mod => mod.ColorPageContent), {
  loading: () => <div className="h-96 w-full animate-pulse bg-muted rounded-lg" />
})

export function AdvancedColorPicker() {
  const router = useRouter()
  const [selectedColor, setSelectedColor] = useState("#E0115F")

  const handleExplore = () => {
    router.push(getColorPageLink(selectedColor))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <InteractiveColorPicker 
          selectedColor={selectedColor} 
          onColorChange={setSelectedColor} 
        />
        
        <div className="flex justify-center px-4">
          <Button onClick={handleExplore} className="w-full max-w-sm" size="lg">
            Explore This Color
          </Button>
        </div>
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
