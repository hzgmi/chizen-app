const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

// 1. Splash: v310-splash-logo → CHIZEN text
var oldSplash = /<div id="v310-splash-logo"[^>]*><\/div>/;
if (h.match(oldSplash)) {
  h = h.replace(oldSplash, '<div class="v311-splash-text">CHIZEN</div>');
  console.log("✅ splash: v310 logo → CHIZEN text");
} else {
  console.warn("⚠️ v310-splash-logo not found");
}

// 2. Header: v310b-header-logo → old logo img
var oldHeader = /<div id="v310b-header-logo"[^>]*><\/div>/;
var newHeader = '<img src="https://i.ibb.co/FkvCmDwy/logo.png" alt="C" onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'<span style=color:#fff;font-size:16px;font-weight:900;>C</span>\';">';
if (h.match(oldHeader)) {
  h = h.replace(oldHeader, newHeader);
  console.log("✅ header: v310b logo → old logo");
} else {
  console.warn("⚠️ v310b-header-logo not found");
}

// 3. CSS لـ CHIZEN text
var css = '\n<style id="v311-splash-css">\n' +
'  #chz-splash-v63 .chz-sp-logo-wrap {\n' +
'    width: auto !important;\n' +
'    height: auto !important;\n' +
'    max-width: none !important;\n' +
'  }\n' +
'  .v311-splash-text {\n' +
'    font-family: "Bodoni Moda", "Tajawal", serif;\n' +
'    font-weight: 900;\n' +
'    font-size: 52px;\n' +
'    letter-spacing: 0.02em;\n' +
'    background: linear-gradient(95deg, #ff9a4e 0%, #ff356f 18%, #ff20c6 39%, #a72bff 59%, #4269ff 78%, #00cfff 100%);\n' +
'    background-size: 200% auto;\n' +
'    -webkit-background-clip: text;\n' +
'    background-clip: text;\n' +
'    -webkit-text-fill-color: transparent;\n' +
'    animation: v311SplashShine 3s linear infinite;\n' +
'    filter: drop-shadow(0 4px 20px rgba(168,85,247,0.35));\n' +
'  }\n' +
'  @keyframes v311SplashShine {\n' +
'    0% { background-position: 0% center; }\n' +
'    100% { background-position: 200% center; }\n' +
'  }\n' +
'  html[data-theme="light"] .v311-splash-text {\n' +
'    filter: drop-shadow(0 4px 20px rgba(168,85,247,0.25));\n' +
'  }\n' +
'</style>\n';

var headEnd = h.indexOf("</head>");
if (headEnd === -1) { console.error("❌ </head> not found"); process.exit(1); }
h = h.slice(0, headEnd) + css + h.slice(headEnd);

// Write
fs.writeFileSync(target, h);
console.log("━━━━━━━━━━━━━━━━━━");
console.log("قبل:  " + before + " bytes");
console.log("بعد:  " + h.length + " bytes");
console.log("فرق:  " + (h.length - before) + " bytes");
