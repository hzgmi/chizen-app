const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

// ═══ 1. حذف splash div (counting) ═══
var startMarker = '<div id="chz-splash-v63"';
var startIdx = h.indexOf(startMarker);
if (startIdx === -1) { console.error("❌ splash start not found"); process.exit(1); }

var depth = 0, i = startIdx, inStr = null, inLine = false, inBlock = false;
var endIdx = -1;
for (; i < h.length; i++) {
  const c = h[i], n = h[i+1];
  if (inLine) { if (c === '\n') inLine = false; continue; }
  if (inBlock) { if (c === '*' && n === '/') { inBlock = false; i++; } continue; }
  if (inStr) { if (c === '\\') { i++; continue; } if (c === inStr) inStr = null; continue; }
  if (c === '/' && n === '/') { inLine = true; i++; continue; }
  if (c === '/' && n === '*') { inBlock = true; i++; continue; }
  if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
  
  // فحص <div vs </div>
  if (h.startsWith('<div', i) && (h[i+4] === ' ' || h[i+4] === '>')) {
    depth++;
    i += 3;
  } else if (h.startsWith('</div>', i)) {
    depth--;
    if (depth === 0) { endIdx = i + 6; break; }
    i += 5;
  }
}

if (endIdx === -1) { console.error("❌ splash end not found"); process.exit(1); }

var splashSize = endIdx - startIdx;
h = h.slice(0, startIdx) + h.slice(endIdx);
console.log("✅ 1: splash div removed (" + splashSize + " bytes)");

// ═══ 2. حذف CSS الذي يخفي المحتوى ═══
var cssPattern = /html:not\(\.chz-auth-ok\)\s+body[^{]*\{[^}]*\}\s*html:not\(\.chz-auth-ok\)\s+body\s*>\s*\*[^{]*\{[^}]*\}\s*html:not\(\.chz-auth-ok\)\s+#chz-splash-v63[^{]*\{[^}]*\}/;
var m = h.match(cssPattern);
if (m) {
  h = h.replace(m[0], '');
  console.log("✅ 2: hidden CSS removed (" + m[0].length + " bytes)");
} else {
  console.log("⚠️ 2: CSS pattern not matched - trying line-by-line");
  // بديل: حذف كل html:not(.chz-auth-ok) rules
  var rules = h.match(/html:not\(\.chz-auth-ok\)[^{]*\{[^}]*\}/g) || [];
  rules.forEach(function(r){ h = h.replace(r, ''); });
  console.log("  حذف " + rules.length + " قاعدة يدوياً");
}

// ═══ 3. إضافة chz-auth-ok فوراً في <head> ═══
var instantScript = '\n<script id="v322-instant-auth">\n' +
'  // v322: content visible immediately, no splash\n' +
'  document.documentElement.classList.add("chz-auth-ok");\n' +
'</script>\n';

var headEnd = h.indexOf("</head>");
if (headEnd === -1) { console.error("❌ </head>"); process.exit(1); }
h = h.slice(0, headEnd) + instantScript + h.slice(headEnd);
console.log("✅ 3: instant auth class added");

// ═══ 4. كتابة ═══
fs.writeFileSync(target, h);
console.log("━━━━━━━━━━━━━━━━━━");
console.log("قبل:  " + before + " bytes");
console.log("بعد:  " + h.length + " bytes");
console.log("فرق:  " + (h.length - before) + " bytes");
