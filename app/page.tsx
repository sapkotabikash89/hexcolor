import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ColorSidebar } from "@/components/sidebar"
import { GlobalLayout } from "@/components/layout/global-layout"
import { Hero } from "@/components/home/hero"
import { AboutSection } from "@/components/home/about-section"
import { LatestPosts } from "@/components/home/latest-posts"
import Link from "next/link"
import {
  Palette,
  Image as ImageIcon,
  Circle,
  BookOpen,
  EyeOff,
  Contrast,
  MonitorSmartphone,
} from "lucide-react"
import {
  WebsiteSchema,
  OrganizationSchema,
} from "@/components/structured-data"
import { getAllPosts } from "@/lib/wordpress"

export const dynamic = "force-static";

// Static metadata for SEO
const siteBase = process.env.NEXT_PUBLIC_SITE_URL || "https://hexcolormeans.com"
const canonicalUrl = siteBase.endsWith("/") ? siteBase : `${siteBase}/`

export const metadata: Metadata = {
  title: "HexColorMeans: Where Every Color Has Meaning - Professional Color Tools & Information",
  description: "Turn ideas into visuals with confidence. Access rich color details, meanings, psychology, symbolism, uses, precise conversions, and powerful tools made for creative minds.",
  keywords: ["color picker", "color converter", "color meanings", "color harmonies", "design tools", "color psychology"],
  alternates: {
    canonical: "https://hexcolormeans.com/",
  },
  openGraph: {
    title: "HexColorMeans: Where Every Color Has Meaning",
    description: "Professional color tools and information for designers and developers",
    url: canonicalUrl,
    siteName: "HexColorMeans",
    type: "website",
    images: [
      {
        url: `${canonicalUrl}hexcolormeans-where-every-color-has-meaning.webp`,
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
    images: [`${canonicalUrl}hexcolormeans-where-every-color-has-meaning.webp`],
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

      <GlobalLayout
        rightSidebar={<ColorSidebar color="#E0115F" />}
      >
        {/* Color Picker Link */}
        <ToolSection
          title="Interactive Color Picker"
          description="Select a color and instantly view its codes, meaning, and related details."
        >
          {/* ... tool section contents ... */}
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-stretch rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-muted/40 px-4 py-4 sm:px-6 sm:py-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold text-primary">
                <Palette className="w-4 h-4" />
                Live color selection tool
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Open the full color picker experience with advanced controls, real-time previews, and precise color codes.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Hex, RGB, HSL conversions
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Saved swatches & history
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Harmony presets
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Accessibility-friendly contrast data
                </span>
              </div>
              <Link
                href="/color-picker/"
                className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
              >
                Go to Color Picker
                <span className="ml-1 text-base">→</span>
              </Link>
            </div>
            <div className="relative h-28 sm:h-32 md:h-36 rounded-xl border bg-background overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#FF6B6B] via-[#FFD166] to-[#4ECDC4]" />
                <div className="hidden sm:flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="h-4 w-10 rounded bg-muted" />
                    <div className="h-4 w-10 rounded bg-muted" />
                    <div className="h-4 w-10 rounded bg-muted" />
                  </div>
                  <div className="h-5 w-24 rounded-full bg-primary/80" />
                </div>
              </div>
            </div>
          </div>
        </ToolSection>

        {/* Image Color Picker Link */}
        <ToolSection
          title="Image Color Picker"
          description="Upload an image and capture precise hex color values from any pixel with ease. Your data stays local"
        >
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-stretch rounded-2xl border bg-gradient-to-br from-sky-500/5 via-background to-muted/40 px-4 py-4 sm:px-6 sm:py-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400">
                <ImageIcon className="w-4 h-4" />
                Pick colors from any image
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Upload a photo, screenshot, or design mockup and grab exact hex values from individual pixels.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Precise pixel sampling
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Local processing, no uploads stored
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Multi-color extraction
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Export-ready color palettes
                </span>
              </div>
              <Link
                href="/image-color-picker/"
                className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
              >
                Go to Image Color Picker
                <span className="ml-1 text-base">→</span>
              </Link>
            </div>
            <div className="relative h-28 sm:h-32 md:h-36 rounded-xl border bg-background overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute inset-3 rounded-lg bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 opacity-80" />
                <div className="absolute inset-3 flex items-center justify-center">
                  <div className="h-16 w-24 rounded-lg border border-white/20 bg-gradient-to-br from-[#ff9ff3] via-[#48dbfb] to-[#1dd1a1]" />
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-background/80 px-2 py-1 text-[10px] font-medium text-muted-foreground">
                  <span className="h-3 w-3 rounded-full bg-[#1dd1a1]" />
                  #1DD1A1
                </div>
              </div>
            </div>
          </div>
        </ToolSection>

        {/* Color Wheel Link */}
        <ToolSection
          title="Harmonic Color Wheel"
          description="Generate scientifically accurate color schemes based on color theory principles"
        >
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-stretch rounded-2xl border bg-gradient-to-br from-violet-500/5 via-background to-muted/40 px-4 py-4 sm:px-6 sm:py-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold text-violet-600 dark:text-violet-300">
                <Circle className="w-4 h-4" />
                Theory-backed color harmonies
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Visualize relationships between hues and build balanced palettes using classic harmony rules.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Analogous, triadic, complementary modes
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Adjustable rotation and angle
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Designer-friendly visual preview
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Ready-to-use hex codes
                </span>
              </div>
              <Link
                href="/color-wheel/"
                className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
              >
                Go to Color Wheel
                <span className="ml-1 text-base">→</span>
              </Link>
            </div>
            <div className="relative h-28 sm:h-32 md:h-36 rounded-xl border bg-background overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full border-[6px] border-transparent border-t-[#ff7675] border-r-[#74b9ff] border-b-[#55efc4] border-l-[#ffeaa7]" />
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 text-[10px] text-muted-foreground">
                <span className="h-3 w-3 rounded-full bg-[#ff7675]" />
                <span className="h-3 w-3 rounded-full bg-[#74b9ff]" />
                <span className="h-3 w-3 rounded-full bg-[#55efc4]" />
              </div>
            </div>
          </div>
        </ToolSection>

        {/* Color Library Link */}
        <ToolSection
          title="Browse Color Library"
          description="Browse our extensive database of colors, meanings, and standardized values"
        >
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-stretch rounded-2xl border bg-gradient-to-br from-emerald-500/5 via-background to-muted/40 px-4 py-4 sm:px-6 sm:py-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                <BookOpen className="w-4 h-4" />
                Explore named colors and meanings
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Browse a curated library of color names with standardized codes, meanings, and usage contexts.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  1,200+ named colors
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Hex, RGB, CMYK values
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Meaning and symbolism notes
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Quick filters and browsing
                </span>
              </div>
              <Link
                href="/colors/"
                className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
              >
                Go to Color Library
                <span className="ml-1 text-base">→</span>
              </Link>
            </div>
            <div className="relative h-28 sm:h-32 md:h-36 rounded-xl border bg-background overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-4 gap-1 p-3">
                <div className="rounded-md bg-[#ff7675]" />
                <div className="rounded-md bg-[#fdcb6e]" />
                <div className="rounded-md bg-[#74b9ff]" />
                <div className="rounded-md bg-[#55efc4]" />
                <div className="rounded-md bg-[#a29bfe]" />
                <div className="rounded-md bg-[#ffeaa7]" />
                <div className="rounded-md bg-[#fab1a0]" />
                <div className="rounded-md bg-[#81ecec]" />
                <div className="rounded-md bg-[#d63031]" />
                <div className="rounded-md bg-[#0984e3]" />
                <div className="rounded-md bg-[#00b894]" />
                <div className="rounded-md bg-[#6c5ce7]" />
              </div>
            </div>
          </div>
        </ToolSection>

        {/* Color Blindness Simulator Link */}
        <ToolSection
          title="Color Blindness Simulator"
          description="Preview how your colors look for users with different types of color vision deficiency."
        >
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-stretch rounded-2xl border bg-gradient-to-br from-rose-500/5 via-background to-muted/40 px-4 py-4 sm:px-6 sm:py-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-300">
                <EyeOff className="w-4 h-4" />
                Simulate real-world color vision
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Test palettes against common color vision types like protanopia, deuteranopia, and tritanopia to spot risky combinations early.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Multiple color blindness modes
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Side-by-side color comparisons
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Quick visual accessibility checks
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Works with any hex color
                </span>
              </div>
              <Link
                href="/color-blindness-simulator/"
                className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
              >
                Go to Color Blindness Simulator
                <span className="ml-1 text-base">→</span>
              </Link>
            </div>
            <div className="relative h-28 sm:h-32 md:h-36 rounded-xl border bg-background overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center gap-3 px-3">
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 w-20 rounded-full bg-muted" />
                  <div className="flex gap-1">
                    <div className="h-10 w-10 rounded-md bg-[#ff7675]" />
                    <div className="h-10 w-10 rounded-md bg-[#74b9ff]" />
                    <div className="h-10 w-10 rounded-md bg-[#55efc4]" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-1 opacity-80">
                  <div className="h-4 w-20 rounded-full bg-muted/70" />
                  <div className="flex gap-1">
                    <div className="h-10 w-10 rounded-md bg-[#ff9f9a]" />
                    <div className="h-10 w-10 rounded-md bg-[#82ccdd]" />
                    <div className="h-10 w-10 rounded-md bg-[#7bed9f]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ToolSection>

        {/* Contrast Checker Link */}
        <ToolSection
          title="Contrast Checker"
          description="Verify text and background contrast against WCAG AA and AAA accessibility standards."
        >
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-stretch rounded-2xl border bg-gradient-to-br from-slate-900/5 via-background to-muted/40 px-4 py-4 sm:px-6 sm:py-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Contrast className="w-4 h-4" />
                WCAG contrast analysis
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Input text and background colors to instantly see contrast ratios and accessibility pass/fail results.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  AA and AAA compliance checks
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Light and dark mode previews
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Large vs normal text handling
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Quick suggestions for improvements
                </span>
              </div>
              <Link
                href="/contrast-checker/"
                className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
              >
                Go to Contrast Checker
                <span className="ml-1 text-base">→</span>
              </Link>
            </div>
            <div className="relative h-28 sm:h-32 md:h-36 rounded-xl border bg-background overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-28 rounded bg-slate-900" />
                  <div className="h-3 w-20 rounded bg-slate-300" />
                  <div className="h-3 w-24 rounded bg-slate-200" />
                </div>
                <div className="flex-1 space-y-2 text-[10px] text-muted-foreground">
                  <div className="h-4 w-24 rounded-full bg-emerald-500/20" />
                  <div className="h-4 w-24 rounded-full bg-amber-500/20" />
                  <div className="h-4 w-24 rounded-full bg-rose-500/20" />
                </div>
              </div>
            </div>
          </div>
        </ToolSection>

        {/* Screen Color Picker Link */}
        <ToolSection
          title="Screen Color Picker"
          description="Use your browser&apos;s eyedropper to pick colors from anywhere on your screen."
        >
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-stretch rounded-2xl border bg-gradient-to-br from-teal-500/5 via-background to-muted/40 px-4 py-4 sm:px-6 sm:py-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-300">
                <MonitorSmartphone className="w-4 h-4" />
                Pick any on-screen color
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Activate the native eyedropper to sample colors from websites, designs, or apps and get precise hex values.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Uses browser color picker APIs
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Instant hex and RGB output
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Works across the whole screen
                </span>
                <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-1">
                  Ideal for quick design audits
                </span>
              </div>
              <Link
                href="/screen-color-picker/"
                className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
              >
                Go to Screen Color Picker
                <span className="ml-1 text-base">→</span>
              </Link>
            </div>
            <div className="relative h-28 sm:h-32 md:h-36 rounded-xl border bg-background overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center gap-3 px-4">
                <div className="flex-1 rounded-lg bg-gradient-to-br from-[#ff9ff3] via-[#74b9ff] to-[#55efc4]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-3 w-20 rounded bg-muted/80" />
                  <div className="h-3 w-16 rounded bg-muted/60" />
                </div>
              </div>
            </div>
          </div>
        </ToolSection>

        {/* About HexColorMeans */}
        <ToolSection
          title="About HexColorMeans"
          description="A reliable color reference for creative and technical work"
        >
          <AboutSection />
        </ToolSection>
      </GlobalLayout>

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
