"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Search } from "lucide-react"
import { getContrastColor } from "@/lib/color-utils"
import { hexToRgb, rgbToHsl } from "@/lib/color-utils"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination"
import { getColorPageLink } from "@/lib/color-linking-utils"
import { LibraryColorSwatch } from "@/components/library-color-swatch"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

// Import the optimized color library data
import colorLibraryData from "@/lib/color-library-data.json"

type ColorItem = typeof colorLibraryData[number];

export function ColorLibrary({ initialQuery = "" }: { initialQuery?: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Initialize state from URL params if available, otherwise use defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || initialQuery)
  const [activeCategory, setActiveCategory] = useState("all")
  const [previewResults, setPreviewResults] = useState<Array<{ name: string; hex: string }>>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<number | null>(null)

  const pageParam = searchParams.get('page')
  const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1)

  const perPage = 50

  // All colors from the optimized data file
  const allColors = colorLibraryData;
  const [isLoading, setIsLoading] = useState(false)

  // Sync state with URL params when they change (e.g. back button)
  useEffect(() => {
    const p = searchParams.get('page')
    setPage(p ? parseInt(p) : 1)

    const q = searchParams.get('q')
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q)
    }
  }, [searchParams])

  // Update URL when page changes
  const updateUrl = (newPage: number, newQuery: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newPage > 1) {
      params.set('page', newPage.toString())
    } else {
      params.delete('page')
    }

    if (newQuery) {
      params.set('q', newQuery)
    } else {
      params.delete('q')
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Intercept setPage to also update URL
  const handleSetPage = (newPage: number | ((prev: number) => number)) => {
    let p: number;
    if (typeof newPage === 'function') {
      p = newPage(page)
    } else {
      p = newPage
    }
    setPage(p)
    // We don't call updateUrl here strictly because we might prefer the Link href to handle navigation
    // BUT for the onClick handlers (user interaction), we might want to push state.
    // However, since we now have correct hrefs, the router will handle it?
    // Actually, next/link with shallow routing might be better, but we want full crawlability.
    // The current href implementation does full navigation or client-side transition.
    // Let's rely on the useEffect [searchParams] to sync state, 
    // and let the onClick handlers just be for preventing default if we want custom behavior,
    // OR just let the Link do its job.

    // For consistency with existing code which calls setPage:
    // We should probably remove manual setPage calls in onClick if we trust the Link.
    // But the existing code has extensive onClick logic.
    // Let's keep the local state update for immediate UI feedback, 
    // and arguably the Link click will update the URL, triggering the useEffect, ensuring consistency.
  }

  const buildMobileList = (pages: number) => {
    if (pages <= 4) return Array.from({ length: pages }, (_, i) => i + 1)
    return [1, 2, "ellipsis", pages - 1, pages]
  }



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

  useEffect(() => {
    setPage(1)
  }, [searchQuery, activeCategory])

  const buildPageList = (pages: number, current: number) => {
    if (pages <= 8) return Array.from({ length: pages }, (_, i) => i + 1)
    if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", pages - 2, pages - 1, pages]
    if (current >= pages - 3) return [1, 2, 3, "ellipsis", pages - 4, pages - 3, pages - 2, pages - 1, pages]
    return [1, 2, "ellipsis", current - 1, current, current + 1, "ellipsis", pages - 2, pages - 1, pages]
  }

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
      if (activeCategory === "all") return allColors
      return allColors.filter((c) => c.category === activeCategory)
    }

    // When there's a search query, we use the preview results
    return previewResults.map(result => ({
      name: result.name,
      hex: result.hex,
      category: getCategory(result.hex)
    }))
  }

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

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="w-full flex-wrap h-auto gap-2 justify-start">
          <TabsTrigger value="all">All Colors</TabsTrigger>
          <TabsTrigger value="reds">Reds</TabsTrigger>
          <TabsTrigger value="pinks">Pinks</TabsTrigger>
          <TabsTrigger value="oranges">Oranges</TabsTrigger>
          <TabsTrigger value="yellows">Yellows</TabsTrigger>
          <TabsTrigger value="greens">Greens</TabsTrigger>
          <TabsTrigger value="blues">Blues</TabsTrigger>
          <TabsTrigger value="purples">Purples</TabsTrigger>
          <TabsTrigger value="browns">Browns</TabsTrigger>
          <TabsTrigger value="grays">Grays</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          {(() => {
            const total = filteredColors().length
            const pages = Math.ceil(total / perPage)
            if (pages <= 1) return null
            const desktop = buildPageList(pages, page)
            const mobile = buildMobileList(pages)
            return (
              <div className="mb-4">
                <Pagination>
                  <PaginationContent className="flex-nowrap sm:flex-wrap">
                    <PaginationItem>
                      {page <= 1 ? (
                        <span className="flex h-9 w-9 items-center justify-center text-muted-foreground opacity-50 cursor-not-allowed" aria-disabled="true">
                          <span className="sr-only">Previous</span>
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </span>
                      ) : (
                        <PaginationPrevious
                          href={searchQuery ? `?q=${searchQuery}&page=${page - 1}` : `?page=${page - 1}`}
                        />
                      )}
                    </PaginationItem>

                    <div className="hidden sm:flex">
                      {desktop.map((n, idx) =>
                        n === "ellipsis" ? (
                          <PaginationItem key={`e-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={`n-${n}`}>
                            <PaginationLink
                              href={searchQuery ? `?q=${searchQuery}&page=${n}` : `?page=${n}`}
                              isActive={n === page}
                              className={n === page ? "bg-primary text-primary-foreground rounded-full" : ""}
                            >
                              {n}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}
                    </div>

                    <div className="flex sm:hidden">
                      {mobile.map((n, idx) =>
                        n === "ellipsis" ? (
                          <PaginationItem key={`me-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={`mn-${idx}-${n}`}>
                            <PaginationLink
                              href={searchQuery ? `?q=${searchQuery}&page=${n}` : `?page=${n}`}
                              isActive={(n as number) === page}
                              className={(n as number) === page ? "bg-primary text-primary-foreground rounded-full" : ""}
                            >
                              {n}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}
                    </div>

                    <PaginationItem>
                      {page >= pages ? (
                        <span className="flex h-9 w-9 items-center justify-center text-muted-foreground opacity-50 cursor-not-allowed" aria-disabled="true">
                          <span className="sr-only">Next</span>
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><path d="M6.1584 3.13523C6.35985 2.94621 6.67627 2.95603 6.86529 3.15749L10.6153 7.15749C10.7956 7.34982 10.7956 7.6491 10.6153 7.84143L6.86529 11.8414C6.67627 12.0429 6.35985 12.0527 6.1584 11.8637C5.95694 11.6747 5.94713 11.3583 6.13615 11.1568L9.56556 7.49946L6.13615 3.84211C5.94713 3.64066 5.95694 3.32424 6.1584 3.13523Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </span>
                      ) : (
                        <PaginationNext
                          href={searchQuery ? `?q=${searchQuery}&page=${page + 1}` : `?page=${page + 1}`}
                        />
                      )}
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )
          })()}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColors()
              .slice((page - 1) * perPage, page * perPage)
              .map((color, index) => (
                <LibraryColorSwatch key={index} name={color.name} hex={color.hex} />
              ))}
          </div>
          {(() => {
            const total = filteredColors().length
            const pages = Math.ceil(total / perPage)
            if (pages <= 1) return null
            const nums = buildPageList(pages, page)
            const mobile = buildMobileList(pages)
            return (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent className="flex-nowrap sm:flex-wrap">
                    <PaginationItem>
                      {page <= 1 ? (
                        <span className="flex h-9 w-9 items-center justify-center text-muted-foreground opacity-50 cursor-not-allowed" aria-disabled="true">
                          <span className="sr-only">Previous</span>
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </span>
                      ) : (
                        <PaginationPrevious
                          href={searchQuery ? `?q=${searchQuery}&page=${page - 1}` : `?page=${page - 1}`}
                        />
                      )}
                    </PaginationItem>
                    <div className="hidden sm:flex">
                      {nums.map((n, idx) =>
                        n === "ellipsis" ? (
                          <PaginationItem key={`b-e-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={`b-n-${n as number}`}>
                            <PaginationLink
                              href={searchQuery ? `?q=${searchQuery}&page=${n}` : `?page=${n}`}
                              isActive={(n as number) === page}
                              className={(n as number) === page ? "bg-primary text-primary-foreground rounded-full" : ""}
                            >
                              {n as number}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}
                    </div>
                    <div className="flex sm:hidden">
                      {mobile.map((n, idx) =>
                        n === "ellipsis" ? (
                          <PaginationItem key={`b-me-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={`b-mn-${idx}-${n}`}>
                            <PaginationLink
                              href={searchQuery ? `?q=${searchQuery}&page=${n}` : `?page=${n}`}
                              isActive={(n as number) === page}
                              className={(n as number) === page ? "bg-primary text-primary-foreground rounded-full" : ""}
                            >
                              {n as number}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}
                    </div>
                    <PaginationItem>
                      {page >= pages ? (
                        <span className="flex h-9 w-9 items-center justify-center text-muted-foreground opacity-50 cursor-not-allowed" aria-disabled="true">
                          <span className="sr-only">Next</span>
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><path d="M6.1584 3.13523C6.35985 2.94621 6.67627 2.95603 6.86529 3.15749L10.6153 7.15749C10.7956 7.34982 10.7956 7.6491 10.6153 7.84143L6.86529 11.8414C6.67627 12.0429 6.35985 12.0527 6.1584 11.8637C5.95694 11.6747 5.94713 11.3583 6.13615 11.1568L9.56556 7.49946L6.13615 3.84211C5.94713 3.64066 5.95694 3.32424 6.1584 3.13523Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </span>
                      ) : (
                        <PaginationNext
                          href={searchQuery ? `?q=${searchQuery}&page=${page + 1}` : `?page=${page + 1}`}
                        />
                      )}
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )
          })()}
        </TabsContent>
      </Tabs>

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
