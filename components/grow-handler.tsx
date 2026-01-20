"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function GrowHandler() {
    const pathname = usePathname()
    const lastPathname = useRef<string | null>(null)
    const formId = "U3Vic2NyaWJlV2lkZ2V0Ojc3ZWU2YmEwLWIzY2QtNGJjNy05YmUzLWRlNzdmZGIxZjFiOQ"

    useEffect(() => {
        const injectGrowScript = () => {
            // Remove any legacy instances to avoid duplication
            const existingScripts = document.querySelectorAll('script[src*="grow.js"], script[src*="faves.grow.me"]')
            existingScripts.forEach(s => s.remove())

            // Initialize command queue for early calls
            if (!(window as any).growMe) {
                ; (window as any).growMe = function (e: any) {
                    ; (window as any).growMe._.push(e)
                }
                    ; (window as any).growMe._ = []
            }

            const script = document.createElement("script")
            script.type = "text/javascript"
            script.src = "https://cdn.mediavine.com/grow.js"
            script.defer = true
            script.setAttribute("data-grow-faves-site-id", "U2l0ZTo5ZmZmYjE4Yi0wMmU2LTQ5YTYtYWRiYy05NGViMmU0OGU4NjY=")

            // Non-blocking injection after page is interactive
            const target = document.getElementsByTagName("script")[0] || document.head.firstChild
            if (target && target.parentNode) {
                target.parentNode.insertBefore(script, target)
            } else {
                document.head.appendChild(script)
            }
        }

        const isPageInteractive = () => {
            return document.readyState === 'complete'
        }

        // Wait for interactivity before injecting the Floating Widget script
        if (isPageInteractive()) {
            injectGrowScript()
        } else {
            window.addEventListener('load', injectGrowScript, { once: true })
        }

        // Trigger logic for native Grow Subscribe Popup
        const triggerSubscribe = () => {
            // Guard: Fire only once per session
            if (sessionStorage.getItem('grow_popup_triggered')) return

            const g = (window as any).growMe
            if (g) {
                try {
                    // Use the SDK command queue to trigger the popup
                    if (typeof g === 'function') {
                        g('triggerSubscribePopup', { id: formId })
                    } else if (g.triggerSubscribePopup) {
                        g.triggerSubscribePopup(formId)
                    }
                    sessionStorage.setItem('grow_popup_triggered', 'true')
                } catch (e) {
                    // Silent fail as requested
                }
            }
        }

        // Trigger 1: 12-second time delay
        const timeTimer = setTimeout(triggerSubscribe, 12000)

        // Trigger 2: 50% Scroll depth
        const handleScroll = () => {
            const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight
            if (scrollPercent > 0.50) {
                triggerSubscribe()
                window.removeEventListener('scroll', handleScroll)
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            clearTimeout(timeTimer)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [pathname])

    return null
}
