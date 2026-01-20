"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function GrowHandler() {
    const pathname = usePathname()

    useEffect(() => {
        // Notify Grow of route changes to refresh widgets
        if ((window as any).growMe) {
            ; (window as any).growMe("content:updated")
        }
    }, [pathname])

    return null
}
