const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

if (h.indexOf("v314-prominent-login") !== -1) {
  console.log("⚠️ v314 مطبق مسبقاً");
  process.exit(0);
}

// ═══ CSS ═══
var css = '\n<style id="v314-prominent-login">\n' +
'  .chz-profile-group[data-v313-guest="1"] {\n' +
'    display: flex !important;\n' +
'    flex-direction: column !important;\n' +
'    align-items: center !important;\n' +
'    justify-content: center !important;\n' +
'    background: #1a1a2e !important;\n' +
'    color: #ffffff !important;\n' +
'    border: none !important;\n' +
'    border-radius: 12px !important;\n' +
'    padding: 11px 18px !important;\n' +
'    min-width: 130px !important;\n' +
'    box-shadow: 0 4px 14px rgba(0,0,0,0.18) !important;\n' +
'    cursor: pointer !important;\n' +
'    gap: 0 !important;\n' +
'  }\n' +
'  .chz-profile-group[data-v313-guest="1"]:active {\n' +
'    transform: scale(0.96) !important;\n' +
'    box-shadow: 0 2px 8px rgba(0,0,0,0.22) !important;\n' +
'  }\n' +
'  .chz-profile-group[data-v313-guest="1"] .chz-prof-avatar {\n' +
'    display: none !important;\n' +
'  }\n' +
'  .chz-profile-group[data-v313-guest="1"] .chz-prof-txt {\n' +
'    text-align: center !important;\n' +
'    align-items: center !important;\n' +
'    width: 100% !important;\n' +
'    display: flex !important;\n' +
'    flex-direction: column !important;\n' +
'    gap: 0 !important;\n' +
'  }\n' +
'  .chz-profile-group[data-v313-guest="1"] .chz-prof-name {\n' +
'    color: #ffffff !important;\n' +
'    font-size: 14px !important;\n' +
'    font-weight: 900 !important;\n' +
'    line-height: 1.2 !important;\n' +
'  }\n' +
'  .chz-profile-group[data-v313-guest="1"] .chz-prof-welcome {\n' +
'    display: none !important;\n' +
'  }\n' +
'  html[data-theme="dark"] .chz-profile-group[data-v313-guest="1"] {\n' +
'    background: #ffffff !important;\n' +
'    color: #1a1a2e !important;\n' +
'    box-shadow: 0 4px 14px rgba(255,255,255,0.18) !important;\n' +
'  }\n' +
'  html[data-theme="dark"] .chz-profile-group[data-v313-guest="1"] .chz-prof-name {\n' +
'    color: #1a1a2e !important;\n' +
'  }\n' +
'</style>\n';

var headEnd = h.indexOf("</head>");
if (headEnd === -1) { console.error("❌ </head> not found"); process.exit(1); }
h = h.slice(0, headEnd) + css + h.slice(headEnd);

// ═══ JS — تغيير النص إلى "تسجيل الآن" ═══
var js = '\n<script id="v314-text-js">\n' +
'(function(){\n' +
'  function update(){\n' +
'    var profile = document.querySelector(".chz-profile-group[data-v313-guest=\\"1\\"]");\n' +
'    if (!profile) return false;\n' +
'    var nameEl = profile.querySelector(".chz-prof-name");\n' +
'    if (nameEl && nameEl.textContent !== "تسجيل الآن") nameEl.textContent = "تسجيل الآن";\n' +
'    return true;\n' +
'  }\n' +
'  setTimeout(update, 2500);\n' +
'  setInterval(update, 4000);\n' +
'})();\n' +
'</script>\n';

var bodyEnd = h.lastIndexOf("</body>");
if (bodyEnd === -1) { console.error("❌ </body> not found"); process.exit(1); }
h = h.slice(0, bodyEnd) + js + h.slice(bodyEnd);

fs.writeFileSync(target, h);
console.log("✅ v314: prominent login button");
console.log("  قبل:  " + before + " bytes");
console.log("  بعد:  " + h.length + " bytes");
console.log("  فرق:  +" + (h.length - before) + " bytes");
