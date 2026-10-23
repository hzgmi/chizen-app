const fs = require('fs');
const html = fs.readFileSync('client/chizen.html', 'utf8');

console.log('🔍 فحص مشكلة زر اللغة:\n');

// 1) كم مرة تظهر setLanguage؟
const matches = html.match(/window\.setLanguage\s*=/g) || [];
console.log('📍 window.setLanguage: ' + matches.length + ' مرة');

// 2) هل هناك نسخة قديمة؟
const hasI18NCall = html.includes('I18N.load');
console.log('📍 I18N.load() في setLanguage: ' + (hasI18NCall ? '✅' : '❌'));

// 3) هل I18N موجود؟
console.log('📍 window.I18N: ' + (html.includes('window.I18N') ? '✅' : '❌'));

// 4) هل الزر يستدعي الدالة الصحيحة؟
const langBtns = html.match(/onclick="setLanguage\([^)]*\)"/g) || [];
console.log('📍 أزرار setLanguage: ' + langBtns.length);

// 5) هل ملف en.json موجود؟
const fs2 = require('fs');
console.log('📍 en.json موجود: ' + (fs2.existsSync('client/i18n/en.json') ? '✅' : '❌'));

// 6) طباعة أول 800 حرف من setLanguage الحالية
const idx = html.indexOf('window.setLanguage');
if (idx !== -1) {
  console.log('\n📋 محتوى setLanguage الحالية:');
  console.log(html.slice(idx, idx + 800).replace(/\n/g, '\n  '));
}
