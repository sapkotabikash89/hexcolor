"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function GrowHandler() {
    const pathname = usePathname()
    const isFirstLoad = useRef(true)

    useEffect(() => {
        // Initialize Grow script only once on mounting
        const initGrow = () => {
            if (!(window as any).growMe) {
                ; (window as any).growMe = function (e: any) {
                    ; (window as any).growMe._.push(e)
                }
                    ; (window as any).growMe._ = []

                const script = document.createElement("script")
                script.type = "text/javascript"
                script.src = "https://faves.grow.me/main.js"
                script.defer = true
                script.setAttribute("data-grow-faves-site-id", "U2l0ZTo5ZmZmYjE4Yi0wMmU2LTQ5YTYtYWRiYy05NGViMmU0OGU4NjY=")

                const target = document.getElementsByTagName("script")[0] || document.head.firstChild
                if (target && target.parentNode) {
                    target.parentNode.insertBefore(script, target)
                } else {
                    document.head.appendChild(script)
                }
            }
        }

        // Delay injection until window.onload + safety buffer to ensure non-blocking UX
        if (document.readyState === 'complete') {
            setTimeout(initGrow, 1000)
        } else {
            window.addEventListener('load', () => setTimeout(initGrow, 1000), { once: true })
        }
    }, [])

    useEffect(() => {
        const refreshGrow = () => {
            if ((window as any).growMe && typeof (window as any).growMe === 'function') {
                try {
                    ; (window as any).growMe('refresh')
                } catch (e) {
                    // Fail silently
                }
            }
        }

        // Trigger refresh after content readiness
        if (isFirstLoad.current) {
            isFirstLoad.current = false
            // Initial load needs more time for everything to settle
            const timer = setTimeout(refreshGrow, 3000)
            return () => clearTimeout(timer)
        } else {
            // Route changes
            const timer = setTimeout(refreshGrow, 1200)
            return () => clearTimeout(timer)
        }
    }, [pathname])

    return null
}
