"use client"

import { useEffect } from "react"

/**
 * Mounted in the root layout.
 * Intercepts all programmatic SPA navigations (router.push, history.pushState, etc.)
 * and converts them to hard browser reloads.
 * Works alongside ForceReloadLink for <a>-based navigation.
 */
export function NavigationInterceptor() {
  useEffect(() => {
    // Intercept history.pushState so calls like router.push() trigger full reloads
    const originalPushState = history.pushState.bind(history)
    history.pushState = function (state, title, url) {
      // Let Next.js do its internal routing first, then force a reload
      originalPushState(state, title, url)
      if (url && typeof url === "string") {
        // Small delay to allow Next.js route handlers to fire, then reload
        window.location.href = url
      }
    }

    const originalReplaceState = history.replaceState.bind(history)
    history.replaceState = function (state, title, url) {
      originalReplaceState(state, title, url)
      if (url && typeof url === "string") {
        window.location.href = url
      }
    }

    // Cleanup on unmount (shouldn't happen in root layout, but good practice)
    return () => {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
    }
  }, [])

  return null
}
