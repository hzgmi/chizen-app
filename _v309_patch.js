const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

// فحص: مطبق مسبقاً؟
if (h.indexOf("v309-minimal-splash") !== -1) {
  console.log("⚠️ v309 مطبق مسبقاً");
  process.exit(0);
}

// إيجاد بداية splash الحالي
var startMarker = '<div id="chz-splash-v63"';
var startIdx = h.indexOf(startMarker);
if (startIdx === -1) {
  console.error("❌ splash start not found");
  process.exit(1);
}

// إيجاد نهاية splash (نمط "chz-sp-tagline ... </div> </div>" أو وجود "<style>\n@keyframes chzLogoFloat")
// نبحث عن أول ظهور لـ "chzLogoFloat" - وهذا آخر ما يلي splash
var afterSplashMarker = "chzLogoFloat";
var afterSplashIdx = h.indexOf(afterSplashMarker, startIdx);
if (afterSplashIdx === -1) {
  console.error("❌ after-splash marker not found");
  process.exit(1);
}

// نرجع للخلف لنشمل "style" block بأكمله
var styleOrphanStart = h.lastIndexOf("<style>", afterSplashIdx);
if (styleOrphanStart === -1 || styleOrphanStart < startIdx) {
  console.error("❌ orphan style not found");
  process.exit(1);
}

// نبحث عن نهاية هذا style block (أول </style> بعد styleOrphanStart)
var styleOrphanEnd = h.indexOf("</style>", styleOrphanStart);
if (styleOrphanEnd === -1) {
  console.error("❌ orphan style end not found");
  process.exit(1);
}

var replaceEnd = styleOrphanEnd + "</style>".length;

// Splash الجديد
var newSplash = [
  '<div id="chz-splash-v63" style="position:fixed;inset:0;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;font-family:Tajawal,sans-serif;overflow:hidden;">',
  '  <style>',
  '    /* v309-minimal-splash */',
  '    #chz-splash-v63 { background: #faf7ff; }',
  '    html[data-theme="dark"] #chz-splash-v63, html.chz-dark #chz-splash-v63 { background: #0a0825; }',
  '',
  '    #chz-splash-v63 .chz-sp-logo-wrap {',
  '      width: 110px; height: 110px;',
  '      display: flex; align-items: center; justify-content: center;',
  '      animation: chzSpBreath 2s ease-in-out infinite;',
  '    }',
  '    #chz-splash-v63 .chz-sp-logo {',
  '      width: 100%; height: 100%; object-fit: contain;',
  '      filter: drop-shadow(0 4px 20px rgba(124, 58, 237, 0.22));',
  '    }',
  '    html[data-theme="dark"] #chz-splash-v63 .chz-sp-logo, html.chz-dark #chz-splash-v63 .chz-sp-logo {',
  '      filter: drop-shadow(0 4px 20px rgba(168, 85, 247, 0.35));',
  '    }',
  '    #chz-splash-v63 .chz-sp-fallback {',
  '      display: none; font-family: "Bodoni Moda", serif;',
  '      font-size: 80px; font-weight: 900;',
  '      background: linear-gradient(135deg, #ec4899, #7c3aed);',
  '      -webkit-background-clip: text; background-clip: text;',
  '      -webkit-text-fill-color: transparent;',
  '    }',
  '    #chz-splash-v63 .chz-sp-spinner {',
  '      width: 28px; height: 28px;',
  '      border: 2.5px solid rgba(124, 58, 237, 0.2);',
  '      border-top-color: #7c3aed;',
  '      border-radius: 50%;',
  '      animation: chzSpSpin 0.8s linear infinite;',
  '    }',
  '    html[data-theme="dark"] #chz-splash-v63 .chz-sp-spinner, html.chz-dark #chz-splash-v63 .chz-sp-spinner {',
  '      border-color: rgba(168, 85, 247, 0.2);',
  '      border-top-color: #a78bfa;',
  '    }',
  '    @keyframes chzSpBreath {',
  '      0%, 100% { transform: scale(1); opacity: 1; }',
  '      50% { transform: scale(1.05); opacity: 0.9; }',
  '    }',
  '    @keyframes chzSpSpin {',
  '      to { transform: rotate(360deg); }',
  '    }',
  '  </style>',
  '',
  '  <div class="chz-sp-logo-wrap">',
  '    <img src="https://i.ibb.co/FkvCmDwy/logo.png" alt="CHIZEN" class="chz-sp-logo"',
  '      onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\';">',
  '    <div class="chz-sp-fallback">C</div>',
  '  </div>',
  '',
  '  <div class="chz-sp-spinner"></div>',
  '</div>'
].join("\n");

// استبدال
var newH = h.slice(0, startIdx) + newSplash + h.slice(replaceEnd);

// تحقق من الحجم المنطقي
var diff = before - newH.length;
if (diff < 500) {
  console.error("❌ الحجم غير منطقي - فرق فقط " + diff + " bytes. توقفنا.");
  process.exit(1);
}

// كتابة
fs.writeFileSync(target, newH);

console.log("✅ v309: splash minimal");
console.log("  قبل:  " + before + " bytes");
console.log("  بعد:  " + newH.length + " bytes");
console.log("  فرق:  -" + diff + " bytes");
