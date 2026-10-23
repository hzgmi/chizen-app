const fs = require('fs');
const h = fs.readFileSync('client/chizen.html', 'utf8');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0;
while ((sc = scRe.exec(h)) !== null) {
  i++;
  if (i !== 8) continue;
  if (/src\s*=/.test(sc[1])) continue;
  fs.writeFileSync('/data/data/com.termux/files/home/b8.txt', sc[2]);
  console.log('✅ تم حفظ الكتلة 8 في ~/b8.txt (' + sc[2].length + ' حرف)');
  break;
}
