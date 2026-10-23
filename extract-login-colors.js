const fs = require('fs');
const html = fs.readFileSync('client/index.html', 'utf8');

console.log('🎨 استخراج ألوان صفحة الدخول:\n');

// استخراج كل الألوان
const colors = new Set();
const hexRe = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;
let m;
while ((m = hexRe.exec(html)) !== null) colors.add('#' + m[1].toUpperCase());

const rgbRe = /rgba?\(([^)]+)\)/g;
while ((m = rgbRe.exec(html)) !== null) colors.add('rgb(' + m[1] + ')');

console.log('الألوان المستخدمة (' + colors.size + '):');
[...colors].forEach(c => console.log('  ' + c));

// استخراج المتغيرات
console.log('\n📋 CSS Variables من :root:');
const rootMatch = html.match(/:root\s*\{([\s\S]*?)\}/);
if (rootMatch) {
  rootMatch[1].split(';').forEach(line => {
    const t = line.trim();
    if (t.includes('--')) console.log('  ' + t);
  });
}

// استخراج التدرجات
console.log('\n🌈 التدرجات (linear-gradient):');
const gradRe = /linear-gradient\([^)]+\)/g;
const grads = new Set();
while ((m = gradRe.exec(html)) !== null) grads.add(m[0]);
[...grads].forEach(g => console.log('  ' + g.slice(0, 100)));
