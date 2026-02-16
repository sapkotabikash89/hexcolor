"use client"

import { useEffect, useRef, useState } from 'react'
import { convertToArticleImageUrl } from '@/lib/image-utils'

interface BlogImageProps {
    src: string
    alt?: string
    width?: number
    height?: number
    className?: string
}

/**
 * BlogImage component for inline/post content images
 * - Keeps original dimensions
 * - Fully responsive (max-width: 100%, height: auto)
 * - Lazy-loaded
 * - Client-side only (no SSR)
 * - Automatically converts WordPress URLs to the configured article image base
 */
export function BlogImage({
    src,
    alt = '',
    width,
    height,
    className = ''
}: BlogImageProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)

    // Convert WordPress URL to configured Article Image Base
    const imageUrl = convertToArticleImageUrl(src)

    useEffect(() => {
        const img = imgRef.current
        if (!img) return

        // Set up intersection observer for lazy loading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsLoaded(true)
                        observer.disconnect()
                    }
                })
            },
            {
                rootMargin: '50px',
            }
        )

        observer.observe(img)

        return () => {
            observer.disconnect()
        }
    }, [])

    return (
        <img
            ref={imgRef}
            src={isLoaded ? imageUrl : ''}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            className={`max-w-full h-auto ${className}`}
            style={{
                aspectRatio: width && height ? `${width} / ${height}` : undefined,
            }}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 75vw, (max-width: 1024px) 60vw, 50vw"
        />
    )
}
