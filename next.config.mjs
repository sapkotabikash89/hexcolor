/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false, // Disabled to fix 404s on Cloudflare Pages

  // Image configuration
  images: {
    unoptimized: true, // Required for OpenNext/Cloudflare Pages compatibility if not using paid image optimization
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
}

export default nextConfig