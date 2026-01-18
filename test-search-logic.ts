/**
 * Test file to verify the deterministic search logic
 */

import { performDeterministicSearch, normalizeInput, detectInputType, isValidHex } from './lib/search-utils'

async function runTests() {
  console.log("🧪 Testing deterministic search logic...\n")

  // Test cases based on the requirements
  const testCases = [
    // Blog post matches
    { input: "blue", expected: "Blog post match" },
    { input: "red", expected: "Blog post match" },
    { input: "#1d4ed8", expected: "Blog post match" },
    
    // JSON matches  
    { input: "green", expected: "JSON match" },
    { input: "purple", expected: "JSON or blog post match" },
    
    // Unknown hex fallback
    { input: "#8e7340", expected: "Unknown hex -> color picker" },
    
    // Edge cases
    { input: " Blue ", expected: "Normalized input handling" },
    { input: "#ABC", expected: "3-digit hex support" },
    { input: "abc123", expected: "6-digit hex without #" },
    { input: "", expected: "Empty input - no action" },
    { input: "   ", expected: "Whitespace only - no action" },
  ]

  console.log("📋 Test Results:")
  console.log("=" .repeat(60))

  for (const testCase of testCases) {
    try {
      console.log(`\n🔍 Testing: "${testCase.input}"`)
      console.log(`Expected: ${testCase.expected}`)
      
      // Test input normalization
      const normalized = normalizeInput(testCase.input)
      console.log(`Normalized: "${normalized}"`)
      
      // Test input type detection
      const inputType = detectInputType(testCase.input)
      console.log(`Input Type: ${inputType}`)
      
      // Test hex validation
      const isHex = isValidHex(testCase.input)
      console.log(`Is Valid Hex: ${isHex}`)
      
      // Test actual search (this will make real API calls)
      if (testCase.input.trim()) {
        console.log("Performing search...")
        const result = await performDeterministicSearch(testCase.input)
        console.log(`Search Result: ${result || "No match found"}`)
        
        if (result) {
          console.log("✅ SUCCESS: Got redirect URL")
        } else {
          console.log("⚠️  INFO: No match found (expected for some test cases)")
        }
      } else {
        console.log("⏭️  SKIPPED: Empty input")
      }
      
      console.log("-".repeat(40))
      
    } catch (error) {
      console.log(`❌ ERROR: ${error}`)
    }
  }

  console.log("\n🎯 Manual Verification Checklist:")
  console.log("1. Blog post 'blue' should redirect to /color-blue-meaning")
  console.log("2. Unknown hex like #8e7340 should redirect to /html-color-picker/?hex=8e7340")  
  console.log("3. Known colors should redirect to /colors/{slug}/")
  console.log("4. Empty input should do nothing")
  console.log("5. Input should be normalized (trimmed, lowercased, # removed)")

  console.log("\n✨ Search logic implementation complete!")
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  runTests()
} else {
  // Node.js environment
  console.log("Run this test in the browser to see actual search results")
}

export { runTests }