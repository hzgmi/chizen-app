const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// استبدال رسائل نجاح الحجز
html = html.replace(
  /this\.toast\(['"]تم تأكيد الحجز[^)]*\)/g,
  "showSuccess({ title: 'تم تأكيد حجزك! 🎉', message: 'سنتواصل معك قريباً لتأكيد التفاصيل.', btn: 'العودة للرئيسية', onClose: function(){ if(window.APP) APP.goTab('home'); } })"
);

// استبدال رسائل نجاح الطلب
html = html.replace(
  /this\.toast\(['"]تم إرسال طلبك[^)]*\)/g,
  "showSuccess({ title: 'تم استلام طلبك! 🎉', message: 'سنتواصل معك قريباً للتوصيل.', btn: 'تسوق المزيد', onClose: function(){ if(window.APP) APP.goTab('home'); } })"
);

// استبدال رسائل نجاح الشراء
html = html.replace(
  /alert\(['"]تم الشراء بنجاح[^)]*\)/g,
  "showSuccess({ title: 'تم الشراء بنجاح! 🎉', message: 'سنتواصل معك قريباً للتسليم.', btn: 'متابعة التسوق', onClose: function(){ if(window.APP) APP.goTab('home'); } })"
);

// استبدال أي رسائل نجاح أخرى داخل دالة submitFlight / submitBus / submitHotel / submitHajj
const bookFormFunctions = ['submitFlight', 'submitBus', 'submitHotel', 'submitHajj'];
bookFormFunctions.forEach(fn => {
  const fnRegex = new RegExp('(' + fn + '\\s*:\\s*(?:async\\s+)?function[\\s\\S]*?)(alert|toast)\\([^)]*تم حجز[^)]*\\)', 'g');
  html = html.replace(fnRegex, "$1 showSuccess({ title: 'تم تأكيد حجزك! 🎉', message: 'سنتواصل معك قريباً لتأكيد التفاصيل.', btn: 'العودة للرئيسية', onClose: function(){ if(window.APP) APP.goTab('home'); } })");
});

fs.writeFileSync(file + '.bak_replacetoast_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('✅ تم استبدال رسائل النجاح بالنافذة الموحدة.');

// فحص Syntax
const os = require('os');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'rpl_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT' : '❌ ' + errs + ' errors');
