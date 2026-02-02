
export interface ColorFamilyData {
  keywords: string;
  psychology: string;
  spiritual: string;
  chakra: string;
  chakraSanskrit: string;
  chakraMeaning: string;
  personality: string;
  bible: string;
  dream: string;
}

export const COLOR_FAMILIES: Record<string, ColorFamilyData> = {
  red: {
    keywords: "passion, energy, danger, and love",
    psychology: "urgency, excitement, and physical stimulation",
    spiritual: "life force, grounding, and survival instincts",
    chakra: "Root",
    chakraSanskrit: "Muladhara",
    chakraMeaning: "safety, stability, and our basic needs",
    personality: "confident, ambitious, and action-oriented",
    bible: "sacrifice, sin, and redemption",
    dream: "strong emotions, intense passion, or a warning of danger"
  },
  blue: {
    keywords: "trust, calmness, loyalty, and intelligence",
    psychology: "peace, tranquility, and mental clarity",
    spiritual: "truth, wisdom, and higher communication",
    chakra: "Throat",
    chakraSanskrit: "Vishuddha",
    chakraMeaning: "self-expression, communication, and truth",
    personality: "reliable, thoughtful, and peace-loving",
    bible: "heaven, divine revelation, and grace",
    dream: "emotional balance, spiritual guidance, or a need for peace"
  },
  green: {
    keywords: "nature, growth, health, and prosperity",
    psychology: "balance, harmony, and restoration",
    spiritual: "healing, renewal, and connection to the earth",
    chakra: "Heart",
    chakraSanskrit: "Anahata",
    chakraMeaning: "love, compassion, and emotional balance",
    personality: "nurturing, practical, and compassionate",
    bible: "immortality, resurrection, and new life",
    dream: "personal growth, healing, or financial stability"
  },
  yellow: {
    keywords: "happiness, optimism, intellect, and creativity",
    psychology: "mental activity, cheerfulness, and caution",
    spiritual: "personal power, confidence, and awakening",
    chakra: "Solar Plexus",
    chakraSanskrit: "Manipura",
    chakraMeaning: "willpower, self-esteem, and transformation",
    personality: "optimistic, creative, and energetic",
    bible: "faith, glory of God, and trials",
    dream: "joy, intellect, or a warning to pay attention"
  },
  purple: {
    keywords: "royalty, luxury, spirituality, and mystery",
    psychology: "imagination, wisdom, and introspection",
    spiritual: "divine connection, intuition, and enlightenment",
    chakra: "Crown",
    chakraSanskrit: "Sahasrara",
    chakraMeaning: "spiritual connection and universal consciousness",
    personality: "visionary, artistic, and deeply intuitive",
    bible: "royalty, priesthood, and wealth",
    dream: "spiritual development, mystery, or higher understanding"
  },
  orange: {
    keywords: "enthusiasm, creativity, warmth, and success",
    psychology: "social interaction, fun, and encouragement",
    spiritual: "emotional expression and creativity",
    chakra: "Sacral",
    chakraSanskrit: "Svadhisthana",
    chakraMeaning: "emotions, pleasure, and relationships",
    personality: "friendly, adventurous, and outgoing",
    bible: "endurance, strength, and fire of God",
    dream: "social energy, ambition, or a desire for expansion"
  },
  pink: {
    keywords: "romance, kindness, compassion, and playfulness",
    psychology: "calming, nurturing, and hope",
    spiritual: "unconditional love and emotional healing",
    chakra: "Heart",
    chakraSanskrit: "Anahata",
    chakraMeaning: "love, tenderness, and emotional recovery",
    personality: "loving, generous, and sensitive",
    bible: "flesh, new life, and health",
    dream: "love, affection, or a desire for emotional connection"
  },
  brown: {
    keywords: "stability, reliability, earthiness, and comfort",
    psychology: "wholesomeness, honesty, and simplicity",
    spiritual: "grounding and connection to the natural world",
    chakra: "Root",
    chakraSanskrit: "Muladhara",
    chakraMeaning: "grounding, stability, and support",
    personality: "down-to-earth, honest, and hardworking",
    bible: "humility, the earth, and human nature",
    dream: "practicality, grounding, or a need for stability"
  },
  black: {
    keywords: "power, elegance, mystery, and protection",
    psychology: "authority, control, and sophistication",
    spiritual: "protection, absorption of negative energy, and the unknown",
    chakra: "Root",
    chakraSanskrit: "Muladhara",
    chakraMeaning: "grounding and protection",
    personality: "independent, strong-willed, and sophisticated",
    bible: "darkness, mourning, or judgment",
    dream: "mystery, the unconscious mind, or a hidden potential"
  },
  white: {
    keywords: "purity, innocence, clarity, and cleanliness",
    psychology: "fresh starts, simplicity, and order",
    spiritual: "light, purification, and divine presence",
    chakra: "Crown",
    chakraSanskrit: "Sahasrara",
    chakraMeaning: "pure consciousness and spiritual awakening",
    personality: "organized, optimistic, and peace-seeking",
    bible: "purity, holiness, and righteousness",
    dream: "clarity, new beginnings, or spiritual cleansing"
  },
  gray: {
    keywords: "neutrality, balance, wisdom, and compromise",
    psychology: "detachment, professionalism, and maturity",
    spiritual: "balance between opposing forces and stillness",
    chakra: "Throat", // Often associated with silver/blue/gray for expression
    chakraSanskrit: "Vishuddha",
    chakraMeaning: "truth and balanced expression",
    personality: "practical, conservative, and composed",
    bible: "aging, wisdom, or repentance",
    dream: "confusion, neutrality, or a transitional phase"
  },
  teal: {
    keywords: "balance, calm, communication, and clarity",
    psychology: "emotional healing and mental stability",
    spiritual: "spiritual growth and open communication",
    chakra: "Throat",
    chakraSanskrit: "Vishuddha",
    chakraMeaning: "clear communication and emotional balance",
    personality: "unique, open-minded, and trustworthy",
    bible: "healing and restoration",
    dream: "emotional clarity or a need for balance"
  },
  indigo: {
    keywords: "intuition, perception, and deep wisdom",
    psychology: "focus, structure, and integrity",
    spiritual: "inner vision and psychic ability",
    chakra: "Third Eye",
    chakraSanskrit: "Ajna",
    chakraMeaning: "intuition, imagination, and wisdom",
    personality: "intuitive, idealist, and truthful",
    bible: "majesty and deep spiritual truth",
    dream: "insight, intuition, or deep spiritual messages"
  },
  gold: {
    keywords: "wealth, success, triumph, and luxury",
    psychology: "abundance, confidence, and optimism",
    spiritual: "divine light, enlightenment, and higher wisdom",
    chakra: "Solar Plexus",
    chakraSanskrit: "Manipura",
    chakraMeaning: "personal power and divine will",
    personality: "charismatic, confident, and successful",
    bible: "divine glory, majesty, and purity",
    dream: "spiritual wealth, success, or valuable insights"
  },
  silver: {
    keywords: "grace, modernity, glamour, and sophistication",
    psychology: "reflection, calm, and clarity",
    spiritual: "feminine energy, intuition, and reflection",
    chakra: "Third Eye", // Often associated with intuition
    chakraSanskrit: "Ajna",
    chakraMeaning: "intuition and clarity of mind",
    personality: "creative, articulate, and graceful",
    bible: "redemption, refined truth, and age",
    dream: "intuition, valuable opportunities, or feminine aspects"
  }
};

export const COLOR_TO_FAMILY: Record<string, string> = {
  // Red Family
  red: 'red', burgundy: 'red', maroon: 'red', crimson: 'red', marsala: 'red',
  // Blue Family
  blue: 'blue', royalblue: 'blue', babyblue: 'blue', pastelblue: 'blue', navyblue: 'blue', cyan: 'blue', cerulean: 'blue',
  // Green Family
  green: 'green', mint: 'green', chartreuse: 'green', caledon: 'green', olivegreen: 'green', limegreen: 'green', neongreen: 'green', sagegreen: 'green', forestgreen: 'green', seafoamgreen: 'green', emeraldgreen: 'green',
  // Yellow Family
  yellow: 'yellow', pastelyellow: 'yellow', brightyellow: 'yellow',
  // Purple Family
  purple: 'purple', magenta: 'purple', fuchsia: 'pink', violet: 'purple', lavender: 'purple', lilac: 'purple', mauve: 'purple', periwinkle: 'purple',
  // Orange Family
  orange: 'orange', brightorange: 'orange', burntsienna: 'orange', tangerine: 'orange', amber: 'orange', champagne: 'yellow',
  // Pink Family
  pink: 'pink', salmon: 'pink', dustyrose: 'pink', honeysuckle: 'pink', lightpink: 'pink', hotpink: 'pink',
  // Brown Family
  brown: 'brown', cognac: 'brown', beige: 'brown', ecru: 'brown', nude: 'brown', taupe: 'brown', khaki: 'brown', tan: 'brown', hazel: 'brown',
  // Black/Dark Family
  black: 'black', ebony: 'black',
  // White/Light Family
  white: 'white', cream: 'white',
  // Gray Family
  gray: 'gray', gunmetal: 'gray', pewter: 'gray', silver: 'silver',
  // Special
  teal: 'teal', turquoise: 'teal',
  indigo: 'indigo',
  gold: 'gold'
};

function capitalize(s: string): string {
  return s.split(/[-\s]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function generateFaqs(slug: string): Array<{ question: string, answer: string }> {
  const normalizedSlug = slug.toLowerCase().trim();
  const familyKey = COLOR_TO_FAMILY[normalizedSlug] || 'gray'; // Fallback to gray if unknown
  const data = COLOR_FAMILIES[familyKey] || COLOR_FAMILIES['gray'];
  const name = capitalize(slug);

  return [
    {
      question: `What does the color ${name} represent?`,
      answer: `${name} represents ${data.keywords}. It is a color that signifies ${data.psychology}. In color psychology, it is often associated with these qualities, making it a popular choice for designs that need to convey ${data.keywords.split(',')[0]}.`
    },
    {
      question: `What is the spiritual meaning of the color ${name}?`,
      answer: `Spiritually, the color ${name} symbolizes ${data.spiritual}. It is often believed to bring a sense of ${data.psychology} to the spirit. Many traditions view ${name} as a sign of ${data.spiritual.split(',')[0]}, connecting the physical and spiritual realms.`
    },
    {
      question: `What chakra is connected to the color ${name}?`,
      answer: `${name} is linked to the ${data.chakra} Chakra, also known as ${data.chakraSanskrit}. This energy center governs ${data.chakraMeaning}. Balancing this chakra with the color ${name} can help improve emotional well-being and spiritual alignment.`
    },
    {
      question: `What does ${name} mean in personality?`,
      answer: `A ${name} personality type is typically ${data.personality}. People who resonate with this color often value ${data.keywords.split(',')[0]} and ${data.keywords.split(',')[1]}. They are frequently seen as ${data.personality.split(',')[0]} individuals who bring a unique energy to their surroundings.`
    },
    {
      question: `What does the color ${name} symbolize in the Bible?`,
      answer: `In the Bible, ${name} symbolizes ${data.bible}. It appears in scriptures to represent these spiritual truths. The color ${name} is often used to signify ${data.bible.split(',')[0]} and divine messages in biblical contexts.`
    },
    {
      question: `What does ${name} mean in a dream?`,
      answer: `Dreaming of the color ${name} usually indicates ${data.dream}. It can signal a need for ${data.psychology.split(',')[0]} or a reflection of your current emotional state. Seeing ${name} in a dream is often a message to pay attention to your ${data.keywords.split(',')[1]}.`
    }
  ];
}
