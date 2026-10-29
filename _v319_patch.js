const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

// فحص: مطبق مسبقاً؟
if (h.indexOf("v319-premium-name") !== -1) {
  console.log("⚠️ v319 مطبق مسبقاً");
  process.exit(0);
}

var css = '\n<style id="v319-premium-name">\n' +
'  /* Only for logged-in users (guest state = chz-is-guest on body) */\n' +
'  body:not(.chz-is-guest) .chz-profile-group {\n' +
'    background: linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.10)) !important;\n' +
'    border: 1px solid rgba(168,85,247,0.3) !important;\n' +
'    border-radius: 12px !important;\n' +
'    padding: 7px 12px !important;\n' +
'    display: flex !important;\n' +
'    align-items: center !important;\n' +
'    gap: 10px !important;\n' +
'    cursor: pointer !important;\n' +
'    transition: transform 0.15s ease, background 0.15s ease !important;\n' +
'  }\n' +
'  body:not(.chz-is-guest) .chz-profile-group:active {\n' +
'    transform: scale(0.97) !important;\n' +
'    background: linear-gradient(135deg, rgba(168,85,247,0.25), rgba(236,72,153,0.18)) !important;\n' +
'  }\n' +
'  \n' +
'  /* Avatar */\n' +
'  body:not(.chz-is-guest) .chz-profile-group .chz-prof-avatar {\n' +
'    width: 34px !important;\n' +
'    height: 34px !important;\n' +
'    border-radius: 50% !important;\n' +
'    background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%) !important;\n' +
'    display: flex !important;\n' +
'    align-items: center !important;\n' +
'    justify-content: center !important;\n' +
'    flex-shrink: 0 !important;\n' +
'    box-shadow: 0 3px 10px rgba(124,58,237,0.35) !important;\n' +
'    border: 2px solid rgba(255,255,255,0.2) !important;\n' +
'  }\n' +
'  body:not(.chz-is-guest) .chz-profile-group .chz-prof-avatar svg {\n' +
'    width: 18px !important;\n' +
'    height: 18px !important;\n' +
'    fill: #ffffff !important;\n' +
'  }\n' +
'  \n' +
'  /* Text container */\n' +
'  body:not(.chz-is-guest) .chz-profile-group .chz-prof-txt {\n' +
'    display: flex !important;\n' +
'    flex-direction: column !important;\n' +
'    align-items: flex-start !important;\n' +
'    gap: 1px !important;\n' +
'    min-width: 0 !important;\n' +
'    text-align: right !important;\n' +
'  }\n' +
'  \n' +
'  /* Name */\n' +
'  body:not(.chz-is-guest) .chz-profile-group .chz-prof-name {\n' +
'    font-family: Tajawal, sans-serif !important;\n' +
'    font-size: 13px !important;\n' +
'    font-weight: 800 !important;\n' +
'    color: #ffffff !important;\n' +
'    line-height: 1.2 !important;\n' +
'    max-width: 100px !important;\n' +
'    overflow: hidden !important;\n' +
'    text-overflow: ellipsis !important;\n' +
'    white-space: nowrap !important;\n' +
'    margin: 0 !important;\n' +
'    padding: 0 !important;\n' +
'  }\n' +
'  \n' +
'  /* Welcome */\n' +
'  body:not(.chz-is-guest) .chz-profile-group .chz-prof-welcome {\n' +
'    font-family: Tajawal, sans-serif !important;\n' +
'    font-size: 10px !important;\n' +
'    font-weight: 600 !important;\n' +
'    color: rgba(196,181,253,0.95) !important;\n' +
'    line-height: 1.2 !important;\n' +
'    margin: 0 !important;\n' +
'    padding: 0 !important;\n' +
'  }\n' +
'  \n' +
'  /* Light theme overrides */\n' +
'  html[data-theme="light"] body:not(.chz-is-guest) .chz-profile-group {\n' +
'    background: linear-gradient(135deg, rgba(168,85,247,0.10), rgba(236,72,153,0.08)) !important;\n' +
'    border-color: rgba(168,85,247,0.25) !important;\n' +
'  }\n' +
'  html[data-theme="light"] body:not(.chz-is-guest) .chz-profile-group .chz-prof-name {\n' +
'    color: #1a1a2e !important;\n' +
'  }\n' +
'  html[data-theme="light"] body:not(.chz-is-guest) .chz-profile-group .chz-prof-welcome {\n' +
'    color: #7c3aed !important;\n' +
'  }\n' +
'</style>\n';

var headEnd = h.indexOf("</head>");
if (headEnd === -1) { console.error("❌ </head>"); process.exit(1); }
h = h.slice(0, headEnd) + css + h.slice(headEnd);

fs.writeFileSync(target, h);
console.log("✅ v319: premium profile design");
console.log("  قبل:  " + before + " bytes");
console.log("  بعد:  " + h.length + " bytes");
console.log("  فرق:  +" + (h.length - before) + " bytes");
