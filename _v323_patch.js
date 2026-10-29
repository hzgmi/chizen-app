const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

// ═══ 1. CSS anti-flicker (يُحقن في <head> فوراً — قبل تحميل JS) ═══
// يقرأ localStorage ويعرض "تسجيل الآن" من 0ms لو الزائر
var css = '\n<style id="v323-anti-flicker">\n' +
'  /* v323: guest state visible from 0ms - no flicker */\n' +
'  html.chz-guest-instant .chz-prof-txt .chz-prof-name {\n' +
'    display: none !important;\n' +
'  }\n' +
'  html.chz-guest-instant .chz-prof-txt .chz-prof-welcome {\n' +
'    display: none !important;\n' +
'  }\n' +
'  html.chz-guest-instant .chz-prof-txt::after {\n' +
'    content: "تسجيل الآن";\n' +
'    font-family: Tajawal, sans-serif;\n' +
'    font-size: 13px;\n' +
'    font-weight: 800;\n' +
'    color: #ffffff;\n' +
'    line-height: 1.2;\n' +
'    text-align: center;\n' +
'    display: block;\n' +
'  }\n' +
'  html.chz-guest-instant .chz-profile-group {\n' +
'    background: #1a1a2e !important;\n' +
'    border: none !important;\n' +
'    border-radius: 10px !important;\n' +
'    padding: 8px 14px !important;\n' +
'    min-width: 100px !important;\n' +
'    max-width: 130px !important;\n' +
'    display: flex !important;\n' +
'    align-items: center !important;\n' +
'    justify-content: center !important;\n' +
'    cursor: pointer !important;\n' +
'  }\n' +
'  html.chz-guest-instant .chz-profile-group .chz-prof-avatar {\n' +
'    display: none !important;\n' +
'  }\n' +
'  html[data-theme="dark"].chz-guest-instant .chz-profile-group,\n' +
'  html[data-theme="dark"] html.chz-guest-instant .chz-profile-group {\n' +
'    background: #ffffff !important;\n' +
'  }\n' +
'  html[data-theme="dark"] html.chz-guest-instant .chz-prof-txt::after {\n' +
'    color: #1a1a2e !important;\n' +
'  }\n' +
'</style>\n';

// إضافة CSS + script في <head>
var headEnd = h.indexOf("</head>");
if (headEnd === -1) { console.error("❌ </head>"); process.exit(1); }

// script صغير جداً في <head> — يضيف class فوراً
var headScript = '\n<script id="v323-guest-instant">\n' +
'  (function(){\n' +
'    try {\n' +
'      if (localStorage.getItem("chizen_guest") === "true") {\n' +
'        document.documentElement.classList.add("chz-guest-instant");\n' +
'      }\n' +
'    } catch(e){}\n' +
'  })();\n' +
'</script>\n';

h = h.slice(0, headEnd) + headScript + css + h.slice(headEnd);

// ═══ 2. تنظيف splash CSS المتبقي ═══
// نحذف فقط القواعد التي تحتوي chz-splash-v63 (شعار لم يعد موجوداً)
var splashCssRules = h.match(/#chz-splash-v63[^{]*\{[^}]*\}/g) || [];
var removedCss = 0;
splashCssRules.forEach(function(rule){
  h = h.replace(rule, '');
  removedCss += rule.length;
});
console.log("✅ 1: anti-flicker CSS + script added");
console.log("✅ 2: splash CSS cleanup (" + splashCssRules.length + " قواعد، " + removedCss + " bytes)");

// ═══ 3. التأكد أن v322 ما زال يعمل ═══
if (h.indexOf("v322-instant-auth") === -1) {
  console.warn("⚠️ v322-instant-auth missing - re-adding");
  var v322Script = '\n<script id="v322-instant-auth">\n' +
  '  document.documentElement.classList.add("chz-auth-ok");\n' +
  '</script>\n';
  h = h.slice(0, headEnd) + v322Script + h.slice(headEnd);
}

fs.writeFileSync(target, h);
console.log("━━━━━━━━━━━━━━━━━━");
console.log("قبل:  " + before + " bytes");
console.log("بعد:  " + h.length + " bytes");
console.log("فرق:  " + (h.length - before) + " bytes");
