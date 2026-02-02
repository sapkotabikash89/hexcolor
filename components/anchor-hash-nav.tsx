"use client"

import { useCallback } from "react"
import { cn } from "@/lib/utils"
import { BLOG_NAV_ITEMS } from "@/lib/blog-nav-data"

interface NavItem {
  label: string
  href: string
}

interface AnchorHashNavProps {
  items?: NavItem[]
  className?: string
}

export { BLOG_NAV_ITEMS }

export function AnchorHashNav({ items, className }: AnchorHashNavProps) {
  const navItems = items || BLOG_NAV_ITEMS

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (!target) return
    const anchor = target.closest("a[href^='#']") as HTMLAnchorElement | null
    if (!anchor) return
    e.preventDefault()
    const href = anchor.getAttribute("href") || ""
    const id = href.replace("#", "")
    if (!id) return
    const el = document.getElementById(id)
    if (!el) return
    
    // Blazing fast scroll - instant jump
    const y = el.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top: y, behavior: "auto" }) // auto is instant
    history.replaceState(null, "", `#${id}`)
  }, [])

  return (
    <div className={cn("w-full bg-muted/30 border-b border-border z-40", className)} onClick={handleClick}>
      <div className="w-full max-w-[1300px] mx-auto px-4">
        <div className="flex overflow-x-auto no-scrollbar md:flex-wrap items-center whitespace-nowrap md:whitespace-normal py-4 gap-x-1.5 gap-y-1 text-base justify-start md:justify-center">
          {navItems.map((item, index) => (
            <div key={item.href} className="flex items-center">
              <a 
                href={item.href} 
                className="text-foreground hover:text-primary font-medium transition-colors"
              >
                {item.label}
              </a>
              {index < navItems.length - 1 && (
                <span className="ml-1 text-muted-foreground inline">|</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
