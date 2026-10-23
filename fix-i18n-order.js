const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// 1) استخراج كتلة I18N كاملة
const i18nStart = html.indexOf('<script id="i18n-engine">');
const i18nEnd = html.indexOf('</script>', i18nStart) + '</script>'.length;

if (i18nStart === -1) {
  console.log('❌ لم يجد i18n-engine');
  process.exit(1);
}

const i18nBlock = html.slice(i18nStart, i18nEnd);
console.log('📦 حجم كتلة I18N: ' + i18nBlock.length + ' حرف');

// 2) حذف الكتلة من مكانها الحالي
html = html.slice(0, i18nStart) + html.slice(i18nEnd);

// 3) إعادة إدراجها قبل كتلة setLanguage
// نبحث عن بداية كتلة showLangModal
const showLangStart = html.indexOf('window.showLangModal = function');
if (showLangStart === -1) {
  console.log('❌ لم يجد showLangModal');
  process.exit(1);
}

// نبحث عن بداية <script> التي تحتوي على showLangModal
const scriptStart = html.lastIndexOf('<script', showLangStart);

// نُدرج I18N قبل هذا الـ script
html = html.slice(0, scriptStart) + i18nBlock + '\n' + html.slice(scriptStart);

console.log('✅ تم نقل I18N قبل showLangModal/setLanguage.');

// 4) حفظ
fs.writeFileSync(file + '.bak_i18norder_' + Date.now(), original);
fs.writeFileSync(file, html);

// 5) التحقق
const newI18nPos = html.indexOf('window.I18N =');
const newSetLangPos = html.indexOf('window.setLanguage =');
console.log('\n═══ التحقق ═══');
console.log('  موقع I18N: ' + newI18nPos);
console.log('  موقع setLanguage: ' + newSetLangPos);
console.log('  الترتيب: ' + (newI18nPos < newSetLangPos ? '✅ صحيح' : '❌ خطأ'));

// 6) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'i18n_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; console.log('❌ block #' + i + ': ' + (e.stderr || '').toString().split('\n')[0]); }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
