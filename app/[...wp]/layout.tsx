import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "../globals.css" // Import globals for blog posts
import { WebsiteSchema, OrganizationSchema, SoftwareApplicationSchema } from "@/components/structured-data"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://hexcolormeans.com"),
  title: "HexColorMeans - Where Every Color Has Meaning | Color Information, Meanings & Tools",
  description:
    "Explore colors with HexColorMeans. Get detailed color information, meanings, conversions, harmonies, and use professional color tools including color picker, contrast checker, and more.",
  keywords: [
    "color picker",
    "color codes",
    "hex colors",
    "rgb colors",
    "color converter",
    "color meanings",
    "color harmonies",
    "color palette",
    "contrast checker",
  ],
  authors: [{ name: "HexColorMeans" }],
  alternates: {
    canonical: "https://hexcolormeans.com",
  },
  openGraph: {
    title: "HexColorMeans - Where Every Color Has Meaning",
    description: "Explore colors with detailed information, meanings, conversions, and professional tools.",
    type: "website",
    url: "https://hexcolormeans.com",
    siteName: "HexColorMeans",
    images: [
      {
        url: "https://hexcolormeans.com/colormean-know%20your%20color.webp",
        width: 1200,
        height: 630,
        alt: "HexColorMeans homepage preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HexColorMeans - Where Every Color Has Meaning",
    description: "Explore colors with detailed information, meanings, conversions, and professional tools.",
    images: ["https://hexcolormeans.com/colormean-know%20your%20color.webp"],
  },
  icons: { icon: "/favicon.webp" },
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
  verification: {
    google: "tiT0KL3QCJ4bLgDI-k7s8vphX4Sx6LQCFmkflXUe4pU",
  },
}

export const viewport: Viewport = {
  themeColor: "#E0115F",
}

export default function BlogRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-full">
      {children}
    </div>
  )
}