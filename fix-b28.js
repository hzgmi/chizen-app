const fs = require('fs');
const path = require('path');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// استخراج الكتلة 28
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0;
let blockStart = -1;
let blockEnd = -1;
let blockContent = '';

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

console.log('✅ الكتلة 28: ' + blockContent.length + ' حرف');

// البحث عن النمط المعطوب: "}\n  };" (سطران، الثاني زائد)
// نبحث عن: logout → } ثم }; على سطر منفصل
const brokenPattern = /(function\(\)\s*\{[\s\S]*?)\}\s*\n\s*\};\s*\n/;
if (brokenPattern.test(blockContent)) {
  blockContent = blockContent.replace(brokenPattern, '$1}\n');
  console.log('✅ تم إصلاح النمط: }\\n  };  →  }');
} else {
  // طريقة بديلة: نبحث عن كل "};" ونرى إذا كان هناك "}" قبله بدون سبب
  const lines = blockContent.split('\n');
  for (let j = 0; j < lines.length; j++) {
    if (lines[j].trim() === '};' && j > 0 && lines[j-1].trim() === '}') {
      lines.splice(j, 1);
      console.log('✅ تم حذف السطر الزائد ' + (j+1));
      break;
    }
  }
  blockContent = lines.join('\n');
}

// إعادة بناء الكتلة
const newBlock = '<script' + sc[1] + '>' + blockContent + '</script>';
html = html.slice(0, blockStart) + newBlock + html.slice(blockEnd);

// حفظ
fs.writeFileSync(file + '.bak_b28_' + Date.now(), original);
fs.writeFileSync(file, html);
console.log('✅ تم حفظ الملف.');

// فحص Syntax
const os = require('os');
const scRe2 = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc2, j = 0, errs = 0;
while ((sc2 = scRe2.exec(html)) !== null) {
  j++;
  if (/src\s*=/.test(sc2[1])) continue;
  if (!sc2[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'b28_' + j + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc2[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; console.log('❌ block #' + j); }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + j + ' blocks)' : '❌ ' + errs + ' errors');
