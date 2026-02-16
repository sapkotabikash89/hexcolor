import fs from 'fs';
import path from 'path';

const COLOR_MEANING_PATH = './lib/color-meaning.json';
const BLOG_POSTS_DIR = './lib/posts';

// Helper to calculate RGB and CMYK from Hex
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
}

function rgbToCmyk(r, g, b) {
    let r_norm = r / 255;
    let g_norm = g / 255;
    let b_norm = b / 255;

    let k = 1 - Math.max(r_norm, g_norm, b_norm);
    let c = k === 1 ? 0 : (1 - r_norm - k) / (1 - k);
    let m = k === 1 ? 0 : (1 - g_norm - k) / (1 - k);
    let y = k === 1 ? 0 : (1 - b_norm - k) / (1 - k);

    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100)
    };
}

// Load color meaning data
const colorMeaning = JSON.parse(fs.readFileSync(COLOR_MEANING_PATH, 'utf8'));
const nameToHexMap = {};
const hexToNameMap = {};
Object.entries(colorMeaning).forEach(([hex, data]) => {
    const cleanHex = hex.toLowerCase().replace('#', '');
    const cleanName = data.name.toLowerCase().trim();
    nameToHexMap[cleanName] = cleanHex;
    hexToNameMap[cleanHex] = data.name;
});

// Manual overrides and common aliases
const aliasMap = {
    'charcoal': 'charcoal blue',
    'charcoal black': 'charcoal blue',
    'midnight black': 'midnight blue',
    'raven black': 'black',
    'ink black': 'black',
    'black raven': 'black',
    'black ink': 'black',
    'black olive': 'charcoal brown',
    'gunmetal black': 'gunmetal',
    'espresso black': 'espresso',
    'midnight': 'midnight blue',
    'raven': 'black',
    'carbon': 'black grey',
    'carbon fiber': 'black grey',
    'matte black': 'matte black',
    'rich black': 'rich black',
    'shadow black': 'shadow',
    'black shadow': 'shadow',
    'void black': 'black',
    'absolute black': 'black',
    'true black': 'black',
    'oil black': 'black',
    'coal': 'black',
    'coal black': 'black',
    'graphite': 'graphite black',
    'black graphite': 'graphite black',
    'smoke black': 'smoke',
    'smoky black': 'smoke',
    'black smoke': 'smoke',
    'soot': 'black',
    'pure black': 'black',
    'jet black': 'jet black',
    'snow': 'snow',
    'ivory': 'ivory',
    'alabaster': 'alabaster',
    'bone': 'bone',
    'bisque': 'bisque',
    'cream': 'cream',
    'seashell': 'seashell',
    'linen': 'linen',
    'old lace': 'old lace',
    'floral white': 'floral white'
};

function getCanonicalHex(name, baseColor = '') {
    const lowerName = name.toLowerCase().trim();
    const findHex = (n) => {
        const hex = nameToHexMap[n];
        if (!hex) return null;

        // Family check: if baseColor is provided, ensure matched color is somewhat related
        const data = colorMeaning[hex.toUpperCase()] || colorMeaning['#' + hex.toUpperCase()];
        if (data && baseColor) {
            const l = data.hsl.l;
            if (baseColor === 'black' && l > 40) return null; // Too bright for black
            if (baseColor === 'white' && l < 70) return null; // Too dark for white
            // Add more family checks as needed
        }
        return hex;
    };

    // 1. Exact match
    let res = findHex(lowerName);
    if (res) return res;

    // 2. Alias match
    if (aliasMap[lowerName]) {
        res = findHex(aliasMap[lowerName]);
        if (res) return res;
    }

    // 3. Try removing "Black", "White", etc. if it's a suffix/prefix
    const baseNames = ['black', 'white', 'blue', 'green', 'red', 'yellow', 'orange', 'purple', 'pink', 'gray', 'grey'];
    let sansBase = lowerName;
    baseNames.forEach(b => {
        const reg = new RegExp(`\\s*${b}\\s*`, 'gi');
        sansBase = sansBase.replace(reg, ' ').trim();
    });

    if (sansBase && sansBase !== lowerName) {
        res = findHex(sansBase);
        if (res) return res;

        if (aliasMap[sansBase]) {
            res = findHex(aliasMap[sansBase]);
            if (res) return res;
        }
    }

    // 4. Try common name variations
    res = findHex(lowerName + ' ' + baseColor);
    if (res) return res;

    return null;
}

async function processFile(filePath) {
    console.log(`Processing ${filePath}...`);
    // Determine base color from filename
    const filename = path.basename(filePath);
    const baseMatch = filename.match(/shades-of-(.*?)-color/);
    const baseColor = baseMatch ? baseMatch[1] : '';

    let content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    let html = data.content;

    // Find headings which signify a color name
    const headingRegex = /<h2 class="wp-block-heading"><strong>(.*?)<\/strong><\/h2>/g;
    let match;
    const colorsToUpdate = [];

    while ((match = headingRegex.exec(html)) !== null) {
        const fullColorName = match[1].trim();
        // Clean name from "(Inspired)" or other suffixes for matching
        const cleanColorName = fullColorName.replace(/\s*\(Inspired\)\s*/gi, '').trim();
        const canonicalHex = getCanonicalHex(cleanColorName, baseColor);

        if (canonicalHex) {
            colorsToUpdate.push({ name: fullColorName, cleanName: cleanColorName, hex: canonicalHex });
            console.log(`  Matched "${fullColorName}" to canonical hex ${canonicalHex} (${hexToNameMap[canonicalHex]})`);
        } else {
            console.log(`  Warning: Color "${fullColorName}" (base: ${baseColor}) not found in canonical map.`);
        }
    }

    let changed = false;
    colorsToUpdate.forEach(color => {
        // 1. Update description paragraph: Name (#OLDHEX) -> <a href="/colors/NEWHEX">Name (#NEWHEX)</a>
        // Escape special characters in name for regex
        const escapedName = color.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const descRegex = new RegExp(`(${escapedName})\\s*\\(#([0-9A-Fa-f]{6})\\)`, 'gi');

        if (descRegex.test(html)) {
            html = html.replace(descRegex, (m, p1, p2) => {
                const newHex = color.hex.toUpperCase();
                return `<a href="/colors/${color.hex}">${p1} (#${newHex})</a>`;
            });
            changed = true;
        }

        // 2. Update metadata list
        const escapedSectionName = color.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const sectionRegex = new RegExp(`(<h2 class="wp-block-heading"><strong>${escapedSectionName}<\/strong><\/h2>[\\s\\S]*?<ul class="wp-block-list">)([\\s\\S]*?)(<\/ul>)`, 'gi');

        html = html.replace(sectionRegex, (m, prefix, listContent, suffix) => {
            let updatedList = listContent;
            const rgb = hexToRgb(color.hex);
            const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
            const hexUpper = color.hex.toUpperCase();

            // Replace HEX
            const oldHexMatch = updatedList.match(/<li>HEX\s*#?([0-9A-Fa-f]{6})<\/li>/i);
            if (oldHexMatch && oldHexMatch[1].toUpperCase() !== hexUpper) {
                updatedList = updatedList.replace(/<li>HEX\s*#?[0-9A-Fa-f]{6}<\/li>/i, `<li>HEX #${hexUpper}</li>`);
            } else if (!oldHexMatch) {
                // If HEX is missing or differently formatted, try to fix it anyway
                updatedList = updatedList.replace(/<li>HEX.*?<\/li>/i, `<li>HEX #${hexUpper}</li>`);
            }

            // Replace RGB
            updatedList = updatedList.replace(/<li>RGB\s*[0-9,\s]+<\/li>/i, `<li>RGB ${rgb.r}, ${rgb.g}, ${rgb.b}</li>`);
            // Replace CMYK
            updatedList = updatedList.replace(/<li>CMYK\s*[0-9,\s]+<\/li>/i, `<li>CMYK ${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}</li>`);

            if (updatedList !== listContent) changed = true;
            return prefix + updatedList + suffix;
        });
    });

    if (changed) {
        data.content = html;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`  Successfully updated ${filePath}`);
    } else {
        console.log(`  No changes made to ${filePath}`);
    }
}

const targetFile = process.argv[2];
if (targetFile) {
    const filePath = targetFile.includes('/') ? targetFile : path.join(BLOG_POSTS_DIR, targetFile);
    processFile(filePath);
} else {
    // Process all shades files
    const files = fs.readdirSync(BLOG_POSTS_DIR).filter(f => f.startsWith('shades-of-'));
    for (const file of files) {
        processFile(path.join(BLOG_POSTS_DIR, file));
    }
}
