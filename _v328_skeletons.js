const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

if (h.indexOf("v328-skeleton-css") !== -1) {
  console.log("⚠️ v328 مطبق مسبقاً");
  process.exit(0);
}

// 1. CSS للهياكل (Shimmer Animation)
var css = '\n<style id="v328-skeleton-css">\n' +
'  .v328-skeleton-card {\n' +
'    background: #ffffff;\n' +
'    border-radius: 12px;\n' +
'    overflow: hidden;\n' +
'    padding-bottom: 8px;\n' +
'  }\n' +
'  html[data-theme="dark"] .v328-skeleton-card { background: #1a1535; }\n' +
'  .v328-skeleton-img {\n' +
'    width: 100%;\n' +
'    aspect-ratio: 1;\n' +
'    background: #e5e7eb;\n' +
'    position: relative;\n' +
'  }\n' +
'  html[data-theme="dark"] .v328-skeleton-img { background: #2a2350; }\n' +
'  .v328-skeleton-text {\n' +
'    height: 12px;\n' +
'    background: #e5e7eb;\n' +
'    border-radius: 4px;\n' +
'    margin: 8px 10px;\n' +
'    position: relative;\n' +
'  }\n' +
'  html[data-theme="dark"] .v328-skeleton-text { background: #2a2350; }\n' +
'  .v328-skeleton-text.short { width: 50%; }\n' +
'  .v328-skeleton-img::after, .v328-skeleton-text::after {\n' +
'    content: "";\n' +
'    position: absolute;\n' +
'    inset: 0;\n' +
'    transform: translateX(-100%);\n' +
'    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);\n' +
'    animation: v328shimmer 1.5s infinite;\n' +
'  }\n' +
'  html[data-theme="dark"] .v328-skeleton-img::after,\n' +
'  html[data-theme="dark"] .v328-skeleton-text::after {\n' +
'    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);\n' +
'  }\n' +
'  @keyframes v328shimmer {\n' +
'    100% { transform: translateX(100%); }\n' +
'  }\n' +
'</style>\n';

var headEnd = h.indexOf("</head>");
h = h.slice(0, headEnd) + css + h.slice(headEnd);

// 2. JS لحقن الهياكل وإزالتها
var js = '\n<script id="v328-skeleton-js">\n' +
'(function(){\n' +
'  function getSkeletonHTML(count){\n' +
'    var html = "";\n' +
'    for(var i=0; i<count; i++){\n' +
'      html += \x27<div class="v328-skeleton-card">\x27 +\n' +
'        \x27<div class="v328-skeleton-img"></div>\x27 +\n' +
'        \x27<div class="v328-skeleton-text"></div>\x27 +\n' +
'        \x27<div class="v328-skeleton-text short"></div>\x27 +\n' +
'      \x27</div>\x27;\n' +
'    }\n' +
'    return html;\n' +
'  }\n' +
'  \n' +
'  function injectSkeletons(){\n' +
'    // نبحث عن جميع حاويات المنتجات الفارغة\n' +
'    var grids = document.querySelectorAll(".prods, #home-prods, #cat-prods");\n' +
'    grids.forEach(function(g){\n' +
'      if (g.children.length === 0 && !g.dataset.v328Done) {\n' +
'        g.innerHTML = getSkeletonHTML(6);\n' +
'        g.dataset.v328Done = "1";\n' +
'      }\n' +
'    });\n' +
'  }\n' +
'  \n' +
'  // حقن الهياكل فوراً عند فتح الصفحة\n' +
'  setTimeout(injectSkeletons, 100);\n' +
'  setTimeout(injectSkeletons, 500);\n' +
'  \n' +
'  // دالة لتنظيف الهياكل عندما تصل البيانات\n' +
'  window.__v328ClearSkeletons = function(){\n' +
'    document.querySelectorAll(".v328-skeleton-card").forEach(function(el){\n' +
'      el.remove();\n' +
'    });\n' +
'  };\n' +
'  \n' +
'  // مراقبة الوصول للبيانات لمسح الهياكل تلقائياً\n' +
'  var tries = 0;\n' +
'  var check = setInterval(function(){\n' +
'    tries++;\n' +
'    if (window.APP && window.APP.products && window.APP.products.length > 0) {\n' +
'      clearInterval(check);\n' +
'      setTimeout(window.__v328ClearSkeletons, 300);\n' +
'    } else if (tries > 40) {\n' +
'      clearInterval(check);\n' +
'    }\n' +
'  }, 250);\n' +
'  \n' +
'  // مراقبة فتح الأقسام الجديدة\n' +
'  if (window.APP && window.APP.openCatPage) {\n' +
'    var origOpen = window.APP.openCatPage;\n' +
'    window.APP.openCatPage = function(){\n' +
'      var r = origOpen.apply(this, arguments);\n' +
'      var catGrid = document.getElementById("cat-prods");\n' +
'      if (catGrid && catGrid.children.length === 0) {\n' +
'        catGrid.innerHTML = getSkeletonHTML(4);\n' +
'      }\n' +
'      return r;\n' +
'    };\n' +
'  }\n' +
'})();\n' +
'</script>\n';

var bodyEnd = h.lastIndexOf("</body>");
h = h.slice(0, bodyEnd) + js + h.slice(bodyEnd);

fs.writeFileSync(target, h);
console.log("✅ v328: Temu-style skeletons added");
console.log("  قبل:  " + before + " bytes");
console.log("  بعد:  " + h.length + " bytes");
console.log("  فرق:  +" + (h.length - before) + " bytes");
