"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function URLNormalizer() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Only run if pathname exists and contains uppercase letters
    // We specifically check for /colors/ route structure if needed, 
    // but a global check for uppercase hex segments is safe here.
    if (pathname && /[A-F]/.test(pathname)) {
      const lower = pathname.toLowerCase()
      
      // If the current path is different from lowercase version
      if (pathname !== lower) {
        const search = searchParams.toString()
        const newUrl = search ? `${lower}?${search}` : lower
        
        // Use replaceState to update URL without reloading the page
        // This keeps the rendered content (which is valid) but fixes the URL bar
        window.history.replaceState(null, '', newUrl)
      }
    }
  }, [pathname, searchParams])

  return null
}
