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
        { url: `${BASE_URL}/colors/`, priority: 0.9 },
        { url: `${BASE_URL}/color-meanings/`, priority: 0.8 },
        { url: `${BASE_URL}/blog/`, priority: 0.7 },
        { url: `${BASE_URL}/categories/`, priority: 0.6 },
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
        // Load known colors from the JSON file
        const colorMeaningPath = path.join(__dirname, '..', 'lib', 'color-meaning.json');
        const knownColorsPath = path.join(__dirname, '..', 'lib', 'known-colors-complete.ts');

        let colorHexes = [];

        // Try to load from color-meaning.json
        if (fs.existsSync(colorMeaningPath)) {
            const colorData = JSON.parse(fs.readFileSync(colorMeaningPath, 'utf8'));
            colorHexes = Object.keys(colorData).map(hex => hex.toLowerCase());
        }

        // If we have colors, generate sitemap
        if (colorHexes.length > 0) {
            // Limit to first 50,000 URLs (sitemap limit)
            const colors = colorHexes.slice(0, 50000);

            const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${colors.map(hex => `  <url>
    <loc>${BASE_URL}/colors/${hex}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

            fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-colors.xml'), xml);
            console.log(`✅ Generated sitemap-colors.xml (${colors.length} colors)`);
        } else {
            console.warn('⚠️  No color data found, skipping sitemap-colors.xml');
        }
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
                const uri = post.uri || '';
                const url = uri.startsWith('http') ? uri : `${BASE_URL}${uri}`;
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
 * Generate sitemap-images.xml
 */
function generateImagesSitemap() {
    try {
        // Load blog posts to extract images
        const blogPostsDataPath = path.join(__dirname, '..', 'lib', 'blog-posts-data.json');
        let posts = [];

        if (fs.existsSync(blogPostsDataPath)) {
            posts = JSON.parse(fs.readFileSync(blogPostsDataPath, 'utf8'));
        }

        // Filter posts that have featured images
        const postsWithImages = posts.filter(post => 
            post.featuredImage && 
            post.featuredImage.node && 
            post.featuredImage.node.sourceUrl
        );

        if (postsWithImages.length > 0) {
            const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${postsWithImages.map(post => {
                const uri = post.uri || '';
                const pageUrl = uri.startsWith('http') ? uri : `${BASE_URL}${uri}`;
                const imageUrl = post.featuredImage.node.sourceUrl;
                const imageTitle = post.featuredImage.node.altText || post.title || 'Image';
                
                // Escape special characters in XML
                const safeImageUrl = imageUrl.replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;');
                const safeImageTitle = imageTitle.replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;');

                return `  <url>
    <loc>${pageUrl}</loc>
    <image:image>
      <image:loc>${safeImageUrl}</image:loc>
      <image:title>${safeImageTitle}</image:title>
    </image:image>
  </url>`;
            }).join('\n')}
</urlset>`;

            fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-images.xml'), xml);
            console.log(`✅ Generated sitemap-images.xml (${postsWithImages.length} images)`);
        } else {
            // If no images found, create a minimal valid sitemap with just the home page logo or similar
            // Or just an empty one but with a comment to avoid "missing tag" if possible, 
            // but Google requires at least one URL. 
            // Let's add the home page with a placeholder logo if no posts exist.
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
 * Generate main sitemap.xml (sitemap index)
 */
function generateMainSitemap() {
    const sitemaps = [
        `${BASE_URL}/sitemap-legal.xml`,
        `${BASE_URL}/sitemap-tools.xml`,
        `${BASE_URL}/sitemap-colors.xml`,
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
    generateMainSitemap();

    console.log('\n✨ All sitemaps generated successfully!');
    console.log(`📁 Location: ${PUBLIC_DIR}`);
} catch (error) {
    console.error('\n❌ Error generating sitemaps:', error);
    process.exit(1);
}
