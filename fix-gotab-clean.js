const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// 1) حذف كل تعريفات goTab القديمة (بأي شكل)
// نبحث عن أي "goTab: function(...)  { ... }" أو "goTab:function(...){...}"
let removedCount = 0;

// بحث متكرر لأن الدالة قد تحتوي على أقواس متداخلة
for (let attempts = 0; attempts < 5; attempts++) {
  const goTabStart = html.search(/goTab\s*:\s*function\s*\(/);
  if (goTabStart === -1) break;
  
  // نبحث عن نهاية الدالة (نعد الأقواس)
  let depth = 1;
  let pos = html.indexOf('{', goTabStart) + 1;
  let inString = false;
  let stringChar = '';
  
  while (pos < html.length && depth > 0) {
    const c = html[pos];
    const prev = html[pos - 1];
    
    if (inString) {
      if (c === stringChar && prev !== '\\') inString = false;
    } else {
      if (c === '"' || c === "'") { inString = true; stringChar = c; }
      else if (c === '{') depth++;
      else if (c === '}') depth--;
    }
    pos++;
  }
  
  // نحذف من goTabStart إلى pos (وهو نهاية الدالة، قد تليها فاصلة)
  let endPos = pos;
  if (html[endPos] === ',') endPos++;
  
  html = html.slice(0, goTabStart) + html.slice(endPos);
  removedCount++;
}

console.log('✅ تم حذف ' + removedCount + ' نسخة قديمة من goTab.');

// 2) حذف السطر المكسور المتبقي
html = html.replace(/};\s*if\(el\)\{el\.classList\.add\('active'\);el\.style\.color='#D81B60';\}[\s\S]*?catch\(e\)\{\}\},/g, '');

// 3) إضافة goTab نظيفة داخل كائن APP (قبل navigate)
const cleanGoTab = `goTab: function(id, el) {
    this.navigate(id, true);
    try {
      var btns = document.querySelectorAll('.bn-it');
      btns.forEach(function(b) {
        b.classList.remove('active');
        b.style.color = '#9ca3af';
      });
      if (el) {
        el.classList.add('active');
        el.style.color = '#D81B60';
      } else {
        btns.forEach(function(b) {
          var oc = b.getAttribute('onclick') || '';
          if (oc.indexOf("'" + id + "'") > -1) {
            b.classList.add('active');
            b.style.color = '#D81B60';
          }
        });
      }
    } catch(e) {}
  },
  `;

// نضيف goTab قبل navigate
const navIdx = html.indexOf('navigate: function(');
if (navIdx !== -1) {
  html = html.slice(0, navIdx) + cleanGoTab + html.slice(navIdx);
  console.log('✅ تم حقن goTab نظيفة قبل navigate.');
} else {
  // إذا navigate بصيغة أخرى
  const navIdx2 = html.indexOf('navigate:function(');
  if (navIdx2 !== -1) {
    html = html.slice(0, navIdx2) + cleanGoTab + html.slice(navIdx2);
    console.log('✅ تم حقن goTab نظيفة قبل navigate (alt).');
  }
}

// 4) حفظ
fs.writeFileSync(file + '.bak_gotabfix_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('  - goTab: ' + (html.match(/goTab\s*:\s*function/g) || []).length + ' مرة');
console.log('  - navigate: ' + (html.match(/navigate\s*:\s*function/g) || []).length + ' مرة');

// 5) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'gt_' + i + '_' + Date.now() + '.js');
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
