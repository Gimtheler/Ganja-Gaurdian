import fs from 'fs';

const file = 'assets/js/strains-extra.js';
const text = fs.readFileSync(file, 'utf8');
const marker = '{"n":"Zwiesel"';
const start = text.lastIndexOf(marker);
const end = text.indexOf('\n', start);
if (start < 0 || end < 0) {
  throw new Error('Zwiesel row not found');
}
fs.writeFileSync(file, text.slice(0, end) + '\n  ];\n})();\n');
console.log('lines', fs.readFileSync(file, 'utf8').split(/\n/).length);
