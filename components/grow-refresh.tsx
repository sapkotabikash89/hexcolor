"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function GrowRefresh() {
    const pathname = usePathname()

    useEffect(() => {
        // Safely check for window and growMe
        if (typeof window !== "undefined" && (window as any).growMe) {
            try {
                // Notify Grow of the route change to re-initialize widgets and ads
                ; (window as any).growMe("refresh")
            } catch (e) {
                // Fail silently if Grow is not loaded or encounters an error
            }
        }
    }, [pathname])

    return null
}
