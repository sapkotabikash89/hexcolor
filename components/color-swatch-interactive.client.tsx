"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { getColorPageLink } from "@/lib/color-linking-utils"

interface ColorSwatchInteractiveProps {
  color: string
  onClick?: () => void
  children: React.ReactNode
}

export function ColorSwatchInteractive({ color, onClick, children }: ColorSwatchInteractiveProps) {
  const router = useRouter()

  const handleSwatchClick = () => {
    window.dispatchEvent(new CustomEvent("colorUpdate", { detail: { color } }))

    if (onClick) {
      onClick()
    } else {
      router.push(getColorPageLink(color))
    }
  }

  return (
    <div onClick={handleSwatchClick}>
      {children}
    </div>
  )
}
