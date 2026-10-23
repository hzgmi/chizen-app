const fs = require('fs');
const html = fs.readFileSync('client/chizen.html', 'utf8');

console.log('════════════════════════════════════════');
console.log('  🔍 فحص نظام القفل الحالي');
console.log('════════════════════════════════════════\n');

// 1) هل النظام موجود؟
console.log('📌 1) العناصر الأساسية:');
console.log('  - شاشة القفل: ' + (html.includes('id="app-lock-screen"') ? '✅' : '❌'));
console.log('  - lockPress: ' + (html.includes('window.lockPress') ? '✅' : '❌'));
console.log('  - lockApp: ' + (html.includes('window.lockApp') ? '✅' : '❌'));
console.log('  - tryFingerprint: ' + (html.includes('window.tryFingerprint') ? '✅' : '❌'));
console.log('  - setupAppPin: ' + (html.includes('window.setupAppPin') ? '✅' : '❌'));

// 2) هل togBio مربوط؟
console.log('\n📌 2) ربط togBio:');
const togBioMatch = html.match(/togBio\s*:\s*function\s*\([^)]*\)\s*\{[\s\S]*?\n\s{2,4}\},/);
if (togBioMatch) {
  const body = togBioMatch[0];
  console.log('  ' + (body.includes('toggleBiometric') ? '✅ مربوط بـ toggleBiometric' : '❌ غير مربوط'));
  console.log('  محتوى الدالة:');
  console.log('  ' + body.replace(/\n/g, '\n  ').slice(0, 300));
}

// 3) هل هناك قفل عند فتح التطبيق؟
console.log('\n📌 3) القفل عند الفتح:');
console.log('  - visibilitychange: ' + (html.includes('visibilitychange') ? '✅' : '❌'));
console.log('  - lockApp عند load: ' + (/addEventListener\('load'[\s\S]{0,500}lockApp/.test(html) ? '✅' : '❌'));
console.log('  - chizen_app_pin في localStorage: ' + (html.includes('chizen_app_pin') ? '✅' : '❌'));

// 4) هل زر togBio في الإعدادات؟
console.log('\n📌 4) زر togBio في الإعدادات:');
const bioBtnMatch = html.match(/onclick="[^"]*togBio[^"]*"/);
if (bioBtnMatch) {
  console.log('  ✅ الزر موجود: ' + bioBtnMatch[0]);
} else {
  console.log('  ❌ الزر مفقود');
}

// 5) فحص CSS للشاشة
console.log('\n📌 5) CSS شاشة القفل:');
console.log('  - #app-lock-screen: ' + (html.includes('#app-lock-screen {') ? '✅' : '❌'));
console.log('  - pin-key: ' + (html.includes('.pin-key') ? '✅' : '❌'));
console.log('  - fingerprint-btn: ' + (html.includes('.fingerprint-btn') ? '✅' : '❌'));
