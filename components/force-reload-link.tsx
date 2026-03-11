"use client"

import type React from "react"
import type { ComponentPropsWithoutRef } from "react"

type ForceReloadLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string
  prefetch?: boolean   // accepted but ignored, for drop-in compatibility
  passHref?: boolean
  replace?: boolean
  scroll?: boolean
}

/**
 * Drop-in replacement for next/link that forces a full browser reload.
 * This ensures all scripts (ads, analytics) reinitialise on every navigation.
 * SEO-friendly: renders a standard <a> tag with the href intact.
 */
export function ForceReloadLink({
  href,
  children,
  onClick,
  prefetch: _prefetch,
  passHref: _passHref,
  replace: _replace,
  scroll: _scroll,
  ...rest
}: ForceReloadLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Call any existing onClick first
    if (onClick) onClick(e)

    // Only intercept left-clicks without modifier keys on internal links
    const isInternal =
      href.startsWith("/") ||
      href.startsWith("#") ||
      href.startsWith("https://hexcolormeans.com") ||
      href.startsWith("http://hexcolormeans.com")

    if (
      isInternal &&
      !e.defaultPrevented &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey &&
      e.button === 0
    ) {
      e.preventDefault()
      // Normalize: strip the origin to get a path
      const target = href.startsWith("http")
        ? new URL(href).pathname + new URL(href).search + new URL(href).hash
        : href
      window.location.href = target
    }
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}

export default ForceReloadLink
