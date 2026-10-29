const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

if (h.indexOf("v335-critical-light") !== -1) {
  console.log("⚠️ v335 مطبق مسبقاً");
  process.exit(0);
}

// ═══ 1. تعديل <html> tag مباشرة ═══
// البحث عن <html...>
var htmlTagMatch = h.match(/<html\b[^>]*>/i);
if (!htmlTagMatch) { console.error("❌ <html> not found"); process.exit(1); }

var oldHtml = htmlTagMatch[0];
var newHtml;

if (oldHtml.indexOf('data-theme=') !== -1) {
  // استبدال data-theme الحالي بـ light
  newHtml = oldHtml.replace(/data-theme=["'](dark|light|auto)["']/i, 'data-theme="light"');
} else {
  // إضافة data-theme="light"
  newHtml = oldHtml.replace(/(<html\b)/i, '$1 data-theme="light"');
}

// إضافة inline style للخلفية الفاتحة (أولوية قصوى قبل أي CSS)
if (newHtml.indexOf('style=') === -1) {
  newHtml = newHtml.replace(/(<html\b[^>]*)(>)/i, '$1 style="background:#faf7ff !important;color-scheme:light"$2');
}

h = h.replace(oldHtml, newHtml);
console.log("✅ <html> tag: " + oldHtml.slice(0, 60) + "...");
console.log("   → " + newHtml.slice(0, 80) + "...");

// ═══ 2. Critical CSS + Script في أول <head> ═══
var critical = '\n<!-- v335-critical-light: LIGHT theme is the app default, always -->\n' +
'<meta name="color-scheme" content="light only">\n' +
'<meta name="theme-color" content="#faf7ff">\n' +
'<style id="v335-critical-light">\n' +
'  /* Force light theme from byte 0 */\n' +
'  html, body {\n' +
'    background-color: #faf7ff !important;\n' +
'    color-scheme: light !important;\n' +
'  }\n' +
'  /* Only override when user explicitly chose dark */\n' +
'  html[data-theme="dark"], html.chz-dark {\n' +
'    background-color: #0a0825 !important;\n' +
'    color-scheme: dark !important;\n' +
'  }\n' +
'</style>\n' +
'<script id="v335-theme-lock">\n' +
'  (function(){\n' +
'    try {\n' +
'      var stored = localStorage.getItem("chizen_theme_mode");\n' +
'      var html = document.documentElement;\n' +
'      // LIGHT is always the default. Dark only if user explicitly chose it.\n' +
'      if (stored === "dark") {\n' +
'        html.setAttribute("data-theme", "dark");\n' +
'        html.classList.add("chz-dark");\n' +
'        html.classList.remove("chz-light");\n' +
'        html.style.background = "#0a0825";\n' +
'      } else {\n' +
'        html.setAttribute("data-theme", "light");\n' +
'        html.classList.add("chz-light");\n' +
'        html.classList.remove("chz-dark");\n' +
'        html.style.background = "#faf7ff";\n' +
'      }\n' +
'    } catch(e) {\n' +
'      document.documentElement.setAttribute("data-theme", "light");\n' +
'    }\n' +
'  })();\n' +
'</script>\n';

var headIdx = h.indexOf("<head>");
if (headIdx === -1) { console.error("❌ <head> not found"); process.exit(1); }
var insertAt = headIdx + "<head>".length;
h = h.slice(0, insertAt) + critical + h.slice(insertAt);

console.log("✅ critical CSS + script inserted at top of <head>");

fs.writeFileSync(target, h);
console.log("━━━━━━━━━━━━━━━━━━");
console.log("قبل:  " + before + " bytes");
console.log("بعد:  " + h.length + " bytes");
console.log("فرق:  +" + (h.length - before) + " bytes");
