"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Share } from "lucide-react"
import { ColorSwatch as Swatch } from "@/components/color-swatch"

interface ColorTabsClientProps {
  tints: string[]
  shades: string[]
  tones: string[]
  onColorChange?: (color: string) => void
  onExport: (colors: string[], title: string, label: string) => void
}

export function ColorTabsClient({ tints, shades, tones, onColorChange, onExport }: ColorTabsClientProps) {
  const [tab, setTab] = useState<"tints" | "shades" | "tones">("tints")

  const handleExport = () => {
    const colors = tab === "tints" ? tints : tab === "shades" ? shades : tones
    const title = tab === "tints" ? "Export Tints" : tab === "shades" ? "Export Shades" : "Export Tones"
    onExport(colors, title, tab)
  }

  return (
    <>
      <div className="w-full flex justify-end">
        <Button size="sm" variant="ghost" className="gap-2" onClick={handleExport}>
          <Share className="w-4 h-4" />
          Export
        </Button>
      </div>
      <Tabs value={tab} onValueChange={(value) => setTab(value as "tints" | "shades" | "tones")} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="tints">Tints</TabsTrigger>
          <TabsTrigger value="shades">Shades</TabsTrigger>
          <TabsTrigger value="tones">Tones</TabsTrigger>
        </TabsList>
        <TabsContent value="tints" className="mt-4">
          <div className="flex justify-center">
            <div className="grid w-fit grid-cols-5 xl:grid-cols-10 gap-1">
              {tints.slice(0, 10).map((c, idx) => (
                <Swatch key={`${c}-${idx}`} color={c} showHex onClick={onColorChange ? () => onColorChange(c) : undefined} />
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="shades" className="mt-4">
          <div className="flex justify-center">
            <div className="grid w-fit grid-cols-5 xl:grid-cols-10 gap-1">
              {shades.slice(0, 10).map((c, idx) => (
                <Swatch key={`${c}-${idx}`} color={c} showHex onClick={onColorChange ? () => onColorChange(c) : undefined} />
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tones" className="mt-4">
          <div className="flex justify-center">
            <div className="grid w-fit grid-cols-5 xl:grid-cols-10 gap-1">
              {tones.slice(0, 10).map((c, idx) => (
                <Swatch key={`${c}-${idx}`} color={c} showHex onClick={onColorChange ? () => onColorChange(c) : undefined} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

