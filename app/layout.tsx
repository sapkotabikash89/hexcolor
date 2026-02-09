import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { WebsiteSchema, OrganizationSchema, SoftwareApplicationSchema } from "@/components/structured-data"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

const SITE_URL = "https://hexcolormeans.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "HexColorMeans",
  keywords: ["color meanings", "hex codes", "color symbolism", "color combinations", "color theory", "web colors", "design resources"],
  authors: [{ name: "HexColorMeans Team" }],
  creator: "HexColorMeans",
  publisher: "HexColorMeans",
  icons: {
    icon: "/favicon.webp",
  },
  verification: {
    google: "6aCCEUx0SvVPIKAgXUdb96PSZ48p0WJNzj0074iCNnY",
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
        <link rel="preconnect" href="https://hexcolormeans.gumlet.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://hexcolormeans.gumlet.io" />
        <meta name="p:domain_verify" content="2f0be474874f515dce302624f3919d26" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body className={`${inter.className} px-0`}>
        <div className="min-h-screen relative bg-background font-sans antialiased">
          {children}
        </div>

        <ScrollToTop />
        <SonnerToaster />

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
