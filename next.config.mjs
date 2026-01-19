/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true, // Add trailing slashes to all routes for compatibility
  images: {
    unoptimized: true, // Required for static exports since we can't use Next.js image optimization
    formats: ["image/webp"],
    minimumCacheTTL: 31536000,
    localPatterns: [
      { pathname: "/img/**" },
      { pathname: "/img/lqip/**" },
      { pathname: "/colors/**" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "cms.colormean.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "static.wixstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "colormean.com", pathname: "/**" },
      { protocol: "https", hostname: "www.colormean.com", pathname: "/**" },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'framer-motion', '@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-tooltip'],
  },
  // Note: Headers and rewrites are handled via Cloudflare Pages configuration or public/_headers and public/_redirects files for static export compatibility
}

export default nextConfig