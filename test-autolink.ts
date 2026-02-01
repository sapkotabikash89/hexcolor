import { autoLinkShadeNames } from './lib/utils';

// Test content that mimics the actual blog post structure
const testContent = `
<h2 class="wp-block-heading"><strong>Chocolate</strong></h2>
<p>Chocolate (#7B3F00) is a deep, rich brown named after the roasted cocoa bean.</p>

<h2 class="wp-block-heading"><strong>Bronze</strong></h2>
<p>Bronze (#CD7F32) is a moderate yellow-brown metal color.</p>

<h2 class="wp-block-heading"><strong>Almond</strong></h2>
<p>Almond (#EADDCA) is a pale, grayish beige.</p>
`;

console.log('Original content:');
console.log(testContent);
console.log('\n' + '='.repeat(50) + '\n');

const result = autoLinkShadeNames(testContent, true);
console.log('Processed content:');
console.log(result);