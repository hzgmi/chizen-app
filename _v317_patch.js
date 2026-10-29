const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

// حذف CSS v315 و v316 (فاشلة)
h = h.replace(/<style id="v315-clean-guest">[\s\S]*?<\/style>/g, "");
h = h.replace(/<style id="v316-clean-guest">[\s\S]*?<\/style>/g, "");

// CSS جديد (أساسي فقط - بدون ::after)
var css = '\n<style id="v317-guest-css">\n' +
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
'  }\n' +
'  body.chz-is-guest .chz-profile-group:active { transform: scale(0.96) !important; }\n' +
'  body.chz-is-guest .chz-profile-group .chz-prof-avatar { display: none !important; }\n' +
'  body.chz-is-guest .chz-profile-group .chz-prof-txt {\n' +
'    display: flex !important;\n' +
'    align-items: center !important;\n' +
'    justify-content: center !important;\n' +
'    width: 100% !important;\n' +
'    text-align: center !important;\n' +
'  }\n' +
'  body.chz-is-guest .chz-profile-group .v317-login-text {\n' +
'    color: #ffffff !important;\n' +
'    font-family: Tajawal, sans-serif !important;\n' +
'    font-size: 14px !important;\n' +
'    font-weight: 900 !important;\n' +
'    line-height: 1.2 !important;\n' +
'    text-align: center !important;\n' +
'    display: block !important;\n' +
'  }\n' +
'  html[data-theme="dark"] body.chz-is-guest .chz-profile-group {\n' +
'    background: #ffffff !important;\n' +
'    box-shadow: 0 4px 14px rgba(255,255,255,0.2) !important;\n' +
'  }\n' +
'  html[data-theme="dark"] body.chz-is-guest .chz-profile-group .v317-login-text {\n' +
'    color: #1a1a2e !important;\n' +
'  }\n' +
'</style>\n';

var headEnd = h.indexOf("</head>");
h = h.slice(0, headEnd) + css + h.slice(headEnd);

// JS جديد - يستبدل DOM مباشرة
var js = '\n<script id="v317-guest-js">\n' +
'(function(){\n' +
'  var REPLACED = false;\n' +
'  \n' +
'  function apply(){\n' +
'    if (typeof window.__isGuest !== "function") return;\n' +
'    if (!window.__isGuest()) return;\n' +
'    \n' +
'    if (!document.body.classList.contains("chz-is-guest")) {\n' +
'      document.body.classList.add("chz-is-guest");\n' +
'    }\n' +
'    \n' +
'    var profile = document.querySelector(".chz-profile-group");\n' +
'    if (!profile) return;\n' +
'    \n' +
'    var txt = profile.querySelector(".chz-prof-txt");\n' +
'    if (!txt) return;\n' +
'    \n' +
'    // استبدال المحتوى بالكامل (يمحو مرحباً + أهلاً بك)\n' +
'    if (!REPLACED || !txt.querySelector(".v317-login-text")) {\n' +
'      txt.innerHTML = \x27<div class="v317-login-text">تسجيل الآن</div>\x27;\n' +
'      REPLACED = true;\n' +
'      console.log("[v317] text replaced");\n' +
'    }\n' +
'    \n' +
'    // ربط النقر\n' +
'    if (profile.getAttribute("data-v317-click") !== "1") {\n' +
'      profile.setAttribute("data-v317-click", "1");\n' +
'      profile.onclick = function(e){\n' +
'        e.preventDefault();\n' +
'        e.stopPropagation();\n' +
'        window.location.href = "index.html";\n' +
'      };\n' +
'    }\n' +
'  }\n' +
'  \n' +
'  // مراقبة DOM لإعادة التطبيق إذا غيّره JS آخر\n' +
'  var observer = new MutationObserver(function(){\n' +
'    if (window.__isGuest && window.__isGuest()) {\n' +
'      var txt = document.querySelector(".chz-profile-group .chz-prof-txt");\n' +
'      if (txt && !txt.querySelector(".v317-login-text")) {\n' +
'        apply();\n' +
'      }\n' +
'    }\n' +
'  });\n' +
'  \n' +
'  function startObserver(){\n' +
'    var profile = document.querySelector(".chz-profile-group");\n' +
'    if (profile) {\n' +
'      observer.observe(profile, {childList: true, subtree: true, characterData: true});\n' +
'    } else {\n' +
'      setTimeout(startObserver, 500);\n' +
'    }\n' +
'  }\n' +
'  \n' +
'  setTimeout(apply, 500);\n' +
'  setTimeout(apply, 1500);\n' +
'  setTimeout(apply, 3000);\n' +
'  setTimeout(startObserver, 2000);\n' +
'  \n' +
'  if (window.FB && window.FB.auth) {\n' +
'    window.FB.auth.onAuthStateChanged(function(){ setTimeout(apply, 200); });\n' +
'  }\n' +
'})();\n' +
'</script>\n';

var bodyEnd = h.lastIndexOf("</body>");
h = h.slice(0, bodyEnd) + js + h.slice(bodyEnd);

fs.writeFileSync(target, h);
console.log("✅ v317: JS replaces .chz-prof-txt content");
console.log("  قبل:  " + before + " bytes");
console.log("  بعد:  " + h.length + " bytes");
console.log("  فرق:  " + (h.length - before) + " bytes");
