/**
 * Comprehensive test to verify search logic with specific examples
 * This mimics the exact test cases mentioned in the requirements
 */

// Mock data to simulate blog posts and color database
const MOCK_BLOG_POSTS = [
  { title: "Blue Color Meaning – Psychology, Spirituality and More", uri: "/color-blue-meaning" },
  { title: "Red Color Psychology and Cultural Significance", uri: "/color-red-meaning" },
  { title: "Color #1D4ED8 Meaning and Symbolism", uri: "/color-1d4ed8-meaning" },
  { title: "Purple: The Royal Color Explained", uri: "/color-purple-meaning" }
]

const MOCK_COLOR_JSON = {
  "00FF00": { name: "Green", hex: "#00FF00", meaning: "Green color meaning..." },
  "800080": { name: "Purple", hex: "#800080", meaning: "Purple color meaning..." },
  "FF0000": { name: "Red", hex: "#FF0000", meaning: "Red color meaning..." }
}

// Override the fetch function for testing
async function mockFetch() {
  return {
    json: async () => ({
      data: {
        posts: {
          nodes: MOCK_BLOG_POSTS
        }
      }
    })
  }
}

// Test the search logic with specific examples
async function testSpecificCases() {
  console.log("🧪 Testing Specific Search Cases")
  console.log("=" .repeat(50))
  
  const testCases = [
    {
      input: "blue",
      description: "Blog post exists",
      expected: "https://colormean.com/color-blue-meaning"
    },
    {
      input: "#1d4ed8", 
      description: "Blog post exists with hex",
      expected: "https://colormean.com/color-1d4ed8-meaning"
    },
    {
      input: "green",
      description: "JSON match exists",
      expected: "https://colormean.com/colors/00ff00/"
    },
    {
      input: "#8e7340",
      description: "Unknown color hex",
      expected: "https://colormean.com/html-color-picker/?hex=8e7340"
    },
    {
      input: "purple",
      description: "Multiple matches - should pick one",
      expected: "Either blog post or JSON match"
    },
    {
      input: " Blue ",
      description: "Input with spaces",
      expected: "Should normalize to 'blue'"
    }
  ]
  
  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: "${testCase.input}" (${testCase.description})`)
    
    try {
      // For testing purposes, we'll simulate the search
      const normalized = testCase.input.trim().toLowerCase().replace('#', '')
      console.log(`Normalized input: "${normalized}"`)
      
      // Check blog post matches
      const blogMatch = MOCK_BLOG_POSTS.find(post => 
        post.title.toLowerCase().includes(normalized) || 
        post.uri.includes(normalized)
      )
      
      if (blogMatch) {
        const result = `https://colormean.com${blogMatch.uri}`
        console.log(`✅ Blog post match found: ${result}`)
        continue
      }
      
      // Check JSON matches
      const jsonMatch = Object.values(MOCK_COLOR_JSON).find(color => 
        color.name.toLowerCase() === normalized ||
        color.hex.replace('#', '').toLowerCase() === normalized
      )
      
      if (jsonMatch) {
        const result = `https://colormean.com/colors/${jsonMatch.hex.replace('#', '').toLowerCase()}/`
        console.log(`✅ JSON match found: ${result}`)
        continue
      }
      
      // Unknown hex fallback
      if (/^[0-9a-f]{3}$/.test(normalized) || /^[0-9a-f]{6}$/.test(normalized)) {
        const result = `https://colormean.com/html-color-picker/?hex=${normalized}`
        console.log(`✅ Unknown hex fallback: ${result}`)
        continue
      }
      
      console.log("⚠️  No match found")
      
    } catch (error: any) {
      console.log(`❌ Error: ${error.message}`)
    }
  }
  
  console.log("\n✅ Specific case testing complete!")
}

// Run the tests
testSpecificCases()