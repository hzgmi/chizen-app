const fs = require('fs');
const path = require('path');
const os = require('os');
const h = fs.readFileSync('client/chizen.html', 'utf8');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(h)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'chk_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) {
    errs++;
    const errLine = (e.stderr || '').toString();
    const match = errLine.match(/:(\d+)/);
    console.log('❌ block #' + i + (match ? ' (سطر ' + match[1] + ')' : ''));
    console.log('   ' + errLine.split('\n').filter(l => l.trim()).slice(0, 3).join('\n   '));
    // حفظ الكتلة للفحص
    fs.writeFileSync('/data/data/com.termux/files/home/broken_' + i + '.js', sc[2]);
  }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n📊 إجمالي: ' + i + ' كتلة، ' + errs + ' خطأ');
