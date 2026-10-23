const fs = require('fs');
const html = fs.readFileSync('client/chizen.html', 'utf8');

// استخراج الهيدر
const hdrStart = html.indexOf('<div class="chz-main"');
const hdrEnd = html.indexOf('</div>', html.indexOf('chz-profile-group')) + 500;

console.log('═══ بنية الهيدر الحالية ═══\n');
const hdr = html.slice(hdrStart, hdrEnd);

// طباعة الأجزاء المرتبة
console.log('📌 الترتيب الحالي في HTML:\n');
const sections = [
  { name: 'الأيقونات (chz-icons-group)', marker: 'chz-icons-group' },
  { name: 'الشعار والنص (chz-brand-group)', marker: 'chz-brand-group' },
  { name: 'المستخدم (chz-profile-group)', marker: 'chz-profile-group' }
];

const positions = sections.map(s => ({
  name: s.name,
  pos: hdr.indexOf(s.marker)
})).sort((a, b) => a.pos - b.pos);

positions.forEach((p, i) => {
  console.log((i + 1) + '. ' + p.name + ' (عند ' + p.pos + ')');
});

console.log('\n📌 CSS الحالي لـ chz-brand-group:');
const brandCSS = html.match(/\.chz-brand-group\s*\{[^}]*\}/);
if (brandCSS) console.log(brandCSS[0].replace(/\n/g, '\n  '));

console.log('\n📌 CSS الحالي لـ chz-en-row (الشعار + النص):');
const enRowCSS = html.match(/\.chz-en-row\s*\{[^}]*\}/);
if (enRowCSS) console.log(enRowCSS[0].replace(/\n/g, '\n  '));

console.log('\n📌 CSS الحالي لـ chz-en (كلمة CHIZEN):');
const enCSS = html.match(/\.chz-en\s*\{[^}]*\}/);
if (enCSS) console.log(enCSS[0].replace(/\n/g, '\n  '));
