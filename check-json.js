const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./lib/color-meaning.json', 'utf8'));
console.log('ABCDEF exists:', !!data['ABCDEF']);
console.log('FF0000 exists:', !!data['FF0000']);
console.log('Total keys:', Object.keys(data).length);
console.log('Sample keys:', Object.keys(data).slice(0, 5));