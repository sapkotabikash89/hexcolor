"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function GrowHandler() {
    const pathname = usePathname()
    const lastPathname = useRef<string | null>(null)
    const formId = "U3Vic2NyaWJlV2lkZ2V0Ojc3ZWU2YmEwLWIzY2QtNGJjNy05YmUzLWRlNzdmZGIxZjFiOQ"

    useEffect(() => {
        const injectGrowScript = () => {
            const existingScripts = document.querySelectorAll('script[src*="faves.grow.me/main.js"]')
            existingScripts.forEach(s => s.remove())

            if (!(window as any).growMe) {
                ; (window as any).growMe = function (e: any) {
                    ; (window as any).growMe._.push(e)
                }
                    ; (window as any).growMe._ = []
            }

            const script = document.createElement("script")
            script.type = "text/javascript"
            script.src = `https://faves.grow.me/main.js?ts=${Date.now()}`
            script.defer = true
            script.setAttribute("data-grow-faves-site-id", "U2l0ZTo5ZmZmYjE4Yi0wMmU2LTQ5YTYtYWRiYy05NGViMmU0OGU4NjY=")

            const target = document.getElementsByTagName("script")[0] || document.head.firstChild
            if (target && target.parentNode) {
                target.parentNode.insertBefore(script, target)
            } else {
                document.head.appendChild(script)
            }
        }

        const isDOMReallyReady = () => {
            if (document.readyState !== 'complete') return false
            const content = document.querySelector('[data-grow-content]')
            const sidebar = document.querySelector('[data-grow-sidebar]')
            if (!content || !sidebar) return false
            const textContent = content.textContent?.trim() || ""
            if (textContent.length < 200) return false
            return true
        }

        let checkCount = 0
        const interval = setInterval(() => {
            checkCount++
            if (isDOMReallyReady()) {
                clearInterval(interval)
                if (lastPathname.current !== pathname) {
                    setTimeout(() => {
                        injectGrowScript()
                        lastPathname.current = pathname
                    }, 800)
                }
            }
            if (checkCount > 75) clearInterval(interval)
        }, 200)

        // Manual Trigger Logic
        const triggerSubscribe = () => {
            if (sessionStorage.getItem('grow_subscribe_triggered')) return

            if (typeof (window as any).growMe === 'function') {
                try {
                    // Try both common API patterns for maximum reliability
                    (window as any).growMe('triggerSubscribePopup', { id: formId });
                    // Explicit method call if script is fully initialized
                    if ((window as any).growMe.triggerSubscribePopup) {
                        (window as any).growMe.triggerSubscribePopup(formId);
                    }
                    sessionStorage.setItem('grow_subscribe_triggered', 'true')
                } catch (e) {
                    console.warn('Grow subscribe trigger failed', e)
                }
            }
        }

        // 1. Time-based trigger (10 seconds)
        const timeTimer = setTimeout(triggerSubscribe, 10000)

        // 2. Scroll-based trigger (45%)
        const handleScroll = () => {
            const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight
            if (scrollPercent > 0.45) {
                triggerSubscribe()
                window.removeEventListener('scroll', handleScroll)
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            clearInterval(interval)
            clearTimeout(timeTimer)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [pathname])

    return null
}
