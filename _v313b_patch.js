const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

if (h.indexOf("v313-guest-header") !== -1) {
  console.log("⚠️ v313b مطبق مسبقاً");
  process.exit(0);
}

// ═══ 1. CSS ═══
var css = '\n<style id="v313-guest-header-css">\n' +
'  .chz-profile-group[data-v313-guest="1"] {\n' +
'    cursor: pointer;\n' +
'    background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15));\n' +
'    border: 1.5px solid rgba(124,58,237,0.4);\n' +
'    border-radius: 12px;\n' +
'    padding: 8px 12px;\n' +
'    transition: all 0.15s ease;\n' +
'    display: flex !important;\n' +
'    flex-direction: row !important;\n' +
'    align-items: center !important;\n' +
'    gap: 8px !important;\n' +
'  }\n' +
'  .chz-profile-group[data-v313-guest="1"]:active {\n' +
'    transform: scale(0.97);\n' +
'    background: linear-gradient(135deg, rgba(124,58,237,0.25), rgba(236,72,153,0.25));\n' +
'  }\n' +
'  .chz-profile-group[data-v313-guest="1"] .chz-prof-avatar {\n' +
'    background: linear-gradient(135deg, #7c3aed, #ec4899) !important;\n' +
'    width: 32px !important;\n' +
'    height: 32px !important;\n' +
'  }\n' +
'  .chz-profile-group[data-v313-guest="1"] .chz-prof-txt {\n' +
'    text-align: right !important;\n' +
'    display: flex !important;\n' +
'    flex-direction: column !important;\n' +
'    gap: 1px !important;\n' +
'  }\n' +
'  .chz-profile-group[data-v313-guest="1"] .chz-prof-name {\n' +
'    color: #ffffff !important;\n' +
'    font-weight: 800 !important;\n' +
'    font-size: 12px !important;\n' +
'    line-height: 1.1 !important;\n' +
'  }\n' +
'  .chz-profile-group[data-v313-guest="1"] .chz-prof-welcome {\n' +
'    color: rgba(196,181,253,0.9) !important;\n' +
'    font-size: 10px !important;\n' +
'    line-height: 1.1 !important;\n' +
'  }\n' +
'  html[data-theme="light"] .chz-profile-group[data-v313-guest="1"] .chz-prof-name {\n' +
'    color: #7c3aed !important;\n' +
'  }\n' +
'  html[data-theme="light"] .chz-profile-group[data-v313-guest="1"] .chz-prof-welcome {\n' +
'    color: #ec4899 !important;\n' +
'  }\n' +
'</style>\n';

var headEnd = h.indexOf("</head>");
if (headEnd === -1) { console.error("❌ </head> not found"); process.exit(1); }
h = h.slice(0, headEnd) + css + h.slice(headEnd);

// ═══ 2. JS ═══
var js = '\n<script id="v313-guest-header-js">\n' +
'(function(){\n' +
'  function setupGuestHeader(){\n' +
'    if (typeof window.__isGuest !== "function" || !window.__isGuest()) return;\n' +
'    var profile = document.querySelector(".chz-profile-group");\n' +
'    if (!profile) { setTimeout(setupGuestHeader, 500); return; }\n' +
'    if (profile.getAttribute("data-v313-guest") === "1") return;\n' +
'    \n' +
'    var nameEl = profile.querySelector(".chz-prof-name");\n' +
'    var welcomeEl = profile.querySelector(".chz-prof-welcome");\n' +
'    if (nameEl) nameEl.textContent = "تسجيل الدخول";\n' +
'    if (welcomeEl) welcomeEl.textContent = "تسوّق الآن";\n' +
'    profile.setAttribute("data-v313-guest", "1");\n' +
'    profile.setAttribute("onclick", "window.__openLogin()");\n' +
'    console.log("[v313b] guest header ready");\n' +
'  }\n' +
'  \n' +
'  // انتظر تحميل __isGuest (v301) + الهيدر\n' +
'  setTimeout(setupGuestHeader, 2000);\n' +
'  setTimeout(setupGuestHeader, 4000);\n' +
'  setInterval(setupGuestHeader, 3000);\n' +
'  \n' +
'  // إعادة الإعداد عند تسجيل الخروج\n' +
'  window.addEventListener("beforeunload", function(){\n' +
'    var profile = document.querySelector(".chz-profile-group");\n' +
'    if (profile) profile.removeAttribute("data-v313-guest");\n' +
'  });\n' +
'})();\n' +
'</script>\n';

var bodyEnd = h.lastIndexOf("</body>");
if (bodyEnd === -1) { console.error("❌ </body> not found"); process.exit(1); }
h = h.slice(0, bodyEnd) + js + h.slice(bodyEnd);

fs.writeFileSync(target, h);
console.log("✅ v313b: guest header login button");
console.log("  قبل:  " + before + " bytes");
console.log("  بعد:  " + h.length + " bytes");
console.log("  فرق:  +" + (h.length - before) + " bytes");
