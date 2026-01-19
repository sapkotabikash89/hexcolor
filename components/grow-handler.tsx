"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function GrowHandler() {
    const pathname = usePathname()

    useEffect(() => {
        // Force Grow rescan after hydration and route changes
        if (typeof window !== "undefined" && (window as any).growMe) {
            ; (window as any).growMe('refresh')
        }
    }, [pathname])

    return null
}
