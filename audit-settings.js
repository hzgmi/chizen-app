const fs = require('fs');
const html = fs.readFileSync('client/chizen.html', 'utf8');

console.log('════════════════════════════════════════');
console.log('  🔍 فحص أزرار الإعدادات');
console.log('════════════════════════════════════════\n');

// استخراج شاشة الإعدادات
const settingsStart = html.indexOf('id="sc-settings"');
const settingsEnd = html.indexOf('<div class="screen"', settingsStart + 50);
const settings = html.slice(settingsStart, settingsEnd);

// استخراج كل onclick في الإعدادات
const onclickRe = /onclick="([^"]+)"/g;
const buttons = [];
let m;
while ((m = onclickRe.exec(settings)) !== null) {
  buttons.push(m[1]);
}

console.log('📌 أزرار الإعدادات الموجودة:');
buttons.forEach((btn, i) => {
  let status = '✅';
  let detail = '';
  
  // فحص إذا كان الزر يستدعي APP.something
  const appMatch = btn.match(/APP\.(\w+)/);
  if (appMatch) {
    const fn = appMatch[1];
    const fnExists = html.includes(fn + ':') || html.includes(fn + ' =') || html.includes('window.' + fn);
    status = fnExists ? '✅' : '❌';
    detail = fnExists ? '(دالة موجودة)' : '(دالة مفقودة!)';
  }
  
  // فحص إذا كان الزر يستدعي دالة مستقلة
  const freeFnMatch = btn.match(/^(\w+)\(/);
  if (freeFnMatch && !appMatch) {
    const fn = freeFnMatch[1];
    const fnExists = html.includes('window.' + fn) || html.includes('function ' + fn);
    status = fnExists ? '✅' : '❌';
    detail = fnExists ? '(دالة مستقلة موجودة)' : '(دالة مفقودة!)';
  }
  
  console.log('  ' + status + ' [' + (i+1) + '] ' + btn + ' ' + detail);
});

// فحص الدوال المطلوبة
console.log('\n📌 الدوال المتوقعة في الإعدادات:');
const expectedFunctions = [
  'openLang', 'openTheme', 'openFont', 'togBio', 'changePass',
  'goTab', 'editProfile', 'deleteAccount', 'logout', 'clearCache', 'backup',
  'toggleThemeMode'
];
expectedFunctions.forEach(fn => {
  const exists = html.includes(fn + ':') || html.includes(fn + ' =') || html.includes('window.' + fn);
  console.log('  ' + (exists ? '✅' : '❌') + ' ' + fn);
});
