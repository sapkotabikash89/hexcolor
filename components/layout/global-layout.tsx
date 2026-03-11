import React from "react"
import { cn } from "@/lib/utils"

interface GlobalLayoutProps {
  children: React.ReactNode
  leftSidebar?: React.ReactNode
  rightSidebar?: React.ReactNode
  className?: string
  leftSidebarClassName?: string
  rightSidebarClassName?: string
  articleClassName?: string
}

export function GlobalLayout({
  children,
  leftSidebar,
  rightSidebar,
  className,
  leftSidebarClassName,
  rightSidebarClassName,
  articleClassName,
}: GlobalLayoutProps) {
  return (
    <div className="site-container">
      <div className={cn("page-layout", className)}>
        {leftSidebar && (
          <aside className={cn("sidebar sidebar-left hidden lg:block shrink-0 transition-all duration-300", leftSidebarClassName)}>
            {leftSidebar}
          </aside>
        )}
        <main className="mv-content-body flex-1 min-w-0">
          <article id="content" className={cn("post-content", articleClassName)} itemProp="articleBody">
            {children}
          </article>
        </main>
        {rightSidebar && (
          <aside className={cn("sidebar sidebar-right hidden lg:block shrink-0 transition-all duration-300", rightSidebarClassName)}>
            {rightSidebar}
          </aside>
        )}
      </div>
    </div>
  )
}
