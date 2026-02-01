"use client"

import React, { useRef } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getContrastColor } from '@/lib/color-utils'

interface ColorPatternsProps {
    color: string
}

export function ColorPatterns({ color }: ColorPatternsProps) {
    // Get contrasting color for pattern details
    const contrastColor = getContrastColor(color)

    // Lighten and darken the color for pattern variations
    const lightenColor = (hex: string, percent: number) => {
        const num = parseInt(hex.replace('#', ''), 16)
        const amt = Math.round(2.55 * percent)
        const R = (num >> 16) + amt
        const G = (num >> 8 & 0x00FF) + amt
        const B = (num & 0x0000FF) + amt
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1)
    }

    const darkenColor = (hex: string, percent: number) => {
        const num = parseInt(hex.replace('#', ''), 16)
        const amt = Math.round(2.55 * percent)
        const R = (num >> 16) - amt
        const G = (num >> 8 & 0x00FF) - amt
        const B = (num & 0x0000FF) - amt
        return '#' + (0x1000000 + (R > 0 ? R : 0) * 0x10000 +
            (G > 0 ? G : 0) * 0x100 +
            (B > 0 ? B : 0))
            .toString(16).slice(1)
    }

    const lightColor = lightenColor(color, 20)
    const darkColor = darkenColor(color, 20)

    // Define patterns with properties to allow reconstructing the SVG string
    const patterns = [
        {
            name: 'Diagonal Stripes',
            id: 'diagonal-stripes',
            defs: `<pattern id="diagonal-stripes" patternUnits="userSpaceOnUse" width="20" height="20">
                    <path d="M0 20L20 0M-5 5L5 -5M15 25L25 15" stroke="${contrastColor}" stroke-width="2" opacity="0.3" />
                   </pattern>`,
            rects: `<rect width="100%" height="100%" fill="${color}" />
                    <rect width="100%" height="100%" fill="url(#diagonal-stripes)" />`
        },
        {
            name: 'Polka Dots',
            id: 'polka-dots',
            defs: `<pattern id="polka-dots" patternUnits="userSpaceOnUse" width="30" height="30">
                    <circle cx="15" cy="15" r="4" fill="${contrastColor}" opacity="0.3" />
                   </pattern>`,
            rects: `<rect width="100%" height="100%" fill="${color}" />
                    <rect width="100%" height="100%" fill="url(#polka-dots)" />`
        },
        {
            name: 'Chevron',
            id: 'chevron',
            defs: `<pattern id="chevron" patternUnits="userSpaceOnUse" width="40" height="20">
                    <path d="M0 10L20 0L40 10L20 20Z" fill="${lightColor}" />
                    <path d="M0 10L20 0L40 10" stroke="${darkColor}" stroke-width="1" fill="none" />
                   </pattern>`,
            rects: `<rect width="100%" height="100%" fill="${color}" />
                    <rect width="100%" height="100%" fill="url(#chevron)" />`
        },
        {
            name: 'Diamond Grid',
            id: 'diamond-grid',
            defs: `<pattern id="diamond-grid" patternUnits="userSpaceOnUse" width="40" height="40">
                    <path d="M20 0L40 20L20 40L0 20Z" fill="${lightColor}" stroke="${darkColor}" stroke-width="1" />
                   </pattern>`,
            rects: `<rect width="100%" height="100%" fill="${color}" />
                    <rect width="100%" height="100%" fill="url(#diamond-grid)" />`
        },
        {
            name: 'Hexagon',
            id: 'hexagon',
            defs: `<pattern id="hexagon" patternUnits="userSpaceOnUse" width="56" height="48">
                    <path d="M28 0L52 14L52 34L28 48L4 34L4 14Z" fill="${lightColor}" stroke="${darkColor}" stroke-width="1" />
                    <path d="M28 48L52 62L52 82" fill="${lightColor}" stroke="${darkColor}" stroke-width="1" />
                   </pattern>`,
            rects: `<rect width="100%" height="100%" fill="${color}" />
                    <rect width="100%" height="100%" fill="url(#hexagon)" />`
        },
        {
            name: 'Waves',
            id: 'waves',
            defs: `<pattern id="waves" patternUnits="userSpaceOnUse" width="60" height="20">
                    <path d="M0 10Q15 0 30 10T60 10" stroke="${contrastColor}" stroke-width="2" fill="none" opacity="0.4" />
                    <path d="M0 15Q15 5 30 15T60 15" stroke="${contrastColor}" stroke-width="2" fill="none" opacity="0.2" />
                   </pattern>`,
            rects: `<rect width="100%" height="100%" fill="${color}" />
                    <rect width="100%" height="100%" fill="url(#waves)" />`
        },
        {
            name: 'Crosshatch',
            id: 'crosshatch',
            defs: `<pattern id="crosshatch" patternUnits="userSpaceOnUse" width="20" height="20">
                    <path d="M0 0L20 20M20 0L0 20" stroke="${contrastColor}" stroke-width="1" opacity="0.3" />
                   </pattern>`,
            rects: `<rect width="100%" height="100%" fill="${color}" />
                    <rect width="100%" height="100%" fill="url(#crosshatch)" />`
        },
        {
            name: 'Zigzag',
            id: 'zigzag',
            defs: `<pattern id="zigzag" patternUnits="userSpaceOnUse" width="40" height="20">
                    <path d="M0 10L10 0L20 10L30 0L40 10L40 20L30 10L20 20L10 10L0 20Z" fill="${lightColor}" />
                    <path d="M0 10L10 0L20 10L30 0L40 10" stroke="${darkColor}" stroke-width="1.5" fill="none" />
                   </pattern>`,
            rects: `<rect width="100%" height="100%" fill="${color}" />
                    <rect width="100%" height="100%" fill="url(#zigzag)" />`
        },
        {
            name: 'Brick Wall',
            id: 'brick-wall',
            defs: `<pattern id="brick-wall" patternUnits="userSpaceOnUse" width="60" height="40">
                    <rect x="0" y="0" width="30" height="20" fill="${lightColor}" stroke="${darkColor}" stroke-width="1" />
                    <rect x="30" y="0" width="30" height="20" fill="${lightColor}" stroke="${darkColor}" stroke-width="1" />
                    <rect x="-15" y="20" width="30" height="20" fill="${lightColor}" stroke="${darkColor}" stroke-width="1" />
                    <rect x="15" y="20" width="30" height="20" fill="${lightColor}" stroke="${darkColor}" stroke-width="1" />
                    <rect x="45" y="20" width="30" height="20" fill="${lightColor}" stroke="${darkColor}" stroke-width="1" />
                   </pattern>`,
            rects: `<rect width="100%" height="100%" fill="${color}" />
                    <rect width="100%" height="100%" fill="url(#brick-wall)" />`
        },
        {
            name: 'Triangles',
            id: 'triangles',
            defs: `<pattern id="triangles" patternUnits="userSpaceOnUse" width="40" height="35">
                    <path d="M20 0L40 35L0 35Z" fill="${lightColor}" stroke="${darkColor}" stroke-width="1" />
                    <path d="M0 0L20 35L-20 35Z" fill="${darkColor}" opacity="0.3" />
                    <path d="M40 0L60 35L20 35Z" fill="${darkColor}" opacity="0.3" />
                   </pattern>`,
            rects: `<rect width="100%" height="100%" fill="${color}" />
                    <rect width="100%" height="100%" fill="url(#triangles)" />`
        },
        {
            name: 'Circles Grid',
            id: 'circles-grid',
            defs: `<pattern id="circles-grid" patternUnits="userSpaceOnUse" width="40" height="40">
                    <circle cx="20" cy="20" r="15" fill="none" stroke="${contrastColor}" stroke-width="2" opacity="0.3" />
                    <circle cx="20" cy="20" r="8" fill="${contrastColor}" opacity="0.2" />
                   </pattern>`,
            rects: `<rect width="100%" height="100%" fill="${color}" />
                    <rect width="100%" height="100%" fill="url(#circles-grid)" />`
        },
        {
            name: 'Herringbone',
            id: 'herringbone',
            defs: `<pattern id="herringbone" patternUnits="userSpaceOnUse" width="40" height="40">
                    <rect x="0" y="0" width="20" height="10" fill="${lightColor}" stroke="${darkColor}" stroke-width="0.5" />
                    <rect x="20" y="10" width="20" height="10" fill="${lightColor}" stroke="${darkColor}" stroke-width="0.5" />
                    <rect x="0" y="20" width="20" height="10" fill="${darkColor}" opacity="0.3" stroke="${darkColor}" stroke-width="0.5" />
                    <rect x="20" y="30" width="20" height="10" fill="${darkColor}" opacity="0.3" stroke="${darkColor}" stroke-width="0.5" />
                   </pattern>`,
            rects: `<rect width="100%" height="100%" fill="${color}" />
                    <rect width="100%" height="100%" fill="url(#herringbone)" />`
        }
    ]

    const downloadPattern = (index: number) => {
        const pattern = patterns[index]
        const svgData = `
            <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
                <defs>${pattern.defs}</defs>
                ${pattern.rects}
            </svg>
        `

        const canvas = document.createElement('canvas')
        canvas.width = 1920
        canvas.height = 1080
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const img = new Image()
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)

        img.onload = () => {
            ctx.drawImage(img, 0, 0)
            URL.revokeObjectURL(url)

            const pngUrl = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = pngUrl
            a.download = `${pattern.name.toLowerCase().replace(/\s+/g, '-')}-pattern.png`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        }
        img.src = url
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {patterns.map((pattern, index) => (
                <div
                    key={index}
                    className="group relative aspect-video sm:aspect-square rounded-xl border-2 border-border overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                    <div
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{
                            __html: `<svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs>${pattern.defs}</defs>${pattern.rects}</svg>`
                        }}
                    />

                    {/* Overlay elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Name at bottom left */}
                        <div className="absolute bottom-0 left-0 p-3 w-full bg-gradient-to-t from-black/60 to-transparent">
                            <span className="text-white font-semibold text-sm drop-shadow-md">
                                {pattern.name}
                            </span>
                        </div>
                    </div>

                    {/* Download button at bottom right - initially hidden, shown on hover */}
                    <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md h-8 w-8 z-10"
                        onClick={() => downloadPattern(index)}
                        title="Download PNG"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            ))}
        </div>
    )
}
