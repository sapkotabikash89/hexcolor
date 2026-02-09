import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import dynamic from "next/dynamic"

const ColorSidebar = dynamic(() => import("@/components/sidebar").then((mod) => mod.ColorSidebar), {
  loading: () => <div className="w-full h-96 animate-pulse bg-muted/20 rounded-xl" />
})

const ColorPageContent = dynamic(() => import("@/components/color-page-content").then(mod => mod.ColorPageContent), {
  loading: () => <div className="h-96 w-full animate-pulse bg-muted rounded-lg" />
})
import { normalizeHex, isValidHex, getContrastColor, hexToRgb, rgbToHsl, rgbToCmyk, getAdjacentColors, getClosestKnownColor, getColorHarmony } from "@/lib/color-utils"
import { getGumletColorImage } from "@/lib/image-utils"
import { KNOWN_COLOR_HEXES } from "@/lib/known-colors-complete"
import { notFound } from "next/navigation"
import { BreadcrumbSchema, FAQSchema, ImageObjectSchema, ArticleSchema } from "@/components/structured-data"
import { CopyButton } from "@/components/copy-button"
import { generateColorInformation, generateColorFAQs } from "@/lib/generateColorContent"
import { TableOfContents } from "@/components/table-of-contents"
import { URLNormalizer } from "@/components/url-normalizer"
import { Suspense } from "react"

// export const runtime = 'nodejs' // Not needed for static export

interface ColorPageProps {
  params: Promise<{
    hex: string
  }>
}

export async function generateStaticParams() {
  console.log('Generating static params for colors...');
  try {
    const data = (await import('@/lib/color-meaning.json')).default
    const meaningHexes = Object.keys(data)
    const knownHexes = Array.from(KNOWN_COLOR_HEXES)

    // Fetch blog posts to identify hex codes that should be excluded
    // because they have a dedicated blog post
    let excludedHexes = new Set<string>()
    try {
      const fs = await import('fs')
      const path = await import('path')
      const postsPath = path.join(process.cwd(), 'lib/blog-posts-data.json')

      if (fs.existsSync(postsPath)) {
        const postsData = JSON.parse(fs.readFileSync(postsPath, 'utf8'))

        postsData.forEach((post: any) => {
          // Extract hex from title: "0000FF Color Blue Meaning..." -> "0000FF"
          // Look for 6-digit hex at start of title
          const match = post.title.trim().match(/^([0-9A-Fa-f]{6})\b/)
          if (match) {
            excludedHexes.add(match[1].toUpperCase())
          }

          // Also check for #HEX format just in case
          const matchHash = post.title.trim().match(/^#([0-9A-Fa-f]{6})\b/);
          if (matchHash) {
            excludedHexes.add(matchHash[1].toUpperCase())
          }
        })
      }
    } catch (e) {
      console.error('Error reading blog posts for hex exclusion:', e)
    }

    // Combine all sources
    const allHexes = new Set([
      ...meaningHexes.map(h => h.toLowerCase()),
      ...knownHexes.map(h => h.toLowerCase()),
      // Add uppercase versions to prevent 404s and allow client-side normalization
      ...meaningHexes.map(h => h.replace('#', '').toUpperCase()),
      ...knownHexes.map(h => h.replace('#', '').toUpperCase())
    ])

    // Filter out hexes that have blog posts
    const filteredHexes = Array.from(allHexes).filter(hex => {
      const cleanHex = hex.replace('#', '').toUpperCase()
      return !excludedHexes.has(cleanHex)
    })

    console.log(`Total hexes: ${allHexes.size}, Excluded: ${excludedHexes.size}, Filtered: ${filteredHexes.length}`);

    if (filteredHexes.length === 0) {
      console.warn('WARNING: No static params generated for colors!');
    }

    const params = filteredHexes.map((hex) => ({
      hex: hex,
    }));

    // Verify param structure
    if (params.length > 0 && !params[0].hex) {
      console.error('Invalid param structure:', params[0]);
    }

    return params;
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}


export async function generateMetadata({ params }: ColorPageProps): Promise<Metadata> {
  const { hex } = await params
  const normalizedHex = normalizeHex(hex)
  const cleanHex = normalizedHex.replace("#", "").toUpperCase()

  if (!isValidHex(normalizedHex)) {
    return {
      title: "Invalid Color",
      robots: { index: false, follow: true },
    }
  }

  // Strict check for known colors
  const isKnownColor = KNOWN_COLOR_HEXES.has(cleanHex);

  // UNKNOWN COLORS: Strict NOINDEX, NO SEO METADATA
  if (!isKnownColor) {
    return {
      // Minimal title for browser tab, but no SEO value
      title: `${normalizedHex} Color Info`,
      // Explicitly disable indexing
      robots: {
        index: false,
        follow: true,
        googleBot: {
          index: false,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      // Explicitly OMIT other SEO tags by not including them
    }
  }

  // KNOWN COLORS: Full SEO Metadata
  const data = (await import('@/lib/color-meaning.json')).default
  const meta: any = (data as any)[cleanHex]
  const colorName: string | undefined = meta?.name || undefined
  const displayLabel = colorName ? `${colorName} (${normalizedHex})` : normalizedHex
  const rgb = hexToRgb(normalizedHex)

  const gumlet = getGumletColorImage({
    colorName: colorName || (normalizedHex),
    hex: normalizedHex,
    rgb: rgb || { r: 0, g: 0, b: 0 }
  })
  const imageUrl = gumlet.url;
  const imageAlt = gumlet.alt;

  const baseTitle = `${displayLabel} Color Meaning, Values and Psychology | HexColorMeans`;
  const baseDescription = `Master the psychology and technical profile of ${displayLabel}. Comprehensive analysis of color meaning, symbolism, and exact RGB/HSL/CMYK specifications for professional design.`;

  return {
    title: baseTitle,
    description: baseDescription,
    keywords: [
      `${normalizedHex} color`,
      ...(colorName ? [`${colorName} color`] : []),
      "color meaning",
      "color psychology",
      "color symbolism",
      "hex color",
      "rgb converter",
      "color harmonies",
      "web colors",
      "design colors",
      "brand colors",
    ],
    // Explicit Canonical for Known Colors
    alternates: {
      canonical: `https://hexcolormeans.com/colors/${cleanHex.toLowerCase()}`,
    },
    openGraph: {
      title: baseTitle,
      description: baseDescription,
      url: `https://hexcolormeans.com/colors/${cleanHex.toLowerCase()}`,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: baseTitle,
      description: baseDescription,
      images: [imageUrl],
    },
    // Explicit Indexing for Known Colors
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default async function ColorPage({ params }: ColorPageProps) {
  const { hex } = await params
  const normalizedHex = normalizeHex(hex)

  if (!isValidHex(normalizedHex)) {
    notFound()
  }

  // Load data dynamically for both static and dynamic rendering
  const data = (await import('@/lib/color-meaning.json')).default
  const upper = normalizedHex.replace("#", "").toUpperCase()
  const meta: any = (data as any)[upper]

  // If the color doesn't exist in our JSON, we'll still render the page but with minimal data
  const colorName: string | undefined = meta?.name || undefined
  const displayLabel = colorName ? `${colorName} (${normalizedHex})` : normalizedHex

  const contrastColor = getContrastColor(normalizedHex)
  const rgb = hexToRgb(normalizedHex)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null

  // Helper for neighbors (used in content generation)
  const neighbors = getAdjacentColors(normalizedHex)
  // Ensure we have name for neighbor display if possible
  const neighborsWithNames = {
    prev: neighbors.prev ? { hex: neighbors.prev, name: getClosestKnownColor(neighbors.prev).name } : undefined,
    next: neighbors.next ? { hex: neighbors.next, name: getClosestKnownColor(neighbors.next).name } : undefined
  }

  const breadcrumbItems = [
    { name: "HexColorMeans", item: "https://hexcolormeans.com" },
    { name: "Color Names", item: "https://hexcolormeans.com/colors" },
    { name: normalizedHex, item: `https://hexcolormeans.com/colors/${normalizedHex.replace("#", "").toLowerCase()}` },
  ]

  let faqItems: { question: string; answer: string }[] = []
  let colorInformation = null

  if (rgb && hsl && cmyk) {
    // Fetch pairings (Analogous + Split Complementary)
    const analogous = getColorHarmony(normalizedHex, "analogous");
    const splitComp = getColorHarmony(normalizedHex, "split-complementary");

    // Filter out self and duplicates, and ensure we only use KNOWN colors
    const pairingCandidates = Array.from(new Set([...analogous, ...splitComp]))
      .map(h => getClosestKnownColor(h))
      .filter((c, index, self) =>
        c.hex.toUpperCase() !== normalizedHex.toUpperCase() &&
        self.findIndex(t => t.hex === c.hex) === index
      );

    const uniquePairings = pairingCandidates.slice(0, 5);

    // Fetch conflicts (Triadic + Complementary)
    const triadic = getColorHarmony(normalizedHex, "triadic");
    const complementary = getColorHarmony(normalizedHex, "complementary");

    const conflictCandidates = Array.from(new Set([...triadic, ...complementary]))
      .map(h => getClosestKnownColor(h))
      .filter((c, index, self) =>
        c.hex.toUpperCase() !== normalizedHex.toUpperCase() &&
        self.findIndex(t => t.hex === c.hex) === index &&
        // Ensure no overlap with pairings
        !pairingCandidates.some(p => p.hex === c.hex)
      );

    const uniqueConflicts = conflictCandidates.slice(0, 5);

    const contentData = {
      hex: normalizedHex,
      name: colorName || "Color",
      rgb,
      hsl,
      cmyk,
      neighbors: neighborsWithNames,
      pairings: uniquePairings,
      conflicts: uniqueConflicts
    }
    faqItems = generateColorFAQs(contentData)
    colorInformation = generateColorInformation(contentData)
  }

  const pageUrl = `https://hexcolormeans.com/colors/${normalizedHex.replace("#", "").toLowerCase()}`
  const pageDescription = `Explore ${normalizedHex} color information, conversions, harmonies, variations, and accessibility.`

  // Use Gumlet CDN image for schema and display
  const gumlet = getGumletColorImage({
    colorName: colorName || normalizedHex,
    hex: normalizedHex,
    rgb: rgb || { r: 0, g: 0, b: 0 }
  })
  const imageUrl = gumlet.url;
  const imageAlt = gumlet.alt;

  const colorExistsInDb = !!meta;

  // Render the page regardless of whether color exists in database
  // Known colors have full data, unknown colors will show minimal information
  // This ensures all hex patterns render a page instead of 404 or redirecting

  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={null}>
        <URLNormalizer />
      </Suspense>
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={faqItems} />
      <ArticleSchema
        title={`${displayLabel} Color Meaning, Codes and Information`}
        description={pageDescription}
        authorName="HexColorMeans"
        authorType="Organization"
        url={pageUrl}
        image={imageUrl}
        articleSection="Color Meanings"
        colorName={colorName}
        colorHex={normalizedHex}
      />

      <Header />

      <ImageObjectSchema
        url={imageUrl}
        width={1200}
        height={630}
        name={colorName ? `${colorName} (${normalizedHex}) color swatch` : `${normalizedHex} color swatch`}
        alt={imageAlt}
        description={colorName
          ? `Detailed color guide showing ${colorName} (${normalizedHex}) technical specifications and analysis.`
          : `Detailed technical specifications for color ${normalizedHex}.`}
        representativeOfPage={true}
      />

      {/* Dynamic Color Hero */}
      <section
        className="py-12 px-4 transition-colors"
        style={{
          backgroundColor: normalizedHex,
          color: contrastColor,
        }}
      >
        <div className="w-full max-w-[1300px] mx-auto overflow-hidden">
          <BreadcrumbNav
            items={[
              { label: "Color Names", href: "/colors" },
              { label: normalizedHex, href: `/colors/${normalizedHex.replace("#", "").toLowerCase()}` },
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
                <CopyButton showIcon={false} variant="ghost" size="sm" className="p-0 h-auto" label={`HEX: ${normalizedHex}`} value={normalizedHex} />
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
        <TableOfContents currentHex={normalizedHex} mobileOnly />
      </div>

      {/* Main Content */}
      <main className="w-full max-w-[1300px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left Sidebar Table of Contents - Sticky (Visible on Desktop/Large Tablet) */}
          <aside className="hidden xl:block w-52 sticky top-28 self-start shrink-0">
            <TableOfContents currentHex={normalizedHex} />
          </aside>

          {/* Center Article Content - Flexible width */}
          <article className="flex-1 min-w-0 w-full">
            <ColorPageContent key={normalizedHex} hex={normalizedHex} faqs={faqItems} colorInformation={colorInformation || undefined} name={colorName} colorExistsInDb={colorExistsInDb} pageUrl={pageUrl} />
          </article>

          {/* Right Sidebar - Hidden below lg to prioritize content width */}
          <aside className="hidden lg:block w-[340px] shrink-0 sticky top-24 self-start">
            <ColorSidebar color={normalizedHex} />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}