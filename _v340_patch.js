const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

if (h.indexOf("v340-search") !== -1) {
  console.log("⚠️ v340 مطبق مسبقاً");
  process.exit(0);
}

// ═══ CSS ═══
var css = '\n<style id="v340-search-css">\n' +
'  #v340-search-overlay {\n' +
'    position: fixed; inset: 0; z-index: 2147483000;\n' +
'    background: #faf7ff;\n' +
'    display: none; flex-direction: column;\n' +
'    font-family: Tajawal, system-ui, sans-serif;\n' +
'  }\n' +
'  html[data-theme="dark"] #v340-search-overlay { background: #0a0825; }\n' +
'  #v340-search-overlay.open { display: flex; }\n' +
'  \n' +
'  /* Header */\n' +
'  .v340-header {\n' +
'    display: flex; align-items: center; gap: 8px;\n' +
'    padding: 12px 12px 8px;\n' +
'    background: #faf7ff;\n' +
'    border-bottom: 1px solid #e5e1f5;\n' +
'    position: sticky; top: 0; z-index: 10;\n' +
'  }\n' +
'  html[data-theme="dark"] .v340-header { background: #0a0825; border-color: #2a2350; }\n' +
'  \n' +
'  .v340-back, .v340-clear-input {\n' +
'    width: 38px; height: 38px; border-radius: 50%;\n' +
'    background: #f0ebff; border: none;\n' +
'    color: #7c3aed; font-size: 18px; cursor: pointer;\n' +
'    display: flex; align-items: center; justify-content: center;\n' +
'    flex-shrink: 0;\n' +
'    font-family: inherit;\n' +
'  }\n' +
'  html[data-theme="dark"] .v340-back,\n' +
'  html[data-theme="dark"] .v340-clear-input { background: #1a1535; color: #a78bfa; }\n' +
'  \n' +
'  .v340-input-wrap {\n' +
'    flex: 1; position: relative;\n' +
'  }\n' +
'  .v340-input-wrap input {\n' +
'    width: 100%; padding: 10px 40px 10px 16px;\n' +
'    background: #ffffff; border: 1.5px solid #e5e1f5;\n' +
'    border-radius: 12px; font-family: inherit; font-size: 14px;\n' +
'    color: #1a1a2e; box-sizing: border-box; outline: none;\n' +
'    transition: border-color 0.15s;\n' +
'  }\n' +
'  .v340-input-wrap input:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }\n' +
'  html[data-theme="dark"] .v340-input-wrap input { background: #1a1535; border-color: #4c3b7a; color: #fff; }\n' +
'  html[data-theme="dark"] .v340-input-wrap input::placeholder { color: #6b5a8a; }\n' +
'  \n' +
'  .v340-input-icon {\n' +
'    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);\n' +
'    color: #7c3aed; font-size: 16px; pointer-events: none;\n' +
'  }\n' +
'  html[data-theme="dark"] .v340-input-icon { color: #a78bfa; }\n' +
'  \n' +
'  /* Body */\n' +
'  .v340-body {\n' +
'    flex: 1; overflow-y: auto; padding: 12px 0 80px;\n' +
'  }\n' +
'  \n' +
'  .v340-section { padding: 0 16px; margin-bottom: 20px; }\n' +
'  .v340-section-title {\n' +
'    font-size: 13px; font-weight: 800; color: #1a1a2e;\n' +
'    margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;\n' +
'    gap: 8px;\n' +
'  }\n' +
'  html[data-theme="dark"] .v340-section-title { color: #ffffff; }\n' +
'  \n' +
'  .v340-clear-all {\n' +
'    font-size: 11px; color: #ef4444; background: transparent;\n' +
'    border: none; font-family: inherit; cursor: pointer; font-weight: 700;\n' +
'    padding: 2px 6px;\n' +
'  }\n' +
'  \n' +
'  /* Chips */\n' +
'  .v340-chips { display: flex; flex-wrap: wrap; gap: 8px; }\n' +
'  .v340-chip {\n' +
'    display: inline-flex; align-items: center; gap: 6px;\n' +
'    padding: 8px 14px; background: #ffffff;\n' +
'    border: 1px solid #e5e1f5; border-radius: 20px;\n' +
'    font-size: 12px; font-weight: 600; color: #1a1a2e;\n' +
'    cursor: pointer; font-family: inherit;\n' +
'    transition: all 0.15s;\n' +
'  }\n' +
'  .v340-chip:active { transform: scale(0.96); background: #f0ebff; border-color: #a78bfa; }\n' +
'  html[data-theme="dark"] .v340-chip { background: #1a1535; border-color: #4c3b7a; color: #e0e7ff; }\n' +
'  html[data-theme="dark"] .v340-chip:active { background: #2a2350; }\n' +
'  \n' +
'  .v340-chip .v340-chip-x {\n' +
'    width: 16px; height: 16px; border-radius: 50%;\n' +
'    background: #ef4444; color: #fff; font-size: 9px;\n' +
'    display: flex; align-items: center; justify-content: center;\n' +
'    font-weight: 900; margin-right: 2px;\n' +
'  }\n' +
'  \n' +
'  /* Filters */\n' +
'  .v340-filters {\n' +
'    display: flex; gap: 6px; padding: 0 16px 12px;\n' +
'    overflow-x: auto; scrollbar-width: none;\n' +
'  }\n' +
'  .v340-filters::-webkit-scrollbar { display: none; }\n' +
'  .v340-filter {\n' +
'    flex-shrink: 0; padding: 7px 14px;\n' +
'    background: #ffffff; border: 1px solid #e5e1f5;\n' +
'    border-radius: 18px; font-size: 11px; font-weight: 700;\n' +
'    color: #6b7280; cursor: pointer; font-family: inherit;\n' +
'    transition: all 0.15s;\n' +
'  }\n' +
'  .v340-filter.active {\n' +
'    background: linear-gradient(135deg, #7c3aed, #ec4899);\n' +
'    color: #fff; border-color: transparent;\n' +
'  }\n' +
'  html[data-theme="dark"] .v340-filter { background: #1a1535; border-color: #4c3b7a; color: #a78bfa; }\n' +
'  \n' +
'  /* Results */\n' +
'  .v340-results-count {\n' +
'    font-size: 12px; color: #6b7280; padding: 0 16px 10px;\n' +
'    font-weight: 600;\n' +
'  }\n' +
'  html[data-theme="dark"] .v340-results-count { color: #a78bfa; }\n' +
'  \n' +
'  .v340-grid {\n' +
'    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;\n' +
'    padding: 0 16px;\n' +
'  }\n' +
'  .v340-prod {\n' +
'    background: #ffffff; border-radius: 12px;\n' +
'    overflow: hidden; cursor: pointer;\n' +
'    box-shadow: 0 2px 8px rgba(0,0,0,0.04);\n' +
'    transition: transform 0.15s;\n' +
'  }\n' +
'  .v340-prod:active { transform: scale(0.97); }\n' +
'  html[data-theme="dark"] .v340-prod { background: #1a1535; }\n' +
'  .v340-prod-img {\n' +
'    width: 100%; aspect-ratio: 1; object-fit: cover;\n' +
'    background: #f4f6fa; display: block;\n' +
'  }\n' +
'  .v340-prod-info { padding: 8px 10px; }\n' +
'  .v340-prod-name {\n' +
'    font-size: 12px; font-weight: 700; color: #1a1a2e;\n' +
'    line-height: 1.3; margin-bottom: 4px;\n' +
'    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;\n' +
'    overflow: hidden; min-height: 32px;\n' +
'  }\n' +
'  html[data-theme="dark"] .v340-prod-name { color: #fff; }\n' +
'  .v340-prod-price {\n' +
'    font-size: 14px; font-weight: 900; color: #ec4899;\n' +
'  }\n' +
'  \n' +
'  .v340-empty {\n' +
'    text-align: center; padding: 60px 20px; color: #6b7280;\n' +
'  }\n' +
'  html[data-theme="dark"] .v340-empty { color: #a78bfa; }\n' +
'  .v340-empty-icon { font-size: 48px; margin-bottom: 12px; }\n' +
'  .v340-empty-text { font-size: 14px; font-weight: 700; }\n' +
'  .v340-empty-sub { font-size: 12px; margin-top: 6px; opacity: 0.7; }\n' +
'  \n' +
'  /* Product suggestions */\n' +
'  .v340-prod-scroll {\n' +
'    display: flex; gap: 10px; overflow-x: auto; padding: 0 16px 6px;\n' +
'    scrollbar-width: none;\n' +
'  }\n' +
'  .v340-prod-scroll::-webkit-scrollbar { display: none; }\n' +
'  .v340-prod-mini {\n' +
'    flex-shrink: 0; width: 130px; background: #ffffff;\n' +
'    border-radius: 12px; overflow: hidden; cursor: pointer;\n' +
'    box-shadow: 0 2px 8px rgba(0,0,0,0.04);\n' +
'  }\n' +
'  html[data-theme="dark"] .v340-prod-mini { background: #1a1535; }\n' +
'  .v340-prod-mini .v340-prod-img { aspect-ratio: 1; }\n' +
'</style>\n';

var headEnd = h.indexOf("</head>");
if (headEnd === -1) { console.error("❌ </head>"); process.exit(1); }
h = h.slice(0, headEnd) + css + h.slice(headEnd);
console.log("✅ CSS added");

// ═══ JS ═══
var js = '\n<script id="v340-search">\n' +
'(function(){\n' +
'  var RECENT_KEY = "v340_recent_searches";\n' +
'  var MAX_RECENT = 8;\n' +
'  var currentFilter = "all";\n' +
'  var currentQuery = "";\n' +
'  \n' +
'  function getRecent(){\n' +
'    try { var s = localStorage.getItem(RECENT_KEY); return s ? JSON.parse(s) : []; } catch(e){ return []; }\n' +
'  }\n' +
'  function saveRecent(list){\n' +
'    try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT))); } catch(e){}\n' +
'  }\n' +
'  function addRecent(q){\n' +
'    q = (q||"").trim();\n' +
'    if (!q || q.length < 2) return;\n' +
'    var list = getRecent().filter(function(x){ return x.toLowerCase() !== q.toLowerCase(); });\n' +
'    list.unshift(q);\n' +
'    saveRecent(list);\n' +
'  }\n' +
'  function esc(s){ return String(s||"").replace(/[&<>"\\"\\x27]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;","\\x27":"&#39;"}[c]; }); }\n' +
'  \n' +
'  function getSuggestions(){\n' +
'    return ["عطر", "آيفون", "لابتوب", "سامسونج", "شانيل", "Nike", "أريكة", "ساعة", "كاميرا", "سجادة"];\n' +
'  }\n' +
'  \n' +
'  function getCategories(){\n' +
'    var cats = {};\n' +
'    if (window.APP && window.APP.products) {\n' +
'      window.APP.products.forEach(function(p){\n' +
'        if (p.category) cats[p.category] = (cats[p.category]||0)+1;\n' +
'      });\n' +
'    }\n' +
'    return cats;\n' +
'  }\n' +
'  \n' +
'  var CAT_LABELS = {\n' +
'    electronics: "📱 إلكترونيات", fashion: "👗 أزياء", clothing: "👕 ملابس",\n' +
'    shoes_bags: "👟 أحذية", beauty: "💄 جمال", kids_sports: "⚽ أطفال",\n' +
'    home: "🛋️ منزل", supermarket: "🛒 سوبرماركت"\n' +
'  };\n' +
'  \n' +
'  function buildOverlay(){\n' +
'    if (document.getElementById("v340-search-overlay")) return;\n' +
'    var ov = document.createElement("div");\n' +
'    ov.id = "v340-search-overlay";\n' +
'    ov.innerHTML =\n' +
'      \x27<div class="v340-header">\x27 +\n' +
'        \x27<button class="v340-back" id="v340-back">←</button>\x27 +\n' +
'        \x27<div class="v340-input-wrap">\x27 +\n' +
'          \x27<input type="text" id="v340-input" placeholder="ابحث عن منتج، ماركة..." autocomplete="off">\x27 +\n' +
'          \x27<span class="v340-input-icon">🔍</span>\x27 +\n' +
'        \x27</div>\x27 +\n' +
'      \x27</div>\x27 +\n' +
'      \x27<div class="v340-body" id="v340-body"></div>\x27;\n' +
'    document.body.appendChild(ov);\n' +
'    \n' +
'    document.getElementById("v340-back").onclick = close;\n' +
'    var input = document.getElementById("v340-input");\n' +
'    var debounce;\n' +
'    input.oninput = function(){\n' +
'      clearTimeout(debounce);\n' +
'      var v = this.value;\n' +
'      debounce = setTimeout(function(){\n' +
'        currentQuery = v;\n' +
'        render();\n' +
'      }, 200);\n' +
'    };\n' +
'    input.onkeydown = function(e){\n' +
'      if (e.key === "Enter"){\n' +
'        addRecent(this.value);\n' +
'        currentQuery = this.value;\n' +
'        render();\n' +
'      }\n' +
'    };\n' +
'  }\n' +
'  \n' +
'  function open(){\n' +
'    buildOverlay();\n' +
'    currentQuery = "";\n' +
'    currentFilter = "all";\n' +
'    var ov = document.getElementById("v340-search-overlay");\n' +
'    ov.classList.add("open");\n' +
'    var input = document.getElementById("v340-input");\n' +
'    input.value = "";\n' +
'    setTimeout(function(){ input.focus(); }, 100);\n' +
'    render();\n' +
'  }\n' +
'  \n' +
'  function close(){\n' +
'    var ov = document.getElementById("v340-search-overlay");\n' +
'    if (ov) ov.classList.remove("open");\n' +
'  }\n' +
'  \n' +
'  function render(){\n' +
'    var body = document.getElementById("v340-body");\n' +
'    if (!body) return;\n' +
'    \n' +
'    if (!currentQuery || currentQuery.trim().length === 0) {\n' +
'      body.innerHTML = renderIdle();\n' +
'      bindIdle();\n' +
'    } else {\n' +
'      body.innerHTML = renderResults();\n' +
'      bindResults();\n' +
'    }\n' +
'  }\n' +
'  \n' +
'  function renderIdle(){\n' +
'    var recent = getRecent();\n' +
'    var sugg = getSuggestions();\n' +
'    var html = "";\n' +
'    \n' +
'    if (recent.length > 0) {\n' +
'      html += \x27<div class="v340-section">\x27;\n' +
'      html += \x27<div class="v340-section-title"><span>🕐 بحث سابق</span><button class="v340-clear-all" id="v340-clear-all">مسح الكل</button></div>\x27;\n' +
'      html += \x27<div class="v340-chips">\x27;\n' +
'      recent.forEach(function(q, i){\n' +
'        html += \x27<div class="v340-chip" data-search="\x27 + esc(q) + \x27"><span>\x27 + esc(q) + \x27</span><span class="v340-chip-x" data-remove="\x27 + i + \x27">✕</span></div>\x27;\n' +
'      });\n' +
'      html += \x27</div></div>\x27;\n' +
'    }\n' +
'    \n' +
'    html += \x27<div class="v340-section">\x27;\n' +
'    html += \x27<div class="v340-section-title"><span>✨ قد تعجبك</span></div>\x27;\n' +
'    html += \x27<div class="v340-chips">\x27;\n' +
'    sugg.forEach(function(q){\n' +
'      html += \x27<div class="v340-chip" data-search="\x27 + esc(q) + \x27">\x27 + esc(q) + \x27</div>\x27;\n' +
'    });\n' +
'    html += \x27</div></div>\x27;\n' +
'    \n' +
'    var prods = (window.APP && window.APP.products) ? window.APP.products.filter(function(p){ return p.active !== false; }) : [];\n' +
'    var shuffled = prods.slice().sort(function(){ return Math.random() - 0.5; }).slice(0, 8);\n' +
'    if (shuffled.length > 0) {\n' +
'      html += \x27<div class="v340-section" style="padding-left:0;padding-right:0">\x27;\n' +
'      html += \x27<div class="v340-section-title" style="padding:0 16px"><span>💡 منتجات رائجة</span></div>\x27;\n' +
'      html += \x27<div class="v340-prod-scroll">\x27;\n' +
'      shuffled.forEach(function(p){\n' +
'        html += \x27<div class="v340-prod-mini" data-prod="\x27 + esc(p.id) + \x27">\x27 +\n' +
'          \x27<img class="v340-prod-img" src="\x27 + esc(p.img) + \x27" onerror="this.style.opacity=0.3">\x27 +\n' +
'          \x27<div class="v340-prod-info"><div class="v340-prod-name">\x27 + esc(p.name) + \x27</div><div class="v340-prod-price">\x27 + (Number(p.price)||0).toFixed(0) + \x27 ر.س</div></div></div>\x27;\n' +
'      });\n' +
'      html += \x27</div></div>\x27;\n' +
'    }\n' +
'    \n' +
'    return html;\n' +
'  }\n' +
'  \n' +
'  function bindIdle(){\n' +
'    document.querySelectorAll(\x27[data-search]\x27).forEach(function(el){\n' +
'      el.onclick = function(e){\n' +
'        if (e.target.hasAttribute("data-remove")) return;\n' +
'        var q = this.getAttribute("data-search");\n' +
'        var input = document.getElementById("v340-input");\n' +
'        input.value = q;\n' +
'        currentQuery = q;\n' +
'        addRecent(q);\n' +
'        render();\n' +
'      };\n' +
'    });\n' +
'    document.querySelectorAll(\x27[data-remove]\x27).forEach(function(el){\n' +
'      el.onclick = function(e){\n' +
'        e.stopPropagation();\n' +
'        var idx = parseInt(this.getAttribute("data-remove"), 10);\n' +
'        var list = getRecent();\n' +
'        list.splice(idx, 1);\n' +
'        saveRecent(list);\n' +
'        render();\n' +
'      };\n' +
'    });\n' +
'    var clearAll = document.getElementById("v340-clear-all");\n' +
'    if (clearAll) clearAll.onclick = function(){\n' +
'      saveRecent([]);\n' +
'      render();\n' +
'    };\n' +
'    document.querySelectorAll(\x27[data-prod]\x27).forEach(function(el){\n' +
'      el.onclick = function(){\n' +
'        var id = this.getAttribute("data-prod");\n' +
'        close();\n' +
'        setTimeout(function(){\n' +
'          if (window.APP && window.APP.openProduct) window.APP.openProduct(id);\n' +
'        }, 200);\n' +
'      };\n' +
'    });\n' +
'  }\n' +
'  \n' +
'  function searchProducts(q, category){\n' +
'    if (!window.APP || !window.APP.products) return [];\n' +
'    var query = q.trim().toLowerCase();\n' +
'    return window.APP.products.filter(function(p){\n' +
'      if (p.active === false) return false;\n' +
'      if (category && category !== "all" && p.category !== category) return false;\n' +
'      if (!query) return true;\n' +
'      var name = (p.name||"").toLowerCase();\n' +
'      var brand = (p.brand||"").toLowerCase();\n' +
'      var desc = (p.desc||"").toLowerCase();\n' +
'      return name.indexOf(query) !== -1 || brand.indexOf(query) !== -1 || desc.indexOf(query) !== -1;\n' +
'    });\n' +
'  }\n' +
'  \n' +
'  function renderResults(){\n' +
'    var results = searchProducts(currentQuery, currentFilter);\n' +
'    var cats = getCategories();\n' +
'    var catKeys = Object.keys(cats);\n' +
'    \n' +
'    var html = "";\n' +
'    \n' +
'    // Filters\n' +
'    html += \x27<div class="v340-filters">\x27;\n' +
'    html += \x27<button class="v340-filter \x27 + (currentFilter==="all"?"active":"") + \x27" data-filter="all">الكل (\x27 + (window.APP.products ? window.APP.products.length : 0) + \x27)</button>\x27;\n' +
'    catKeys.forEach(function(k){\n' +
'      var label = CAT_LABELS[k] || k;\n' +
'      var active = currentFilter === k;\n' +
'      html += \x27<button class="v340-filter \x27 + (active?"active":"") + \x27" data-filter="\x27 + k + \x27">\x27 + label + \x27 (\x27 + cats[k] + \x27)</button>\x27;\n' +
'    });\n' +
'    html += \x27</div>\x27;\n' +
'    \n' +
'    // Count\n' +
'    html += \x27<div class="v340-results-count">\x27 + results.length + \x27 نتيجة</div>\x27;\n' +
'    \n' +
'    // Grid\n' +
'    if (results.length === 0) {\n' +
'      html += \x27<div class="v340-empty"><div class="v340-empty-icon">🔍</div><div class="v340-empty-text">لا توجد نتائج</div><div class="v340-empty-sub">جرب كلمة أخرى أو غيّر الفلتر</div></div>\x27;\n' +
'    } else {\n' +
'      html += \x27<div class="v340-grid">\x27;\n' +
'      results.slice(0, 30).forEach(function(p){\n' +
'        html += \x27<div class="v340-prod" data-prod="\x27 + esc(p.id) + \x27">\x27 +\n' +
'          \x27<img class="v340-prod-img" src="\x27 + esc(p.img) + \x27" onerror="this.style.opacity=0.3">\x27 +\n' +
'          \x27<div class="v340-prod-info"><div class="v340-prod-name">\x27 + esc(p.name) + \x27</div><div class="v340-prod-price">\x27 + (Number(p.price)||0).toFixed(0) + \x27 ر.س</div></div></div>\x27;\n' +
'      });\n' +
'      html += \x27</div>\x27;\n' +
'    }\n' +
'    \n' +
'    return html;\n' +
'  }\n' +
'  \n' +
'  function bindResults(){\n' +
'    document.querySelectorAll(\x27[data-filter]\x27).forEach(function(el){\n' +
'      el.onclick = function(){\n' +
'        currentFilter = this.getAttribute("data-filter");\n' +
'        render();\n' +
'      };\n' +
'    });\n' +
'    document.querySelectorAll(\x27.v340-prod[data-prod]\x27).forEach(function(el){\n' +
'      el.onclick = function(){\n' +
'        var id = this.getAttribute("data-prod");\n' +
'        addRecent(currentQuery);\n' +
'        close();\n' +
'        setTimeout(function(){\n' +
'          if (window.APP && window.APP.openProduct) window.APP.openProduct(id);\n' +
'        }, 200);\n' +
'      };\n' +
'    });\n' +
'  }\n' +
'  \n' +
'  // ═══ Hook: click on search bar opens overlay ═══\n' +
'  function hookSearchInput(){\n' +
'    var inp = document.getElementById("search-in");\n' +
'    if (!inp) return false;\n' +
'    if (inp.__v340Hooked) return true;\n' +
'    inp.__v340Hooked = true;\n' +
'    \n' +
'    // منع التركيز الأصلي + فتح اللوحة\n' +
'    inp.addEventListener("focus", function(e){ e.preventDefault(); this.blur(); open(); }, true);\n' +
'    inp.addEventListener("click", function(e){ e.preventDefault(); this.blur(); open(); }, true);\n' +
'    // منع لوحة المفاتيح من الظهور في الأصل\n' +
'    inp.setAttribute("readonly", "readonly");\n' +
'    inp.style.cursor = "pointer";\n' +
'    \n' +
'    console.log("[v340] search input hooked");\n' +
'    return true;\n' +
'  }\n' +
'  \n' +
'  // حاول فوراً + كل 500ms حتى يظهر\n' +
'  var tries = 0;\n' +
'  var interval = setInterval(function(){\n' +
'    tries++;\n' +
'    if (hookSearchInput() || tries > 40) clearInterval(interval);\n' +
'  }, 500);\n' +
'  \n' +
'  console.log("[v340] search overlay ready");\n' +
'})();\n' +
'</script>\n';

var bodyEnd = h.lastIndexOf("</body>");
if (bodyEnd === -1) { console.error("❌ </body>"); process.exit(1); }
h = h.slice(0, bodyEnd) + js + h.slice(bodyEnd);
console.log("✅ JS added");

fs.writeFileSync(target, h);
console.log("━━━━━━━━━━━━━━━━━━");
console.log("قبل:  " + before + " bytes");
console.log("بعد:  " + h.length + " bytes");
console.log("فرق:  +" + (h.length - before) + " bytes");
