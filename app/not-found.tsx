"use client"
import Head from "next/head"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ColorPageContent } from "@/components/color-page-content"
import { ColorSidebar } from "@/components/sidebar"
import { TableOfContents } from "@/components/table-of-contents"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { CopyButton } from "@/components/copy-button"
import {
  normalizeHex,
  isValidHex,
  getContrastColor,
  hexToRgb,
  rgbToHsl
} from "@/lib/color-utils"
import { generateFAQs } from "@/lib/category-utils"

export default function NotFound() {
  const pathname = usePathname()
  const [colorHex, setColorHex] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!pathname) {
      setIsLoading(false)
      return
    }

    // Check if we're on a /colors/ path
    const hexMatch = pathname.match(/^\/colors\/([0-9a-fA-F]{3,6})\/?$/i)

    if (hexMatch) {
      const hex = hexMatch[1]
      // Validate hex
      const normalized = normalizeHex(hex)
      if (isValidHex(normalized)) {
        // If it has uppercase in URL, standard Next.js might have 404'd it if generated paths are lowercase
        // But here we just want to render it.
        // We prefer lowercase URLs, so if it has uppercase, we might want to replace URL without reload?
        // But for a 404 page, just rendering content is priority.
        setColorHex(normalized)
      }
    }
    setIsLoading(false)
  }, [pathname])

  if (isLoading) {
    return <div className="min-h-screen bg-background" />
  }

  // Render Color Page content for valid hex codes
  if (colorHex) {
    const contrastColor = getContrastColor(colorHex)
    const rgb = hexToRgb(colorHex)
    const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null

    // Generate FAQs dynamically
    const faqs = rgb && hsl ? generateFAQs(colorHex, rgb, hsl) : []

    const displayLabel = colorHex

    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />

        {/* Inject SEO metadata for unknown color pages */}
        <title>{`${colorHex} Color Information & Tools | HexColorMeans`}</title>
        <meta name="robots" content="noindex, follow" />
        <meta name="description" content={`Technical specifications for ${colorHex}. Access calibrated color conversions (RGB, HSL, CMYK), harmony maps, and accessibility validation metrics.`} />
        <link rel="canonical" href={`https://hexcolormeans.com/colors/${colorHex.replace("#", "").toLowerCase()}`} />
        {/* Dynamic Color Hero */}
        <section
          className="py-12 px-4 transition-colors"
          style={{
            backgroundColor: colorHex,
            color: contrastColor,
          }}
        >
          <div className="w-full max-w-[1300px] mx-auto overflow-hidden">
            <BreadcrumbNav
              items={[
                { label: "Color Names", href: "/colors" },
                { label: colorHex, href: `/colors/${colorHex.replace("#", "").toLowerCase()}` },
              ]}
            />
            <div className="text-center space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
                {displayLabel} Color Meaning, Codes and Information
              </h1>

              <p className="max-w-3xl mx-auto text-lg md:text-xl opacity-90 leading-relaxed text-pretty">
                A complete guide to {displayLabel} covering color values, harmonies, shades, meaning, and practical uses across design, branding, and everyday visuals.
              </p>
              <div className="max-w-4xl mx-auto">
                <div className="font-mono text-xs md:text-sm flex flex-wrap justify-center gap-4">
                  <CopyButton showIcon={false} variant="ghost" size="sm" className="p-0 h-auto" label={`HEX: ${colorHex}`} value={colorHex} />
                  {rgb && (
                    <CopyButton
                      showIcon={false}
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto"
                      label={`RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                      value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                    />
                  )}
                  {hsl && (
                    <CopyButton
                      showIcon={false}
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto"
                      label={`HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                      value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile-only horizontal navigation strip */}
        <div className="xl:hidden z-40">
          <TableOfContents currentHex={colorHex} mobileOnly />
        </div>

        {/* Main Content */}
        <main className="w-full max-w-[1300px] mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left Sidebar Table of Contents - Sticky (Visible on Desktop/Large Tablet) */}
            <aside className="hidden xl:block w-52 sticky top-28 self-start shrink-0">
              <TableOfContents currentHex={colorHex} />
            </aside>

            {/* Center Article Content - Flexible width */}
            <article className="flex-1 min-w-0 w-full">
              <ColorPageContent key={colorHex} hex={colorHex} faqs={faqs} />
            </article>

            {/* Right Sidebar - Hidden below lg to prioritize content width */}
            <aside className="hidden lg:block w-[340px] shrink-0 sticky top-24 self-start">
              <ColorSidebar color={colorHex} />
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  // Standard 404
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center space-y-6 max-w-2xl">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-4xl font-bold">Page Not Found</h2>
          <p className="text-lg text-muted-foreground">
            The color or page you're looking for doesn't exist. Try searching for a different color or explore our color
            library.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/">
              <Button size="lg">Go Home</Button>
            </Link>
            <Link href="/colors">
              <Button size="lg" variant="outline" className="bg-transparent">
                Browse Colors
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
