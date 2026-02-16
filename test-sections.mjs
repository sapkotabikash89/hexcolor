// Test to see what sections contain
import fs from 'fs';
import path from 'path';

// Read the blog post content
const content = fs.readFileSync('./lib/posts/shades-of-brown-color.json', 'utf8');
const postData = JSON.parse(content);

const html = postData.content;

// Simple split by H2 to see what each section contains
const sections = html.split(/<h2[^>]*>.*?<\/h2>/i);

console.log('Number of sections:', sections.length);
console.log('\nFirst few sections:');

// Show first 3 sections with their content
for (let i = 0; i < Math.min(3, sections.length); i++) {
  console.log(`\n=== Section ${i} ===`);
  console.log(sections[i].substring(0, 200) + '...');
  
  // Check if this section contains the pattern we're looking for
  const hasPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*\(#([0-9A-Fa-f]{6})\)/.test(sections[i]);
  console.log('Contains pattern:', hasPattern);
}