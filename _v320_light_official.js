const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

// عدّاد تغييرات
var count = 0;

// 1. تغيير fallback من 'auto' إلى 'light'
var re1 = /localStorage\.getItem\(['"]chizen_theme_mode['"]\)\s*\|\|\s*['"]auto['"]/g;
var matches1 = h.match(re1) || [];
count += matches1.length;
h = h.replace(re1, function(m){
  return m.replace("'auto'", "'light'").replace('"auto"', '"light"');
});
console.log("✅ fallback 'auto' → 'light': " + matches1.length + " تحويل");

// 2. تحويل auto إلى light (deprecate)
var re2 = /if\s*\(\s*['"]auto['"]\s*===\s*mode\s*\)/g;
var m2 = h.match(re2) || [];
if (m2.length > 0) {
  console.log("ℹ️ وجدنا " + m2.length + " فحص 'auto' — لن نلمسه، سيحوله السطر التالي");
}

// 3. حقن override: نُجبر auto → light
var override = '\n<script id="v320-light-official">\n' +
'(function(){\n' +
'  try {\n' +
'    var stored = localStorage.getItem("chizen_theme_mode");\n' +
'    if (!stored || stored === "auto") {\n' +
'      document.documentElement.setAttribute("data-theme", "light");\n' +
'      document.documentElement.classList.remove("chz-dark");\n' +
'      document.documentElement.classList.add("chz-light");\n' +
'      console.log("[v320] light official forced");\n' +
'    }\n' +
'  } catch(e){}\n' +
'})();\n' +
'</script>\n';

var bodyEnd = h.lastIndexOf("</body>");
if (bodyEnd === -1) { console.error("❌ </body> not found"); process.exit(1); }
h = h.slice(0, bodyEnd) + override + h.slice(bodyEnd);

// 4. الكتابة
fs.writeFileSync(target, h);
console.log("━━━━━━━━━━━━━━━━━━");
console.log("قبل:  " + before + " bytes");
console.log("بعد:  " + h.length + " bytes");
console.log("فرق:  +" + (h.length - before) + " bytes");
