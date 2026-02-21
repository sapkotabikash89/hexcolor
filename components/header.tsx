import type React from "react"
import Link from "next/link"
import NextImage from "next/image"
import { Button } from "@/components/ui/button"
import { Palette, Droplet, Contrast, Eye, ImageIcon, CircleDot, Search, Menu, Pipette, Grid, Disc, LayoutGrid, Library, Layers, BookOpen, Mail, ShieldCheck } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import blogPostsData from "@/lib/blog-posts-data.json"
import { SearchBar } from "./search-bar.client"
import { MobileMenu } from "./mobile-menu.client"
import { ColorPickerTrigger } from "./color-picker-trigger.client"

export function Header() {
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

        <div className="flex items-center gap-2 flex-1 md:flex-none justify-end md:justify-start">
          <ColorPickerTrigger />
          <SearchBar />
          <MobileMenu />
        </div>
      </div>

    </header>
  )
}
