const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

// 1. حذف v317 القديم
h = h.replace(/<style id="v317-guest-css">[\s\S]*?<\/style>/g, "");
h = h.replace(/<script id="v317-guest-js">[\s\S]*?<\/script>/g, "");

// 2. CSS جديد (مصغّر + avatar hidden)
var css = '\n<style id="v318-guest-css">\n' +
'  body.chz-is-guest .chz-profile-group {\n' +
'    background: #1a1a2e !important;\n' +
'    border: none !important;\n' +
'    border-radius: 10px !important;\n' +
'    padding: 8px 14px !important;\n' +
'    min-width: 100px !important;\n' +
'    max-width: 130px !important;\n' +
'    box-shadow: 0 3px 10px rgba(0,0,0,0.18) !important;\n' +
'    cursor: pointer !important;\n' +
'    display: flex !important;\n' +
'    align-items: center !important;\n' +
'    justify-content: center !important;\n' +
'    flex-direction: row !important;\n' +
'    gap: 0 !important;\n' +
'  }\n' +
'  body.chz-is-guest .chz-profile-group:active { transform: scale(0.96) !important; }\n' +
'  body.chz-is-guest .chz-profile-group .chz-prof-avatar { display: none !important; width: 0 !important; height: 0 !important; overflow: hidden !important; }\n' +
'  body.chz-is-guest .chz-profile-group .chz-prof-txt {\n' +
'    display: flex !important;\n' +
'    align-items: center !important;\n' +
'    justify-content: center !important;\n' +
'    width: 100% !important;\n' +
'    text-align: center !important;\n' +
'    flex-direction: column !important;\n' +
'    gap: 0 !important;\n' +
'  }\n' +
'  body.chz-is-guest .chz-profile-group .v318-login-text {\n' +
'    color: #ffffff !important;\n' +
'    font-family: Tajawal, sans-serif !important;\n' +
'    font-size: 13px !important;\n' +
'    font-weight: 800 !important;\n' +
'    line-height: 1.2 !important;\n' +
'    text-align: center !important;\n' +
'    display: block !important;\n' +
'  }\n' +
'  html[data-theme="dark"] body.chz-is-guest .chz-profile-group {\n' +
'    background: #ffffff !important;\n' +
'    box-shadow: 0 3px 10px rgba(255,255,255,0.2) !important;\n' +
'  }\n' +
'  html[data-theme="dark"] body.chz-is-guest .chz-profile-group .v318-login-text {\n' +
'    color: #1a1a2e !important;\n' +
'  }\n' +
'</style>\n';

var headEnd = h.indexOf("</head>");
h = h.slice(0, headEnd) + css + h.slice(headEnd);

// 3. JS جديد - يحفظ الأصل + يستعيد عند التسجيل
var js = '\n<script id="v318-guest-js">\n' +
'(function(){\n' +
'  var originalHTML = null;\n' +
'  \n' +
'  function getProfileTxt(){\n' +
'    return document.querySelector(".chz-profile-group .chz-prof-txt");\n' +
'  }\n' +
'  \n' +
'  function apply(){\n' +
'    if (typeof window.__isGuest !== "function") return;\n' +
'    var isGuest = window.__isGuest();\n' +
'    var body = document.body;\n' +
'    var txt = getProfileTxt();\n' +
'    if (!txt) return;\n' +
'    \n' +
'    if (isGuest) {\n' +
'      // === GUEST MODE ===\n' +
'      if (!body.classList.contains("chz-is-guest")) {\n' +
'        body.classList.add("chz-is-guest");\n' +
'      }\n' +
'      // حفظ الأصل قبل الاستبدال\n' +
'      if (originalHTML === null && !txt.querySelector(".v318-login-text")) {\n' +
'        originalHTML = txt.innerHTML;\n' +
'        console.log("[v318] original captured");\n' +
'      }\n' +
'      // استبدال\n' +
'      if (!txt.querySelector(".v318-login-text")) {\n' +
'        txt.innerHTML = \x27<div class="v318-login-text">تسجيل الآن</div>\x27;\n' +
'      }\n' +
'      // ربط النقر\n' +
'      var profile = document.querySelector(".chz-profile-group");\n' +
'      if (profile && profile.getAttribute("data-v318-click") !== "1") {\n' +
'        profile.setAttribute("data-v318-click", "1");\n' +
'        profile.onclick = function(e){\n' +
'          e.preventDefault(); e.stopPropagation();\n' +
'          window.location.href = "index.html";\n' +
'        };\n' +
'      }\n' +
'    } else {\n' +
'      // === LOGGED IN ===\n' +
'      if (body.classList.contains("chz-is-guest")) {\n' +
'        body.classList.remove("chz-is-guest");\n' +
'        console.log("[v318] guest class removed");\n' +
'      }\n' +
'      // استعادة المحتوى الأصلي\n' +
'      if (txt.querySelector(".v318-login-text") && originalHTML !== null) {\n' +
'        txt.innerHTML = originalHTML;\n' +
'        console.log("[v318] original restored");\n' +
'      }\n' +
'      // إعادة onclick الأصلي\n' +
'      var profile2 = document.querySelector(".chz-profile-group");\n' +
'      if (profile2 && profile2.getAttribute("data-v318-click") === "1") {\n' +
'        profile2.removeAttribute("data-v318-click");\n' +
'        profile2.setAttribute("onclick", "APP.goTab(\x27profile\x27)");\n' +
'      }\n' +
'    }\n' +
'  }\n' +
'  \n' +
'  // مراقبة DOM\n' +
'  var observer = new MutationObserver(function(){ apply(); });\n' +
'  function startObserver(){\n' +
'    var profile = document.querySelector(".chz-profile-group");\n' +
'    if (profile) {\n' +
'      observer.observe(profile, {childList: true, subtree: true, characterData: true});\n' +
'    } else { setTimeout(startObserver, 500); }\n' +
'  }\n' +
'  \n' +
'  setTimeout(apply, 500);\n' +
'  setTimeout(apply, 1500);\n' +
'  setTimeout(apply, 3000);\n' +
'  setTimeout(startObserver, 2000);\n' +
'  \n' +
'  if (window.FB && window.FB.auth) {\n' +
'    window.FB.auth.onAuthStateChanged(function(){ setTimeout(apply, 300); });\n' +
'  }\n' +
'})();\n' +
'</script>\n';

var bodyEnd = h.lastIndexOf("</body>");
h = h.slice(0, bodyEnd) + js + h.slice(bodyEnd);

fs.writeFileSync(target, h);
console.log("✅ v318: guest fix + smaller box");
console.log("  قبل:  " + before + " bytes");
console.log("  بعد:  " + h.length + " bytes");
console.log("  فرق:  " + (h.length - before) + " bytes");
