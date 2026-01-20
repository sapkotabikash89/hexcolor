"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function GrowHandler() {
    const pathname = usePathname()
    // Use a ref to track if we've initialized to avoid double firing in strict mode (if that were an issue),
    // but here we mainly care about repeated effects.
    const isMounted = useRef(false)

    useEffect(() => {
        // 1. Initialize global growMe function if it doesn't exist
        // This mirrors the standard Grow snippet structure
        if (typeof window !== "undefined" && !(window as any).growMe) {
            ; (window as any).growMe = function (e: any) {
                ; (window as any).growMe._.push(e)
            }
                ; (window as any).growMe._ = []
        }

        // 2. Safely trigger content update
        const triggerUpdate = () => {
            if (typeof window !== "undefined" && (window as any).growMe) {
                try {
                    ; (window as any).growMe("content:updated")
                } catch (e) {
                    console.warn("Grow update failed:", e)
                }
            }
        }

        // Short delay to ensure DOM is ready on route change
        const t = setTimeout(triggerUpdate, 500)

        // Also setup a retry for cases where the main script is still loading
        const retryTimer = setTimeout(triggerUpdate, 2000)

        return () => {
            clearTimeout(t)
            clearTimeout(retryTimer)
        }
    }, [pathname])

    return null
}
