"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { getContrastColor, hexToRgb, rgbToHsl } from "@/lib/color-utils"
import { getColorPageLink } from "@/lib/color-linking-utils"
import { LibraryColorSwatch } from "@/components/library-color-swatch"
import { useSearchParams } from "next/navigation"

// Import the optimized color library data
import colorLibraryData from "@/lib/color-library-data.json"

type ColorItem = typeof colorLibraryData[number];

export function ColorLibrary({
  initialCategory = "all",
  page = 1,
  hidePagination = false,
}: {
  initialCategory?: string;
  page?: number;
  hidePagination?: boolean;
}) {
  const searchParams = useSearchParams()

  // Initialize category from URL params, fallback to initialCategory prop
  const currentCategory = searchParams.get('cat') || initialCategory

  // Initialize state from URL params if available for search
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "")
  const [previewResults, setPreviewResults] = useState<Array<{ name: string; hex: string }>>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<number | null>(null)

  // All colors from the optimized data file
  const allColors = colorLibraryData;

  useEffect(() => {
    const q = searchParams.get('q')
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q)
    }
  }, [searchParams])

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }
    if (searchQuery.trim().length <= 2) {
      setPreviewResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    debounceRef.current = window.setTimeout(() => {
      try {
        const query = searchQuery.trim().toLowerCase()
        const results: Array<{ name: string; hex: string }> = []

        // Search through all colors
        for (let i = 0; i < allColors.length; i++) {
          const color = allColors[i]
          const name = color.name.toLowerCase()

          if (name.startsWith(query)) {
            results.push({ name: color.name, hex: color.hex })
          }
        }

        // Add contains matches (limit to 200 total results)
        if (results.length < 200) {
          for (let i = 0; i < allColors.length && results.length < 200; i++) {
            const color = allColors[i]
            const name = color.name.toLowerCase()

            if (name.includes(query) && !name.startsWith(query)) {
              results.push({ name: color.name, hex: color.hex })
            }
          }
        }

        setPreviewResults(results)
      } catch {
        setPreviewResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [searchQuery, allColors])

  const getCategory = (hex: string) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return "grays"
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    if (hsl.s <= 12 || hsl.l <= 5 || hsl.l >= 95) return "grays"
    if ((hsl.h >= 0 && hsl.h < 12) || (hsl.h >= 348 && hsl.h <= 360)) return "reds"
    if (hsl.h >= 12 && hsl.h < 20 && hsl.s < 70 && hsl.l < 60) return "browns"
    if (hsl.h >= 20 && hsl.h < 45) {
      if (hsl.s < 70 && hsl.l < 60) return "browns"
      return "oranges"
    }
    if (hsl.h >= 45 && hsl.h < 75) return "yellows"
    if (hsl.h >= 75 && hsl.h < 165) return "greens"
    if (hsl.h >= 165 && hsl.h < 255) return "blues"
    if (hsl.h >= 255 && hsl.h < 320) return "purples"
    if (hsl.h >= 320 && hsl.h < 348) return "pinks"
    return "reds"
  }

  const highlight = (name: string, q: string) => {
    const idx = name.toLowerCase().indexOf(q.toLowerCase())
    if (idx === -1) return name
    const before = name.slice(0, idx)
    const match = name.slice(idx, idx + q.length)
    const after = name.slice(idx + q.length)
    return (
      <>
        {before}
        <span className="bg-muted px-0.5 rounded-sm font-semibold">{match}</span>
        {after}
      </>
    )
  }

  const filteredColors = () => {
    if (!searchQuery) {
      // When no search query, we use the imported all colors
      if (currentCategory === "all") return allColors
      return allColors.filter((c) => c.category === currentCategory)
    }

    // When there's a search query, we use the preview results
    return previewResults.map(result => ({
      name: result.name,
      hex: result.hex,
      category: getCategory(result.hex)
    }))
  }

  const categories = [
    { value: "all", label: "All Colors" },
    { value: "reds", label: "Reds" },
    { value: "pinks", label: "Pinks" },
    { value: "oranges", label: "Oranges" },
    { value: "yellows", label: "Yellows" },
    { value: "greens", label: "Greens" },
    { value: "blues", label: "Blues" },
    { value: "purples", label: "Purples" },
    { value: "browns", label: "Browns" },
    { value: "grays", label: "Grays" },
  ]

  const shadeMeta: { [key: string]: { label: string; href: string } } = {
    reds: { label: "Shades of Red", href: "/shades-of-red-color/" },
    pinks: { label: "Shades of Pink", href: "/shades-of-pink-color/" },
    oranges: { label: "Shades of Orange", href: "/shades-of-orange-color/" },
    yellows: { label: "Shades of Yellow", href: "/shades-of-yellow-color/" },
    greens: { label: "Shades of Green", href: "/shades-of-green-color/" },
    blues: { label: "Shades of Blue", href: "/shades-of-blue-color/" },
    purples: { label: "Shades of Purple", href: "/shades-of-purple-color/" },
    browns: { label: "Shades of Brown", href: "/shades-of-brown-color/" },
    grays: { label: "Shades of Gray", href: "/shades-of-gray-color/" },
  }

  const shadeOrder = ["reds", "pinks", "oranges", "yellows", "greens", "blues", "purples", "browns", "grays"] as const

  const colorsToShow = filteredColors()

  return (
    <div className="space-y-8">
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Search Colors</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by color name or hex code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery.trim().length > 2 && (
              <div className="absolute left-0 right-0 mt-2 border-2 border-border rounded-md bg-background shadow-lg max-h-64 overflow-y-auto z-30">
                {loading ? (
                  <div className="p-4 text-sm text-muted-foreground">Searching…</div>
                ) : previewResults.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">No matches</div>
                ) : (
                  <div className="divide-y">
                    {previewResults.map((c, i) => (
                      <Link key={`${c.hex}-${i}`} href={getColorPageLink(c.hex)} className="flex items-center gap-3 p-3 hover:bg-muted">
                        <div className="w-6 h-6 rounded border" style={{ backgroundColor: c.hex }} />
                        <div className="flex-1 text-sm">
                          {highlight(c.name, searchQuery.trim())}
                        </div>
                        <div className="font-mono text-xs">{c.hex}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="w-full">
        <nav className="bg-muted p-1 rounded-lg inline-flex flex-wrap gap-1 mb-6">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              href={cat.value === "all" ? "/colors/" : `/colors/?cat=${cat.value}`}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                currentCategory === cat.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        {!searchQuery && currentCategory === "all" ? (
          <div className="space-y-10">
            {shadeOrder.map((shade) => {
              const colorsForShade = colorsToShow.filter((color) => {
                const cat = (color as any).category ?? getCategory(color.hex)
                return cat === shade
              })
              if (colorsForShade.length === 0) return null
              const meta = shadeMeta[shade]
              return (
                <section key={shade} className="space-y-4">
                  <h2 className="text-2xl font-bold">
                    {meta ? (
                      <Link href={meta.href} className="hover:underline">
                        {meta.label}
                      </Link>
                    ) : (
                      shade
                    )}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {colorsForShade.map((color, index) => (
                      <LibraryColorSwatch key={`${shade}-${index}`} name={color.name} hex={color.hex} />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        ) : (
          <>
            {!searchQuery && currentCategory !== "all" && shadeMeta[currentCategory] && (
              <h2 className="text-2xl font-bold mb-4">
                <Link href={shadeMeta[currentCategory].href} className="hover:underline">
                  {shadeMeta[currentCategory].label}
                </Link>
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {colorsToShow.map((color, index) => (
                <LibraryColorSwatch key={index} name={color.name} hex={color.hex} />
              ))}
            </div>
          </>
        )}
      </div>

      {filteredColors().length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No colors found matching your search.</p>
          <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </Card>
      )}
    </div>
  )
}
