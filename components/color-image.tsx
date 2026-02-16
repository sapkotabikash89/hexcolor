"use client"

import Image from 'next/image';
import { getGumletColorImage } from '@/lib/image-utils';
import { hexToRgb } from '@/lib/color-utils';

interface ColorImageProps {
  hex: string;
  name?: string;
  alt?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Reusable ColorImage component for displaying Gumlet CDN color images
 * Features:
 * - Width: 1200, Height: 630
 * - Mandatory SEO-friendly alt text
 * - Responsive via style maxWidth: "100%", height: "auto"
 */
export function ColorImage({ hex, name, alt, priority = false, className = '' }: ColorImageProps) {
  const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };

  // Use central utility for Gumlet URL and Mandatory Alt Text
  const gumlet = getGumletColorImage({
    colorName: name || hex,
    hex,
    rgb
  });

  const altText = alt || gumlet.alt;

  return (
    <Image
      src={gumlet.url}
      alt={altText}
      width={1200}
      height={630}
      priority={priority}
      fetchPriority={priority ? "high" : "auto"}
      loading={priority ? undefined : 'lazy'}
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px"
      className={className}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAADAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  );
}
