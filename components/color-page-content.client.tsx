"use client"

import Image from "next/image"
import Link from "next/link"
import { Select } from "@/components/ui/select"
import { SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/components/ui/select"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  getColorHarmony,
  generateTints,
  generateShades,
  generateTones,
  simulateColorBlindness,
  getRelatedColors,
  getContrastColor,
  getHexColorMeansing,
  getAdjacentColors,
  getHueFamily,
  getClosestKnownColor,
  hexToRgb,
  rgbToHsl,
  rgbToCmyk,
  rgbToHsv,
  rgbToLab,
  rgbToXyz,
  rgbToYxy,
  rgbToHunterLab,
  isKnownHex,
} from "@/lib/color-utils"
import { ShareButtons } from "@/components/share-buttons"
import { ColorImage } from "@/components/color-image"
import { getGumletColorImage } from "@/lib/image-utils"
import { getColorPageLink } from "@/lib/color-linking-utils"
import { ColorCombination } from "@/components/color-combination"
import {
  Share,
  Heart,
  Check,
  Copy,
  Download,
  Pipette,
  Image as ImageIcon,
  Palette,
  Monitor,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { CopyButton } from "@/components/copy-button"
import nextDynamic from "next/dynamic"
import { ColorTabsClient } from "@/components/color-tabs.client"
import { ContrastCheckerClient } from "@/components/contrast-checker.client"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const ColorExportDialog = nextDynamic(() =>
  import("@/components/color-export-dialog").then((mod) => mod.ColorExportDialog),
)
const ColorIcons = nextDynamic(() => import("@/components/color-icons").then((mod) => mod.ColorIcons), {
  loading: () => <div className="h-[200px] w-full bg-muted/20 animate-pulse rounded-lg" />,
})
const ColorPatterns = nextDynamic(
  () => import("@/components/color-patterns").then((mod) => mod.ColorPatterns),
  {
    loading: () => <div className="h-[200px] w-full bg-muted/20 animate-pulse rounded-lg" />,
  },
)
const ColorMockups = nextDynamic(
  () => import("@/components/color-mockups").then((mod) => mod.ColorMockups),
  {
    loading: () => <div className="h-[200px] w-full bg-muted/20 animate-pulse rounded-lg" />,
  },
)

const MarkdownText = ({ content }: { content: string }) => {
  if (!content) return null
  const parts = content.split(/(\[[^\]]+\]\([^)]+\))/g)

  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (match) {
          return (
            <Link key={i} href={match[2]} className="text-primary hover:underline font-medium">
              {match[1]}
            </Link>
          )
        }
        return part
      })}
    </>
  )
}

interface ColorPageContentClientProps {
  hex: string
  mode?: "full" | "sectionsOnly"
  faqs?: { question: string; answer: string }[]
  colorInformation?: { paragraph1: string; paragraph2: string }
  name?: string
  colorExistsInDb?: boolean
  onColorChange?: (color: string) => void
  pageUrl?: string
}

export function ColorPageContentClient({
  hex,
  mode = "full",
  faqs,
  colorInformation,
  name,
  colorExistsInDb,
  onColorChange,
  pageUrl,
}: ColorPageContentClientProps) {
  const router = useRouter()
  const label = name ? `${name} (${hex})` : hex
  const [selectedHarmony, setSelectedHarmony] = useState("analogous")
  const [colorBlindnessType, setColorBlindnessType] = useState("protanopia")
  const [exportOpen, setExportOpen] = useState(false)
  const [exportColors, setExportColors] = useState<string[]>([])
  const [exportTitle, setExportTitle] = useState("")
  const [exportLabel, setExportLabel] = useState("")
  const [loveCount, setLoveCount] = useState(9)
  const [liked, setLiked] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [hex])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("colorUpdate", { detail: { color: hex } }))

    const key = `love:${hex.toUpperCase()}`
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setLiked(!!parsed.liked)
      } catch {
      }
    } else {
      setLiked(false)
    }
  }, [hex])

  useEffect(() => {
    if (onColorChange) {
    }
  }, [hex, onColorChange])

  const rgb = hexToRgb(hex)
  const { prev, next } = getAdjacentColors(hex)
  if (!rgb) return null

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
  const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b)
  const yxy = rgbToYxy(rgb.r, rgb.g, rgb.b)
  const lab = rgbToLab(rgb.r, rgb.g, rgb.b)
  const hunter = rgbToHunterLab(rgb.r, rgb.g, rgb.b)
  const colorMeaning = getHexColorMeansing(hex)
  const hueFamily = getHueFamily
  const tone = hsl.l < 30 ? "Dark" : hsl.l > 70 ? "Light" : "Medium"
  const family = hueFamily(hsl.h)
  const categoryName = `${tone} ${family.name}`
  const complementary = getColorHarmony(hex, "complementary")[1]

  const downloadMainSwatch = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 1920
    canvas.height = 1080
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.fillStyle = hex
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const textColor = getContrastColor(hex)
    ctx.fillStyle = textColor
    ctx.font = "bold 120px system-ui, -apple-system, Segoe UI, Roboto"
    ctx.textAlign = "center"
    ctx.fillText(hex.toUpperCase(), canvas.width / 2, canvas.height / 2 - 40)
    ctx.font = "600 72px system-ui, -apple-system, Segoe UI, Roboto"
    ctx.fillText(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, canvas.width / 2, canvas.height / 2 + 80)
    ctx.font = "600 64px system-ui, -apple-system, Segoe UI, Roboto"
    ctx.textAlign = "right"
    ctx.fillText("HexColorMeans", canvas.width - 40, canvas.height - 40)
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        const cleanHex = hex.replace("#", "").toUpperCase()
        a.download = `${cleanHex}-color-information-meaning.png`
        a.click()
        URL.revokeObjectURL(url)
      }
    })
  }

  const toggleLove = async () => {
    const key = `love:${hex.toUpperCase()}`
    const nextLiked = !liked
    setLiked(nextLiked)
    setLoveCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)))
    const payload = { liked: nextLiked }
    if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(payload))
  }

  const harmonies = {
    analogous: { name: "Analogous", colors: getColorHarmony(hex, "analogous") },
    complementary: { name: "Complementary", colors: getColorHarmony(hex, "complementary") },
    "split-complementary": { name: "Split Complementary", colors: getColorHarmony(hex, "split-complementary") },
    triadic: { name: "Triadic", colors: getColorHarmony(hex, "triadic") },
    tetradic: { name: "Tetradic", colors: getColorHarmony(hex, "tetradic") },
    square: { name: "Square", colors: getColorHarmony(hex, "square") },
    "double-split-complementary": {
      name: "Double Split Complementary",
      colors: getColorHarmony(hex, "double-split-complementary"),
    },
    monochromatic: { name: "Monochromatic", colors: getColorHarmony(hex, "monochromatic") },
  }

  const harmonyDescriptions: Record<string, string> = {
    analogous: "Colors adjacent on the color wheel (30° apart)",
    complementary: "Colors opposite on the color wheel (180° apart)",
    triadic: "Three colors evenly spaced (120° apart)",
    tetradic: "Four colors forming a rectangle on the wheel",
    square: "Four colors evenly spaced (90° apart)",
    monochromatic: "Variations of a single hue",
    "split-complementary": "Three colors using one base hue and the two hues beside its opposite",
    "double-split-complementary": "Four colors formed from two base hues and the colors next to their opposites",
  }

  const tints = generateTints(hex, 10)
  const shades = generateShades(hex, 10)
  const tones = generateTones(hex, 10)
  const relatedColors = getRelatedColors(hex, 9)

  const navigateToColor = (color: string) => {
    router.push(getColorPageLink(color))
  }

  const defaultOpen = mode !== "sectionsOnly"
  const [openConversion, setOpenConversion] = useState(defaultOpen)
  const [openBars, setOpenBars] = useState(defaultOpen)
  const [openVariations, setOpenVariations] = useState(defaultOpen)
  const [openHarmonies, setOpenHarmonies] = useState(defaultOpen)
  const [openContrast, setOpenContrast] = useState(defaultOpen)
  const [openBlindness, setOpenBlindness] = useState(defaultOpen)
  const [openCss, setOpenCss] = useState(defaultOpen)
  const [openPatterns, setOpenPatterns] = useState(defaultOpen)
  const [openMockups, setOpenMockups] = useState(defaultOpen)
  const [openIcons, setOpenIcons] = useState(defaultOpen)
  const [openRelated, setOpenRelated] = useState(defaultOpen)

  return (
    <div className="space-y-8">
      {mode !== "sectionsOnly" ? (
        <Card id="information" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
          <div className="bg-muted-foreground/10 border-l-[10px] py-5 px-4" style={{ borderLeftColor: hex }}>
            <h2 className="text-3xl font-bold m-0 leading-tight">{label} Color Information</h2>
          </div>
          <div className="px-4 sm:px-6 py-2">
            <div className="text-base leading-relaxed">
              {colorInformation ? (
                <div className="space-y-4">
                  <p>
                    <MarkdownText content={colorInformation.paragraph1} />
                  </p>
                  <p>
                    <MarkdownText content={colorInformation.paragraph2} />
                  </p>
                </div>
              ) : (
                (() => {
                  const getUniqueKnownColors = (colors: string[]) => {
                    const known = colors.map((c) => getClosestKnownColor(c))
                    const unique = new Map<string, { name: string; hex: string }>()
                    for (const c of known) {
                      if (c.hex.toUpperCase() !== hex.toUpperCase() && !unique.has(c.hex.toUpperCase())) {
                        unique.set(c.hex.toUpperCase(), c)
                      }
                    }
                    return Array.from(unique.values()).slice(0, 3)
                  }

                  const analogous = getColorHarmony(hex, "analogous")
                  const splitComp = getColorHarmony(hex, "split-complementary")
                  const pairingColors = getUniqueKnownColors([...analogous, ...splitComp])

                  const triadic = getColorHarmony(hex, "triadic")
                  const complementaryColor = getColorHarmony(hex, "complementary")[1]
                  const conflictingColors = getUniqueKnownColors([...triadic, complementaryColor])

                  const renderColorLink = (c: { name: string; hex: string }, i: number, arr: any[]) => (
                    <span key={c.hex}>
                      <Link href={getColorPageLink(c.hex)} className="text-primary hover:underline">
                        {c.name} ({c.hex})
                      </Link>
                      {i < arr.length - 1 ? (i === arr.length - 2 ? ", and " : ", ") : ""}
                    </span>
                  )

                  return (
                    <div className="space-y-4">
                      <p>
                        <span className="font-semibold">{label}</span> RGB value is ({rgb.r}, {rgb.g}, {rgb.b}). The hex
                        color red value is {rgb.r}, green is {rgb.g}, and blue is {rgb.b}. Its HSL format shows a hue of{" "}
                        {hsl.h}°, saturation of {hsl.s}%, and lightness of {hsl.l}%, while the CMYK process values are{" "}
                        {cmyk.c}%, {cmyk.m}%, {cmyk.y}%, and {cmyk.k}%.
                      </p>
                      <p>
                        Colors that pair well with <span className="font-semibold">{label}</span> include{" "}
                        {pairingColors.map((c, i) => renderColorLink(c, i, pairingColors))}
                        , as they maintain visual balance and harmony, whereas{" "}
                        {conflictingColors.map((c, i) => renderColorLink(c, i, conflictingColors))} tend to conflict with
                        this color due to strong contrast or opposing tonal characteristics.
                      </p>
                    </div>
                  )
                })()
              )}
            </div>
          </div>
        </Card>
      ) : null}

      {mode !== "sectionsOnly" ? (
        <Card className="p-4 sm:p-6 space-y-4">
          <div className="w-full flex justify-center">
            <div className="relative w-full max-w-xl aspect-[1200/630] rounded-lg border-2 border-border overflow-hidden">
              {(() => {
                const rgbLocal = hexToRgb(hex) || { r: 0, g: 0, b: 0 }
                const isKnown = colorExistsInDb !== undefined ? colorExistsInDb : isKnownHex(hex)
                const gumlet = getGumletColorImage({
                  colorName: name || hex,
                  hex: hex,
                  rgb: rgbLocal,
                })

                if (isKnown && gumlet.url && !imageError) {
                  return (
                    <Image
                      src={gumlet.url}
                      alt={gumlet.alt}
                      width={1200}
                      height={630}
                      priority
                      fetchPriority="high"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      sizes="(max-width: 640px) 100vw, 600px"
                      onError={() => setImageError(true)}
                    />
                  )
                }

                const contrastColor = getContrastColor(hex)
                return (
                  <div
                    className="w-full h-full relative font-sans select-none flex items-center justify-center"
                    style={{ backgroundColor: hex, color: contrastColor }}
                  >
                    <div
                      className="absolute inset-2 sm:inset-4 border-2 opacity-20 pointer-events-none"
                      style={{ borderColor: contrastColor }}
                    />

                    <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                      <div className="text-4xl sm:text-7xl font-bold mb-1 tracking-tight">
                        {hex.toUpperCase()}
                      </div>
                      <div className="text-lg sm:text-2xl font-medium opacity-80">
                        {`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                      </div>
                    </div>

                    <div className="absolute bottom-2 sm:bottom-10 left-1/2 -translate-x-1/2">
                      <div
                        className="px-4 py-1 sm:px-6 sm:py-2 rounded-full text-xs sm:text-lg font-bold opacity-40 whitespace-nowrap"
                        style={{
                          backgroundColor:
                            contrastColor === "#000000" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)",
                          color: contrastColor,
                        }}
                      >
                        HexColorMeans.com
                      </div>
                    </div>
                  </div>
                )
              })()}
              <button
                onClick={toggleLove}
                className="absolute left-2 bottom-2 inline-flex items-center gap-1 px-2 py-1 rounded bg-black/40 text-white z-10"
                style={{ color: liked ? "#ef4444" : undefined }}
              >
                <Heart className="w-4 h-4" />
                <span className="text-xs font-semibold">{loveCount}</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="outline"
              className="bg-transparent border-border hover:bg-muted hover:text-foreground transition-all font-bold gap-3 group"
              onClick={downloadMainSwatch}
            >
              <span>Download image (1920x1080)</span>
              <Download className="w-4 h-4 transition-transform group-hover:scale-110" />
            </Button>
            <ShareButtons url={pageUrl} title={`Color ${label}`} />
          </div>
        </Card>
      ) : null}

      {mode !== "sectionsOnly" ? (
        <Card id="meaning" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
          <div className="bg-muted-foreground/10 border-l-[10px] py-5 px-4" style={{ borderLeftColor: hex }}>
            <h2 className="text-3xl font-bold m-0 leading-tight">{label} Color Meaning</h2>
          </div>
          <div className="px-4 sm:px-6 py-2">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-line leading-relaxed">{colorMeaning}</p>
            </div>
          </div>
        </Card>
      ) : null}

      <Card id="conversion" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
        <div
          onClick={() => setOpenConversion((v) => !v)}
          className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between gap-4"
          style={{ borderLeftColor: hex }}
        >
          <h2 className="text-3xl font-bold m-0 leading-tight underline">Color Conversion</h2>
          {openConversion ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        {openConversion ? (
          <div className="px-2 sm:px-6 py-2 space-y-4">
            <p className="text-muted-foreground">
              Accurate conversions of {label} across RGB, Hex, CMYK, HSL, and Lab ensure consistent color fidelity across
              digital, print, and design applications.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorCodeItem label="HEX" value={hex} />
              <ColorCodeItem label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
              <ColorCodeItem label="HSL" value={`hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`} />
              <ColorCodeItem label="CMYK" value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`} />
              <ColorCodeItem label="HSV" value={`hsv(${hsv.h}°, ${hsv.s}%, ${hsv.v}%)`} />
              <ColorCodeItem
                label="XYZ"
                value={`${xyz.x.toFixed(4)} ${xyz.y.toFixed(4)} ${xyz.z.toFixed(4)}`}
              />
              <ColorCodeItem
                label="Yxy"
                value={`${yxy.Y.toFixed(4)} ${yxy.x.toFixed(4)} ${yxy.y.toFixed(4)}`}
              />
              <ColorCodeItem
                label="Hunter Lab"
                value={`${hunter.L.toFixed(4)} ${hunter.a.toFixed(4)} ${hunter.b.toFixed(4)}`}
              />
              <ColorCodeItem
                label="CIE-Lab"
                value={`${lab.l.toFixed(4)} ${lab.a.toFixed(4)} ${lab.b.toFixed(4)}`}
              />
            </div>
          </div>
        ) : null}
      </Card>

      <Card className="p-0 overflow-hidden space-y-0">
        <div
          onClick={() => setOpenBars((v) => !v)}
          className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between gap-4"
          style={{ borderLeftColor: hex }}
        >
          <h2 className="text-3xl font-bold m-0 leading-tight underline">RGB Values & CMYK Values</h2>
          {openBars ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        {openBars ? (
          <div className="px-2 sm:px-6 py-2 space-y-6">
            <p className="text-muted-foreground">
              Detailed RGB and CMYK values of {label} displayed in a horizontal bar provide clear reference for digital
              and print color accuracy.
            </p>
            <div className="space-y-3">
              <h3 className="font-semibold text-2xl">RGB Channels</h3>
              <ColorBar label="Red" value={rgb.r} max={255} color="#FF0000" />
              <ColorBar label="Green" value={rgb.g} max={255} color="#00FF00" />
              <ColorBar label="Blue" value={rgb.b} max={255} color="#0000FF" />
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-2xl">CMYK Ink Density</h3>
              <ColorBar label="Cyan" value={cmyk.c} max={100} color="#00FFFF" />
              <ColorBar label="Magenta" value={cmyk.m} max={100} color="#FF00FF" />
              <ColorBar label="Yellow" value={cmyk.y} max={100} color="#FFFF00" />
              <ColorBar label="Key (Black)" value={cmyk.k} max={100} color="#000000" />
            </div>
          </div>
        ) : null}
      </Card>

      <Card id="variations" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
        <div
          onClick={() => setOpenVariations((v) => !v)}
          className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between gap-4"
          style={{ borderLeftColor: hex }}
        >
          <h2 className="text-3xl font-bold m-0 leading-tight underline">Color Variations</h2>
          {openVariations ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        {openVariations ? (
          <div className="px-2 sm:px-6 py-2 space-y-4">
            <p className="text-muted-foreground">
              A full range of {label} variations, including tints, shades, and tones, provides highlights, depth, and
              subtle desaturated options for UI design.
            </p>
            <ColorTabsClient
              tints={tints}
              shades={shades}
              tones={tones}
              onColorChange={onColorChange}
              onExport={(colors, title, labelKey) => {
                setExportColors(colors)
                setExportTitle(title)
                setExportLabel(labelKey)
                setExportOpen(true)
              }}
            />
          </div>
        ) : null}
      </Card>

      <Card id="harmonies" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
        <div
          onClick={() => setOpenHarmonies((v) => !v)}
          className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between gap-4"
          style={{ borderLeftColor: hex }}
        >
          <h2 className="text-3xl font-bold m-0 leading-tight underline">Color Harmonies</h2>
          {openHarmonies ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        {openHarmonies ? (
          <div className="px-2 sm:px-6 py-2 space-y-6">
            <p className="text-muted-foreground">
              Harmonious color schemes for {label} created using the{" "}
              <Link href="/color-wheel/" className="text-primary hover:underline">
                color wheel
              </Link>{" "}
              ensure visually balanced palettes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(harmonies).map(([type, harmony]) => (
                <div key={type} className="space-y-3 p-3 sm:p-5 border-2 border-border rounded-lg">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-2xl min-w-0">{harmony.name}</h3>
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="shrink-0 h-8 w-8"
                            onClick={() => {
                              setExportColors(harmony.colors)
                              setExportTitle(`Export ${harmony.name}`)
                              setExportLabel(type)
                              setExportOpen(true)
                            }}
                          >
                            <Share className="w-4 h-4" />
                            <span className="sr-only">Export</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Export</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-muted-foreground">{harmonyDescriptions[type]}</p>
                  <ColorCombination colors={harmony.colors} baseHex={hex} onColorChange={onColorChange} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Card>

      <Card id="contrast-checker" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
        <div
          className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer flex items-center justify-between gap-4"
          style={{ borderLeftColor: hex }}
          onClick={() => setOpenContrast((v) => !v)}
        >
          <h2 className="text-3xl font-bold m-0 leading-tight underline">Contrast Checker (WCAG)</h2>
          {openContrast ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        {openContrast ? (
          <div className="px-2 sm:px-6 py-2 space-y-4">
            <ContrastCheckerClient hex={hex} label={label} shouldSyncBackgroundWithHex={!!onColorChange} />
          </div>
        ) : null}
      </Card>

      <Card id="blindness-simulator" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
        <div
          className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer flex items-center justify-between gap-4"
          style={{ borderLeftColor: hex }}
          onClick={() => setOpenBlindness((v) => !v)}
        >
          <h2 className="text-3xl font-bold m-0 leading-tight underline">Color Blindness Simulator</h2>
          {openBlindness ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        {openBlindness ? (
          <div className="px-2 sm:px-6 py-2 space-y-4">
            <p className="text-muted-foreground">
              Simulated views of {label} for different color vision deficiencies help identify potential confusion using
              the{" "}
              <Link href="/color-blindness-simulator/" className="text-primary hover:underline">
                Color Blindness Simulator
              </Link>
              .
            </p>
            <Select value={colorBlindnessType} onValueChange={setColorBlindnessType}>
              <SelectTrigger className="w-full md:w-64" aria-label="Select color blindness type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="protanopia">Protanopia (Red-Blind)</SelectItem>
                <SelectItem value="protanomaly">Protanomaly (Red-Weak)</SelectItem>
                <SelectItem value="deuteranopia">Deuteranopia (Green-Blind)</SelectItem>
                <SelectItem value="deuteranomaly">Deuteranomaly (Green-Weak)</SelectItem>
                <SelectItem value="tritanopia">Tritanopia (Blue-Blind)</SelectItem>
                <SelectItem value="tritanomaly">Tritanomaly (Blue-Weak)</SelectItem>
                <SelectItem value="achromatopsia">Achromatopsia (Total Color Blind)</SelectItem>
                <SelectItem value="achromatomaly">Achromatomaly (Partial Color Blind)</SelectItem>
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-center">Normal Vision</h3>
                <div
                  className="w-full h-32 rounded-lg border-2 border-border flex items-center justify-center font-mono"
                  style={{ backgroundColor: hex, color: getContrastColor(hex) }}
                >
                  {label}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-center capitalize">
                  {colorBlindnessType.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <div
                  className="w-full h-32 rounded-lg border-2 border-border flex items-center justify-center font-mono"
                  style={{
                    backgroundColor: simulateColorBlindness(hex, colorBlindnessType),
                    color: getContrastColor(simulateColorBlindness(hex, colorBlindnessType)),
                  }}
                >
                  {simulateColorBlindness(hex, colorBlindnessType)}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: These simulations are approximations. Actual color vision deficiency varies by individual.
            </p>
          </div>
        ) : null}
      </Card>

      <Card id="css-examples" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
        <div
          className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer flex items-center justify-between gap-4"
          style={{ borderLeftColor: hex }}
          onClick={() => setOpenCss((v) => !v)}
        >
          <h2 className="text-3xl font-bold m-0 leading-tight underline">CSS Examples</h2>
          {openCss ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        {openCss ? (
          <div className="px-2 sm:px-6 py-2 space-y-4">
            <CSSExample
              title="Background Color"
              code={`background-color: ${hex};`}
              preview={<div className="w-full h-16 rounded-md" style={{ backgroundColor: hex }} />}
            />
            <CSSExample
              title="Text Color"
              code={`color: ${hex};`}
              preview={
                <p className="text-2xl font-bold" style={{ color: hex }}>
                  Sample Text
                </p>
              }
            />
            <CSSExample
              title="Border Color"
              code={`border: 2px solid ${hex};`}
              preview={<div className="w-full h-16 rounded-md border-2" style={{ borderColor: hex }} />}
            />
            <CSSExample
              title="Box Shadow"
              code={`box-shadow: 0 4px 6px ${hex}40;`}
              preview={
                <div className="w-full h-16 rounded-md bg-muted" style={{ boxShadow: `0 4px 6px ${hex}40` }} />
              }
            />
            <CSSExample
              title="Text Shadow"
              code={`text-shadow: 2px 2px 4px ${hex};`}
              preview={
                <p className="text-2xl font-bold" style={{ textShadow: `2px 2px 4px ${hex}` }}>
                  Sample Text
                </p>
              }
            />
            <CSSExample
              title="Gradient"
              code={`background: linear-gradient(135deg, ${hex} 0%, ${shades[4]} 100%);`}
              preview={
                <div
                  className="w-full h-16 rounded-md"
                  style={{ background: `linear-gradient(135deg, ${hex} 0%, ${shades[4]} 100%)` }}
                />
              }
            />
          </div>
        ) : null}
      </Card>

      <Card id="patterns" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
        <div
          className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between gap-4"
          style={{ borderLeftColor: hex }}
          onClick={() => setOpenPatterns((v) => !v)}
        >
          <h2 className="text-3xl font-bold m-0 leading-tight underline">Seamless Patterns</h2>
          {openPatterns ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        {openPatterns ? (
          <div className="px-6 py-2 space-y-4">
            <p className="text-muted-foreground">
              High-resolution seamless patterns featuring {label} provide ready-to-use backgrounds, wallpapers, and print
              designs for any project.
            </p>
            <ColorPatterns color={hex} />
          </div>
        ) : null}
      </Card>

      <Card id="icons" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
        <div
          className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between gap-4"
          style={{ borderLeftColor: hex }}
          onClick={() => setOpenIcons((v) => !v)}
        >
          <h2 className="text-3xl font-bold m-0 leading-tight underline">Icons</h2>
          {openIcons ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        {openIcons ? (
          <div className="px-6 py-2 space-y-4">
            <p className="text-muted-foreground">
              A collection of popular icons in {label} offers ready-to-use visuals for interfaces, designs, and creative
              projects.
            </p>
            <ColorIcons color={hex} />
          </div>
        ) : null}
      </Card>

      <Card id="mockups" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
        <div
          className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between gap-4"
          style={{ borderLeftColor: hex }}
          onClick={() => setOpenMockups((v) => !v)}
        >
          <h2 className="text-3xl font-bold m-0 leading-tight underline">Real-World Applications</h2>
          {openMockups ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        {openMockups ? (
          <div className="px-6 py-2 space-y-4">
            <p className="text-muted-foreground">
              Real-world mockups of {label} showcase its versatility across fashion, interiors, branding, and product
              packaging.
            </p>
            <ColorMockups color={hex} />
          </div>
        ) : null}
      </Card>

      {mode !== "sectionsOnly" ? (
        <Card id="related-colors" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
          <div
            className="bg-muted-foreground/10 border-l-[10px] py-5 px-4 cursor-pointer flex items-center justify-between gap-4"
            style={{ borderLeftColor: hex }}
            onClick={() => setOpenRelated((v) => !v)}
          >
            <h2 className="text-3xl font-bold m-0 leading-tight underline">Related Colors</h2>
            {openRelated ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {openRelated ? (
            <div className="px-6 py-2 space-y-4">
              <p className="text-muted-foreground">
                Colors related to {label} in hue, saturation, and lightness provide harmonious and complementary options
                for cohesive color schemes.
              </p>
              <div className="flex justify-center">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 w-full">
                  {relatedColors.slice(0, 10).map((color, idx) => (
                    <a
                      key={`${color.hex}-${idx}`}
                      href={getColorPageLink(color.hex)}
                      className="group flex flex-col gap-2"
                    >
                      <div
                        className="w-full aspect-square rounded-lg border border-border shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center"
                        style={{ backgroundColor: color.hex }}
                      >
                        <span
                          className="font-mono text-xs font-bold"
                          style={{ color: getContrastColor(color.hex) }}
                        >
                          {color.hex.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-center">
                        <span
                          className="font-medium text-xs sm:text-sm block leading-tight truncate px-1"
                          title={color.name}
                        >
                          {color.name}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </Card>
      ) : null}

      {mode !== "sectionsOnly" ? (
        <Card id="useful-tools" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
          <div className="bg-muted-foreground/10 border-l-[10px] py-5 px-4" style={{ borderLeftColor: hex }}>
            <h2 className="text-3xl font-bold m-0 leading-tight">Useful Color Tools</h2>
          </div>
          <div className="px-6 py-6 transition-all">
            <p className="text-muted-foreground mb-6">
              A curated set of tools to help apply, analyze, and manage colors effectively in your projects
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Color Picker", href: "/html-color-picker/", icon: Pipette },
                { name: "Image Color Picker", href: "/image-color-picker/", icon: ImageIcon },
                { name: "Palette from Image", href: "/palette-from-image", icon: Palette },
                { name: "Screen Color Picker", href: "/screen-color-picker/", icon: Monitor },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="p-6 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-center group flex flex-col items-center gap-3"
                >
                  <tool.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="font-bold">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </Card>
      ) : null}

      {mode !== "sectionsOnly" && faqs && faqs.length > 0 ? (
        <Card id="faqs" className="p-0 overflow-hidden space-y-0 scroll-mt-24">
          <div className="bg-muted-foreground/10 border-l-[10px] py-5 px-4" style={{ borderLeftColor: hex }}>
            <h2 className="text-3xl font-bold m-0 leading-tight">{label} Color FAQs</h2>
          </div>
          <div className="px-6 py-2 space-y-4">
            <p className="text-muted-foreground">
              Frequently asked questions about {label} color meaning, symbolism, and applications. Click on any question
              to expand detailed answers.
            </p>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx + 1}`}>
                  <AccordionTrigger className="text-base sm:text-lg">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Card>
      ) : null}

      {mode !== "sectionsOnly" ? (
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex justify-between items-center py-6 border-t border-b border-border">
            <a href={getColorPageLink(prev)} className="flex flex-col items-start max-w-[45%] group">
              <span className="text-sm text-muted-foreground group-hover:text-foreground mb-1">
                ← Previous Color
              </span>
              <span className="font-medium group-hover:underline">
                {getClosestKnownColor(prev).name} ({prev}) Color Meaning
              </span>
            </a>
            <a href={getColorPageLink(next)} className="flex flex-col items-end max-w-[45%] text-right group">
              <span className="text-sm text-muted-foreground group-hover:text-foreground mb-1">Next Color →</span>
              <span className="font-medium group-hover:underline">
                {getClosestKnownColor(next).name} ({next}) Color Meaning
              </span>
            </a>
          </div>
          <div className="flex justify-center">
            <ShareButtons url={pageUrl} title={`Color ${hex} - HexColorMeans`} />
          </div>
        </div>
      ) : null}

      <ColorExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title={exportTitle}
        colors={exportColors}
        baseHex={hex}
        filenameLabel={exportLabel}
      />
    </div>
  )
}

function ColorCodeItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
      <div className="space-y-1">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className="font-mono text-sm">{value}</div>
      </div>
      <CopyButton value={value} />
    </div>
  )
}

function ColorBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percentage = (value / max) * 100
  const whiteLabels = new Set(["Red", "Blue", "Key (Black)"])
  const blackLabels = new Set(["Green", "Yellow", "Cyan", "Magenta"])
  const textColor = whiteLabels.has(label) ? "#FFFFFF" : blackLabels.has(label) ? "#000000" : getContrastColor(color)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-mono">
          {value} / {max} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className="w-full h-6 bg-muted rounded-md overflow-hidden">
        <div
          className="h-full flex items-center justify-end px-2 text-xs font-bold transition-all"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            color: textColor,
          }}
        >
          {percentage > 10 && `${percentage.toFixed(0)}%`}
        </div>
      </div>
    </div>
  )
}

function CSSExample({ title, code, preview }: { title: string; code: string; preview: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-xl">{title}</h3>
      </div>
      <div className="p-3 bg-muted rounded-md font-mono text-sm">{code}</div>
      <div className="p-4 bg-background border-2 border-dashed border-border rounded-md">{preview}</div>
    </div>
  )
}

function ColorPalette({
  name,
  colors,
  onColorClick,
}: {
  name: string
  colors: string[]
  onColorClick: (color: string) => void
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">{name}</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color, idx) => (
          <div
            key={idx}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-dashed border-border cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: color }}
            onClick={() => onColorClick(color)}
            title={color}
          />
        ))}
      </div>
    </div>
  )
}

