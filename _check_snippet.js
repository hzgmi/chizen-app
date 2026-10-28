const fs = require('fs');
const h = fs.readFileSync('_v302_snippet.html', 'utf8');
const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
let m, i = 0, e = 0;
while ((m = re.exec(h)) !== null) {
  i++;
  if (!m[1].trim()) continue;
  try { new Function(m[1]); }
  catch (x) { e++; console.log('FAIL', i, x.message); }
}
console.log('Snippet OK:', i, 'errors:', e);
