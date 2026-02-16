import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC_COLORS = path.join(ROOT, 'public', 'colors');
const COLOR_MEANING_PATH = path.join(ROOT, 'lib', 'color-meaning.json');

// Helper for contrast color
function getContrastColor(hex) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `${r}, ${g}, ${b}`;
}

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
}

// Ensure base output directory exists
if (!fs.existsSync(PUBLIC_COLORS)) {
    fs.mkdirSync(PUBLIC_COLORS, { recursive: true });
}

// Load color data
let colorData = {};
try {
    const content = fs.readFileSync(COLOR_MEANING_PATH, 'utf-8');
    colorData = JSON.parse(content);
} catch (e) {
    console.error("FATAL: Could not read color-meaning.json", e);
    process.exit(1);
}

const hexList = Object.keys(colorData);
console.log(`Starting generation for ${hexList.length} colors...`);

async function generateImage(hex) {
    const colorInfo = colorData[hex];
    const name = colorInfo.name || hex;
    const slug = slugify(name);
    const cleanHex = hex.replace('#', '').toLowerCase();

    const dir = path.join(PUBLIC_COLORS, cleanHex);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // SEO-friendly filename: {slug}-{hex}.webp
    const filename = `${slug}-${cleanHex}.webp`;
    const filePath = path.join(dir, filename);

    const bg = hex.startsWith('#') ? hex : '#' + hex;
    const fg = getContrastColor(cleanHex.toUpperCase());
    const rgb = hexToRgb(cleanHex.toUpperCase());

    // SVG Template for the color image (1200x630)
    const svg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <!-- Background Swatch -->
    <rect width="1200" height="630" fill="${bg}"/>
    
    <!-- Decorative Border -->
    <rect x="20" y="20" width="1160" height="590" fill="none" stroke="${fg}" stroke-width="4" opacity="0.2"/>

    <!-- Color Name -->
    <text x="600" y="220" 
          font-family="Arial, Helvetica, sans-serif" 
          font-size="84" 
          font-weight="bold" 
          fill="${fg}" 
          text-anchor="middle" 
          dominant-baseline="middle">
      ${name.toUpperCase()}
    </text>
    
    <!-- Hex Value -->
    <text x="600" y="320" 
          font-family="monospace" 
          font-size="64" 
          font-weight="bold" 
          fill="${fg}" 
          text-anchor="middle" 
          dominant-baseline="middle">
      #${cleanHex.toUpperCase()}
    </text>
    
    <!-- RGB Value -->
    <text x="600" y="410" 
          font-family="Arial, Helvetica, sans-serif" 
          font-size="42" 
          font-weight="normal" 
          fill="${fg}" 
          opacity="0.9"
          text-anchor="middle" 
          dominant-baseline="middle">
      rgb(${rgb})
    </text>
    
    <!-- Watermark / Brand -->
    <rect x="450" y="520" width="300" height="60" rx="30" fill="${fg}" opacity="0.1"/>
    <text x="600" y="550" 
          font-family="Arial, Helvetica, sans-serif" 
          font-size="28" 
          font-weight="bold" 
          fill="${fg}" 
          opacity="0.6"
          text-anchor="middle" 
          dominant-baseline="middle">
      HexColorMeans.com
    </text>
  </svg>
  `;

    try {
        await sharp(Buffer.from(svg))
            .webp({ quality: 85, effort: 6 })
            .toFile(filePath);
    } catch (err) {
        console.error(`Error generating ${hex}:`, err);
    }
}

async function run() {
    console.log('Generating images...');

    // Limit concurrency to keep memory usage sane
    const CHUNK_SIZE = 25;
    for (let i = 0; i < hexList.length; i += CHUNK_SIZE) {
        const chunk = hexList.slice(i, i + CHUNK_SIZE);
        await Promise.all(chunk.map(h => generateImage(h)));

        if (i % 100 === 0 || i === hexList.length - CHUNK_SIZE) {
            const percent = Math.round((i / hexList.length) * 100);
            console.log(`Progress: ${i} / ${hexList.length} (${percent}%)`);
        }
    }

    console.log('\nSuccess! All color images generated locally.');
    console.log(`Location: ${PUBLIC_COLORS}`);
}

run();
