import { hasColorInTitle, hasExplicitHexInTitle } from "./lib/color-title-utils";

console.log("Testing explicit hex detection in titles...\n");

// Test cases for titles with and without explicit hex codes
const testTitles = [
  "FFA500 Color Orange Meaning – Psychology, Spirituality and More",  // Has explicit hex
  "Learn about #FF0000 Red Color Psychology",                         // Has explicit hex
  "Blue Color (#0000FF) Symbolism and Cultural Significance",        // Has explicit hex
  "Green Color Meaning - #008000 and Its Effects",                   // Has explicit hex
  "Understanding Yellow Color (FFFF00) in Design",                   // Has explicit hex
  "Shades of Green and Their Meanings",                              // Has color name, no hex
  "Understanding Typography in Web Design",                          // No color
  "General Tips for Better Photography",                             // No color
  "The Beauty of Red Color Psychology",                              // Has color name, no hex
];

console.log("Results:");
console.log("=" .repeat(70));

testTitles.forEach(title => {
  const hasAnyColor = hasColorInTitle(title);
  const hasExplicitHex = hasExplicitHexInTitle(title);
  
  console.log(`Title: "${title}"`);
  console.log(`  Has Any Color (names or hex): ${hasAnyColor}`);
  console.log(`  Has Explicit Hex Only: ${hasExplicitHex}`);
  console.log("-".repeat(50));
});

console.log("\nWith the updated implementation:");
console.log("- Navigation, Technical Info, and FAQs will show only when explicit hex codes are in the title");
console.log("- Color names alone (like 'Green', 'Red') will NOT trigger these sections");
console.log("- This addresses the issue where 'Shades of Green and Their Meanings' showed unwanted sections");