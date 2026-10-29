const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

// ═══ 1. إزالة profile من BT (v302) ═══
var btRegex = /profile:\s*"للوصول لحسابك",\s*/;
if (btRegex.test(h)) {
  h = h.replace(btRegex, "");
  console.log("✅ 1: removed profile from BT");
} else {
  console.log("⚠️ 1: BT profile not found");
}

// ═══ 2. CSS ═══
var css = '\n<style id="v321-guest-profile">\n' +
'  .v321-guest-banner {\n' +
'    margin: 10px 14px 14px;\n' +
'    background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);\n' +
'    border-radius: 16px;\n' +
'    padding: 18px 16px;\n' +
'    color: #fff;\n' +
'    box-shadow: 0 8px 24px rgba(124,58,237,0.28);\n' +
'  }\n' +
'  .v321-guest-banner-title {\n' +
'    font-size: 15px; font-weight: 900; margin-bottom: 10px;\n' +
'    display: flex; align-items: center; gap: 8px;\n' +
'  }\n' +
'  .v321-guest-banner-list {\n' +
'    font-size: 11.5px; line-height: 1.85; opacity: 0.95; margin-bottom: 12px;\n' +
'  }\n' +
'  .v321-guest-banner-list div {\n' +
'    display: flex; align-items: center; gap: 6px;\n' +
'  }\n' +
'  .v321-login-btn {\n' +
'    width: 100%; padding: 12px; background: #ffffff; color: #7c3aed;\n' +
'    border: none; border-radius: 10px; font-family: inherit; font-weight: 800;\n' +
'    font-size: 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15);\n' +
'  }\n' +
'  .v321-login-btn:active { transform: scale(0.97); }\n' +
'  \n' +
'  body.chz-is-guest #sc-profile .v321-hide { display: none !important; }\n' +
'  body.chz-is-guest #sc-profile .profile-hero { display: none !important; }\n' +
'  body.chz-is-guest #sc-profile .sit[onclick*="\'orders\'"] { display: none !important; }\n' +
'  body.chz-is-guest #sc-profile .sit[onclick*="\'favorites\'"] { display: none !important; }\n' +
'  body.chz-is-guest #sc-profile .sit[onclick*="\'points\'"] { display: none !important; }\n' +
'  body.chz-is-guest #sc-profile .sit[onclick*="APP.logout"] { display: none !important; }\n' +
'</style>\n';

var headEnd = h.indexOf("</head>");
if (headEnd === -1) { console.error("❌ </head>"); process.exit(1); }
h = h.slice(0, headEnd) + css + h.slice(headEnd);
console.log("✅ 2: CSS added");

// ═══ 3. JS ═══
var js = '\n<script id="v321-guest-profile-js">\n' +
'(function(){\n' +
'  function applyGuestProfile(){\n' +
'    if (typeof window.__isGuest !== "function" || !window.__isGuest()) return;\n' +
'    var sc = document.getElementById("sc-profile");\n' +
'    if (!sc) return;\n' +
'    \n' +
'    if (!sc.querySelector(".v321-guest-banner")) {\n' +
'      var banner = document.createElement("div");\n' +
'      banner.className = "v321-guest-banner";\n' +
'      banner.innerHTML = \x27<div class="v321-guest-banner-title">🎉 سجّل للحصول على:</div>\x27 +\n' +
'        \x27<div class="v321-guest-banner-list">\x27 +\n' +
'          \x27<div>🎁 خصم 20% على أول طلب</div>\x27 +\n' +
'          \x27<div>⭐ احفظ سلتك على أي جهاز</div>\x27 +\n' +
'          \x27<div>📦 تتبع طلباتك لحظة بلحظة</div>\x27 +\n' +
'          \x27<div>💰 نقاط ولاء مع كل شراء</div>\x27 +\n' +
'        \x27</div>\x27 +\n' +
'        \x27<button class="v321-login-btn">تسجيل الدخول الآن</button>\x27;\n' +
'      var btn = banner.querySelector(".v321-login-btn");\n' +
'      if (btn) btn.onclick = function(){ window.location.href = "index.html"; };\n' +
'      var header = sc.querySelector(".sh2");\n' +
'      if (header && header.nextSibling) {\n' +
'        sc.insertBefore(banner, header.nextSibling);\n' +
'      } else {\n' +
'        sc.insertBefore(banner, sc.firstChild);\n' +
'      }\n' +
'      console.log("[v321] banner added");\n' +
'    }\n' +
'    \n' +
'    var sgs = sc.querySelectorAll(".sgt");\n' +
'    sgs.forEach(function(sg){\n' +
'      if (sg.textContent.indexOf("نشاطي") !== -1) sg.classList.add("v321-hide");\n' +
'    });\n' +
'  }\n' +
'  \n' +
'  function hookGoTab(){\n' +
'    if (!window.APP || !window.APP.goTab) { setTimeout(hookGoTab, 500); return; }\n' +
'    if (window.APP.goTab.__v321) return;\n' +
'    var orig = window.APP.goTab;\n' +
'    window.APP.goTab = function(id){\n' +
'      var r = orig.apply(this, arguments);\n' +
'      if (id === "profile") setTimeout(applyGuestProfile, 250);\n' +
'      return r;\n' +
'    };\n' +
'    window.APP.goTab.__v321 = true;\n' +
'    console.log("[v321] goTab hooked");\n' +
'  }\n' +
'  \n' +
'  setTimeout(hookGoTab, 1500);\n' +
'  setTimeout(applyGuestProfile, 1000);\n' +
'  setTimeout(applyGuestProfile, 3000);\n' +
'})();\n' +
'</script>\n';

var bodyEnd = h.lastIndexOf("</body>");
if (bodyEnd === -1) { console.error("❌ </body>"); process.exit(1); }
h = h.slice(0, bodyEnd) + js + h.slice(bodyEnd);
console.log("✅ 3: JS added");

fs.writeFileSync(target, h);
console.log("━━━━━━━━━━━━━━━━━━");
console.log("قبل:  " + before + " bytes");
console.log("بعد:  " + h.length + " bytes");
console.log("فرق:  +" + (h.length - before) + " bytes");
