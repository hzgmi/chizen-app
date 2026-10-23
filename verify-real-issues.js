const fs = require('fs');
const html = fs.readFileSync('client/chizen.html', 'utf8');

console.log('════════════════════════════════════════');
console.log('  🔍 التحقق الدقيق من المشاكل');
console.log('════════════════════════════════════════\n');

// 1) هل الحجوزات تحفظ حقاً؟ نبحث عن أي "bookings" في الكود
console.log('📌 1) كل استخدامات "bookings":');
const bookingsMatches = html.match(/bookings/g) || [];
console.log('  عدد المرات: ' + bookingsMatches.length);
[...html.matchAll(/.{50}bookings.{50}/g)].slice(0, 3).forEach((m, i) => {
  console.log('  #' + (i+1) + ': ...' + m[0].replace(/\s+/g, ' ') + '...');
});

// 2) كيف تُحفظ الحجوزات حالياً؟
console.log('\n📌 2) دالة submitFlight كاملة (أول 800 حرف):');
const sfIdx = html.indexOf('submitFlight');
if (sfIdx !== -1) {
  console.log(html.slice(sfIdx, sfIdx + 800).replace(/\n/g, '\n  '));
}

// 3) renderOrders - من أين تقرأ؟
console.log('\n📌 3) renderOrders:');
const roIdx = html.indexOf('renderOrders:');
if (roIdx !== -1) {
  console.log(html.slice(roIdx, roIdx + 600).replace(/\n/g, '\n  '));
}

// 4) renderNotifs - من أين تقرأ؟
console.log('\n📌 4) renderNotifs:');
const rnIdx = html.indexOf('renderNotifs:');
if (rnIdx !== -1) {
  console.log(html.slice(rnIdx, rnIdx + 600).replace(/\n/g, '\n  '));
}

// 5) firebase.auth() - كيف تستخدم؟
console.log('\n📌 5) firebase.auth:');
const faMatches = html.match(/firebase\.auth/g) || [];
console.log('  عدد المرات: ' + faMatches.length);
[...html.matchAll(/.{30}firebase\.auth.{30}/g)].slice(0, 2).forEach((m, i) => {
  console.log('  #' + (i+1) + ': ' + m[0].replace(/\s+/g, ' '));
});
