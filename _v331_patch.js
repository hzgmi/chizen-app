const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

if (h.indexOf("v331-fix") !== -1) {
  console.log("⚠️ v331 مطبق مسبقاً");
  process.exit(0);
}

// ═══ 1. حذف safety net v327 (سبب مشكلة زر الداكن) ═══
var v327Start = h.indexOf('<script id="v327-safety">');
if (v327Start !== -1) {
  var v327End = h.indexOf('</script>', v327Start) + '</script>'.length;
  h = h.slice(0, v327Start) + '<!-- v327 safety net DISABLED v331 -->' + h.slice(v327End);
  console.log("✅ v327 safety net disabled");
}

// ═══ 2. CSS: CHIZEN span + unify toggle ═══
var css = '\n<style id="v331-fix">\n' +
'  /* CHIZEN span in skeleton (بدل ::before) */\n' +
'  .v329-chizen-text {\n' +
'    position: absolute;\n' +
'    top: 50%;\n' +
'    left: 50%;\n' +
'    transform: translate(-50%, -50%);\n' +
'    font-family: "Bodoni Moda", "Tajawal", Georgia, serif;\n' +
'    font-weight: 900;\n' +
'    font-size: 22px;\n' +
'    letter-spacing: 0.12em;\n' +
'    background: linear-gradient(135deg,\n' +
'      #b8b8c8 0%, #ffffff 25%, #e0e0ee 42%,\n' +
'      #ffffff 55%, #9a9aae 75%, #ffffff 100%);\n' +
'    background-size: 250% 250%;\n' +
'    -webkit-background-clip: text;\n' +
'    background-clip: text;\n' +
'    -webkit-text-fill-color: transparent;\n' +
'    color: transparent;\n' +
'    animation: v329SilverShine 3s ease-in-out infinite;\n' +
'    opacity: 0.75;\n' +
'    z-index: 3;\n' +
'    pointer-events: none;\n' +
'  }\n' +
'  html[data-theme="dark"] .v329-chizen-text {\n' +
'    background: linear-gradient(135deg,\n' +
'      #6a6a80 0%, #d0d0e0 25%, #9090a8 42%,\n' +
'      #e0e0f0 55%, #7a7a92 75%, #c0c0d0 100%);\n' +
'    background-size: 250% 250%;\n' +
'    -webkit-background-clip: text;\n' +
'    background-clip: text;\n' +
'    -webkit-text-fill-color: transparent;\n' +
'  }\n' +
'  /* إخفاء CHIZEN من ::before القديم */\n' +
'  .v328-skeleton-img::before { content: none !important; }\n' +
'  \n' +
'  /* تأكد shimmer تحت CHIZEN */\n' +
'  .v328-skeleton-img::after {\n' +
'    z-index: 1 !important;\n' +
'  }\n' +
'  \n' +
'  /* Dark theme animations */\n' +
'  @keyframes v329SilverShine {\n' +
'    0%, 100% { background-position: 0% 50%; }\n' +
'    50% { background-position: 100% 50%; }\n' +
'  }\n' +
'</style>\n';

var headEnd = h.indexOf("</head>");
if (headEnd === -1) { console.error("❌ </head>"); process.exit(1); }
h = h.slice(0, headEnd) + css + h.slice(headEnd);
console.log("✅ CHIZEN span CSS + z-index fix");

// ═══ 3. JS: تحديث دالة skeleton + unify toggle ═══
var js = '\n<script id="v331-js">\n' +
'(function(){\n' +
'  // ═══ Fix 1: CHIZEN في skeleton ═══\n' +
'  if (typeof window.__v328SkeletonHTML === "function") {\n' +
'    var orig = window.__v328SkeletonHTML;\n' +
'    window.__v328SkeletonHTML = function(count){\n' +
'      var html = "";\n' +
'      for(var i=0; i<count; i++){\n' +
'        html += \x27<div class="v328-skeleton-card">\x27 +\n' +
'          \x27<div class="v328-skeleton-img"><span class="v329-chizen-text">CHIZEN</span></div>\x27 +\n' +
'          \x27<div class="v328-skeleton-text"></div>\x27 +\n' +
'          \x27<div class="v328-skeleton-text short"></div>\x27 +\n' +
'        \x27</div>\x27;\n' +
'      }\n' +
'      return html;\n' +
'    };\n' +
'  }\n' +
'  \n' +
'  // ═══ Fix 2: توحيد toggle (header + settings) ═══\n' +
'  function unifiedToggle(){\n' +
'    var current = document.documentElement.getAttribute("data-theme");\n' +
'    var next = (current === "dark") ? "light" : "dark";\n' +
'    document.documentElement.setAttribute("data-theme", next);\n' +
'    document.documentElement.classList.toggle("chz-dark", next === "dark");\n' +
'    document.documentElement.classList.toggle("chz-light", next === "light");\n' +
'    try { localStorage.setItem("chizen_theme_mode", next); } catch(e){}\n' +
'    window.__userClickedTheme = true;\n' +
'    console.log("[v331] theme toggled →", next);\n' +
'  }\n' +
'  window.toggleThemeMode = unifiedToggle;\n' +
'  if (window.APP) {\n' +
'    window.APP.toggleThemeMode = unifiedToggle;\n' +
'  } else {\n' +
'    var waitAPP = setInterval(function(){\n' +
'      if (window.APP) {\n' +
'        window.APP.toggleThemeMode = unifiedToggle;\n' +
'        clearInterval(waitAPP);\n' +
'        console.log("[v331] APP.toggleThemeMode unified");\n' +
'      }\n' +
'    }, 200);\n' +
'  }\n' +
'  console.log("[v331] fixes applied");\n' +
'})();\n' +
'</script>\n';

var bodyEnd = h.lastIndexOf("</body>");
if (bodyEnd === -1) { console.error("❌ </body>"); process.exit(1); }
h = h.slice(0, bodyEnd) + js + h.slice(bodyEnd);
console.log("✅ unify toggle + skeleton CHIZEN span");

fs.writeFileSync(target, h);
console.log("━━━━━━━━━━━━━━━━━━");
console.log("قبل:  " + before + " bytes");
console.log("بعد:  " + h.length + " bytes");
console.log("فرق:  " + (h.length - before) + " bytes");
