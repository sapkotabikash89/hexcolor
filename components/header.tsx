"use client"

import type React from "react"
import { useEffect } from "react"
import Link from "next/link"
import NextImage from "next/image"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Palette, Droplet, Contrast, Eye, ImageIcon, CircleDot, Search, Menu, Pipette, Grid, Disc, LayoutGrid, Library, Layers, BookOpen, Mail, ShieldCheck } from "lucide-react"
import { CustomColorPicker } from "@/components/custom-color-picker"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { getColorPageLink } from "@/lib/color-linking-utils"
import { performStaticSearch, performSimpleSearch } from "@/lib/static-search-utils"
import blogPostsData from "@/lib/blog-posts-data.json"

export function Header() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")
  const [pickerColor, setPickerColor] = useState("#E0115F")
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [tempColor, setTempColor] = useState("#E0115F")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Use a custom hook to detect outside clicks for the search bar
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleColorUpdate = (e: CustomEvent) => {
      setPickerColor(e.detail.color)
    }
    window.addEventListener("colorUpdate", handleColorUpdate as EventListener)
    return () => window.removeEventListener("colorUpdate", handleColorUpdate as EventListener)
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    // Use static search logic with bundled blog post data
    const blogPosts = Array.isArray(blogPostsData) ? blogPostsData : [];
    const searchResult = blogPosts.length > 0
      ? performStaticSearch(searchValue, blogPosts)
      : performSimpleSearch(searchValue)

    if (searchResult) {
      // Use Next.js router for navigation to avoid Cloudflare redirects
      router.push(searchResult.replace('https://hexcolormeans.com', ''))
    } else {
      // Fallback for empty/invalid input - do nothing
      return
    }
  }


  const handleColorChange = (color: string) => {
    setTempColor(color)
  }

  const handleColorApply = (color?: string) => {
    const selectedColor = typeof color === "string" ? color : tempColor
    setPickerColor(selectedColor)
    const cleanHex = selectedColor.replace("#", "")
    setShowCustomPicker(false)

    // Dispatch color update event for sidebar
    window.dispatchEvent(new CustomEvent("colorUpdate", { detail: { color: selectedColor } }))

    // Navigate to the appropriate color page using centralized linking logic
    // Use Next.js router to avoid Cloudflare redirects
    const link = getColorPageLink(selectedColor)
    const relativeLink = link.replace('https://hexcolormeans.com', '')
    router.push(relativeLink)
  }

  const blogPosts = Array.isArray(blogPostsData) ? blogPostsData : []
  const categoryMap = new Map<string, { name: string; slug: string }>()
  blogPosts.forEach((post: any) => {
    ; (post.categories?.nodes || []).forEach((c: any) => {
      if (c?.slug && c?.name && !categoryMap.has(c.slug)) {
        categoryMap.set(c.slug, { name: c.name, slug: c.slug })
      }
    })
  })
  const categories = Array.from(categoryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  )

  const getCategoryHref = (slug: string) => {
    if (
      slug === "color-meaning" ||
      slug === "shades-meaning" ||
      slug === "spiritual-colors"
    ) {
      return `/category/${slug}/`
    }
    return `/category/${slug}/`
  }

  const getCategoryIcon = (slug: string) => {
    if (slug === "color-meaning") return BookOpen
    if (slug === "shades-meaning") return Layers
    if (slug === "spiritual-colors") return CircleDot
    return LayoutGrid
  }

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border bg-background">
      <div className="w-full max-w-[1300px] mx-auto flex justify-between h-16 items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <NextImage src="/logo.webp" alt="HexColorMeans logo" width={120} height={32} className="h-8 w-auto" priority fetchPriority="high" />
          <span className="hidden sm:inline-block">HexColorMeans</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-4 flex-1 max-w-[500px] xl:max-w-none">
          {/* Tools submenu */}
          <div className="relative group">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="sm" className="gap-2" aria-label="Tools">
                  <Link href="/color-wheel/">
                    <Grid className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden lg:inline">Tools</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="lg:hidden">
                <p>Tools</p>
              </TooltipContent>
            </Tooltip>
            <div className="absolute left-0 mt-2 w-[240px] bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200">
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start gap-2 h-auto py-2 whitespace-normal text-left"
                aria-label="Color Wheel"
              >
                <Link href="/color-wheel/">
                  <Disc className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Color Wheel
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start gap-2 h-auto py-2 whitespace-normal text-left"
                aria-label="Color Picker"
              >
                <Link href="/color-picker/">
                  <Pipette className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Color Picker
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start gap-2 h-auto py-2 whitespace-normal text-left"
                aria-label="Contrast Checker"
              >
                <Link href="/contrast-checker/">
                  <Contrast className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Contrast Checker
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start gap-2 h-auto py-2 whitespace-normal text-left"
                aria-label="Color Blindness Simulator"
              >
                <Link href="/color-blindness-simulator/">
                  <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Color Blindness Simulator
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start gap-2 h-auto py-2 whitespace-normal text-left"
                aria-label="Image Color Picker"
              >
                <Link href="/image-color-picker/">
                  <ImageIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Image Color Picker
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start gap-2 h-auto py-2 whitespace-normal text-left"
                aria-label="Palette from Image"
              >
                <Link href="/palette-from-image/">
                  <LayoutGrid className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Palette from Image
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start gap-2 h-auto py-2 whitespace-normal text-left"
                aria-label="Screen Color Picker"
              >
                <Link href="/screen-color-picker/">
                  <Pipette className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Screen Color Picker
                </Link>
              </Button>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="ghost" size="sm" className="gap-2" aria-label="Color Library">
                <Link href="/colors/">
                  <Library className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden lg:inline">Color Library</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="lg:hidden">
              <p>Color Library</p>
            </TooltipContent>
          </Tooltip>
          <div className="relative group">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="sm" className="gap-2" aria-label="Blog">
                  <Link href="/blog/">
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden lg:inline">Blog</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="lg:hidden">
                <p>Blog</p>
              </TooltipContent>
            </Tooltip>
            {categories.length > 0 && (
              <div className="absolute left-0 mt-2 w-[260px] bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start gap-2 h-auto py-2 whitespace-normal text-left"
                  aria-label="All Blog Posts"
                >
                  <Link href="/blog/">
                    <LayoutGrid className="w-4 h-4 shrink-0" aria-hidden="true" />
                    All Blog Posts
                  </Link>
                </Button>
                {categories.map((cat) => {
                  const Icon = getCategoryIcon(cat.slug)
                  return (
                    <Button
                      key={cat.slug}
                      asChild
                      variant="ghost"
                      className="w-full justify-start gap-2 h-auto py-2 whitespace-normal text-left"
                      aria-label={cat.name}
                    >
                      <Link href={getCategoryHref(cat.slug)}>
                        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                        {cat.name}
                      </Link>
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="ghost" size="sm" className="gap-2" aria-label="Contact">
                <Link href="/contact/">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden lg:inline">Contact</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="lg:hidden">
              <p>Contact</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="ghost" size="sm" className="gap-2" aria-hidden="true" aria-label="Privacy">
                <Link href="/privacy-policy/">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden lg:inline">Privacy</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="lg:hidden">
              <p>Privacy</p>
            </TooltipContent>
          </Tooltip>
        </nav>

        {/* Color Picker & Search */}
        <div className="flex items-center gap-2 flex-1 md:flex-none justify-end md:justify-start">
          <div className="relative">
            <button
              onClick={() => setShowCustomPicker(true)}
              className="w-10 h-10 md:w-9 md:h-9 rounded-md border-2 border-border cursor-pointer flex-shrink-0 flex items-center justify-center"
              style={{ backgroundColor: pickerColor }}
              title="Pick a color"
              aria-label="Pick a color"
            >
              <Pipette className="w-5 h-5 text-white mix-blend-difference" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center flex-1 md:flex-none md:w-auto">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block md:w-56 lg:w-48 xl:w-64">
              <Input
                type="text"
                placeholder="Search color..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pr-10"
              />
              <Button type="submit" size="sm" variant="ghost" className="absolute right-0 top-0 h-full px-3" aria-label="Search">
                <Search className="w-4 h-4" />
              </Button>
            </form>

            {/* Mobile Search - Always Visible */}
            <form onSubmit={handleSearch} className="relative md:hidden w-full flex-1">
              <Input
                type="text"
                placeholder="Search color..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pr-10 w-full"
              />
              <Button type="submit" size="sm" variant="ghost" className="absolute right-0 top-0 h-full px-3" aria-label="Search">
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Mobile Menu Icon */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 border-2 border-black rounded-md flex-shrink-0 ml-2" aria-label="Open menu">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <Link href="/color-wheel/" onClick={() => setIsMobileMenuOpen(false)}>
                    <Disc className="w-4 h-4" />
                    Color Wheel
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <Link href="/color-picker/" onClick={() => setIsMobileMenuOpen(false)}>
                    <Pipette className="w-4 h-4" />
                    Color Picker
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <Link href="/contrast-checker/" onClick={() => setIsMobileMenuOpen(false)}>
                    <Contrast className="w-4 h-4" />
                    Contrast Checker
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <Link href="/color-blindness-simulator/" onClick={() => setIsMobileMenuOpen(false)}>
                    <Eye className="w-4 h-4" />
                    Color Blindness Simulator
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <Link href="/image-color-picker/" onClick={() => setIsMobileMenuOpen(false)}>
                    <ImageIcon className="w-4 h-4" />
                    Image Color Picker
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <Link href="/palette-from-image/" onClick={() => setIsMobileMenuOpen(false)}>
                    <LayoutGrid className="w-4 h-4" />
                    Palette from Image
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <Link href="/screen-color-picker/" onClick={() => setIsMobileMenuOpen(false)}>
                    <Pipette className="w-4 h-4" />
                    Screen Color Picker
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <Link href="/colors/" onClick={() => setIsMobileMenuOpen(false)}>
                    <Library className="w-4 h-4" />
                    Color Library
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <Link href="/blog/" onClick={() => setIsMobileMenuOpen(false)}>
                    <BookOpen className="w-4 h-4" />
                    Blog
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <Link href="/contact/" onClick={() => setIsMobileMenuOpen(false)}>
                    <Mail className="w-4 h-4" />
                    Contact
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <Link href="/privacy-policy/" onClick={() => setIsMobileMenuOpen(false)}>
                    <ShieldCheck className="w-4 h-4" />
                    Privacy
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Custom Color Picker Dialog */}
      {showCustomPicker && (
        <CustomColorPicker
          value={pickerColor}
          onChange={handleColorChange}
          onApply={handleColorApply}
          onClose={() => setShowCustomPicker(false)}
        />
      )}
    </header>
  )
}
