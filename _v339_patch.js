const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

if (h.indexOf("v339-cart-pro") !== -1) {
  console.log("⚠️ v339 مطبق مسبقاً");
  process.exit(0);
}

// ═══ CSS ═══
var css = '\n<style id="v339-cart-pro">\n' +
'  /* 1. Fix: checkout button visible above bottom nav */\n' +
'  #sc-cart {\n' +
'    padding-bottom: calc(90px + env(safe-area-inset-bottom, 0px)) !important;\n' +
'  }\n' +
'  \n' +
'  /* 2. Dismissible suggestions */\n' +
'  .v336-suggested {\n' +
'    position: relative !important;\n' +
'  }\n' +
'  .v339-dismiss {\n' +
'    position: absolute !important;\n' +
'    top: 0 !important;\n' +
'    left: 0 !important;\n' +
'    width: 26px !important;\n' +
'    height: 26px !important;\n' +
'    background: rgba(0,0,0,0.06) !important;\n' +
'    border-radius: 50% !important;\n' +
'    display: flex !important;\n' +
'    align-items: center !important;\n' +
'    justify-content: center !important;\n' +
'    cursor: pointer !important;\n' +
'    z-index: 2 !important;\n' +
'    transition: background 0.2s !important;\n' +
'  }\n' +
'  .v339-dismiss:hover { background: rgba(0,0,0,0.12) !important; }\n' +
'  html[data-theme="dark"] .v339-dismiss { background: rgba(255,255,255,0.08) !important; }\n' +
'  html[data-theme="dark"] .v339-dismiss:hover { background: rgba(255,255,255,0.15) !important; }\n' +
'  .v339-dismiss svg {\n' +
'    width: 12px !important;\n' +
'    height: 12px !important;\n' +
'    stroke: #6b7280 !important;\n' +
'    stroke-width: 2.5 !important;\n' +
'    fill: none !important;\n' +
'  }\n' +
'  html[data-theme="dark"] .v339-dismiss svg { stroke: #a78bfa !important; }\n' +
'  \n' +
'  /* 3. Cart polish */\n' +
'  #sc-cart .st {\n' +
'    height: 0 !important;\n' +
'  }\n' +
'  #sc-cart .sh2 {\n' +
'    padding: 12px 16px 8px !important;\n' +
'    display: flex !important;\n' +
'    align-items: center !important;\n' +
'    justify-content: space-between !important;\n' +
'  }\n' +
'  #sc-cart .st2 {\n' +
'    font-size: 18px !important;\n' +
'    font-weight: 900 !important;\n' +
'    color: #1a1a2e !important;\n' +
'  }\n' +
'  html[data-theme="dark"] #sc-cart .st2 { color: #ffffff !important; }\n' +
'  \n' +
'  #sc-cart #cart-items {\n' +
'    padding: 8px 16px 16px !important;\n' +
'  }\n' +
'  \n' +
'  /* Clear cart button */\n' +
'  .v339-clear {\n' +
'    background: rgba(239, 68, 68, 0.1) !important;\n' +
'    border: 1px solid rgba(239, 68, 68, 0.25) !important;\n' +
'    color: #ef4444 !important;\n' +
'    padding: 6px 12px !important;\n' +
'    border-radius: 8px !important;\n' +
'    font-size: 11px !important;\n' +
'    font-weight: 800 !important;\n' +
'    cursor: pointer !important;\n' +
'    font-family: inherit !important;\n' +
'  }\n' +
'  \n' +
'  /* Checkout button - bigger + fixed feel */\n' +
'  #sc-cart .btn-p {\n' +
'    padding: 16px 20px !important;\n' +
'    font-size: 15px !important;\n' +
'    font-weight: 900 !important;\n' +
'    border-radius: 14px !important;\n' +
'    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.3) !important;\n' +
'    background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%) !important;\n' +
'  }\n' +
'  \n' +
'  /* Total box - elevated */\n' +
'  #sc-cart .tb {\n' +
'    background: #ffffff !important;\n' +
'    border-radius: 18px !important;\n' +
'    padding: 18px !important;\n' +
'    box-shadow: 0 4px 16px rgba(0,0,0,0.06) !important;\n' +
'    border: 1px solid rgba(0,0,0,0.04) !important;\n' +
'  }\n' +
'  html[data-theme="dark"] #sc-cart .tb {\n' +
'    background: #1a1535 !important;\n' +
'    border-color: rgba(255,255,255,0.08) !important;\n' +
'    box-shadow: 0 4px 16px rgba(0,0,0,0.3) !important;\n' +
'  }\n' +
'  \n' +
'  /* Coupon input - cleaner */\n' +
'  #sc-cart .fi {\n' +
'    background: #f9f7ff !important;\n' +
'    border: 1px solid #e5e1f5 !important;\n' +
'    border-radius: 12px !important;\n' +
'    padding: 12px 14px !important;\n' +
'    font-size: 13px !important;\n' +
'    font-family: inherit !important;\n' +
'  }\n' +
'  html[data-theme="dark"] #sc-cart .fi {\n' +
'    background: #0f0d22 !important;\n' +
'    border-color: #4c3b7a !important;\n' +
'    color: #ffffff !important;\n' +
'  }\n' +
'</style>\n';

var headEnd = h.indexOf("</head>");
if (headEnd === -1) { console.error("❌ </head>"); process.exit(1); }
h = h.slice(0, headEnd) + css + h.slice(headEnd);
console.log("✅ CSS added (button padding + dismiss + polish)");

// ═══ JS — X button + sessionStorage ═══
var js = '\n<script id="v339-js">\n' +
'(function(){\n' +
'  var KEY = "v339_cart_sugg_dismissed";\n' +
'  \n' +
'  function addDismiss(){\n' +
'    var suggested = document.querySelectorAll("#sc-cart .v336-suggested");\n' +
'    suggested.forEach(function(el){\n' +
'      if (el.querySelector(".v339-dismiss")) return;\n' +
'      var btn = document.createElement("button");\n' +
'      btn.className = "v339-dismiss";\n' +
'      btn.title = "إخفاء المقترحات";\n' +
'      btn.innerHTML = \x27<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>\x27;\n' +
'      btn.onclick = function(e){\n' +
'        e.stopPropagation();\n' +
'        el.style.display = "none";\n' +
'        try { sessionStorage.setItem(KEY, "1"); } catch(err){}\n' +
'        console.log("[v339] suggestions dismissed");\n' +
'      };\n' +
'      el.appendChild(btn);\n' +
'    });\n' +
'  }\n' +
'  \n' +
'  function hideIfDismissed(){\n' +
'    var dismissed = false;\n' +
'    try { dismissed = sessionStorage.getItem(KEY) === "1"; } catch(e){}\n' +
'    if (!dismissed) return;\n' +
'    document.querySelectorAll("#sc-cart .v336-suggested").forEach(function(el){\n' +
'      el.style.display = "none";\n' +
'    });\n' +
'  }\n' +
'  \n' +
'  // مراقبة DOM لإضافة X عند ظهور suggestions\n' +
'  var timer;\n' +
'  var mo = new MutationObserver(function(){\n' +
'    clearTimeout(timer);\n' +
'    timer = setTimeout(function(){\n' +
'      addDismiss();\n' +
'      hideIfDismissed();\n' +
'    }, 300);\n' +
'  });\n' +
'  \n' +
'  setTimeout(function(){\n' +
'    var cart = document.getElementById("sc-cart");\n' +
'    if (cart) {\n' +
'      mo.observe(cart, { childList: true, subtree: true });\n' +
'      addDismiss();\n' +
'      hideIfDismissed();\n' +
'      console.log("[v339] observer on cart");\n' +
'    }\n' +
'  }, 1500);\n' +
'  \n' +
'  // فحص دوري احتياطي\n' +
'  setInterval(function(){\n' +
'    addDismiss();\n' +
'    hideIfDismissed();\n' +
'  }, 2500);\n' +
'})();\n' +
'</script>\n';

var bodyEnd = h.lastIndexOf("</body>");
if (bodyEnd === -1) { console.error("❌ </body>"); process.exit(1); }
h = h.slice(0, bodyEnd) + js + h.slice(bodyEnd);
console.log("✅ JS added (dismiss + sessionStorage)");

fs.writeFileSync(target, h);
console.log("━━━━━━━━━━━━━━━━━━");
console.log("قبل:  " + before + " bytes");
console.log("بعد:  " + h.length + " bytes");
console.log("فرق:  " + (h.length - before) + " bytes");
