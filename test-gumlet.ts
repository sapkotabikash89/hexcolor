// Test gumlet URL generation
import { getGumletImageUrl } from './lib/gumlet-utils';

console.log('Testing gumlet URL generation:');
console.log('FF0000:', getGumletImageUrl('#FF0000'));
console.log('ABCDEF:', getGumletImageUrl('#ABCDEF'));

// Test if FF0000 exists in color-meaning.json
import colorMeaning from './lib/color-meaning.json';
console.log('FF0000 in color-meaning.json:', !!colorMeaning['FF0000']);
console.log('ABCDEF in color-meaning.json:', !!colorMeaning['ABCDEF']);