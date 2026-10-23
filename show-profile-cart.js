const fs = require('fs');
const html = fs.readFileSync('client/chizen.html', 'utf8');

// استخراج شاشة حسابي
const profStart = html.indexOf('id="sc-profile"');
const profEnd = html.indexOf('<div class="screen"', profStart + 100);
console.log('═══ شاشة حسابي (sc-profile) ═══');
if (profStart !== -1 && profEnd !== -1) {
  console.log(html.slice(profStart - 50, profEnd).replace(/\n\s*\n/g, '\n'));
}

console.log('\n\n═══ شاشة السلة (sc-cart) ═══');
const cartStart = html.indexOf('id="sc-cart"');
const cartEnd = html.indexOf('<div class="screen"', cartStart + 100);
if (cartStart !== -1 && cartEnd !== -1) {
  console.log(html.slice(cartStart - 50, cartEnd).replace(/\n\s*\n/g, '\n'));
}
