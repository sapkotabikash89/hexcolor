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
    // Helper to check if the pathname actually changed
    // We don't want to hard-reload if only the query string (?key=val) or hash (#sec) changed
    const isPathChanged = (newUrlStr: string) => {
      try {
        const currentUrl = new URL(window.location.href, window.location.origin)
        const newUrl = new URL(newUrlStr, window.location.origin)
        return currentUrl.pathname !== newUrl.pathname
      } catch (e) {
        // If parsing fails for any reason, safely default to a hard reload
        return true
      }
    }

    // Intercept history.pushState so calls like router.push() trigger full reloads
    const originalPushState = history.pushState.bind(history)
    history.pushState = function (state, title, url) {
      // Let Next.js do its internal routing first
      originalPushState(state, title, url)
      
      if (url && typeof url === "string" && isPathChanged(url)) {
        window.location.href = url
      }
    }

    const originalReplaceState = history.replaceState.bind(history)
    history.replaceState = function (state, title, url) {
      originalReplaceState(state, title, url)
      
      if (url && typeof url === "string" && isPathChanged(url)) {
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
