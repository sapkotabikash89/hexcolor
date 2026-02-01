/**
 * Local Image Utils
 * Manages access to locally generated color images and CDN-hosted article images.
 * 
 * Architecture:
 * 1. Color Images: /public/colors/{hex}/{slug}-{hex}.webp (locally generated)
 * 2. Article Images: Derived from WordPress CMS
 */

import colorMeaningData from './color-meaning.json';
import { KNOWN_COLOR_HEXES } from './known-colors-complete';
import { hexToRgb } from './color-utils';

// --- CONFIGURATION ---

const GUMLET_BASE_URL = 'https://hexcolormeans.gumlet.io';
const WORDPRESS_UPLOADS_PATH = '/wp-content/uploads/';
const ARTICLE_IMAGE_BASE = `${GUMLET_BASE_URL}${WORDPRESS_UPLOADS_PATH}`;
const WORDPRESS_CMS_BASE = 'https://blog.hexcolormeans.com/wp-content/uploads/';

// --- COLOR IMAGES (GUMLET) ---

const knownHexSet = new Set<string>();
Object.keys(colorMeaningData).forEach(hex => knownHexSet.add(hex.toUpperCase()));
KNOWN_COLOR_HEXES.forEach(hex => knownHexSet.add(hex.toUpperCase()));

/**
 * Interface for Gumlet Color Image result
 */
export interface GumletColorImage {
    url: string;
    alt: string;
    filename: string;
}

/**
 * Central utility to generate Gumlet Image URL and mandatory Alt Text.
 * Format: https://hexcolormeans.gumlet.io/wp-content/uploads/colors/{hex}/{seo-file-name}.webp
 */
export function getGumletColorImage(params: {
    colorName: string,
    hex: string,
    rgb?: { r: number, g: number, b: number }
}): GumletColorImage {
    const { colorName, hex, rgb } = params;
    const cleanHex = hex.replace('#', '').toLowerCase();

    // Generate SEO friendly slug
    const slug = colorName.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const filename = `${slug}-${cleanHex}.webp`;
    const url = `${GUMLET_BASE_URL}${WORDPRESS_UPLOADS_PATH}colors/${cleanHex}/${filename}`;

    // Mandatory Alt Text Format:
    // Clear image showing {Color Name} color swatch with hex value {HEX} and RGB value ({R},{G},{B})
    const hexWithHash = hex.startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
    const rgbText = rgb ? `(${rgb.r},${rgb.g},${rgb.b})` : '(0,0,0)'; // Fallback if RGB not provided

    const alt = `Clear image showing ${colorName} color swatch with hex value ${hexWithHash} and RGB value ${rgbText}`;

    return { url, alt, filename };
}

/**
 * Get the color image URL (prioritizes Gumlet CDN).
 * Note: Keeps name "getLocalImageUrl" for backward compatibility but returns Gumlet URL.
 */
export function getLocalImageUrl(hex: string): string | null {
    const normalizedHex = hex.replace('#', '').toUpperCase();
    if (!knownHexSet.has(normalizedHex)) return null;

    const meta = (colorMeaningData as any)[normalizedHex];
    const rgb = hexToRgb(normalizedHex) || { r: 0, g: 0, b: 0 };

    return getGumletColorImage({
        colorName: meta?.name || normalizedHex,
        hex: normalizedHex,
        rgb
    }).url;
}

/**
 * Get the absolute color image URL (always Gumlet CDN).
 */
export function getLocalImageAbsoluteUrl(hex: string, colorName?: string, rgb?: { r: number, g: number, b: number }): string | null {
    const normalizedHex = hex.replace('#', '').toUpperCase();
    if (!knownHexSet.has(normalizedHex)) return null;

    if (colorName) {
        return getGumletColorImage({ colorName, hex, rgb }).url;
    }

    return getLocalImageUrl(normalizedHex);
}

// --- ARTICLE IMAGES (GUMLET) ---

/**
 * Check if a URL is a WordPress CMS image URL
 */
export function isWordPressImageUrl(url: string): boolean {
    if (!url) return false;
    return url.includes('blog.hexcolormeans.com/wp-content/uploads/') ||
        url.includes('hexcolormeans.gumlet.io/wp-content/uploads/');
}

/**
 * Convert WordPress CMS URL to the configured Gumlet Article Image Base
 */
export function convertToArticleImageUrl(url: string): string {
    if (!url) return url;

    // If already a Gumlet URL, return as is
    if (url.includes('hexcolormeans.gumlet.io')) return url;

    if (isWordPressImageUrl(url)) {
        return url.replace(WORDPRESS_CMS_BASE, ARTICLE_IMAGE_BASE);
    }

    const variations = [
        'http://blog.hexcolormeans.com/wp-content/uploads/',
        '//blog.hexcolormeans.com/wp-content/uploads/',
    ];

    for (const variant of variations) {
        if (url.includes(variant)) {
            return url.replace(variant, ARTICLE_IMAGE_BASE);
        }
    }

    return url;
}

/**
 * Convert all WordPress image URLs in HTML content to Gumlet CDN base
 */
export function convertHtmlImagesToBase(html: string): string {
    if (!html) return html;

    // Replace src attributes to point to Gumlet
    let converted = html.replace(
        /src=["'](https?:)?\/\/blog\.hexcolormeans\.com\/wp-content\/uploads\/([^"']+)["']/gi,
        `src="${ARTICLE_IMAGE_BASE}$2"`
    );

    // Replace srcset attributes
    converted = converted.replace(
        /srcset=["']([^"']*blog\.hexcolormeans\.com\/wp-content\/uploads\/[^"']*)["']/gi,
        (match, srcset) => {
            const convertedSrcset = srcset.replace(
                /(https?:)?\/\/blog\.hexcolormeans\.com\/wp-content\/uploads\//gi,
                ARTICLE_IMAGE_BASE
            );
            return `srcset="${convertedSrcset}"`;
        }
    );

    // Replace background image URLs
    converted = converted.replace(
        /url\((["']?)(https?:)?\/\/blog\.hexcolormeans\.com\/wp-content\/uploads\/([^)"']+)\1\)/gi,
        `url($1${ARTICLE_IMAGE_BASE}$3$1)`
    );

    return converted;
}
