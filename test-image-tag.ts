import { getGumletImageUrl } from "./lib/gumlet-utils";

// Test if image URLs are being generated correctly
const testColors = ['B0BF1A', 'FF6B6B', '000000', 'FFFFFF'];

console.log('Testing Gumlet image URLs:');
testColors.forEach(hex => {
  const imageUrl = getGumletImageUrl(`#${hex}`);
  console.log(`${hex}: ${imageUrl ? '✓ Has image' : '✗ No image'} - ${imageUrl || 'N/A'}`);
});

// Also check if the colors exist in color-meaning.json
import colorMeaning from "./lib/color-meaning.json";
console.log('\nColors in color-meaning.json:');
Object.keys(colorMeaning).slice(0, 10).forEach(hex => {
  console.log(`- ${hex}: ${colorMeaning[hex as keyof typeof colorMeaning]?.name || 'No name'}`);
});