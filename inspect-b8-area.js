const fs = require('fs');
const path = require('path');
const h = fs.readFileSync('client/chizen.html', 'utf8');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0;
while ((sc = scRe.exec(h)) !== null) {
  i++;
  if (i !== 8) continue;
  if (/src\s*=/.test(sc[1])) continue;
  const lines = sc[2].split('\n');
  console.log('═══ الكتلة 8 — الأسطر 165-190 ═══');
  for (let j = 164; j < Math.min(lines.length, 190); j++) {
    const marker = (j + 1 === 175) ? ' ← الخطأ' : '';
    console.log((j + 1) + ': ' + lines[j] + marker);
  }
  break;
}
