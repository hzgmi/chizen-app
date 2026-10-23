const fs = require('fs');
const h = fs.readFileSync('client/chizen.html', 'utf8');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, e = 0;
while ((sc = scRe.exec(h)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  try { new Function(sc[2]); }
  catch(x) { e++; console.log('❌ block ' + i + ': ' + x.message); }
}
console.log(e === 0 ? '✅ ALL VALID (' + i + ' blocks)' : '❌ ' + e + ' errors');
