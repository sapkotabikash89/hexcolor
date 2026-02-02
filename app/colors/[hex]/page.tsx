import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ColorSidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorPageContent } from "@/components/color-page-content"
import { normalizeHex, isValidHex, getContrastColor, hexToRgb, rgbToHsl, rgbToCmyk, getColorHarmony } from "@/lib/color-utils"
import { getGumletColorImage } from "@/lib/image-utils"
import { KNOWN_COLOR_HEXES } from "@/lib/known-colors-complete"
import { notFound, redirect } from "next/navigation"
import { BreadcrumbSchema, FAQSchema, ImageObjectSchema, ArticleSchema } from "@/components/structured-data"
import { CopyButton } from "@/components/copy-button"
import { generateFAQs } from "@/lib/category-utils"
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
  const data = (await import('@/lib/color-meaning.json')).default
  const meaningHexes = Object.keys(data)
  const knownHexes = Array.from(KNOWN_COLOR_HEXES)

  // Combine all sources
  const allHexes = new Set([
    ...meaningHexes.map(h => h.toLowerCase()),
    ...knownHexes.map(h => h.toLowerCase()),
    // Add uppercase versions to prevent 404s and allow client-side normalization
    ...meaningHexes.map(h => h.replace('#', '').toUpperCase()),
    ...knownHexes.map(h => h.replace('#', '').toUpperCase())
  ])

  return Array.from(allHexes).map((hex) => ({
    hex: hex,
  }))
}


export async function generateMetadata({ params }: ColorPageProps): Promise<Metadata> {
  const { hex } = await params
  const normalizedHex = normalizeHex(hex)
  const cleanHex = normalizedHex.replace("#", "").toUpperCase()

  if (!isValidHex(normalizedHex)) {
    return {
      title: "Invalid Color - HexColorMeans",
    }
  }

  // Load data to check if color exists in our database
  const data = (await import('@/lib/color-meaning.json')).default
  const meta: any = (data as any)[cleanHex]
  const colorName: string | undefined = meta?.name || undefined
  const displayLabel = colorName ? `${colorName} (${normalizedHex})` : normalizedHex
  const rgb = hexToRgb(normalizedHex)

  // Use Gumlet CDN image
  const gumlet = getGumletColorImage({
    colorName: colorName || (normalizedHex),
    hex: normalizedHex,
    rgb: rgb || { r: 0, g: 0, b: 0 }
  })
  const imageUrl = gumlet.url;
  const imageAlt = gumlet.alt;

  // Enhanced SEO metadata specifically for known colors
  const isKnownColor = KNOWN_COLOR_HEXES.has(cleanHex);

  const baseTitle = isKnownColor
    ? `${displayLabel} Color Meaning, Values and Psychology | HexColorMeans`
    : `${displayLabel} Color Information & Tools | HexColorMeans`;

  const baseDescription = isKnownColor
    ? `Master the psychology and technical profile of ${displayLabel}. Comprehensive analysis of color meaning, symbolism, and exact RGB/HSL/CMYK specifications for professional design.`
    : `Technical specifications for ${normalizedHex}. Access calibrated color conversions (RGB, HSL, CMYK), harmony maps, and accessibility validation metrics.`;

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
    // Additional SEO enhancements
    robots: {
      index: isKnownColor, // Only index known colors
      follow: true,
    },
  }
}

export default async function ColorPage({ params }: ColorPageProps) {
  const { hex } = await params
  const normalizedHex = normalizeHex(hex)

  // Check if this is a known static color - ensure lowercase URL
  // const lowerHex = normalizedHex.replace("#", "").toLowerCase();
  // const upperHex = normalizedHex.replace("#", "").toUpperCase();
  // if (isValidHex(normalizedHex) && KNOWN_COLOR_HEXES.has(upperHex) && hex !== lowerHex) {
  //   // Redirect to lowercase version for consistency and to match static export
  //   redirect(`/colors/${lowerHex}`);
  // }

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

  const redirected = await maybeRedirectToBlog(normalizedHex)
  if (redirected) {
    redirect(redirected)
  }

  const contrastColor = getContrastColor(normalizedHex)
  const rgb = hexToRgb(normalizedHex)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null

  const breadcrumbItems = [
    { name: "HexColorMeans", item: "https://hexcolormeans.com" },
    { name: "Color Names", item: "https://hexcolormeans.com/colors" },
    { name: normalizedHex, item: `https://hexcolormeans.com/colors/${normalizedHex.replace("#", "").toLowerCase()}` },
  ]

  const faqItems = rgb && hsl ? generateFAQs(normalizedHex, rgb, hsl) : []
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
            <ColorPageContent key={normalizedHex} hex={normalizedHex} faqs={faqItems} name={colorName} colorExistsInDb={colorExistsInDb} pageUrl={pageUrl} />
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

async function maybeRedirectToBlog(hex: string): Promise<string | null> {
  const normalizedHex = normalizeHex(hex)
  const cleanHex = normalizedHex.replace("#", "").toUpperCase()

  // CRITICAL: Never redirect known static colors
  // These are authoritative static pages that must not redirect
  if (KNOWN_COLOR_HEXES.has(cleanHex)) {
    return null
  }

  const site = "https://hexcolormeans.com"
  const searchTerm = hex.toUpperCase()
  const clean = searchTerm.replace("#", "")
  try {
    const res = await fetch("https://blog.hexcolormeans.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query SearchByHex($q: String!) {
            posts(where: { search: $q }, first: 3) {
              nodes { uri content }
            }
            pages(where: { search: $q }, first: 3) {
              nodes { uri content }
            }
          }
        `,
        variables: { q: clean },
      }),

    })
    const json = await res.json()
    const nodes: Array<{ uri: string; content: string }> = [
      ...((json?.data?.posts?.nodes as any[]) || []),
      ...((json?.data?.pages?.nodes as any[]) || []),
    ]
    for (const n of nodes) {
      const html = String(n?.content || "")
      const found = findHexInContent(html, searchTerm)
      if (found) {
        if (n?.uri) return new URL(n.uri, site).toString()
      }
    }
  } catch { }
  return null
}

function findHexInContent(html: string, target: string): boolean {
  const t = target.toUpperCase()
  const noHash = t.replace("#", "")
  const patterns = [
    new RegExp(`\\b${t}\\b`, "i"),
    new RegExp(`#${noHash}\\b`, "i"),
    new RegExp(`\\b${noHash}\\b`, "i"),
  ]
  for (const re of patterns) {
    if (re.test(html)) return true
  }
  return !!parseShortcodeHex(html) && parseShortcodeHex(html)!.toUpperCase() === t
}

function parseShortcodeHex(html: string): string | null {
  const pre = (html || "")
    .replace(/&(amp;)?#91;?/gi, "[")
    .replace(/&(amp;)?#93;?/gi, "]")
    .replace(/&(amp;)?#x0*5[bB];?/gi, "[")
    .replace(/&(amp;)?#x0*5[dD];?/gi, "]")
    .replace(/&(amp;)?lsqb;?/gi, "[")
    .replace(/&(amp;)?rsqb;?/gi, "]")
    .replace(/&(amp;)?lbrack;?/gi, "[")
    .replace(/&(amp;)?rbrack;?/gi, "]")
    .replace(/\u005B/g, "[")
    .replace(/\u005D/g, "]")
  const tag = pre.match(/\[\s*(?:colormean|hexcolormeans)\b([\s\S]*?)\]/i)
  if (!tag) return null
  const attrs = tag[1] || ""
  const decoded = attrs
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&ldquo;/gi, '"')
    .replace(/&rdquo;/gi, '"')
    .replace(/&lsquo;/gi, "'")
    .replace(/&rsquo;/gi, "'")
    .replace(/&#34;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#8220;/gi, '"')
    .replace(/&#8221;/gi, '"')
    .replace(/&#8216;/gi, "'")
    .replace(/&#8217;/gi, "'")
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u2018|\u2019/g, "'")
  let val: string | undefined
  const re = /([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"']+))/g
  for (const m of decoded.matchAll(re) as any) {
    const key = String(m[1] || "").trim().toLowerCase()
    if (key === "hex") {
      val = (m[2] ?? m[3] ?? m[4] ?? "").trim()
      break
    }
  }
  if (!val) return null
  const raw = val.replace(/^#/, "").toLowerCase()
  if (/^[0-9a-f]{6}$/.test(raw)) return `#${raw.toUpperCase()}`
  if (/^[0-9a-f]{3}$/.test(raw)) {
    const exp = `${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`
    return `#${exp.toUpperCase()}`
  }
  return null
}