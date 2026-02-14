"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ensureTrailingSlash } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getColorHarmony } from "@/lib/color-utils"
import { Download, Share } from "lucide-react"
import { toast } from "sonner"
import { ColorExportDialog } from "@/components/color-export-dialog"
import { ColorCombination } from "@/components/color-combination"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ColorSidebarProps {
  color: string
  onColorChange?: (color: string) => void
  showColorSchemes?: boolean
  showLatestPosts?: boolean
  className?: string
}

export function ColorSidebar({ 
  color: initialColor, 
  onColorChange, 
  showColorSchemes = true,
  showLatestPosts = true,
  className 
}: ColorSidebarProps) {
  const [color, setColor] = useState(initialColor)
  const [harmonyType, setHarmonyType] = useState("complementary")
  const [exportOpen, setExportOpen] = useState(false)
  const [latestPosts, setLatestPosts] = useState<Array<{ title: string; uri: string }>>([])

  useEffect(() => {
    const handleColorUpdate = (e: CustomEvent) => {
      if (e.detail?.color) {
        setColor(e.detail.color)
      }
    }

    window.addEventListener("colorUpdate", handleColorUpdate as EventListener)
    return () => window.removeEventListener("colorUpdate", handleColorUpdate as EventListener)
  }, [])

  const harmonies = getColorHarmony(color, harmonyType)

  const downloadSwatch = (hex: string) => {
    const canvas = document.createElement("canvas")
    canvas.width = 200
    canvas.height = 200
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.fillStyle = hex
      ctx.fillRect(0, 0, 200, 200)
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `${hex.replace("#", "")}.png`
          a.click()
          URL.revokeObjectURL(url)
          toast.success("Swatch downloaded!")
        }
      })
    }
  }

  useEffect(() => {
    if (!showLatestPosts) return

    const fetchLatest = async () => {
      try {
        const res = await fetch("/latest-posts.json")
        if (!res.ok) throw new Error("Failed to fetch posts")
        const posts = await res.json()
        setLatestPosts(posts)
      } catch {
        setLatestPosts([])
      }
    }
    fetchLatest()
  }, [showLatestPosts])

  return (
    <aside id="sidebar" className={className || "main-sidebar w-full lg:w-[340px] shrink-0 space-y-6 sticky top-24 self-start"}>
      {showColorSchemes && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2">
            <h3 className="font-semibold text-lg">Color Schemes</h3>
            <Button
              size="sm"
              variant="ghost"
              className="gap-2 shrink-0"
              onClick={() => setExportOpen(true)}
            >
              <Share className="w-4 h-4" />
              Export
            </Button>
          </div>

          <Select value={harmonyType} onValueChange={setHarmonyType}>
            <SelectTrigger aria-label="Select harmony type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="analogous">Analogous</SelectItem>
              <SelectItem value="complementary">Complementary</SelectItem>
              <SelectItem value="split-complementary">Split Complementary</SelectItem>
              <SelectItem value="triadic">Triadic</SelectItem>
              <SelectItem value="tetradic">Tetradic</SelectItem>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="double-split-complementary">Double Split Complementary</SelectItem>
              <SelectItem value="monochromatic">Monochromatic</SelectItem>
            </SelectContent>
          </Select>

          <ColorCombination colors={harmonies} baseHex={color} height={120} onColorChange={onColorChange} />
        </div>
      )}

      {showLatestPosts && latestPosts.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg">Latest Posts</h3>
          <ul className="space-y-3">
            {latestPosts.map((p, idx) => {
              const numBg = showColorSchemes ? color : "#000000"
              const numColor = getContrastColor(numBg)
              return (
                <li key={`${p.uri}-${idx}`} className="flex items-start gap-3">
                  <span
                    className="inline-flex items-center justify-center rounded-full shrink-0"
                    style={{
                      width: "28px",
                      height: "28px",
                      backgroundColor: numBg,
                      color: numColor,
                      fontWeight: 700,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <Link href={ensureTrailingSlash(p.uri)} className="hover:underline whitespace-normal break-words">
                    {p.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      {showColorSchemes && (
        <ColorExportDialog
          open={exportOpen}
          onOpenChange={setExportOpen}
          title={`Export ${harmonyType}`}
          colors={harmonies}
          baseHex={color}
          filenameLabel={harmonyType}
        />
      )}
    </aside>
  )
}

function getContrastColor(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? "#000000" : "#FFFFFF"
}
