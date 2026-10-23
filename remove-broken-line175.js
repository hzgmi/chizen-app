const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// حذف السطر المكسور بالكامل (الذي يبدأ بـ ); ويحتوي على if(el) و catch(e)
const brokenLine = /\n\s*\);\s*if\(el\)\{[^\n]*catch\(e\)\{\}\},?\s*\n/g;
const before = html.length;
html = html.replace(brokenLine, '\n');
const after = html.length;

if (before !== after) {
  console.log('✅ تم حذف السطر المكسور (' + (before - after) + ' حرف).');
} else {
  console.log('⚠️ لم يتم العثور على النمط المتوقع، سنستخدم بحثاً يدوياً.');
  // بحث يدوي
  const lines = html.split('\n');
  let removed = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(");") && lines[i].includes("if(el)") && lines[i].includes("catch(e)")) {
      lines[i] = '';
      removed++;
    }
  }
  html = lines.join('\n');
  console.log('✅ تم حذف ' + removed + ' سطر يدوياً.');
}

// حفظ
fs.writeFileSync(file + '.bak_removeline_' + Date.now(), original);
fs.writeFileSync(file, html);

// فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'rml_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { 
    errs++; 
    const errLine = (e.stderr || '').toString().match(/:(\d+)/);
    console.log('❌ block #' + i + (errLine ? ' (سطر ' + errLine[1] + ')' : '')); 
  }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
