import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { WebsiteSchema, OrganizationSchema, SoftwareApplicationSchema } from "@/components/structured-data"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { GrowRefresh } from "@/components/grow-refresh"

const inter = Inter({ subsets: ["latin"] })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hexcolormeans.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    canonical: SITE_URL,
  },
  openGraph: {
    title: "HexColorMeans - Where Every Color Has Meaning",
    description: "Explore colors with detailed information, meanings, conversions, and professional tools.",
    type: "website",
    url: SITE_URL,
    siteName: "HexColorMeans",
    images: [
      {
        url: `${SITE_URL}/advanced-color-picker-tool-online-free.webp`,
        width: 1200,
        height: 630,
        alt: "HexColorMeans - Professional Color Tools and Information",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HexColorMeans - Where Every Color Has Meaning",
    description: "Explore colors with detailed information, meanings, conversions, and professional tools.",
    images: [`${SITE_URL}/advanced-color-picker-tool-online-free.webp`],
  },
  icons: {
    icon: [
      { url: "/favicon.webp" },
      { url: "/favicon.webp", type: "image/webp" },
    ],
    shortcut: ["/favicon.webp"],
    apple: [
      { url: "/favicon.webp" },
    ],
  },
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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://blog.hexcolormeans.com" />
        <link rel="dns-prefetch" href="https://blog.hexcolormeans.com" />
        <meta name="google-site-verification" content="tiT0KL3QCJ4bLgDI-k7s8vphX4Sx6LQCFmkflXUe4pU" />
        <meta name="p:domain_verify" content="2f0be474874f515dce302624f3919d26" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body className={`${inter.className} px-0`}>
        <div className="min-h-screen relative bg-background font-sans antialiased">
          {children}
        </div>

        {/* Grow Script - Placed in body with afterInteractive strategy for safe loading */}
        <ScrollToTop />
        <SonnerToaster />
        <GrowRefresh />
        <Script src="/color-fallback-handler.js" strategy="beforeInteractive" />

        <Script id="grow-by-mediavine" strategy="afterInteractive">
          {`
    !(function() {
      window.growMe || (
        (window.growMe = function(e) { window.growMe._.push(e); }),
        (window.growMe._ = [])
      );
      var e = document.createElement("script");
      e.type = "text/javascript";
      e.src = "https://faves.grow.me/main.js";
      e.defer = true;
      e.setAttribute("data-grow-faves-site-id", "U2l0ZTo5ZmZmYjE4Yi0wMmU2LTQ5YTYtYWRiYy05NGViMmU0OGU4NjY=");
      var t = document.getElementsByTagName("script")[0];
      t.parentNode.insertBefore(e, t);
    })();
  `}
        </Script>

        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ? (
          <Script id="ga-defer-on-first-interaction" strategy="lazyOnload">
            {`
              (function() {
                var loaded = false;
                function loadGA() {
                  if (loaded) return;
                  loaded = true;
                  var s = document.createElement('script');
                  s.src = 'https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}';
                  s.async = true;
                  s.defer = true;
                  document.head.appendChild(s);
                  s.onload = function() {
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', { page_path: window.location.pathname });
                  };
                }
                ['keydown','pointerdown','touchstart','scroll'].forEach(function(evt){
                  window.addEventListener(evt, loadGA, { once: true, passive: true });
                });
              })();
            `}
          </Script>
        ) : null}
      </body>
    </html>
  )
}
