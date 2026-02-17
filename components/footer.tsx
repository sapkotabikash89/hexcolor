import Link from "next/link"
import NextImage from "next/image"
import blogPostsData from "@/lib/blog-posts-data.json"

export function Footer() {
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

  return (
    <footer className="w-full border-t border-border bg-card mt-auto">
      <div className="w-full max-w-[1300px] mx-auto px-4 py-12 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <NextImage src="/logo.webp" alt="HexColorMeans logo" width={120} height={32} className="h-8 w-auto rounded-lg" />
              <span>HexColorMeans</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              We built HexColorMeans to go beyond basic hex values and color lists. The site focuses on the symbolism, psychological, and spiritual meaning of color, supported by accurate technical data you can trust. If HexColorMeans helps your work or sparks an idea, we would love to hear your thoughts and suggestions.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold mb-4">Color Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/color-wheel/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Color Wheel
                </Link>
              </li>
              <li>
                <Link href="/color-picker/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Color Picker
                </Link>
              </li>
              <li>
                <Link
                  href="/contrast-checker/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contrast Checker
                </Link>
              </li>
              <li>
                <Link
                  href="/color-blindness-simulator/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Color Blindness Simulator
                </Link>
              </li>
              <li>
                <Link
                  href="/image-color-picker/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Image Color Picker
                </Link>
              </li>
              <li>
                <Link
                  href="/palette-from-image/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Palette from Image
                </Link>
              </li>
              <li>
                <Link
                  href="/screen-color-picker/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Screen Color Picker
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/colors/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Color Library
                </Link>
              </li>
              <li>
                <Link href="/blog/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={getCategoryHref(cat.slug)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm">
              <li>
                <Link href="/about-us/" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/editorial-policy/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Editorial Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2026 HexColorMeans. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
