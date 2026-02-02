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

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border bg-background">
      <div className="w-full max-w-[1300px] mx-auto flex justify-between h-16 items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <NextImage src="/logo.webp" alt="HexColorMeans logo" width={120} height={32} className="h-8 w-auto" priority />
          <span className="hidden sm:inline-block">HexColorMeans</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center justify-between gap-1 flex-1 max-w-[500px] xl:max-w-none">
          {/* Tools submenu */}
          <div className="relative group">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/color-wheel">
                  <Button variant="ghost" size="sm" className="gap-2" aria-label="Tools">
                    <Grid className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden xl:inline">Tools</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="xl:hidden">
                <p>Tools</p>
              </TooltipContent>
            </Tooltip>
            <div className="absolute left-0 mt-2 w-[240px] bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200">
              <Link href="/color-wheel">
                <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-2 whitespace-normal text-left" aria-label="Color Wheel">
                  <Disc className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Color Wheel
                </Button>
              </Link>
              <Link href="/color-picker">
                <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-2 whitespace-normal text-left" aria-label="Color Picker">
                  <Pipette className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Color Picker
                </Button>
              </Link>
              <Link href="/contrast-checker">
                <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-2 whitespace-normal text-left" aria-label="Contrast Checker">
                  <Contrast className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Contrast Checker
                </Button>
              </Link>
              <Link href="/color-blindness-simulator">
                <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-2 whitespace-normal text-left" aria-label="Color Blindness Simulator">
                  <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Color Blindness Simulator
                </Button>
              </Link>
              <Link href="/image-color-picker">
                <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-2 whitespace-normal text-left" aria-label="Image Color Picker">
                  <ImageIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Image Color Picker
                </Button>
              </Link>
              <Link href="/palette-from-image">
                <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-2 whitespace-normal text-left" aria-label="Palette from Image">
                  <LayoutGrid className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Palette from Image
                </Button>
              </Link>
              <Link href="/screen-color-picker">
                <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-2 whitespace-normal text-left" aria-label="Screen Color Picker">
                  <Pipette className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Screen Color Picker
                </Button>
              </Link>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/colors">
                <Button variant="ghost" size="sm" className="gap-2" aria-label="Color Library">
                  <Library className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden xl:inline">Color Library</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top" className="xl:hidden">
              <p>Color Library</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/category/shades-meaning">
                <Button variant="ghost" size="sm" className="gap-2" aria-label="Shades">
                  <Layers className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden xl:inline">Shades</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top" className="xl:hidden">
              <p>Shades</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/category/color-meaning">
                <Button variant="ghost" size="sm" className="gap-2" aria-label="Color Meaning">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden xl:inline">Color Meaning</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="xl:hidden">
              <p>Color Meaning</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/contact">
                <Button variant="ghost" size="sm" className="gap-2" aria-label="Contact">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden xl:inline">Contact</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="xl:hidden">
              <p>Contact</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/privacy-policy">
                <Button variant="ghost" size="sm" className="gap-2" aria-hidden="true" aria-label="Privacy">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden xl:inline">Privacy</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="xl:hidden">
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
            <form onSubmit={handleSearch} className="relative hidden md:block w-32 lg:w-48 xl:w-64">
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
                <Link href="/color-wheel" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Disc className="w-4 h-4" />
                    Color Wheel
                  </Button>
                </Link>
                <Link href="/color-picker" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Pipette className="w-4 h-4" />
                    Color Picker
                  </Button>
                </Link>
                <Link href="/contrast-checker" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Contrast className="w-4 h-4" />
                    Contrast Checker
                  </Button>
                </Link>
                <Link href="/color-blindness-simulator" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Eye className="w-4 h-4" />
                    Color Blindness Simulator
                  </Button>
                </Link>
                <Link href="/image-color-picker" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Image Color Picker
                  </Button>
                </Link>
                <Link href="/palette-from-image" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <LayoutGrid className="w-4 h-4" />
                    Palette from Image
                  </Button>
                </Link>
                <Link href="/screen-color-picker" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Pipette className="w-4 h-4" />
                    Screen Color Picker
                  </Button>
                </Link>
                <Link href="/colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Library className="w-4 h-4" />
                    Color Library
                  </Button>
                </Link>
                <Link href="/category/shades-meaning" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Layers className="w-4 h-4" />
                    Shades
                  </Button>
                </Link>
                <Link href="/category/color-meaning" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <BookOpen className="w-4 h-4" />
                    Color Meaning
                  </Button>
                </Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Mail className="w-4 h-4" />
                    Contact
                  </Button>
                </Link>
                <Link href="/privacy-policy" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Privacy
                  </Button>
                </Link>
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
