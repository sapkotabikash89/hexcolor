/** @type {import('next').NextConfig} */
const nextConfig = {
  // STATIC EXPORT CONFIGURATION
  output: 'export', // Always use static export
  trailingSlash: true, // Required for consistent routing in static export

  // Image configuration for static export
  images: {
    unoptimized: true, // Required - Next.js image optimization not available in static export
    formats: ["image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: "https", hostname: "hexcolormeans.gumlet.io", pathname: "/**" },
      { protocol: "https", hostname: "blog.hexcolormeans.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "static.wixstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "hexcolormeans.com", pathname: "/**" },
      { protocol: "https", hostname: "www.hexcolormeans.com", pathname: "/**" },
    ],
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-popover',
      '@radix-ui/react-tooltip'
    ],
  },

  // Note: headers(), rewrites(), and redirects() are NOT supported in static export
  // Use Cloudflare Pages _headers and _redirects files instead
}

export default nextConfig