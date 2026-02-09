#!/usr/bin/env node

/**
 * Verify Static Export Output
 * Checks that the build output is correct and complete
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.join(__dirname, '..', 'out');

console.log('🔍 Verifying static export output...\n');

let errors = 0;
let warnings = 0;

// Check if out directory exists
if (!fs.existsSync(OUT_DIR)) {
    console.error('❌ ERROR: /out directory does not exist!');
    console.error('   Run "npm run build" first.\n');
    process.exit(1);
}

// Check critical files
const criticalFiles = [
    'index.html',
    'sitemap.xml',
    'robots.txt',
    '_redirects',
    '_headers',
];

console.log('📄 Checking critical files...');
criticalFiles.forEach(file => {
    const filePath = path.join(OUT_DIR, file);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`   ✅ ${file} (${stats.size} bytes)`);
    } else {
        console.error(`   ❌ MISSING: ${file}`);
        errors++;
    }
});

// Check sitemaps
console.log('\n🗺️  Checking sitemaps...');
const sitemaps = [
    'sitemap-legal.xml',
    'sitemap-tools.xml',
    'sitemap-colors.xml',
    'sitemap-posts.xml',
    'sitemap-images.xml',
];

sitemaps.forEach(sitemap => {
    const filePath = path.join(OUT_DIR, sitemap);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`   ✅ ${sitemap} (${(stats.size / 1024).toFixed(1)} KB)`);
    } else {
        console.error(`   ❌ MISSING: ${sitemap}`);
        errors++;
    }
});

// Check sample color pages
console.log('\n🎨 Checking sample color pages...');
const sampleColors = ['ff0000', '00ff00', '0000ff', 'ffffff', '000000'];
sampleColors.forEach(hex => {
    const filePath = path.join(OUT_DIR, 'colors', hex, 'index.html');
    if (fs.existsSync(filePath)) {
        console.log(`   ✅ /colors/${hex}/`);
    } else {
        console.warn(`   ⚠️  MISSING: /colors/${hex}/`);
        warnings++;
    }
});

// Check tool pages
console.log('\n🛠️  Checking tool pages...');
const toolPages = [
    'color-picker',
    'color-wheel',
    'contrast-checker',
];

toolPages.forEach(tool => {
    const filePath = path.join(OUT_DIR, tool, 'index.html');
    if (fs.existsSync(filePath)) {
        console.log(`   ✅ /${tool}/`);
    } else {
        console.error(`   ❌ MISSING: /${tool}/`);
        errors++;
    }
});

// Check static assets
console.log('\n📦 Checking static assets...');
const assetsDir = path.join(OUT_DIR, '_next', 'static');
if (fs.existsSync(assetsDir)) {
    console.log('   ✅ /_next/static/ exists');

    // Count files
    const countFiles = (dir) => {
        let count = 0;
        const items = fs.readdirSync(dir);
        items.forEach(item => {
            const itemPath = path.join(dir, item);
            const stats = fs.statSync(itemPath);
            if (stats.isDirectory()) {
                count += countFiles(itemPath);
            } else {
                count++;
            }
        });
        return count;
    };

    const fileCount = countFiles(assetsDir);
    console.log(`   ℹ️  ${fileCount} static asset files`);
} else {
    console.warn('   ⚠️  /_next/static/ directory not found');
    warnings++;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(50));

if (errors === 0 && warnings === 0) {
    console.log('✅ All checks passed!');
    console.log('\n🚀 Your static export is ready for deployment!');
    console.log('\nNext steps:');
    console.log('1. Test locally: npm start');
    console.log('2. Deploy to Cloudflare Pages');
    console.log('3. See CLOUDFLARE_DEPLOYMENT_GUIDE.md for instructions');
} else {
    if (errors > 0) {
        console.error(`\n❌ ${errors} error(s) found`);
    }
    if (warnings > 0) {
        console.warn(`⚠️  ${warnings} warning(s) found`);
    }

    if (errors > 0) {
        console.log('\n⚠️  Please fix errors before deploying.');
        process.exit(1);
    } else {
        console.log('\n⚠️  Warnings found, but build is acceptable.');
        console.log('You can proceed with deployment.');
    }
}

console.log('');
