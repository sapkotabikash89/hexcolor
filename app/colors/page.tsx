import { Suspense } from "react"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { ColorLibrary } from "@/components/color-library"
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/structured-data"

import { ShareButtons } from "@/components/share-buttons"

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Color Library: 1200+ Color Names, Codes and Shades | HexColorMeans",
  description:
    "Explore our Color Library featuring 1,200+ color names with verified Hex, RGB, and CMYK codes. Quickly find exact shades or browse categories for palette inspiration, all organized for speed, clarity, and technical accuracy.",
  keywords: ["color library", "color names", "hex colors", "color palette", "color collection"],
  alternates: {
    canonical: "https://hexcolormeans.com/colors/",
  },
  openGraph: {
    title: "Color Library: 1200+ Color Names, Codes and Shades | HexColorMeans",
    description:
      "Explore our Color Library featuring 1,200+ color names with verified Hex, RGB, and CMYK codes. Quickly find exact shades or browse categories for palette inspiration, all organized for speed, clarity, and technical accuracy.",
    url: "https://hexcolormeans.com/colors/",
    siteName: "HexColorMeans",
    type: "website",
    images: [
      {
        url: "https://hexcolormeans.com/color-library-hexcolormeans.webp",
        width: 1200,
        height: 630,
        alt: "Color Library preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Library: 1200+ Color Names, Codes and Shades | HexColorMeans",
    description:
      "Explore our Color Library featuring 1,200+ color names with verified Hex, RGB, and CMYK codes. Quickly find exact shades or browse categories for palette inspiration, all organized for speed, clarity, and technical accuracy.",
    images: ["https://hexcolormeans.com/color-library-hexcolormeans.webp"],
  },
}

export default function ColorsPage() {
  const baseUrl = "https://hexcolormeans.com"
  return (
    <div className="flex flex-col min-h-screen">
      <CollectionPageSchema name="Color Library" url={`${baseUrl}/colors/`} />
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://hexcolormeans.com/" },
        { name: "Color Library", item: "https://hexcolormeans.com/colors/" }
      ]} />
      <Header />

      <section className="bg-muted/30 py-12 px-4 border-b">
        <div className="w-full max-w-[1300px] mx-auto">
          <BreadcrumbNav items={[{ label: "Color Library", href: "/colors/" }]} />
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">Color Library</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Explore our Color Library featuring 1,200+ color names with verified Hex, RGB, and CMYK codes. Quickly find exact shades or browse categories for palette inspiration, all organized for speed, clarity, and technical accuracy.
            </p>
          </div>
        </div>
      </section>

      <main className="w-full max-w-[1300px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <article id="content" className="main-content grow-content flex-1">
            <h2 className="sr-only">Color library results and tools</h2>
            <div className="space-y-12">
              <Suspense fallback={<div className="p-12 text-center">Loading color library...</div>}>
                <ColorLibrary initialCategory="all" page={1} />
              </Suspense>

              <div className="mt-8 pt-8 border-t flex flex-col items-center gap-6">
                <ShareButtons title="Explore the HexColorMeans Digital Color Compendium" />
              </div>
            </div>
          </article>
          <aside className="hidden lg:block w-[340px] shrink-0">
            <ColorSidebar color="#E0115F" />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
