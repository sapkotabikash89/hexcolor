#!/usr/bin/env node

/**
 * Generate Static Sitemaps for Cloudflare Pages Deployment
 * This script generates all sitemap XML files at build time
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hexcolormeans.com';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const now = new Date().toISOString();

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

console.log('🗺️  Generating static sitemaps...');

/**
 * Generate sitemap-legal.xml
 */
function generateLegalSitemap() {
    const legalPages = [
        { url: `${BASE_URL}/about-us/`, priority: 0.5 },
        { url: `${BASE_URL}/contact/`, priority: 0.5 },
        { url: `${BASE_URL}/privacy-policy/`, priority: 0.3 },
        { url: `${BASE_URL}/terms-and-conditions/`, priority: 0.3 },
        { url: `${BASE_URL}/cookie-policy/`, priority: 0.3 },
        { url: `${BASE_URL}/disclaimer/`, priority: 0.3 },
        { url: `${BASE_URL}/editorial-policy/`, priority: 0.3 },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${legalPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-legal.xml'), xml);
    console.log('✅ Generated sitemap-legal.xml');
}

/**
 * Generate sitemap-tools.xml
 */
function generateToolsSitemap() {
    const toolPages = [
        { url: `${BASE_URL}/`, priority: 1.0 },
        { url: `${BASE_URL}/color-picker/`, priority: 0.9 },
        { url: `${BASE_URL}/color-wheel/`, priority: 0.8 },
        { url: `${BASE_URL}/contrast-checker/`, priority: 0.8 },
        { url: `${BASE_URL}/color-blindness-simulator/`, priority: 0.8 },
        { url: `${BASE_URL}/image-color-picker/`, priority: 0.8 },
        { url: `${BASE_URL}/palette-from-image/`, priority: 0.8 },
        { url: `${BASE_URL}/screen-color-picker/`, priority: 0.7 },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${toolPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-tools.xml'), xml);
    console.log('✅ Generated sitemap-tools.xml');
}

/**
 * Generate sitemap-colors.xml
 */
function generateColorsSitemap() {
    try {
        // Color pages are intentionally excluded from sitemaps.
        // Generate an empty sitemap-colors.xml for backward compatibility.
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

        fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-colors.xml'), xml);
        console.log('✅ Generated empty sitemap-colors.xml (color pages excluded)');
    } catch (error) {
        console.error('❌ Error generating colors sitemap:', error.message);
    }
}

/**
 * Generate sitemap-posts.xml
 */
function generatePostsSitemap() {
    try {
        // Load blog posts from local JSON
        const postsDir = path.join(__dirname, '..', 'lib', 'posts');
        const blogPostsDataPath = path.join(__dirname, '..', 'lib', 'blog-posts-data.json');

        let posts = [];

        // Try to load from blog-posts-data.json
        if (fs.existsSync(blogPostsDataPath)) {
            posts = JSON.parse(fs.readFileSync(blogPostsDataPath, 'utf8'));
        } else if (fs.existsSync(postsDir)) {
            // Fallback: read individual post files
            const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.json'));
            posts = postFiles.map(file => {
                const data = JSON.parse(fs.readFileSync(path.join(postsDir, file), 'utf8'));
                return data;
            });
        }

        if (posts.length > 0) {
            const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${posts.map(post => {
                let uri = post.uri || '';
                if (uri && !uri.endsWith('/')) uri = `${uri}/`;
                const url = uri.startsWith('http') ? (uri.endsWith('/') ? uri : `${uri}/`) : `${BASE_URL}${uri}`;
                // Ensure date is in ISO 8601 format (YYYY-MM-DDThh:mm:ssTZD)
                let dateStr = post.date || now;
                try {
                    // If date string doesn't have timezone, assume UTC or append Z if needed
                    // But safest is to let Date object parse it and output ISO string
                    dateStr = new Date(dateStr).toISOString();
                } catch (e) {
                    dateStr = now; // Fallback to now if invalid
                }

                return `  <url>
    <loc>${url}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
            }).join('\n')}
</urlset>`;

            fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-posts.xml'), xml);
            console.log(`✅ Generated sitemap-posts.xml (${posts.length} posts)`);
        } else {
            console.warn('⚠️  No blog posts found, creating empty sitemap-posts.xml');
            const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
            fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-posts.xml'), xml);
        }
    } catch (error) {
        console.error('❌ Error generating posts sitemap:', error.message);
    }
}

/**
 * Helper: Convert Hex to RGB
 */
function hexToRgb(hex) {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
}

/**
 * Helper: Generate Gumlet Color Image Data
 * Matches logic in lib/image-utils.ts
 */
function getGumletColorImage(params) {
    const { colorName, hex, rgb } = params;
    const cleanHex = hex.replace('#', '').toLowerCase();
    const GUMLET_BASE_URL = 'https://hexcolormeans.gumlet.io';
    const WORDPRESS_UPLOADS_PATH = '/wp-content/uploads/';

    // Generate SEO friendly slug
    const slug = colorName.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const filename = `${slug}-${cleanHex}.webp`;
    const url = `${GUMLET_BASE_URL}${WORDPRESS_UPLOADS_PATH}colors/${cleanHex}/${filename}`;

    const hexWithHash = hex.startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
    const rgbText = rgb ? `(${rgb.r},${rgb.g},${rgb.b})` : '(0,0,0)';

    const alt = `Clear image showing ${colorName} color swatch with hex value ${hexWithHash} and RGB value ${rgbText}`;

    return { url, alt, filename };
}

const GUMLET_BASE_URL = 'https://hexcolormeans.gumlet.io';
const WORDPRESS_UPLOADS_PATH = '/wp-content/uploads/';
const ARTICLE_IMAGE_BASE = `${GUMLET_BASE_URL}${WORDPRESS_UPLOADS_PATH}`;

function normalizeArticleImageUrl(url) {
    if (!url) return null;
    if (url.includes('hexcolormeans.gumlet.io')) return url;
    const directMatch = url.match(/^https?:\/\/blog\.hexcolormeans\.com(\/wp-content\/.+)$/);
    if (directMatch) {
        return `${GUMLET_BASE_URL}${directMatch[1]}`;
    }
    if (url.startsWith('//blog.hexcolormeans.com/')) {
        return url.replace('//blog.hexcolormeans.com', GUMLET_BASE_URL);
    }
    return url;
}

function extractImageUrlsFromHtml(html) {
    if (!html) return [];
    const urls = [];
    const imgRegex = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
        urls.push(match[1]);
    }
    return urls;
}

function generateImagesSitemap() {
    try {
        let allImageUrls = [];

        const blogPostsDataPath = path.join(__dirname, '..', 'lib', 'blog-posts-data.json');
        const postsDir = path.join(__dirname, '..', 'lib', 'posts');
        const hasPostsDir = fs.existsSync(postsDir);
        if (fs.existsSync(blogPostsDataPath)) {
            const posts = JSON.parse(fs.readFileSync(blogPostsDataPath, 'utf8'));
            posts.forEach(post => {
                let uri = post.uri || '';
                if (uri && !uri.endsWith('/')) uri = `${uri}/`;
                const pageUrl = uri.startsWith('http') ? (uri.endsWith('/') ? uri : `${uri}/`) : `${BASE_URL}${uri}`;

                const imageSet = new Set();
                const addImage = (url, titleCandidate) => {
                    if (!url) return;
                    const normalized = normalizeArticleImageUrl(url);
                    if (!normalized) return;
                    if (!normalized.includes('/wp-content/uploads/')) return;
                    if (imageSet.has(normalized)) return;
                    imageSet.add(normalized);
                    const imageTitle =
                        titleCandidate ||
                        (post.featuredImage && post.featuredImage.node && post.featuredImage.node.altText) ||
                        post.title ||
                        'Image';
                    allImageUrls.push({ pageUrl, imageUrl: normalized, imageTitle });
                };

                if (post.featuredImage && post.featuredImage.node && post.featuredImage.node.sourceUrl) {
                    addImage(post.featuredImage.node.sourceUrl, post.featuredImage.node.altText);
                }

                if (post.seo && post.seo.opengraphImage) {
                    if (post.seo.opengraphImage.sourceUrl) {
                        addImage(post.seo.opengraphImage.sourceUrl);
                    }
                    if (post.seo.opengraphImage.mediaItemUrl) {
                        addImage(post.seo.opengraphImage.mediaItemUrl);
                    }
                }

                const rawSchema = post.seo && post.seo.schema && post.seo.schema.raw;
                if (rawSchema) {
                    try {
                        const schema = JSON.parse(rawSchema);
                        const graph = Array.isArray(schema['@graph']) ? schema['@graph'] : [];
                        graph.forEach(node => {
                            if (!node || typeof node !== 'object') return;
                            if (typeof node.thumbnailUrl === 'string') {
                                addImage(node.thumbnailUrl, post.title);
                            }
                            const img = node.image;
                            if (!img) return;
                            if (typeof img === 'string') {
                                addImage(img, post.title);
                            } else if (typeof img === 'object') {
                                if (typeof img.url === 'string') {
                                    addImage(img.url, post.title);
                                } else if (typeof img.contentUrl === 'string') {
                                    addImage(img.contentUrl, post.title);
                                }
                            }
                        });
                    } catch (e) {
                    }
                }

                if (hasPostsDir) {
                    let fullPost = null;
                    let slug = post.slug || null;
                    if (!slug && post.uri) {
                        slug = post.uri.replace(/^\/|\/$/g, '').replace(/\//g, '-');
                    }
                    if (slug) {
                        const fullPath = path.join(postsDir, `${slug}.json`);
                        if (fs.existsSync(fullPath)) {
                            try {
                                fullPost = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                            } catch (e) {
                                fullPost = null;
                            }
                        }
                    }
                    const htmlContent = fullPost && typeof fullPost.content === 'string' ? fullPost.content : null;
                    if (htmlContent) {
                        const inlineUrls = extractImageUrlsFromHtml(htmlContent);
                        inlineUrls.forEach(url => {
                            addImage(url);
                        });
                    }
                }
            });
        }

        if (allImageUrls.length > 0) {
            const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allImageUrls.map(entry => {
                // Escape special characters in XML
                const safeImageUrl = entry.imageUrl.replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;');
                const safeImageTitle = entry.imageTitle.replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;');

                return `  <url>
    <loc>${entry.pageUrl}</loc>
    <image:image>
      <image:loc>${safeImageUrl}</image:loc>
      <image:title>${safeImageTitle}</image:title>
    </image:image>
  </url>`;
            }).join('\n')}
</urlset>`;

            fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-images.xml'), xml);
            console.log(`✅ Generated sitemap-images.xml (${allImageUrls.length} images)`);
        } else {
            // Fallback
            const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${BASE_URL}/</loc>
    <image:image>
      <image:loc>${BASE_URL}/logo.png</image:loc>
      <image:title>HexColorMeans Logo</image:title>
    </image:image>
  </url>
</urlset>`;
            fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-images.xml'), xml);
            console.log('✅ Generated sitemap-images.xml (fallback)');
        }
    } catch (error) {
        console.error('❌ Error generating images sitemap:', error.message);
    }
}

/**
 * Generate _redirects file for Cloudflare Pages
 */
function generateRedirects() {
    try {
        const blogPostsDataPath = path.join(__dirname, '..', 'lib', 'blog-posts-data.json');
        if (!fs.existsSync(blogPostsDataPath)) {
            console.warn('⚠️  No blog posts found, skipping _redirects generation');
            return;
        }

        const posts = JSON.parse(fs.readFileSync(blogPostsDataPath, 'utf8'));
        const redirects = [];

        posts.forEach(post => {
            // Extract hex from title
            const match = post.title.trim().match(/^([0-9A-Fa-f]{6})\b/);
            const matchHash = post.title.trim().match(/^#([0-9A-Fa-f]{6})\b/);

            let hex = null;
            if (match) hex = match[1];
            else if (matchHash) hex = matchHash[1];

            if (hex) {
                const targetPath = post.uri || `/`; // Fallback to root if no uri

                // Cloudflare _redirects format: /source /target code
                // Generate for both uppercase and lowercase to be safe
                // Case 1: Uppercase hex
                redirects.push(`/colors/${hex.toUpperCase()} ${targetPath} 301`);

                // Case 2: Lowercase hex (if different)
                if (hex.toUpperCase() !== hex.toLowerCase()) {
                    redirects.push(`/colors/${hex.toLowerCase()} ${targetPath} 301`);
                }
            }
        });

        if (redirects.length > 0) {
            const content = redirects.join('\n');
            fs.writeFileSync(path.join(PUBLIC_DIR, '_redirects'), content);
            console.log(`✅ Generated _redirects (${redirects.length} rules)`);
        } else {
            console.log('ℹ️  No hex-specific redirects needed.');
        }

    } catch (error) {
        console.error('❌ Error generating _redirects:', error.message);
    }
}

/**
 * Generate main sitemap.xml (sitemap index)
 */
function generateMainSitemap() {
    const sitemaps = [
        `${BASE_URL}/sitemap-legal.xml`,
        `${BASE_URL}/sitemap-tools.xml`,
        `${BASE_URL}/sitemap-posts.xml`,
        `${BASE_URL}/sitemap-images.xml`,
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(loc => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml);
    console.log('✅ Generated sitemap.xml (index)');
}

// Generate all sitemaps
try {
    generateLegalSitemap();
    generateToolsSitemap();
    generateColorsSitemap();
    generatePostsSitemap();
    generateImagesSitemap();
    generateRedirects();
    generateMainSitemap();

    console.log('\n✨ All sitemaps generated successfully!');
    console.log(`📁 Location: ${PUBLIC_DIR}`);
} catch (error) {
    console.error('\n❌ Error generating sitemaps:', error);
    process.exit(1);
}
