const fs = require('fs');
const h = fs.readFileSync('client/chizen.html', 'utf8');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0;
while ((sc = scRe.exec(h)) !== null) {
  i++;
  if (i !== 18 && i !== 19) continue;
  if (/src\s*=/.test(sc[1])) continue;
  const lines = sc[2].split('\n');
  console.log('═══ الكتلة ' + i + ' — الأسطر 15-30 ═══');
  for (let j = 14; j < Math.min(lines.length, 30); j++) {
    const marker = (j + 1 === 23) ? ' ← الخطأ' : '';
    console.log((j + 1) + ': ' + lines[j] + marker);
  }
  console.log('');
}
