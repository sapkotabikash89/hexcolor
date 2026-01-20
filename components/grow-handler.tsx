"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function GrowHandler() {
    const pathname = usePathname()

    useEffect(() => {
        // Force Grow rescan after hydration and route changes
        // Added a small delay to ensure DOM is fully ready and hydration is complete
        const timer = setTimeout(() => {
            if (typeof window !== "undefined" && (window as any).growMe && typeof (window as any).growMe === 'function') {
                try {
                    ; (window as any).growMe('refresh')
                } catch (e) {
                    console.warn('Grow refresh failed:', e)
                }
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [pathname])

    return null
}
