"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Upload, Share } from "lucide-react"
import { CopyButton } from "@/components/copy-button"
import { ColorExportDialog } from "@/components/color-export-dialog"
import { ShareButtons } from "@/components/share-buttons"
import { getColorPageLink } from "@/lib/color-linking-utils"

export function PaletteFromImageTool() {
  const router = useRouter()
  const [image, setImage] = useState<string | null>(null)
  const [palette, setPalette] = useState<{ hex: string; percent: number }[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCustomImage, setIsCustomImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [colorCount, setColorCount] = useState(8)

  const kMeansPalette = (imageData: ImageData, k: number): { hex: string; count: number }[] => {
    const data = imageData.data
    const samples: { r: number; g: number; b: number }[] = []
    for (let i = 0; i < data.length; i += 40) {
      const a = data[i + 3]
      if (a < 128) continue
      samples.push({ r: data[i], g: data[i + 1], b: data[i + 2] })
    }
    if (samples.length === 0) return []

    const centroids = samples.slice(0, k)
    const assignments = new Array(samples.length).fill(0)
    for (let iter = 0; iter < 6; iter++) {
      for (let i = 0; i < samples.length; i++) {
        let best = 0
        let bestDist = Infinity
        for (let c = 0; c < k; c++) {
          const dr = samples[i].r - centroids[c].r
          const dg = samples[i].g - centroids[c].g
          const db = samples[i].b - centroids[c].b
          const dist = dr * dr + dg * dg + db * db
          if (dist < bestDist) {
            bestDist = dist
            best = c
          }
        }
        assignments[i] = best
      }
      const sums = Array.from({ length: k }, () => ({ r: 0, g: 0, b: 0, n: 0 }))
      for (let i = 0; i < samples.length; i++) {
        const a = assignments[i]
        sums[a].r += samples[i].r
        sums[a].g += samples[i].g
        sums[a].b += samples[i].b
        sums[a].n += 1
      }
      for (let c = 0; c < k; c++) {
        if (sums[c].n === 0) {
          centroids[c] = samples[Math.floor(Math.random() * samples.length)]
        } else {
          centroids[c] = {
            r: Math.round(sums[c].r / sums[c].n),
            g: Math.round(sums[c].g / sums[c].n),
            b: Math.round(sums[c].b / sums[c].n),
          }
        }
      }
    }
    const counts = Array(k).fill(0)
    for (let i = 0; i < samples.length; i++) counts[assignments[i]]++
    return centroids.map((c, idx) => ({
      hex: `#${((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1)}`,
      count: counts[idx],
    }))
  }

  const extractPalette = (imageSrc: string, countOverride?: number) => {
    setIsProcessing(true)
    const img = new window.Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const scaleFactor = Math.min(1, 200 / Math.max(img.width, img.height))
      canvas.width = img.width * scaleFactor
      canvas.height = img.height * scaleFactor

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const colors = kMeansPalette(imageData, Math.max(2, Math.min(12, countOverride ?? colorCount)))
      const total = colors.reduce((sum, c) => sum + c.count, 0)
      let withPercents = colors.map((c) => ({ hex: c.hex.toUpperCase(), percent: Math.round((c.count / total) * 100) }))
      const sumPerc = withPercents.reduce((s, x) => s + x.percent, 0)
      if (sumPerc !== 100 && withPercents.length > 0) {
        const diff = 100 - sumPerc
        withPercents[withPercents.length - 1].percent += diff
      }
      setPalette(withPercents)
      setIsProcessing(false)
    }

    img.src = imageSrc
  }

  useEffect(() => {
    const defaultImg = "/default-image-for-image-palette-generator.webp"
    setImage(defaultImg)
    setIsCustomImage(false)
    extractPalette(defaultImg)
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = event.target?.result as string
        setImage(img)
        setIsCustomImage(true)
        extractPalette(img)
      }
      reader.readAsDataURL(file)
    }
  }




  const handleExplore = (color: string) => {
    // Use centralized linking logic for safe color navigation
    router.push(getColorPageLink(color))
  }

  const openExport = () => setExportOpen(true)



  return (
    <div className="space-y-8">
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Generate Color Palette</h2>
          </div>
          <p className="text-muted-foreground">
            Upload an image to extract its dominant colors and create a beautiful color palette
          </p>

          <div className="space-y-4">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <Button onClick={() => fileInputRef.current?.click()} className="w-full gap-2" size="lg">
              <Upload className="w-5 h-5" />
              Upload Image
            </Button>

            {image && (
              <div className="space-y-4">
                <div className="relative border-2 border-dashed border-lime-400 bg-lime-50 rounded-lg overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Uploaded"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
                <canvas ref={canvasRef} className="hidden" />

                {isProcessing ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Extracting colors...</p>
                  </div>
                ) : palette.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Extracted Palette</h3>
                      <Button onClick={openExport} variant="ghost" size="sm" className="gap-2">
                        <Share className="w-4 h-4" />
                        Export
                      </Button>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium">Number of colors:</label>
                      <select
                        className="border rounded-md px-2 py-1 text-sm bg-background"
                        value={colorCount}
                        onChange={(e) => {
                          const v = Number(e.target.value)
                          setColorCount(v)
                          if (image) extractPalette(image, v)
                        }}
                      >
                        {Array.from({ length: 11 }, (_, i) => i + 2).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {palette.map((item, index) => (
                        <div key={index} className="group cursor-pointer" onClick={() => handleExplore(item.hex)}>
                          <div
                            className="w-full aspect-square rounded-lg hover:scale-105 transition-transform"
                            style={{ backgroundColor: item.hex }}
                          />
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm font-mono">{item.hex} ({item.percent}%)</p>
                            <CopyButton value={item.hex} size="icon" />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex rounded-lg overflow-hidden border-2 border-border h-16">
                      {palette.map((item, index) => (
                        <div
                          key={index}
                          className="flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: item.hex }}
                          onClick={() => handleExplore(item.hex)}
                          title={item.hex}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </Card>
      <ColorExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title="Export Palette"
        colors={palette.map((p) => p.hex)}
        filenameLabel="palette-from-image"
      />

      <div className="flex justify-center py-4">
        <ShareButtons title="Palette From Image Tool - HexColorMeans" />
      </div>
    </div>
  )
}
