const fs = require('fs');
const html = fs.readFileSync('client/chizen.html', 'utf8');

console.log('════════════════════════════════════════════════════');
console.log('  🔍 فحص أزرار الإعدادات');
console.log('════════════════════════════════════════════════════\n');

// استخراج شاشة الإعدادات
const settingsStart = html.indexOf('id="sc-settings"');
const settingsEnd = html.indexOf('<div class="screen"', settingsStart + 100);
const settingsHTML = html.slice(settingsStart, settingsEnd);

// 1) الأزرار في الإعدادات
const btnRegex = /<button([^>]*)>([\s\S]*?)<\/button>/g;
let m, total = 0;
console.log('📌 أزرار <button> في الإعدادات:\n');
while ((m = btnRegex.exec(settingsHTML)) !== null) {
  total++;
  const attrs = m[1];
  const text = m[2].replace(/<[^>]+>/g, '').trim().slice(0, 50);
  const cls = (attrs.match(/class="([^"]*)"/) || [])[1] || '';
  const style = (attrs.match(/style="([^"]*)"/) || [])[1] || '';
  const onclick = (attrs.match(/onclick="([^"]*)"/) || [])[1] || '';
  
  const noStyle = !style || style.length < 10;
  const noClass = !cls || cls.length < 3;
  const hasStyle = !noStyle || !noClass;
  
  console.log('  [' + total + '] "' + text + '"');
  console.log('      class: ' + (cls || '(فارغ)'));
  console.log('      style: ' + (style.slice(0, 60) || '(فارغ)'));
  console.log('      onclick: ' + (onclick.slice(0, 40) || '(فارغ)'));
  console.log('      ' + (hasStyle ? '✅ مصمم' : '❌ بدون تنسيق'));
  console.log('');
}

// 2) العناصر القابلة للنقر (.sit)
const sitRegex = /<div class="sit"([^>]*)>/g;
let sitCount = 0;
console.log('📌 عناصر .sit (قابلة للنقر):\n');
while ((m = sitRegex.exec(settingsHTML)) !== null) {
  sitCount++;
  const attrs = m[1];
  const onclick = (attrs.match(/onclick="([^"]*)"/) || [])[1] || '';
  console.log('  [' + sitCount + '] onclick: ' + (onclick.slice(0, 60) || '(بدون onclick)'));
}

// 3) المفاتيح (tog) - أزرار التبديل
const togRegex = /<div class="tog([^"]*)"([^>]*)>/g;
let togCount = 0;
console.log('\n📌 مفاتيح التبديل (.tog):\n');
while ((m = togRegex.exec(settingsHTML)) !== null) {
  togCount++;
  console.log('  [' + togCount + '] class: "tog' + m[1] + '" ' + m[2].slice(0, 60));
}

// 4) هل هناك أزرار بحجم صغير جداً؟
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 أزرار صغيرة (قد تبدو قبيحة):');
const smallBtnRegex = /<button[^>]*style="[^"]*(?:padding:\s*[0-6]px|font-size:\s*[0-9]px)[^"]*"[^>]*>([\s\S]*?)<\/button>/g;
let smallCount = 0;
while ((m = smallBtnRegex.exec(settingsHTML)) !== null) {
  smallCount++;
  const text = m[1].replace(/<[^>]+>/g, '').trim().slice(0, 40);
  console.log('  ⚠️ "' + text + '"');
}
if (smallCount === 0) console.log('  ✅ لا توجد أزرار صغيرة قبيحة');

// 5) ملخص
console.log('\n════════════════════════════════════════════════════');
console.log('  📊 الملخص');
console.log('════════════════════════════════════════════════════');
console.log('  - أزرار <button>: ' + total);
console.log('  - عناصر .sit (قابلة للنقر): ' + sitCount);
console.log('  - مفاتيح .tog: ' + togCount);
console.log('  - أزرار صغيرة: ' + smallCount);
