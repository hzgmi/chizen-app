const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

// فحص: هل v325 مطبق؟ (نستبدله)
if (h.indexOf("v325-skeleton") === -1) {
  console.log("⚠️ v325 غير موجود — v326 سيضيف loader جديد مستقل");
}

// حذف v325 إذا موجود
h = h.replace(/<style id="v325-skeleton-css">[\s\S]*?<\/style>/g, "");
h = h.replace(/<script id="v325-skeleton-js">[\s\S]*?<\/script>/g, "");
h = h.replace(/<div id="v325-loader">[\s\S]*?<\/div>\s*<\/div>/g, "");

// فحص: هل v326 مطبق مسبقاً؟
if (h.indexOf("v326-silver") !== -1) {
  console.log("⚠️ v326 مطبق مسبقاً");
  process.exit(0);
}

// ═══ 1. CSS + HTML في <head> ═══
var block = '\n<style id="v326-silver-css">\n' +
'  #v326-loader {\n' +
'    position: fixed; inset: 0; z-index: 2147483647;\n' +
'    background: #faf7ff;\n' +
'    display: flex;\n' +
'    align-items: center;\n' +
'    justify-content: center;\n' +
'    transition: opacity 0.4s ease;\n' +
'  }\n' +
'  html[data-theme="dark"] #v326-loader {\n' +
'    background: #0a0825;\n' +
'  }\n' +
'  .v326-text {\n' +
'    font-family: "Bodoni Moda", "Tajawal", Georgia, serif;\n' +
'    font-weight: 900;\n' +
'    font-size: 52px;\n' +
'    letter-spacing: 0.12em;\n' +
'    background: linear-gradient(135deg,\n' +
'      #b8b8c8 0%,\n' +
'      #ffffff 25%,\n' +
'      #e0e0ee 42%,\n' +
'      #ffffff 55%,\n' +
'      #9a9aae 75%,\n' +
'      #ffffff 100%);\n' +
'    background-size: 250% 250%;\n' +
'    -webkit-background-clip: text;\n' +
'    background-clip: text;\n' +
'    -webkit-text-fill-color: transparent;\n' +
'    color: transparent;\n' +
'    animation: v326shine 3s ease-in-out infinite;\n' +
'    opacity: 0.85;\n' +
'    text-align: center;\n' +
'    line-height: 1;\n' +
'    filter: drop-shadow(0 2px 8px rgba(160, 160, 180, 0.15));\n' +
'  }\n' +
'  html[data-theme="dark"] .v326-text {\n' +
'    background: linear-gradient(135deg,\n' +
'      #6a6a80 0%,\n' +
'      #d0d0e0 25%,\n' +
'      #9090a8 42%,\n' +
'      #e0e0f0 55%,\n' +
'      #7a7a92 75%,\n' +
'      #c0c0d0 100%);\n' +
'    background-size: 250% 250%;\n' +
'    -webkit-background-clip: text;\n' +
'    background-clip: text;\n' +
'    -webkit-text-fill-color: transparent;\n' +
'    filter: drop-shadow(0 2px 12px rgba(168, 85, 247, 0.15));\n' +
'  }\n' +
'  @keyframes v326shine {\n' +
'    0%, 100% { background-position: 0% 50%; }\n' +
'    50% { background-position: 100% 50%; }\n' +
'  }\n' +
'</style>\n' +
'<div id="v326-loader">\n' +
'  <div class="v326-text">CHIZEN</div>\n' +
'</div>\n';

var headEnd = h.indexOf("</head>");
if (headEnd === -1) { console.error("❌ </head>"); process.exit(1); }
h = h.slice(0, headEnd) + block + h.slice(headEnd);

// ═══ 2. JS — إخفاء عند جاهزية APP ═══
var js = '\n<script id="v326-silver-js">\n' +
'(function(){\n' +
'  function hideLoader(){\n' +
'    var loader = document.getElementById("v326-loader");\n' +
'    if (!loader) return;\n' +
'    loader.style.opacity = "0";\n' +
'    setTimeout(function(){ if(loader.parentNode) loader.remove(); }, 450);\n' +
'    console.log("[v326] loader removed");\n' +
'  }\n' +
'  \n' +
'  var tries = 0;\n' +
'  var check = setInterval(function(){\n' +
'    tries++;\n' +
'    if (window.APP && window.APP.state) {\n' +
'      clearInterval(check);\n' +
'      setTimeout(hideLoader, 250); // 250ms لضمان استقرار أولي\n' +
'    } else if (tries > 30) {\n' +
'      clearInterval(check);\n' +
'      hideLoader(); // إخفاء قسري بعد 3s\n' +
'    }\n' +
'  }, 100);\n' +
'})();\n' +
'</script>\n';

var bodyEnd = h.lastIndexOf("</body>");
if (bodyEnd === -1) { console.error("❌ </body>"); process.exit(1); }
h = h.slice(0, bodyEnd) + js + h.slice(bodyEnd);

fs.writeFileSync(target, h);
console.log("✅ v326: silver glossy CHIZEN loader");
console.log("  قبل:  " + before + " bytes");
console.log("  بعد:  " + h.length + " bytes");
console.log("  فرق:  " + (h.length - before) + " bytes");
