const fs = require('fs');
const h = fs.readFileSync('client/chizen.html', 'utf8');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0;
while ((sc = scRe.exec(h)) !== null) {
  i++;
  if (i !== 8) continue;
  if (/src\s*=/.test(sc[1])) continue;
  try {
    new Function(sc[2]);
    console.log('✅ block 8 is valid');
  } catch (e) {
    console.log('❌ Error:', e.message);
    const lineMatch = (e.stack || '').match(/<anonymous>:(\d+):/);
    if (lineMatch) {
      const n = parseInt(lineMatch[1]) - 1;
      const lines = sc[2].split('\n');
      for (let j = Math.max(0, n - 3); j <= Math.min(lines.length, n + 3); j++) {
        console.log((j + 1) + ': ' + lines[j]);
      }
    }
  }
  break;
}
