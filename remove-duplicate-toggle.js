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

// حذف كل تعريفات toggleBiometric (بأي شكل)
// نبحث عن "window.toggleBiometric =" أو "toggleBiometric =" ونحذف حتى القوس المغلق
function removeAllFunctions(content, fnName) {
  let result = content;
  let iterations = 0;
  
  while (iterations < 5) {
    const patterns = [
      new RegExp('window\\.' + fnName + '\\s*=\\s*function\\s*\\([^)]*\\)\\s*\\{', 'g'),
      new RegExp(fnName + '\\s*:\\s*function\\s*\\([^)]*\\)\\s*\\{', 'g')
    ];
    
    let found = false;
    for (const re of patterns) {
      const match = re.exec(result);
      if (match) {
        // ابحث عن القوس المغلق
        let depth = 1;
        let pos = match.index + match[0].length;
        let inString = false, stringChar = '';
        
        while (pos < result.length && depth > 0) {
          const c = result[pos];
          const prev = result[pos - 1];
          
          if (inString) {
            if (c === stringChar && prev !== '\\\\') inString = false;
          } else {
            if (c === '"' || c === "'") { inString = true; stringChar = c; }
            else if (c === '{') depth++;
            else if (c === '}') depth--;
          }
          pos++;
        }
        
        // تجاوز ";" أو "," إن وجدت
        if (result[pos] === ';') pos++;
        if (result[pos] === ',') pos++;
        
        result = result.slice(0, match.index) + result.slice(pos);
        found = true;
        break;
      }
    }
    
    if (!found) break;
    iterations++;
  }
  
  return result;
}

blockContent = removeAllFunctions(blockContent, 'toggleBiometric');
console.log('✅ تم حذف كل toggleBiometric القديمة.');

// إضافة toggleBiometric نظيفة قبل })();
const cleanToggle = `
  // التحكم من الإعدادات
  window.toggleBiometric = function() {
    if (!storedPin) {
      if (window.openPinSetup) {
        openPinSetup();
        return true;
      }
      return false;
    } else {
      if (window.chzConfirm) {
        chzConfirm('هل تريد إلغاء قفل التطبيق؟', 'إلغاء القفل', {
          icon: 'lock',
          confirmText: 'نعم، إلغاء',
          cancelText: 'إبقاء القفل',
          danger: true
        }).then(function(ok) {
          if (ok) {
            removeAppPin();
            var bioSwitch = document.getElementById('t-bio');
            if (bioSwitch) bioSwitch.classList.remove('on');
          }
        });
      } else if (confirm('هل تريد إلغاء قفل التطبيق؟')) {
        removeAppPin();
        return false;
      }
      return true;
    }
  };
`;

// أدرج قبل "})();" الأخيرة
const lastParen = blockContent.lastIndexOf('})();');
if (lastParen !== -1) {
  blockContent = blockContent.slice(0, lastParen) + cleanToggle + '\n' + blockContent.slice(lastParen);
  console.log('✅ تم إضافة toggleBiometric نظيفة.');
}

// إعادة بناء الكتلة
const newBlock = '<script' + sc[1] + '>' + blockContent + '</script>';
html = html.slice(0, blockStart) + newBlock + html.slice(blockEnd);

// حفظ
fs.writeFileSync(file + '.bak_removedup_' + Date.now(), original);
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
  const tmp = path.join(os.tmpdir(), 'rd_' + j + '_' + Date.now() + '.js');
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
