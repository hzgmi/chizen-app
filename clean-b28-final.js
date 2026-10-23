const fs = require('fs');
const path = require('path');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// استخراج الكتلة 28
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0;
let blockStart = -1, blockEnd = -1, blockContent = '';

while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (i !== 28) continue;
  if (/src\s*=/.test(sc[1])) continue;
  blockStart = sc.index;
  blockEnd = sc.index + sc[0].length;
  blockContent = sc[2];
  break;
}

if (blockStart === -1) {
  console.log('❌ لم يجد الكتلة 28');
  process.exit(1);
}

console.log('📦 الكتلة 28 الأصلية: ' + blockContent.length + ' حرف');

// السحر: نجد آخر "// التحكم من الإعدادات" أو "window.toggleBiometric" ونحذف كل شيء قبلها حتى "})();" السابقة
// الأفضل: نجد آخر تعريف صحيح لـ toggleBiometric ونحتفظ به فقط

// حذف كل شيء بين آخر "});" قبل "// التحكم من الإعدادات" الثاني وقبل toggleBiometric الأول
const lines = blockContent.split('\n');

// ابحث عن آخر سطر يحتوي "window.toggleBiometric"
let lastToggleIdx = -1;
for (let j = lines.length - 1; j >= 0; j--) {
  if (lines[j].includes('window.toggleBiometric = function')) {
    lastToggleIdx = j;
    break;
  }
}

if (lastToggleIdx === -1) {
  console.log('❌ لم يجد toggleBiometric');
  process.exit(1);
}

console.log('✅ آخر toggleBiometric في السطر ' + (lastToggleIdx + 1));

// ابحث عن "// التحكم من الإعدادات" قبل هذا السطر (آخر واحد)
let commentIdx = -1;
for (let j = lastToggleIdx - 1; j >= 0; j--) {
  if (lines[j].includes('// التحكم من الإعدادات')) {
    commentIdx = j;
    break;
  }
}

if (commentIdx === -1) {
  console.log('❌ لم يجد التعليق');
  process.exit(1);
}

console.log('✅ آخر تعليق في السطر ' + (commentIdx + 1));

// الآن، نحتاج أن نجد بداية البقايا القديمة.
// نبحث قبل commentIdx عن آخر "});" أو "}" في سياق IIFE (وهو نهاية addEventListener)
// نبحث عن آخر سطر قبل commentIdx يحتوي "});" و هو داخل الـ IIFE
let cleanupStart = -1;
for (let j = commentIdx - 1; j >= 0; j--) {
  if (lines[j].trim() === '});') {
    cleanupStart = j;
    break;
  }
}

if (cleanupStart === -1) {
  console.log('⚠️ لم يجد بداية البقايا، سيحذف فقط من commentIdx إلى lastToggleIdx');
  cleanupStart = commentIdx - 1;
}

console.log('📍 حذف من السطر ' + (cleanupStart + 2) + ' إلى ' + lastToggleIdx);

// الآن نحذف من cleanupStart + 1 (بعد }) حتى lastToggleIdx (قبل toggleBiometric)
const newLines = [
  ...lines.slice(0, cleanupStart + 1),
  '',
  '  // التحكم من الإعدادات',
  ...lines.slice(lastToggleIdx)
];

blockContent = newLines.join('\n');

// إعادة بناء الكتلة
const newBlock = '<script' + sc[1] + '>' + blockContent + '</script>';
html = html.slice(0, blockStart) + newBlock + html.slice(blockEnd);

// حفظ
fs.writeFileSync(file + '.bak_cleanb28_' + Date.now(), original);
fs.writeFileSync(file, html);
console.log('✅ تم حفظ الملف.');

// فحص
const os = require('os');
const scRe2 = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc2, j = 0, errs = 0;
while ((sc2 = scRe2.exec(html)) !== null) {
  j++;
  if (/src\s*=/.test(sc2[1])) continue;
  if (!sc2[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'cb28_' + j + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc2[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) {
    errs++;
    const errLine = (e.stderr || '').toString().match(/:(\d+)/);
    console.log('❌ block #' + j + (errLine ? ' (سطر ' + errLine[1] + ')' : ''));
  }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + j + ' blocks)' : '❌ ' + errs + ' errors');
