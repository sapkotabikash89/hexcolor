"use client"

interface BlogContentProps {
  html: string
  className?: string
  style?: React.CSSProperties
}

export function BlogContent({ html, className = '', style }: BlogContentProps) {
  return (
    <div
      className={`wp-content not-prose ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
