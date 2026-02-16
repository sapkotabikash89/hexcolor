import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ColorSidebar } from "@/components/sidebar"
import { Hero } from "@/components/home/hero"
import { ColorLibraryPreview } from "@/components/home/color-library-preview"
import { AboutSection } from "@/components/home/about-section"
import { LatestPosts } from "@/components/home/latest-posts"
import Link from "next/link"
import nextDynamic from "next/dynamic"

const CompactAdvancedColorPicker = nextDynamic(() => import("@/components/home/compact-advanced-color-picker").then(mod => mod.CompactAdvancedColorPicker), {
  loading: () => <div className="h-[400px] w-full bg-muted/20 animate-pulse rounded-lg" />
})
const CompactImageColorPicker = nextDynamic(() => import("@/components/home/compact-image-color-picker").then(mod => mod.CompactImageColorPicker), {
  loading: () => <div className="h-[400px] w-full bg-muted/20 animate-pulse rounded-lg" />
})
const CompactColorWheel = nextDynamic(() => import("@/components/home/compact-color-wheel").then(mod => mod.CompactColorWheel), {
  loading: () => <div className="h-[400px] w-full bg-muted/20 animate-pulse rounded-lg" />
})
import {
  WebsiteSchema,
  OrganizationSchema,
} from "@/components/structured-data"
import { getAllPosts } from "@/lib/wordpress"

export const dynamic = "force-static";

// Static metadata for SEO
export const metadata: Metadata = {
  title: "HexColorMeans: Where Every Color Has Meaning - Professional Color Tools & Information",
  description: "Turn ideas into visuals with confidence. Access rich color details, meanings, psychology, symbolism, uses, precise conversions, and powerful tools made for creative minds.",
  keywords: ["color picker", "color converter", "color meanings", "color harmonies", "design tools", "color psychology"],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://hexcolormeans.com",
  },
  openGraph: {
    title: "HexColorMeans: Where Every Color Has Meaning",
    description: "Professional color tools and information for designers and developers",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://hexcolormeans.com",
    siteName: "HexColorMeans",
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://hexcolormeans.com"}/opengraph-image.webp`,
        width: 1200,
        height: 630,
        alt: "HexColorMeans - Professional Color Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HexColorMeans: Where Every Color Has Meaning",
    description: "Professional color tools and information for designers and developers",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || "https://hexcolormeans.com"}/opengraph-image.webp`],
  },
}

// Static props for server-side generation
export async function generateStaticParams() {
  return [{}]
}

// Interactive homepage
export default async function HomePage() {
  const latestPosts = await getAllPosts(5);

  return (
    <div className="flex flex-col min-h-screen">
      <WebsiteSchema />
      <Header />

      {/* Hero Section with Animation */}
      <Hero />

      {/* Main Content */}
      <main className="w-full max-w-[1300px] mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Content Area */}
          <article id="content" className="main-content grow-content flex-1 space-y-12">
            {/* Live Color Picker Tool */}
            <ToolSection
              title="Interactive Color Picker"
              description="Select a color and instantly view its codes, meaning, and related details."
            >
              <CompactAdvancedColorPicker />
            </ToolSection>

            {/* Live Image Color Picker Tool */}
            <ToolSection
              title="Image Color Picker"
              description="Upload an image and capture precise hex color values from any pixel with ease. Your data stays local"
            >
              <CompactImageColorPicker />
            </ToolSection>

            {/* Live Color Wheel Tool */}
            <ToolSection
              title="Harmonic Color Wheel"
              description="Generate scientifically accurate color schemes based on color theory principles"
            >
              <CompactColorWheel />
            </ToolSection>

            {/* Color Library Preview */}
            <ToolSection
              title="Browse Color Library"
              description="Browse our extensive database of colors, meanings, and standardized values"
            >
              <ColorLibraryPreview />
            </ToolSection>

            {/* About HexColorMeans */}
            <ToolSection
              title="About HexColorMeans"
              description="A reliable color reference for creative and technical work"
            >
              <AboutSection />
            </ToolSection>
          </article>

          {/* Sidebar */}
          <ColorSidebar color="#E0115F" />
        </div>
      </main>

      {/* Latest Posts - Full Width */}
      <LatestPosts posts={latestPosts} />

      <Footer />
    </div>
  )
}

// Tool Section Wrapper Component
function ToolSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
      </div>

      {children}
    </div>
  )
}