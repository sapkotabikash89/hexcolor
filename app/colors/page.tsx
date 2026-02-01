import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { ColorLibrary } from "@/components/color-library"
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema } from "@/components/structured-data"
import data from "@/lib/color-meaning.json"

import { ShareButtons } from "@/components/share-buttons"

export const metadata: Metadata = {
  title: "Color Library - Browse Thousands of Colors | HexColorMeans",
  description:
    "Explore our comprehensive color library with thousands of colors organized by category. Find the perfect color with hex codes, RGB values, and color names.",
  keywords: ["color library", "color names", "hex colors", "color palette", "color collection"],
  alternates: {
    canonical: "https://hexcolormeans.com/colors",
  },
  openGraph: {
    title: "Color Library - Browse Thousands of Colors | HexColorMeans",
    description:
      "Explore our comprehensive color library with thousands of colors organized by category. Find the perfect color with hex codes, RGB values, and color names.",
    url: "https://hexcolormeans.com/colors",
    siteName: "HexColorMeans",
    type: "website",
    images: [
      {
        url: "https://hexcolormeans.com/color%20library-list%20of%20all%20colors.webp",
        width: 1200,
        height: 630,
        alt: "Color Library preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Library - Browse Thousands of Colors | HexColorMeans",
    description:
      "Explore our comprehensive color library with thousands of colors organized by category. Find the perfect color with hex codes, RGB values, and color names.",
    images: ["https://hexcolormeans.com/color%20library-list%20of%20all%20colors.webp"],
  },
}

export default function ColorsPage() {
  const baseUrl = "https://hexcolormeans.com"
  const allColors = (() => {
    const entries: Array<{ name: string; hex: string }> = []
    for (const key of Object.keys(data as any)) {
      const item = (data as any)[key]
      const hex = String(item?.hex || `#${key}`).toUpperCase()
      const name = String(item?.name || `#${key}`)
      entries.push({ name, hex })
    }
    return entries
  })()
  const q = "" // For static export, search is not supported
  const filtered = q
    ? allColors.filter((c) => c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q))
    : allColors
  const initialPageItems = filtered.slice(0, 100).map((c) => ({
    name: c.name,
    url: `${baseUrl}/colors/${c.hex.replace("#", "").toLowerCase()}`,
  }))
  return (
    <div className="flex flex-col min-h-screen">
      <CollectionPageSchema name="Color Library" url={`${baseUrl}/colors`} />
      <ItemListSchema items={initialPageItems} />
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://hexcolormeans.com" },
        { name: "Color Library", item: "https://hexcolormeans.com/colors" }
      ]} />
      <Header />

      <section className="bg-muted/30 py-12 px-4 border-b">
        <div className="w-full max-w-[1280px] mx-auto">
          <BreadcrumbNav items={[{ label: "Color Library", href: "/colors" }]} />
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">Color Library</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Browse a growing collection of colors organized by category, complete with clear names and precise hex codes.
            </p>
          </div>
        </div>
      </section>

      <main className="w-full max-w-[1280px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <article id="content" className="main-content grow-content flex-1" itemProp="articleBody">
            <div className="space-y-12">
              <ColorLibrary initialQuery="" />

              <div className="mt-8 pt-8 border-t flex flex-col items-center gap-6">
                <p className="text-center max-w-2xl text-muted-foreground">
                  Access verified Hex, RGB, and HSL data across thousands of unique color entries. Whether you are searching for the precise value of a specific shade or exploring categories for palette inspiration, the HexColorMeans Color Library is engineered for rapid information retrieval and technical accuracy.
                </p>
                <p className="text-muted-foreground font-medium italic text-center">
                  Empowering your creative workflow with data-driven color decisions.
                </p>
                <ShareButtons title="Explore the HexColorMeans Digital Color Compendium" />
              </div>
            </div>
          </article>
          <aside className="hidden xl:block w-[380px] shrink-0">
            <ColorSidebar color="#E0115F" />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
