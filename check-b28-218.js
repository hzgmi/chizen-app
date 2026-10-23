const fs = require('fs');
const h = fs.readFileSync('client/chizen.html', 'utf8');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0;
while ((sc = scRe.exec(h)) !== null) {
  i++;
  if (i !== 28) continue;
  if (/src\s*=/.test(sc[1])) continue;
  fs.writeFileSync('/data/data/com.termux/files/home/b28fix.js', sc[2]);
  break;
}
