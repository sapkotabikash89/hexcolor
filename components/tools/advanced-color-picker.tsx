"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShareButtons } from "@/components/share-buttons"
import { getColorPageLink } from "@/lib/color-linking-utils"
import dynamic from "next/dynamic"
import Link from "next/link"
import { RefreshCw, Image as ImageIcon } from "lucide-react"

const CompactAdvancedColorPicker = dynamic(() => import("@/components/home/compact-advanced-color-picker").then(mod => mod.CompactAdvancedColorPicker), {
  loading: () => <div className="h-96 w-full animate-pulse bg-muted rounded-lg" />
})

const ColorPageContent = dynamic(() => import("@/components/color-page-content").then(mod => mod.ColorPageContent), {
  loading: () => <div className="h-96 w-full animate-pulse bg-muted rounded-lg" />
})

export function AdvancedColorPicker() {
  const [selectedColor, setSelectedColor] = useState("#a73991")


  const handleRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`.toUpperCase();
    setSelectedColor(randomColor);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <CompactAdvancedColorPicker
          color={selectedColor}
          onChange={setSelectedColor}
          hideLink={true}
        />

        <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
          <Button onClick={handleRandomColor} className="w-full sm:w-auto" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Random Color
          </Button>
          <Link href="/image-color-picker/" className="w-full sm:w-auto">
            <Button className="w-full" variant="outline">
              <ImageIcon className="w-4 h-4 mr-2" />
              Image Color Picker
            </Button>
          </Link>
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
