"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, X, Terminal, Cpu, Layout, Hash, Download } from "lucide-react"
import { hexToRgb, rgbToHsl, rgbToCmyk } from "@/lib/color-utils"
import { cn } from "@/lib/utils"

interface ColorExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  colors: string[]
  baseHex?: string
  filenameLabel?: string
}

type ExportTarget = "tailwind-v4" | "tailwind-v3" | "figma" | "css-prefixes" | "just-codes"
type ExportFormat = "hex" | "rgb" | "hsl" | "cmyk"

export function ColorExportDialog({ open, onOpenChange, title = "Export color codes", colors, baseHex, filenameLabel }: ColorExportDialogProps) {
  const [selectedTarget, setSelectedTarget] = useState<ExportTarget>("tailwind-v4")
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("hex")
  const [prefix, setPrefix] = useState("")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [allCopied, setAllCopied] = useState(false)

  const targets = [
    { id: "tailwind-v4" as ExportTarget, label: "Tailwind v4", sub: "CSS Variables", icon: Cpu },
    { id: "tailwind-v3" as ExportTarget, label: "Tailwind v3", sub: "Config Object", icon: Layout },
    { id: "figma" as ExportTarget, label: "Figma", sub: "Design Object", icon: Layout },
    { id: "css-prefixes" as ExportTarget, label: "CSS Prefixes", sub: "Direct Syntax", icon: Hash },
    { id: "just-codes" as ExportTarget, label: "Just Codes", sub: "Raw Values", icon: Terminal },
  ]

  const formats = [
    { id: "hex" as ExportFormat, label: "HEX" },
    { id: "rgb" as ExportFormat, label: "RGB" },
    { id: "hsl" as ExportFormat, label: "HSL" },
    { id: "cmyk" as ExportFormat, label: "CMYK" },
  ]

  const colorData = useMemo(() => {
    return colors.map((hex) => {
      const rgb = hexToRgb(hex)
      const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null
      const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null
      return {
        hex: hex.toUpperCase(),
        rgbSpace: rgb ? `${rgb.r} ${rgb.g} ${rgb.b}` : "",
        hslSpace: hsl ? `${hsl.h} ${hsl.s} ${hsl.l}` : "",
        rgbComma: rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : "",
        hslComma: hsl ? `${hsl.h}, ${hsl.s}, ${hsl.l}` : "",
        cmyk: cmyk ? `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%` : "",
      }
    })
  }, [colors])

  const getDisplayValue = (data: any, format: ExportFormat, target: ExportTarget) => {
    if (target === "just-codes") {
      switch (format) {
        case "hex": return data.hex
        case "rgb": return data.rgbComma
        case "hsl": return data.hslComma
        case "cmyk": return data.cmyk
      }
    }
    switch (format) {
      case "hex": return data.hex
      case "rgb": return `rgb(${data.rgbSpace})`
      case "hsl": return `hsl(${data.hslSpace})`
      case "cmyk": return `cmyk(${data.cmyk})`
    }
  }

  const generatedCode = useMemo(() => {
    const pre = prefix.trim() || "color"
    const lines = colorData.map((c, i) => {
      const displayVal = getDisplayValue(c, selectedFormat, selectedTarget)
      switch (selectedTarget) {
        case "tailwind-v4": return `--${pre}-${i + 1}: ${displayVal};`
        case "tailwind-v3":
        case "figma": return `    ${i + 1}: "${displayVal}",`
        case "css-prefixes": return `${displayVal};`
        case "just-codes": return displayVal
        default: return displayVal
      }
    })
    if (selectedTarget === "tailwind-v3" || selectedTarget === "figma") {
      return `"${pre}": {\n${lines.join("\n")}\n}`
    }
    return lines.join("\n")
  }, [colorData, selectedTarget, selectedFormat, prefix])

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch { }
  }

  const downloadCombinedImage = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 1920
    canvas.height = 1080
    const ctx = canvas.getContext("2d")
    if (!ctx || colors.length === 0) return

    const stripeH = Math.floor(canvas.height / colors.length)
    colors.forEach((hex, i) => {
      ctx.fillStyle = hex
      ctx.fillRect(0, i * stripeH, canvas.width, stripeH)

      const textColor = getContrast(hex)
      ctx.fillStyle = textColor
      ctx.font = "bold 80px JetBrains Mono, monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(hex.toUpperCase(), canvas.width / 2, i * stripeH + stripeH / 2)
    })

    ctx.font = "600 48px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "bottom"
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
    ctx.fillText("HexColorMeans", canvas.width / 2, canvas.height - 40)

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        const name = filenameLabel || "palette"
        const hexSuffix = baseHex ? `-${baseHex.replace("#", "")}` : ""
        a.download = `hexcolormeans-${name}${hexSuffix}.png`
        a.click()
        URL.revokeObjectURL(url)
      }
    }, "image/png")
  }

  const handleCopyAll = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(generatedCode)
      }
      setAllCopied(true)
      setTimeout(() => setAllCopied(false), 2000)
    } catch { }
  }

  const dynamicTitle = useMemo(() => {
    if (baseHex) {
      const type = title.replace("Export ", "").replace(" color codes", "")
      return `Export ${type} of ${baseHex.toUpperCase()}`
    }
    return title
  }, [title, baseHex])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-[1000px] w-[95vw] p-0 overflow-y-auto max-h-[96vh] md:max-h-[90vh] border border-border shadow-2xl bg-[#F8F9FA] rounded-2xl scrollbar-thin scrollbar-thumb-muted">
        {/* Fixed Header */}
        <div className="p-6 border-b border-border bg-white flex items-center justify-center relative shrink-0">
          <DialogTitle className="text-xl font-bold text-foreground text-center tracking-tight">{dynamicTitle}</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-6 p-2 hover:bg-muted rounded-full transition-all text-muted-foreground hover:text-foreground md:top-6 top-12"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-auto md:h-[540px]">
          {/* Sidebar */}
          <div className="w-full md:w-[260px] border-r border-border bg-muted/20 p-4 space-y-2 overflow-y-auto shrink-0 scrollbar-none">
            {targets.map((target) => {
              const Icon = target.icon
              return (
                <button
                  key={target.id}
                  onClick={() => setSelectedTarget(target.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl transition-all duration-200 group relative border border-transparent",
                    selectedTarget === target.id
                      ? "bg-white shadow-sm border-border"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                      selectedTarget === target.id ? "bg-primary/10 text-primary shadow-sm" : "bg-muted text-muted-foreground group-hover:bg-muted/80 group-hover:text-foreground"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={cn("font-bold text-sm tracking-tight transition-colors", selectedTarget === target.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>{target.label}</div>
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">{target.sub}</div>
                    </div>
                  </div>
                  {selectedTarget === target.id && (
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Main Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] overflow-hidden">
            {/* Action Bar */}
            <div className="p-4 sm:p-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 border-b border-border/50">
              <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg">
                {formats.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormat(f.id)}
                    className={cn(
                      "px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 tracking-widest uppercase",
                      selectedFormat === f.id
                        ? "bg-white text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-44">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-[10px] uppercase font-bold opacity-60">prefix:</div>
                <Input
                  placeholder="color"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="h-10 bg-white border border-border focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-sm pl-16 font-mono"
                />
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-0">
                {/* Visual Swatches */}
                <div className="flex flex-col rounded-2xl overflow-hidden border border-border shadow-sm bg-white min-h-[300px] h-fit">
                  {colorData.map((c, i) => {
                    const displayVal = getDisplayValue(c, selectedFormat, selectedTarget)
                    return (
                      <div
                        key={i}
                        className="group/bar h-14 flex items-center justify-center relative transition-all duration-300"
                        style={{ backgroundColor: c.hex, color: getContrast(c.hex) }}
                      >
                        <div className="flex items-center gap-2 font-mono text-sm font-bold z-10 drop-shadow-sm px-4 py-1.5 rounded-full bg-black/10 hover:bg-black/20 transition-colors cursor-default">
                          <span>{displayVal}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCopy(displayVal, `bar-${i}`) }}
                            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                          >
                            {copiedKey === `bar-${i}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Code Preview */}
                <div className="flex flex-col min-w-0 h-fit">
                  <div className="bg-white rounded-2xl p-6 font-mono text-xs sm:text-sm relative border border-border shadow-inner min-h-[150px]">
                    <div className="text-muted-foreground leading-relaxed whitespace-pre font-medium">
                      {generatedCode}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer for Buttons */}
            <div className="p-4 sm:p-6 pt-4 border-t border-border bg-white flex flex-col sm:flex-row gap-4 shrink-0">
              <Button
                onClick={downloadCombinedImage}
                variant="outline"
                className="flex-1 h-12 rounded-xl bg-white border border-border hover:bg-muted hover:text-foreground transition-all font-bold text-foreground gap-3 group"
              >
                <span className="truncate">Download Image (1920x1080)</span>
                <Download className="w-4 h-4 transition-transform group-hover:scale-110" />
              </Button>

              <Button
                onClick={handleCopyAll}
                className={cn(
                  "flex-1 h-12 rounded-xl transition-all duration-300 gap-3 font-bold text-white shadow-md hover:shadow-lg",
                  allCopied ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"
                )}
              >
                {allCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Payload Copied!</span>
                  </>
                ) : (
                  <>
                    <span>Copy Collection</span>
                    <Copy className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1 h-12 rounded-xl bg-white border border-border hover:bg-muted hover:text-foreground transition-all font-bold text-foreground gap-3"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function getContrast(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return "#000000"
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? "#000000" : "#FFFFFF"
}
