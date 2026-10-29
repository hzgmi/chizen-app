const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

if (h.indexOf("v336-cart-css") !== -1) {
  console.log("⚠️ v336 مطبق مسبقاً");
  process.exit(0);
}

// ═══ 1. CSS ═══
var css = '\n<style id="v336-cart-css">\n' +
'  /* Cart items - Shein style */\n' +
'  #sc-cart .ci {\n' +
'    display: flex !important;\n' +
'    gap: 12px !important;\n' +
'    padding: 14px !important;\n' +
'    background: #ffffff !important;\n' +
'    border-radius: 16px !important;\n' +
'    margin-bottom: 10px !important;\n' +
'    box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;\n' +
'    align-items: flex-start !important;\n' +
'  }\n' +
'  html[data-theme="dark"] #sc-cart .ci { background: #1a1535 !important; }\n' +
'  \n' +
'  #sc-cart .ci-i {\n' +
'    position: relative !important;\n' +
'    width: 80px !important;\n' +
'    height: 80px !important;\n' +
'    border-radius: 12px !important;\n' +
'    overflow: hidden !important;\n' +
'    flex-shrink: 0 !important;\n' +
'    background: #f4f6fa !important;\n' +
'  }\n' +
'  #sc-cart .ci-i img {\n' +
'    width: 100% !important;\n' +
'    height: 100% !important;\n' +
'    object-fit: cover !important;\n' +
'    border-radius: 12px !important;\n' +
'  }\n' +
'  \n' +
'  #sc-cart .cr {\n' +
'    position: absolute !important;\n' +
'    top: 4px !important;\n' +
'    right: 4px !important;\n' +
'    width: 22px !important;\n' +
'    height: 22px !important;\n' +
'    background: rgba(0,0,0,0.65) !important;\n' +
'    border-radius: 50% !important;\n' +
'    display: flex !important;\n' +
'    align-items: center !important;\n' +
'    justify-content: center !important;\n' +
'    cursor: pointer !important;\n' +
'  }\n' +
'  #sc-cart .cr svg {\n' +
'    width: 12px !important;\n' +
'    height: 12px !important;\n' +
'    stroke: #ffffff !important;\n' +
'    stroke-width: 2.5 !important;\n' +
'    fill: none !important;\n' +
'  }\n' +
'  \n' +
'  #sc-cart .ci-inf {\n' +
'    flex: 1 !important;\n' +
'    min-width: 0 !important;\n' +
'    display: flex !important;\n' +
'    flex-direction: column !important;\n' +
'    gap: 6px !important;\n' +
'  }\n' +
'  #sc-cart .ci-n {\n' +
'    font-size: 13px !important;\n' +
'    font-weight: 700 !important;\n' +
'    color: #1a1a2e !important;\n' +
'    line-height: 1.3 !important;\n' +
'    margin: 0 !important;\n' +
'    display: -webkit-box !important;\n' +
'    -webkit-line-clamp: 2 !important;\n' +
'    -webkit-box-orient: vertical !important;\n' +
'    overflow: hidden !important;\n' +
'  }\n' +
'  html[data-theme="dark"] #sc-cart .ci-n { color: #ffffff !important; }\n' +
'  \n' +
'  #sc-cart .ci-p {\n' +
'    font-size: 15px !important;\n' +
'    font-weight: 900 !important;\n' +
'    color: #ec4899 !important;\n' +
'    margin: 0 !important;\n' +
'  }\n' +
'  \n' +
'  #sc-cart .qty {\n' +
'    display: inline-flex !important;\n' +
'    align-items: center !important;\n' +
'    gap: 8px !important;\n' +
'    background: #f4f6fa !important;\n' +
'    border-radius: 20px !important;\n' +
'    padding: 4px 6px !important;\n' +
'    width: fit-content !important;\n' +
'  }\n' +
'  html[data-theme="dark"] #sc-cart .qty { background: #2a2350 !important; }\n' +
'  #sc-cart .qb {\n' +
'    width: 26px !important;\n' +
'    height: 26px !important;\n' +
'    border-radius: 50% !important;\n' +
'    background: #ffffff !important;\n' +
'    border: 1px solid #e5e7eb !important;\n' +
'    color: #7c3aed !important;\n' +
'    font-weight: 900 !important;\n' +
'    font-size: 14px !important;\n' +
'    cursor: pointer !important;\n' +
'    display: flex !important;\n' +
'    align-items: center !important;\n' +
'    justify-content: center !important;\n' +
'    padding: 0 !important;\n' +
'    line-height: 1 !important;\n' +
'  }\n' +
'  html[data-theme="dark"] #sc-cart .qb { background: #1e1533 !important; border-color: #4c3b7a !important; color: #a78bfa !important; }\n' +
'  #sc-cart .qn {\n' +
'    font-size: 13px !important;\n' +
'    font-weight: 800 !important;\n' +
'    color: #1a1a2e !important;\n' +
'    min-width: 20px !important;\n' +
'    text-align: center !important;\n' +
'  }\n' +
'  html[data-theme="dark"] #sc-cart .qn { color: #ffffff !important; }\n' +
'  \n' +
'  /* Total box - lighter look */\n' +
'  #sc-cart .tb {\n' +
'    background: #ffffff !important;\n' +
'    border-radius: 16px !important;\n' +
'    padding: 16px !important;\n' +
'    margin-top: 8px !important;\n' +
'    box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;\n' +
'  }\n' +
'  html[data-theme="dark"] #sc-cart .tb { background: #1a1535 !important; }\n' +
'  #sc-cart .tr { display: flex !important; justify-content: space-between !important; padding: 6px 0 !important; font-size: 13px !important; }\n' +
'  #sc-cart .tf { display: flex !important; justify-content: space-between !important; padding: 12px 0 0 !important; font-size: 17px !important; font-weight: 900 !important; border-top: 1px solid #e5e7eb !important; margin-top: 8px !important; color: #1a1a2e !important; }\n' +
'  html[data-theme="dark"] #sc-cart .tf { color: #ffffff !important; border-color: #4c3b7a !important; }\n' +
'  \n' +
'  /* Suggested products section */\n' +
'  .v336-suggested {\n' +
'    margin-top: 20px !important;\n' +
'    padding-top: 16px !important;\n' +
'    border-top: 1px solid #e5e7eb !important;\n' +
'  }\n' +
'  html[data-theme="dark"] .v336-suggested { border-color: #4c3b7a !important; }\n' +
'  .v336-suggested-title {\n' +
'    font-size: 15px !important;\n' +
'    font-weight: 900 !important;\n' +
'    color: #1a1a2e !important;\n' +
'    margin-bottom: 12px !important;\n' +
'    display: flex !important;\n' +
'    align-items: center !important;\n' +
'    gap: 6px !important;\n' +
'  }\n' +
'  html[data-theme="dark"] .v336-suggested-title { color: #ffffff !important; }\n' +
'  .v336-suggested-scroll {\n' +
'    display: flex !important;\n' +
'    gap: 10px !important;\n' +
'    overflow-x: auto !important;\n' +
'    padding-bottom: 6px !important;\n' +
'    scrollbar-width: none !important;\n' +
'  }\n' +
'  .v336-suggested-scroll::-webkit-scrollbar { display: none !important; }\n' +
'  .v336-suggested-card {\n' +
'    flex-shrink: 0 !important;\n' +
'    width: 130px !important;\n' +
'    background: #ffffff !important;\n' +
'    border-radius: 12px !important;\n' +
'    overflow: hidden !important;\n' +
'    cursor: pointer !important;\n' +
'    box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;\n' +
'  }\n' +
'  html[data-theme="dark"] .v336-suggested-card { background: #1a1535 !important; }\n' +
'  .v336-suggested-card:active { transform: scale(0.97) !important; }\n' +
'  .v336-suggested-img {\n' +
'    width: 100% !important;\n' +
'    aspect-ratio: 1 !important;\n' +
'    object-fit: cover !important;\n' +
'    background: #f4f6fa !important;\n' +
'  }\n' +
'  .v336-suggested-info {\n' +
'    padding: 8px 10px !important;\n' +
'  }\n' +
'  .v336-suggested-name {\n' +
'    font-size: 11px !important;\n' +
'    font-weight: 700 !important;\n' +
'    color: #1a1a2e !important;\n' +
'    line-height: 1.3 !important;\n' +
'    margin-bottom: 4px !important;\n' +
'    display: -webkit-box !important;\n' +
'    -webkit-line-clamp: 2 !important;\n' +
'    -webkit-box-orient: vertical !important;\n' +
'    overflow: hidden !important;\n' +
'    min-height: 28px !important;\n' +
'  }\n' +
'  html[data-theme="dark"] .v336-suggested-name { color: #ffffff !important; }\n' +
'  .v336-suggested-price {\n' +
'    font-size: 13px !important;\n' +
'    font-weight: 900 !important;\n' +
'    color: #ec4899 !important;\n' +
'  }\n' +
'</style>\n';

var headEnd = h.indexOf("</head>");
if (headEnd === -1) { console.error("❌ </head>"); process.exit(1); }
h = h.slice(0, headEnd) + css + h.slice(headEnd);
console.log("✅ 1: CSS added");

// ═══ 2. تعديل renderCart — سطر واحد فقط ═══
var oldLine = "    c.innerHTML=html;\n  },";
var newLine = "    c.innerHTML=html + (window.__v336RenderSuggested ? window.__v336RenderSuggested() : '');\n  },";

if (h.indexOf(oldLine) === -1) {
  console.error("❌ renderCart line not found");
  process.exit(1);
}
h = h.replace(oldLine, newLine);
console.log("✅ 2: renderCart + suggested hook");

// ═══ 3. دالة مقترحات المنتجات ═══
var js = '\n<script id="v336-cart-js">\n' +
'(function(){\n' +
'  window.__v336RenderSuggested = function(){\n' +
'    if (!window.APP || !window.APP.products || window.APP.products.length < 2) return "";\n' +
'    var cartIds = {};\n' +
'    if (window.APP.cart) window.APP.cart.forEach(function(c){ cartIds[c.id] = true; });\n' +
'    \n' +
'    var byCategory = {};\n' +
'    window.APP.products.forEach(function(p){\n' +
'      if (!p.active || cartIds[p.id]) return;\n' +
'      if (!byCategory[p.category]) byCategory[p.category] = [];\n' +
'      byCategory[p.category].push(p);\n' +
'    });\n' +
'    \n' +
'    var cats = Object.keys(byCategory);\n' +
'    if (cats.length === 0) return "";\n' +
'    \n' +
'    // shuffle cats + pick 1 random from each, max 8\n' +
'    for (var i = cats.length - 1; i > 0; i--) {\n' +
'      var j = Math.floor(Math.random() * (i + 1));\n' +
'      var tmp = cats[i]; cats[i] = cats[j]; cats[j] = tmp;\n' +
'    }\n' +
'    \n' +
'    var picked = [];\n' +
'    for (var k = 0; k < cats.length && picked.length < 8; k++) {\n' +
'      var arr = byCategory[cats[k]];\n' +
'      var pick = arr[Math.floor(Math.random() * arr.length)];\n' +
'      picked.push(pick);\n' +
'    }\n' +
'    \n' +
'    if (picked.length === 0) return "";\n' +
'    \n' +
'    var esc = function(s){ return String(s||"").replace(/[&<>"\'"]/g, function(c){ return {\'&\':\'&amp;\',\'<\':\'&lt;\',\'>\':\'&gt;\',\'"\':\'&quot;\',"\'":\'&#39;\'}[c]; }); };\n' +
'    \n' +
'    var html = \x27<div class="v336-suggested">\x27 +\n' +
'      \x27<div class="v336-suggested-title">💡 منتجات قد تعجبك</div>\x27 +\n' +
'      \x27<div class="v336-suggested-scroll">\x27;\n' +
'    \n' +
'    picked.forEach(function(p){\n' +
'      html += \x27<div class="v336-suggested-card" onclick="APP.openProduct && APP.openProduct(\\\x27\x27 + esc(p.id) + \x27\\\x27)">\x27 +\n' +
'        \x27<img class="v336-suggested-img" src="\x27 + esc(p.img) + \x27" onerror="this.style.opacity=0.3">\x27 +\n' +
'        \x27<div class="v336-suggested-info">\x27 +\n' +
'          \x27<div class="v336-suggested-name">\x27 + esc(p.name) + \x27</div>\x27 +\n' +
'          \x27<div class="v336-suggested-price">\x27 + (Number(p.price)||0).toFixed(0) + \x27 ر.س</div>\x27 +\n' +
'        \x27</div>\x27 +\n' +
'      \x27</div>\x27;\n' +
'    });\n' +
'    \n' +
'    html += \x27</div></div>\x27;\n' +
'    return html;\n' +
'  };\n' +
'  console.log("[v336] suggested products ready");\n' +
'})();\n' +
'</script>\n';

var bodyEnd = h.lastIndexOf("</body>");
if (bodyEnd === -1) { console.error("❌ </body>"); process.exit(1); }
h = h.slice(0, bodyEnd) + js + h.slice(bodyEnd);
console.log("✅ 3: suggested products JS added");

fs.writeFileSync(target, h);
console.log("━━━━━━━━━━━━━━━━━━");
console.log("قبل:  " + before + " bytes");
console.log("بعد:  " + h.length + " bytes");
console.log("فرق:  +" + (h.length - before) + " bytes");
