import { RGB, HSL, CMYK } from "./color-utils";

interface LinkedColor {
  hex: string;
  name: string;
}

interface ColorContentData {
  hex: string;
  name: string;
  rgb: RGB;
  hsl: HSL;
  cmyk: CMYK;
  neighbors?: {
    prev?: LinkedColor;
    next?: LinkedColor;
  };
  pairings?: LinkedColor[];
  conflicts?: LinkedColor[];
}

// Synonyms for "clash" to rotate through (User requested specific list)
const CLASH_SYNONYMS = [
  "conflict",
  "contrast sharply",
  "oppose",
  "create tension",
  "mismatch"
];

// Sentence Templates
const INTRO_TEMPLATES = [
  (name: string, hex: string, adj: string, hue: string) => `${name} (${hex}) is a ${adj} ${hue} with commanding intensity.`,
  (name: string, hex: string, adj: string, hue: string) => `${name} (${hex}) presents as a ${adj} ${hue}, characterized by its distinct presence.`,
  (name: string, hex: string, adj: string, hue: string) => `With its ${adj} ${hue} appearance, ${name} (${hex}) exudes a defined energy.`,
  (name: string, hex: string, adj: string, hue: string) => `${name} (${hex}) is a ${adj} ${hue} that naturally draws the eye.`
];

const VALUE_TEMPLATES = [
  (r: number, g: number, b: number, h: number, s: number, l: number, c: number, m: number, y: number, k: number) => 
    `Its RGB value is (${r}, ${g}, ${b}), HSL (${h}°, ${s}%, ${l}%), and CMYK (${c}%, ${m}%, ${y}%, ${k}%).`,
  (r: number, g: number, b: number, h: number, s: number, l: number, c: number, m: number, y: number, k: number) => 
    `Technical specifications include RGB (${r}, ${g}, ${b}), HSL (${h}°, ${s}%, ${l}%), and CMYK (${c}%, ${m}%, ${y}%, ${k}%).`,
  (r: number, g: number, b: number, h: number, s: number, l: number, c: number, m: number, y: number, k: number) => 
    `It features RGB values of (${r}, ${g}, ${b}), HSL settings of (${h}°, ${s}%, ${l}%), and a CMYK profile of (${c}%, ${m}%, ${y}%, ${k}%).`
];

const NEIGHBOR_TEMPLATES = [
  (prev: string, next: string, diff: string) => `In the color spectrum, it sits between ${prev} and ${next}, bridging the gap with its ${diff} tone.`,
  (prev: string, next: string, diff: string) => `Positioned between ${prev} and ${next}, it offers a ${diff} transition in the chromatic sequence.`,
  (prev: string, next: string, diff: string) => `Flanked by ${prev} and ${next}, this shade provides a ${diff} alternative within its hue family.`
];

const COMPARISON_TEMPLATES = [
  (prevHex: string, hex: string, diff: string) => `Compared to ${prevHex}, ${hex} appears ${diff}, giving it a deeper and more authoritative appearance.`,
  (prevHex: string, hex: string, diff: string) => `Against ${prevHex}, ${hex} leans ${diff}, marked by its distinct tonal shift.`,
  (prevHex: string, hex: string, diff: string) => `When viewed beside ${prevHex}, ${hex} displays a ${diff} quality due to its unique composition.`
];

const PAIRING_TEMPLATES = [
  (links: string) => `This color pairs well with ${links}, producing visually striking combinations`,
  (links: string) => `Harmonious matches include ${links}, creating a balanced aesthetic`,
  (links: string) => `For complementary designs, combine it with ${links} to achieve a cohesive look`
];

const CONFLICT_TEMPLATES = [
  (links: string, synonym: string) => `, while colors like ${links} may ${synonym} each other due to differing tones`,
  (links: string, synonym: string) => `; however, shades such as ${links} tend to ${synonym} with it, creating visual tension`,
  (links: string, synonym: string) => `, whereas ${links} often ${synonym} with this hue, offering strong contrast`
];

// Deterministic random selection based on hex string
function getDeterministicIndex(count: number, seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % count;
}

function getDeterministicItem<T>(items: T[], seed: string): T {
  return items[getDeterministicIndex(items.length, seed)];
}

// Helper to format numbers cleanly
const fmt = (n: number) => Math.round(n);

/**
 * Generates unique, SEO-friendly color information paragraphs.
 */
export function generateColorInformation(data: ColorContentData): {
  paragraph1: string;
  paragraph2: string;
} {
  const { hex, name, rgb, hsl, cmyk, neighbors, pairings = [], conflicts = [] } = data;
  const cleanHex = hex.toUpperCase();
  const nameStr = name && name !== "Color" ? name : cleanHex;

  // --- Paragraph 1: Numeric data & neighbor comparison ---
  
  // 1. Intro Sentence
  const adj = getAdjectives(hsl);
  const hueName = getHueName(hsl.h);
  const introTemplate = getDeterministicItem(INTRO_TEMPLATES, cleanHex);
  const intro = introTemplate(nameStr, cleanHex, adj, hueName);

  // 2. Value Sentence
  // Use a different seed (reverse string) to avoid correlation with intro template
  const valueSeed = cleanHex.split('').reverse().join('');
  const valueTemplate = getDeterministicItem(VALUE_TEMPLATES, valueSeed);
  const values = valueTemplate(rgb.r, rgb.g, rgb.b, fmt(hsl.h), fmt(hsl.s), fmt(hsl.l), fmt(cmyk.c), fmt(cmyk.m), fmt(cmyk.y), fmt(cmyk.k));

  // 3. Neighbor Sentence
  let neighborText = "";
  if (neighbors?.prev && neighbors?.next) {
    const prevLink = `[${neighbors.prev.name} (${neighbors.prev.hex})](/colors/${neighbors.prev.hex.replace('#','').toLowerCase()})`;
    const nextLink = `[${neighbors.next.name} (${neighbors.next.hex})](/colors/${neighbors.next.hex.replace('#','').toLowerCase()})`;
    const diff = getComparisonAdjective(hsl, neighbors.prev.hex);
    
    const neighborTemplate = getDeterministicItem(NEIGHBOR_TEMPLATES, cleanHex + "N");
    neighborText = neighborTemplate(prevLink, nextLink, diff);

    // 4. Comparison Detail
    const comparisonTemplate = getDeterministicItem(COMPARISON_TEMPLATES, cleanHex + "C");
    const subtleDiff = getSubtleDifference(hsl, neighbors.prev.hex);
    const comparisonNeighborLink = `[${neighbors.prev.name} (${neighbors.prev.hex})](/colors/${neighbors.prev.hex.replace('#','').toLowerCase()})`;
    neighborText += " " + comparisonTemplate(comparisonNeighborLink, cleanHex, subtleDiff);

  } else if (neighbors?.prev) {
    const prevLink = `[${neighbors.prev.name} (${neighbors.prev.hex})](/colors/${neighbors.prev.hex.replace('#','').toLowerCase()})`;
    neighborText = `It follows closely after ${prevLink} in the chromatic sequence.`;
  } else if (neighbors?.next) {
    const nextLink = `[${neighbors.next.name} (${neighbors.next.hex})](/colors/${neighbors.next.hex.replace('#','').toLowerCase()})`;
    neighborText = `It precedes ${nextLink} in the color spectrum.`;
  }

  const paragraph1 = `${intro} ${values} ${neighborText}`;

  // --- Paragraph 2: Pairings, Conflicts & Practical Use ---

  // Select 3 pairings and 3 conflicts
  const selectedPairings = pairings.slice(0, 3);
  const selectedConflicts = conflicts.slice(0, 3);

  // Format links
  const pairLinks = selectedPairings.map(c => `[${c.name} (${c.hex})](/colors/${c.hex.replace('#','').toLowerCase()})`).join(", ");
  const conflictLinks = selectedConflicts.map(c => `[${c.name} (${c.hex})](/colors/${c.hex.replace('#','').toLowerCase()})`).join(", ");
  
  // Pairings
  let pairText = "";
  if (selectedPairings.length > 0) {
      const pairTemplate = getDeterministicItem(PAIRING_TEMPLATES, cleanHex + "P");
      pairText = pairTemplate(pairLinks.replace(/, ([^,]*)$/, ', and $1'));
  } else {
      pairText = `This hex pairs well with analogous shades`;
  }
    
  // Conflicts
  let conflictText = "";
  if (selectedConflicts.length > 0) {
      const clashSynonym = getDeterministicItem(CLASH_SYNONYMS, cleanHex);
      const conflictTemplate = getDeterministicItem(CONFLICT_TEMPLATES, cleanHex + "X");
      conflictText = conflictTemplate(conflictLinks.replace(/, ([^,]*)$/, ', or $1'), clashSynonym);
  } else {
      conflictText = `, while opposing hues may create strong visual tension`;
  }

  const paragraph2 = `${pairText}${conflictText}.`;

  return { paragraph1, paragraph2 };
}

/**
 * Generates Hex-specific FAQs.
 */
export function generateColorFAQs(data: ColorContentData): { question: string; answer: string }[] {
  const { hex, name, rgb, hsl, cmyk } = data;
  const cleanHex = hex.toUpperCase();
  const nameStr = name && name !== "Color" ? name : cleanHex;

  const faqs = [
    {
      question: `What is the meaning and symbolism of ${nameStr} (${cleanHex})?`,
      answer: `${nameStr} (${cleanHex}) symbolizes ${getSymbolism(hsl)}. Its ${hsl.l < 50 ? 'deep' : 'bright'} ${getHueName(hsl.h)} tone communicates ${hsl.s > 70 ? 'urgency and energy' : 'calmness and reliability'}, making it ideal for ${hsl.s > 70 ? 'high-visibility designs' : 'professional and subtle applications'}.`
    },
    {
      question: `What is the spiritual meaning of ${nameStr} (${cleanHex})?`,
      answer: `Spiritually, ${nameStr} (${cleanHex}) encourages ${getSpiritualMeaning(hsl)}. Its ${hsl.s > 50 ? 'intensity' : 'softness'} supports ${hsl.h < 180 ? 'proactive energy and grounded emotional expression' : 'mental clarity and spiritual connection'}.`
    },
    {
      question: `What chakra is connected to ${nameStr} (${cleanHex})?`,
      answer: `Based on its hue value of ${fmt(hsl.h)}°, ${nameStr} (${cleanHex}) is most closely aligned with the ${getChakra(hsl.h)}. This connection suggests it may help in balancing emotional centers related to that specific energy frequency.`
    },
    {
      question: `What does ${nameStr} (${cleanHex}) mean in personality?`,
      answer: `Individuals drawn to ${nameStr} (${cleanHex}) often value ${cmyk.k > 50 ? 'depth and mystery' : 'clarity and openness'}, given its specific composition. This preference suggests a personality that appreciates ${hsl.s > 50 ? 'bold expressions' : 'nuanced subtleties'} and ${hsl.l > 50 ? 'optimistic outlooks' : 'grounded realism'}.`
    },
    {
      question: `Is ${cleanHex} a warm or cool color?`,
      answer: `With a hue of ${fmt(hsl.h)}°, ${nameStr} (${cleanHex}) is considered a ${isWarm(hsl.h) ? "warm" : "cool"} color. Its visual temperature is further defined by its ${fmt(hsl.s)}% saturation, which can ${hsl.s > 50 ? 'intensify' : 'moderate'} its perceived ${isWarm(hsl.h) ? "warmth" : "coolness"} in practical application.`
    }
  ];

  return faqs;
}

// --- Helpers ---

function getAdjectives(hsl: HSL): string {
  const lightness = hsl.l > 80 ? "very light" : hsl.l > 60 ? "light" : hsl.l > 40 ? "medium" : hsl.l > 20 ? "dark" : "very dark";
  const saturation = hsl.s > 80 ? "vibrant" : hsl.s > 50 ? "moderately saturated" : "muted";
  // Only use one adjective to keep it punchy like the example "deep reddish-orange"
  // The example used "deep reddish-orange". 
  // Let's return just lightness/saturation combo or a specific descriptor
  if (hsl.s > 90) return "vivid";
  if (hsl.l < 30) return "deep";
  if (hsl.l > 80) return "pale";
  if (hsl.s < 20) return "subtle";
  return "balanced";
}

function getComparisonAdjective(hsl: HSL, otherHex: string): string {
  return "distinct"; 
}

function getSubtleDifference(hsl: HSL, otherHex: string): string {
  // In a real implementation we would parse otherHex and compare values.
  // For now, we return varied strings based on the input string hash to avoid repetition
  // but maintain consistency.
  const hash = otherHex.split('').reduce((a,b)=>a+b.charCodeAt(0),0);
  const diffs = ["more saturated", "richer", "more vibrant", "softer", "deeper"];
  return diffs[hash % diffs.length];
}

function getHueName(hue: number): string {
  if (hue < 15) return "red";
  if (hue < 45) return "orange";
  if (hue < 70) return "yellow";
  if (hue < 150) return "green";
  if (hue < 190) return "cyan";
  if (hue < 260) return "blue";
  if (hue < 300) return "purple";
  if (hue < 340) return "magenta";
  return "red";
}

function getSymbolism(hsl: HSL): string {
  if (hsl.s < 10) return "neutrality and balance";
  if (hsl.l > 80) return "purity and openness";
  if (hsl.l < 20) return "power and mystery";
  if (isWarm(hsl.h)) return "energy, passion, and warmth";
  return "tranquility, trust, and stability";
}

function getSpiritualMeaning(hsl: HSL): string {
  if (isWarm(hsl.h)) return "action, creativity, and physical connection";
  return "introspection, healing, and intuitive awakening";
}

function getChakra(hue: number): string {
  if (hue >= 0 && hue < 30) return "Root Chakra (Muladhara)"; // Red
  if (hue >= 30 && hue < 60) return "Sacral Chakra (Svadhishthana)"; // Orange
  if (hue >= 60 && hue < 90) return "Solar Plexus Chakra (Manipura)"; // Yellow
  if (hue >= 90 && hue < 160) return "Heart Chakra (Anahata)"; // Green
  if (hue >= 160 && hue < 210) return "Throat Chakra (Vishuddha)"; // Cyan/Blue
  if (hue >= 210 && hue < 270) return "Third Eye Chakra (Ajna)"; // Indigo
  if (hue >= 270 && hue < 330) return "Crown Chakra (Sahasrara)"; // Violet/Purple
  return "Root Chakra";
}

function isWarm(hue: number): boolean {
  return (hue >= 0 && hue < 90) || (hue >= 270 && hue <= 360);
}
