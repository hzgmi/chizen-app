const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;
let removed = 0;
let m;

// ═══ 1. حذف v313b + v314 بالكامل ═══
m = h.match(/<style id="v313-guest-header-css">[\s\S]*?<\/style>\s*/);
if (m) { removed += m[0].length; h = h.replace(m[0], ""); }

m = h.match(/<script id="v313-guest-header-js">[\s\S]*?<\/script>\s*/);
if (m) { removed += m[0].length; h = h.replace(m[0], ""); }

m = h.match(/<style id="v314-prominent-login">[\s\S]*?<\/style>\s*/);
if (m) { removed += m[0].length; h = h.replace(m[0], ""); }

m = h.match(/<script id="v314-text-js">[\s\S]*?<\/script>\s*/);
if (m) { removed += m[0].length; h = h.replace(m[0], ""); }

console.log("✅ Removed old patches: " + removed + " bytes");

// ═══ 2. CSS نظيف (بدون JS text manipulation) ═══
var css = '\n<style id="v315-clean-guest">\n' +
'  body.chz-is-guest .chz-profile-group {\n' +
'    background: #1a1a2e !important;\n' +
'    border: none !important;\n' +
'    border-radius: 12px !important;\n' +
'    padding: 11px 18px !important;\n' +
'    min-width: 130px !important;\n' +
'    box-shadow: 0 4px 14px rgba(0,0,0,0.2) !important;\n' +
'    cursor: pointer !important;\n' +
'    display: flex !important;\n' +
'    align-items: center !important;\n' +
'    justify-content: center !important;\n' +
'    flex-direction: row !important;\n' +
'    gap: 0 !important;\n' +
'  }\n' +
'  body.chz-is-guest .chz-profile-group:active { transform: scale(0.96) !important; }\n' +
'  body.chz-is-guest .chz-profile-group .chz-prof-avatar { display: none !important; }\n' +
'  body.chz-is-guest .chz-profile-group .chz-prof-txt {\n' +
'    text-align: center !important; width: 100% !important;\n' +
'    display: flex !important; flex-direction: column !important; align-items: center !important;\n' +
'  }\n' +
'  body.chz-is-guest .chz-profile-group .chz-prof-name {\n' +
'    font-size: 0 !important; line-height: 1.2 !important; color: transparent !important;\n' +
'  }\n' +
'  body.chz-is-guest .chz-profile-group .chz-prof-name::after {\n' +
'    content: "تسجيل الآن";\n' +
'    font-size: 14px; font-weight: 900; color: #ffffff;\n' +
'    line-height: 1.2; display: inline-block;\n' +
'  }\n' +
'  body.chz-is-guest .chz-profile-group .chz-prof-welcome { display: none !important; }\n' +
'  html[data-theme="dark"] body.chz-is-guest .chz-profile-group {\n' +
'    background: #ffffff !important;\n' +
'    box-shadow: 0 4px 14px rgba(255,255,255,0.2) !important;\n' +
'  }\n' +
'  html[data-theme="dark"] body.chz-is-guest .chz-profile-group .chz-prof-name::after {\n' +
'    color: #1a1a2e !important;\n' +
'  }\n' +
'</style>\n';

var headEnd = h.indexOf("</head>");
if (headEnd === -1) { console.error("❌ </head>"); process.exit(1); }
h = h.slice(0, headEnd) + css + h.slice(headEnd);

// ═══ 3. JS بسيط: فقط يضيف class على body ═══
var js = '\n<script id="v315-guest-class">\n' +
'(function(){\n' +
'  function apply(){\n' +
'    var isGuest = (typeof window.__isGuest === "function") ? window.__isGuest() : false;\n' +
'    if (isGuest) {\n' +
'      if (!document.body.classList.contains("chz-is-guest")) {\n' +
'        document.body.classList.add("chz-is-guest");\n' +
'        console.log("[v315] guest mode active");\n' +
'      }\n' +
'      var profile = document.querySelector(".chz-profile-group");\n' +
'      if (profile && profile.getAttribute("data-v315-click") !== "1") {\n' +
'        profile.setAttribute("data-v315-click", "1");\n' +
'        profile.onclick = function(e){ e.stopPropagation(); e.preventDefault(); window.location.href = "index.html"; };\n' +
'      }\n' +
'    } else {\n' +
'      document.body.classList.remove("chz-is-guest");\n' +
'    }\n' +
'  }\n' +
'  if (typeof window.__isGuest !== "function") {\n' +
'    var waitTimer = setInterval(function(){\n' +
'      if (typeof window.__isGuest === "function") { clearInterval(waitTimer); apply(); }\n' +
'    }, 200);\n' +
'  } else { apply(); }\n' +
'  if (window.FB && window.FB.auth) {\n' +
'    window.FB.auth.onAuthStateChanged(function(){ setTimeout(apply, 100); });\n' +
'  }\n' +
'  setTimeout(apply, 1500);\n' +
'  setTimeout(apply, 3500);\n' +
'})();\n' +
'</script>\n';

var bodyEnd = h.lastIndexOf("</body>");
if (bodyEnd === -1) { console.error("❌ </body>"); process.exit(1); }
h = h.slice(0, bodyEnd) + js + h.slice(bodyEnd);

fs.writeFileSync(target, h);
console.log("✅ v315: surgical fix");
console.log("  قبل:  " + before + " bytes");
console.log("  بعد:  " + h.length + " bytes");
console.log("  فرق:  " + (h.length - before) + " bytes");
