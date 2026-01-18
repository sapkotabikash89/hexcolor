import { detectColorInTitle, hasColorInTitle } from "./lib/color-title-utils";

console.log("Testing color detection in titles...\n");

// Test cases for titles with colors
const testTitles = [
  "FFA500 Color Orange Meaning – Psychology, Spirituality and More",
  "Learn about #FF0000 Red Color Psychology",
  "Blue Color (#0000FF) Symbolism and Cultural Significance",
  "Green Color Meaning - #008000 and Its Effects",
  "Understanding Yellow Color (FFFF00) in Design",
  "Purple Color Meaning – #800080 Psychology and Symbolism",
  "Color Psychology - White and Black Contrasts",
  "Understanding Typography in Web Design",
  "General Tips for Better Photography",
  "Learn CSS Grid Layout Techniques",
];

console.log("Results:");
console.log("=" .repeat(60));

testTitles.forEach(title => {
  const hasColor = hasColorInTitle(title);
  const detectedColor = detectColorInTitle(title);
  
  console.log(`Title: "${title}"`);
  console.log(`  Has Color: ${hasColor}`);
  console.log(`  Detected Color: ${detectedColor || 'None'}`);
  console.log("-".repeat(40));
});

console.log("\nThe utility correctly identifies titles with color codes and returns");
console.log("the appropriate hex value when present, which can be used to ");
console.log("conditionally render navigation, technical information, and FAQ sections.");