"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function GrowHandler() {
    const pathname = usePathname()
    const lastPathname = useRef<string | null>(null)

    useEffect(() => {
        const injectGrowScript = () => {
            // Remove existing Grow script to ensure a fresh scan of the new DOM
            // Deterministic approach: re-inject script on every page change for SPAs
            const existingScripts = document.querySelectorAll('script[src*="faves.grow.me/main.js"]')
            existingScripts.forEach(s => s.remove())

            // Initialize command queue if not present
            if (!(window as any).growMe) {
                ; (window as any).growMe = function (e: any) {
                    ; (window as any).growMe._.push(e)
                }
                    ; (window as any).growMe._ = []
            }

            const script = document.createElement("script")
            script.type = "text/javascript"
            script.src = `https://faves.grow.me/main.js?ts=${Date.now()}` // Cache busting for deterministic re-init
            script.defer = true
            script.setAttribute("data-grow-faves-site-id", "U2l0ZTo5ZmZmYjE4Yi0wMmU2LTQ5YTYtYWRiYy05NGViMmU0OGU4NjY=")

            // Non-blocking injection
            const target = document.getElementsByTagName("script")[0] || document.head.firstChild
            if (target && target.parentNode) {
                target.parentNode.insertBefore(script, target)
            } else {
                document.head.appendChild(script)
            }
        }

        const isDOMReallyReady = () => {
            // Mandatory Check 1: Loading state
            if (document.readyState !== 'complete') return false

            // Mandatory Check 2: Structural anchors present (Required by Grow classification)
            const content = document.querySelector('[data-grow-content]')
            const sidebar = document.querySelector('[data-grow-sidebar]')
            if (!content || !sidebar) return false

            // Mandatory Check 3: Content-aware readability (Enforce classification)
            const textContent = content.textContent?.trim() || ""
            if (textContent.length < 200) return false

            return true
        }

        // Deterministic wait for hydration completion and DOM readiness
        let checkCount = 0
        const interval = setInterval(() => {
            checkCount++
            if (isDOMReallyReady()) {
                clearInterval(interval)
                if (lastPathname.current !== pathname) {
                    // Delay Share & Love UI until after fully loaded and path has stabilized
                    setTimeout(() => {
                        injectGrowScript()
                        lastPathname.current = pathname
                    }, 800)
                }
            }
            // Timeout after 15 seconds
            if (checkCount > 75) clearInterval(interval)
        }, 200)

        return () => clearInterval(interval)
    }, [pathname])

    return null
}
