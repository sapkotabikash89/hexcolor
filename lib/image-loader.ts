'use client'

export default function gumletLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // If the image is already optimized or external/not gumlet, return as is
  // But wait, we want to optimize everything through Gumlet if possible or just use Next.js sizing for everything.
  // Since we are using a custom loader, we must return a URL for every src.
  
  if (src.includes('hexcolormeans.gumlet.io')) {
    const params = [`w=${width}`];
    if (quality) {
      params.push(`q=${quality}`);
    }
    const paramsString = params.join('&');
    return `${src}?${paramsString}`;
  }

  // For local images or other domains, if we can't resize them via URL params, we just return them.
  // But for a static export with custom loader, Next.js expects the loader to handle resizing.
  // If we return the same URL for all widths, we lose responsive benefits for non-Gumlet images.
  // However, the user prioritized Gumlet.
  
  return src
}
