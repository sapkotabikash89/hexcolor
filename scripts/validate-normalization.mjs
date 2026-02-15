import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'out');
const colorsDir = path.join(outDir, 'colors');

console.log('🔍 Validating build output for case normalization...');

if (!fs.existsSync(colorsDir)) {
    console.log('⚠️  out/colors directory not found. Please run "npm run build" first.');
    process.exit(1);
}

const colorDirs = fs.readdirSync(colorsDir);
let errors = 0;
let uppercaseCount = 0;

colorDirs.forEach(dir => {
    if (dir === '.DS_Store') return;
    // Check if directory name contains any UPPERCASE letters
    if (dir.match(/[A-Z]/)) {
        console.error(`❌ Found uppercase directory: out/colors/${dir}`);
        uppercaseCount++;
        errors++;
    }
});

console.log(`\n📊 Summary:`);
console.log(`- Total color directories: ${colorDirs.length} (excluding .DS_Store)`);
console.log(`- Uppercase directories: ${uppercaseCount}`);

if (errors === 0) {
    console.log('✅ PASS: All color directories are lowercase.');
} else {
    console.log('❌ FAIL: Found uppercase color directories.');
}

// Check sitemap-colors.xml
const sitemapPath = path.join(outDir, 'sitemap-colors.xml');
if (fs.existsSync(sitemapPath)) {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    // Check for URLs containing uppercase A-F
    const uppercaseMatches = sitemap.match(/\/colors\/[0-9A-F]*[A-F][0-9A-F]*\//g);
    if (uppercaseMatches) {
        console.error(`❌ Found ${uppercaseMatches.length} uppercase URLs in sitemap-colors.xml`);
        console.error(`Example: ${uppercaseMatches[0]}`);
        errors++;
    } else {
        console.log('✅ PASS: All URLs in sitemap-colors.xml are lowercase.');
    }
} else {
    console.log('⚠️  sitemap-colors.xml not found.');
}

if (errors > 0) {
    process.exit(1);
}
