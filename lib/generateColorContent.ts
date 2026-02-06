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
  "clash",
  "create tension",
  "discord"
];

// Sentence Templates
const INTRO_TEMPLATES = [
  (name: string, hex: string, adj: string, hue: string) => `${name} (${hex}) is a ${adj} ${hue}.`,
  (name: string, hex: string, adj: string, hue: string) => `${name} (${hex}) is a ${adj} ${hue} color.`,
  (name: string, hex: string, adj: string, hue: string) => `The color ${name} (${hex}) is a ${adj} ${hue}.`,
  (name: string, hex: string, adj: string, hue: string) => `${name} (${hex}) is defined as a ${adj} ${hue}.`
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
  (links: string, synonym: string) => `, while colors like ${links} may ${synonym} with it due to differing tones`,
  (links: string, synonym: string) => `; however, shades such as ${links} tend to ${synonym} with it, creating visual tension`,
  (links: string, synonym: string) => `, whereas ${links} often ${synonym} with this hue, offering strong contrast`
];

const USAGE_TEMPLATES = [
  (hex: string, usage: string) => `Designers often use ${hex} in ${usage} where a specific visual weight is required.`,
  (hex: string, usage: string) => `In professional settings, ${hex} is frequently applied in ${usage}.`,
  (hex: string, usage: string) => `This color is suitable for ${usage}, often utilized to create a distinct atmosphere.`
];

// FAQ Templates
const MEANING_TEMPLATES = [
  (name: string, hex: string, symbolism: string, hue: string, usage: string) => 
    `${name} (${hex}) symbolizes ${symbolism}, serving as a visual representation of these core qualities. Its ${hue} character communicates a specific emotional weight, often associated with ${symbolism}. In design and art, ${name} (${hex}) is frequently utilized for ${usage}, where its distinct presence can make a lasting impact.`,
  (name: string, hex: string, symbolism: string, hue: string, usage: string) => 
    `The meaning of ${name} (${hex}) is deeply tied to ${symbolism}, reflecting its inherent chromatic nature. As a shade of ${hue}, it embodies a unique vibration that resonates with viewers on a subconscious level. Consequently, ${name} (${hex}) finds its best application in ${usage}, where it can effectively convey its intended message.`,
  (name: string, hex: string, symbolism: string, hue: string, usage: string) => 
    `Representing ${symbolism}, ${name} (${hex}) stands as a testament to the power of color psychology. This particular ${hue} variant offers a nuanced perspective, blending traditional associations with modern interpretations. Designers often turn to ${name} (${hex}) for ${usage} to leverage its specific visual and emotional appeal.`
];

const SPIRITUAL_TEMPLATES = [
  (name: string, hex: string, meaning: string, effect: string) => 
    `Spiritually, ${name} (${hex}) encourages ${meaning}, acting as a catalyst for inner growth. This color's vibration is believed to resonate with the soul, fostering a sense of connection and purpose. Practitioners often use ${name} (${hex}) to support ${effect}, allowing for deeper meditation and spiritual alignment.`,
  (name: string, hex: string, meaning: string, effect: string) => 
    `In spiritual practices, ${name} (${hex}) is revered for its ability to promote ${meaning}. It serves as a bridge between the physical and metaphysical, guiding individuals toward higher states of consciousness. By meditating on ${name} (${hex}), one may experience enhanced ${effect}, leading to a more balanced and harmonious state of being.`,
  (name: string, hex: string, meaning: string, effect: string) => 
    `The spiritual significance of ${name} (${hex}) lies in its power to facilitate ${meaning}. It is often seen as a protective and enlightening force, helping to clear negative energies. Integrating ${name} (${hex}) into one's environment can actively support ${effect}, creating a sanctuary for spiritual development.`
];

const CHAKRA_TEMPLATES = [
  (name: string, hex: string, chakra: string, hueVal: number) => 
    `Based on its hue value of ${hueVal}°, ${name} (${hex}) is most closely aligned with the ${chakra}. This energy center governs specific physical and emotional functions, which this color helps to stimulate and balance. Working with ${name} (${hex}) can therefore aid in unblocking the ${chakra}, promoting a free flow of vital life force energy.`,
  (name: string, hex: string, chakra: string, hueVal: number) => 
    `${name} (${hex}) resonates strongly with the ${chakra}, a connection determined by its specific chromatic frequency of ${hueVal}°. This alignment suggests that the color can be a powerful tool for healing issues related to this chakra. By visualizing ${name} (${hex}), individuals may find it easier to center themselves and restore equilibrium to the ${chakra}.`,
  (name: string, hex: string, chakra: string, hueVal: number) => 
    `The energetic signature of ${name} (${hex}) corresponds directly to the ${chakra}, consistent with its hue of ${hueVal}°. This relationship highlights the color's potential to influence the attributes associated with this chakra. Consequently, incorporating ${name} (${hex}) into therapeutic practices can be beneficial for nurturing the health and vitality of the ${chakra}.`
];

const PERSONALITY_TEMPLATES = [
  (name: string, hex: string, trait1: string, trait2: string) => 
    `Individuals drawn to ${name} (${hex}) often value ${trait1}, given its specific composition and allure. This preference suggests a personality that is deeply in tune with their environment and appreciates ${trait2}. Furthermore, those who favor ${name} (${hex}) tends to possess a unique perspective, finding beauty and meaning in aspects of life that others might overlook.`,
  (name: string, hex: string, trait1: string, trait2: string) => 
    `A preference for ${name} (${hex}) typically indicates a personality that prioritizes ${trait1}. Such individuals are likely to be introspective yet expressive, balancing a desire for ${trait2} with practical grounding. Embracing ${name} (${hex}) reflects a confidence in one's own taste and a willingness to stand out through subtle yet powerful choices.`,
  (name: string, hex: string, trait1: string, trait2: string) => 
    `Choosing ${name} (${hex}) as a favorite color points to a character that seeks ${trait1} in their daily life. It reveals a temperament that enjoys ${trait2}, often approaching challenges with a distinct and creative mindset. Ultimately, the resonance with ${name} (${hex}) showcases a complex and multifaceted personality.`
];

const WARM_COOL_TEMPLATES = [
  (name: string, hex: string, temp: string, hueVal: number, saturation: number) => 
    `With a hue of ${hueVal}°, ${name} (${hex}) is considered a ${temp} color. Its visual temperature is further defined by its ${saturation}% saturation, which influences how it is perceived in various lighting conditions. While primarily ${temp}, ${name} (${hex}) can adapt to different palettes, offering versatility while maintaining its core thermal identity.`,
  (name: string, hex: string, temp: string, hueVal: number, saturation: number) => 
    `${name} (${hex}) falls into the category of ${temp} colors, a classification based on its hue angle of ${hueVal}°. This designation implies certain psychological effects, such as inducing feelings of ${temp === 'warm' ? 'energy and comfort' : 'calm and focus'}. Additionally, the ${saturation}% saturation of ${name} (${hex}) adds depth, making its ${temp} nature feel more nuanced and sophisticated.`,
  (name: string, hex: string, temp: string, hueVal: number, saturation: number) => 
    `Technically, ${name} (${hex}) is a ${temp} shade, determined by its position at ${hueVal}° on the color wheel. This suggests it brings a sense of ${temp === 'warm' ? 'warmth and vibrancy' : 'coolness and serenity'} to any space it occupies. The impact of this ${temp} characteristic is modulated by the color's saturation of ${saturation}%, ensuring that ${name} (${hex}) remains balanced and pleasing to the eye.`
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
  const hueName = getHueName(hsl.h, hsl.s, hsl.l);
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
    
    // Use a pairing color for comparison if available to avoid repetition
    // We try to use the 4th pairing (index 3) since only first 3 are shown in paragraph 2
    let comparisonColor = neighbors.prev;
    if (pairings && pairings.length > 3) {
        comparisonColor = pairings[3];
    } else if (pairings && pairings.length > 0) {
        // Fallback to first pairing if we don't have enough
        comparisonColor = pairings[0];
    }

    const subtleDiff = getSubtleDifference(hsl, comparisonColor.hex);
    const comparisonNeighborLink = `[${comparisonColor.name} (${comparisonColor.hex})](/colors/${comparisonColor.hex.replace('#','').toLowerCase()})`;
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

  // Practical Usage
  const usage = getUsage(hsl);
  const usageTemplate = getDeterministicItem(USAGE_TEMPLATES, cleanHex + "U");
  const usageText = usageTemplate(cleanHex, usage);

  const paragraph2 = `${pairText}${conflictText}. ${usageText}`;

  return { paragraph1, paragraph2 };
}

/**
 * Generates Hex-specific FAQs.
 */
export function generateColorFAQs(data: ColorContentData): { question: string; answer: string }[] {
  const { hex, name, rgb, hsl, cmyk } = data;
  const cleanHex = hex.toUpperCase();
  const nameStr = name && name !== "Color" ? name : cleanHex;

  // Data preparation for templates
  const hueName = getHueName(hsl.h, hsl.s, hsl.l);
  const symbolism = getSymbolism(hsl);
  const usage = hsl.s > 70 ? 'high-visibility designs' : 'professional and subtle applications';
  
  const spiritualMeaning = getSpiritualMeaning(hsl);
  const spiritualEffect = hsl.h < 180 ? 'proactive energy and grounded emotional expression' : 'mental clarity and spiritual connection';
  
  const chakra = getChakra(hsl.h);
  
  const trait1 = cmyk.k > 50 ? 'depth and mystery' : 'clarity and openness';
  const trait2 = hsl.s > 50 ? 'bold expressions' : 'nuanced subtleties';
  
  const temp = isWarm(hsl.h) ? "warm" : "cool";

  // Generate answers using deterministic templates
  const q1Template = getDeterministicItem(MEANING_TEMPLATES, cleanHex + "Q1");
  const a1 = q1Template(nameStr, cleanHex, symbolism, hueName, usage);

  const q2Template = getDeterministicItem(SPIRITUAL_TEMPLATES, cleanHex + "Q2");
  const a2 = q2Template(nameStr, cleanHex, spiritualMeaning, spiritualEffect);

  const q3Template = getDeterministicItem(CHAKRA_TEMPLATES, cleanHex + "Q3");
  const a3 = q3Template(nameStr, cleanHex, chakra, fmt(hsl.h));

  const q4Template = getDeterministicItem(PERSONALITY_TEMPLATES, cleanHex + "Q4");
  const a4 = q4Template(nameStr, cleanHex, trait1, trait2);

  const q5Template = getDeterministicItem(WARM_COOL_TEMPLATES, cleanHex + "Q5");
  const a5 = q5Template(nameStr, cleanHex, temp, fmt(hsl.h), fmt(hsl.s));

  const faqs = [
    {
      question: `What is the meaning and symbolism of ${nameStr} (${cleanHex})?`,
      answer: a1
    },
    {
      question: `What is the spiritual meaning of ${nameStr} (${cleanHex})?`,
      answer: a2
    },
    {
      question: `What chakra is connected to ${nameStr} (${cleanHex})?`,
      answer: a3
    },
    {
      question: `What does ${nameStr} (${cleanHex}) mean in personality?`,
      answer: a4
    },
    {
      question: `Is ${cleanHex} a warm or cool color?`,
      answer: a5
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

function getHueName(hue: number, s: number = 100, l: number = 50): string {
  if (s < 10 || l > 95 || l < 5) return "neutral";
  if (hue < 15) return "red";
  if (hue < 45) return "orange";
  if (hue < 70) return "yellow";
  if (hue < 165) return "green";
  if (hue < 200) return "cyan";
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

function getUsage(hsl: HSL): string {
  if (hsl.s > 70) return 'branding, signage, and high-visibility designs';
  if (hsl.l > 80) return 'backgrounds, interfaces, and subtle design elements';
  if (hsl.l < 20) return 'typography, borders, and structural elements';
  return 'branding, environmental graphics, and design systems';
}
