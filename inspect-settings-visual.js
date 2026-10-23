const fs = require('fs');
const html = fs.readFileSync('client/chizen.html', 'utf8');

console.log('🔍 فحص بصري لشاشة الإعدادات:\n');

// استخراج CSS للعناصر
const cssChecks = [
  { name: '.sit', pattern: /\.sit\s*\{[^}]*\}/ },
  { name: '.sit-ti', pattern: /\.sit-ti\s*\{[^}]*\}/ },
  { name: '.sii', pattern: /\.sii\s*\{[^}]*\}/ },
  { name: '.sgt', pattern: /\.sgt\s*\{[^}]*\}/ },
  { name: '.tog', pattern: /\.tog\s*\{[^}]*\}/ },
  { name: '.tog.on', pattern: /\.tog\.on\s*\{[^}]*\}/ },
  { name: '.mi-v', pattern: /\.mi-v\s*\{[^}]*\}/ },
  { name: '.mi-a', pattern: /\.mi-a\s*\{[^}]*\}/ }
];

cssChecks.forEach(check => {
  const match = html.match(check.pattern);
  console.log('═══ ' + check.name + ' ═══');
  if (match) {
    console.log(match[0].replace(/\n/g, '\n  '));
  } else {
    console.log('  ❌ غير معرف');
  }
  console.log('');
});

// فحص إذا كان الثيم الداكن يغطيها
console.log('📌 هل الثيم الداكن يغطي .sit؟');
const darkThemeCSS = html.match(/<style id="chizen-dark-theme">[\s\S]*?<\/style>/);
if (darkThemeCSS) {
  const css = darkThemeCSS[0];
  console.log('  .sit: ' + (css.includes('.sit ') || css.includes('.sit{') ? '✅' : '❌'));
  console.log('  .sii: ' + (css.includes('.sii ') || css.includes('.sii{') ? '✅' : '❌'));
  console.log('  .tog: ' + (css.includes('.tog ') || css.includes('.tog{') ? '✅' : '❌'));
  console.log('  .sg: ' + (css.includes('.sg ') || css.includes('.sg{') ? '✅' : '❌'));
}
