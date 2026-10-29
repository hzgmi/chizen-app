const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

if (h.indexOf("v341-kill") !== -1) {
  console.log("⚠️ v341 مطبق مسبقاً");
  process.exit(0);
}

var patch = '\n<script id="v341-kill-freezes">\n' +
'(function(){\n' +
'  "use strict";\n' +
'  var stats = { intervals: 0, observers: 0 };\n' +
'  \n' +
'  var BLOCKED_FN = [\n' +
'    "enforceAll", "enforce", "guard", "ensureVisible",\n' +
'    "priceGuard", "scanSelects", "forceOrders", "updateProfileName"\n' +
'  ];\n' +
'  \n' +
'  var origSI = window.setInterval;\n' +
'  window.setInterval = function(fn, delay){\n' +
'    try {\n' +
'      var src = String(fn);\n' +
'      // Block fast intervals (< 1500ms) with defensive function names\n' +
'      if (delay < 1500) {\n' +
'        for (var i = 0; i < BLOCKED_FN.length; i++) {\n' +
'          if (src.indexOf(BLOCKED_FN[i]) !== -1) {\n' +
'            stats.intervals++;\n' +
'            console.log("[v341] BLOCKED:", BLOCKED_FN[i], "@" + delay + "ms");\n' +
'            return 0;\n' +
'          }\n' +
'        }\n' +
'        // Block anonymous fast functions that don\'t reference our vXXX markers\n' +
'        if (delay < 500) {\n' +
'          var hasMarker = /v3[0-9][0-9]/.test(src);\n' +
'          if (!hasMarker) {\n' +
'            stats.intervals++;\n' +
'            console.log("[v341] BLOCKED anon @" + delay + "ms:", src.slice(0, 50));\n' +
'            return 0;\n' +
'          }\n' +
'        }\n' +
'      }\n' +
'    } catch(e){}\n' +
'    return origSI.apply(this, arguments);\n' +
'  };\n' +
'  \n' +
'  // MutationObserver filter — block body+characterData (heaviest)\n' +
'  var origObserve = MutationObserver.prototype.observe;\n' +
'  var bodyObserverCount = 0;\n' +
'  MutationObserver.prototype.observe = function(target, opts){\n' +
'    try {\n' +
'      if (target === document.body && opts && opts.subtree) {\n' +
'        if (opts.characterData) {\n' +
'          stats.observers++;\n' +
'          console.log("[v341] BLOCKED body+characterData observer");\n' +
'          return;\n' +
'        }\n' +
'        bodyObserverCount++;\n' +
'        if (bodyObserverCount > 3) {\n' +
'          stats.observers++;\n' +
'          console.log("[v341] BLOCKED excess body observer #" + bodyObserverCount);\n' +
'          return;\n' +
'        }\n' +
'      }\n' +
'    } catch(e){}\n' +
'    return origObserve.apply(this, arguments);\n' +
'  };\n' +
'  \n' +
'  setTimeout(function(){\n' +
'    console.log("[v341] blocked", stats.intervals, "intervals +", stats.observers, "observers");\n' +
'  }, 3000);\n' +
'})();\n' +
'</script>\n';

// إدراج في نهاية head (قبل body → يلتقط كل setInterval في body)
var headEnd = h.indexOf("</head>");
if (headEnd === -1) { console.error("❌ </head>"); process.exit(1); }
h = h.slice(0, headEnd) + patch + h.slice(headEnd);

fs.writeFileSync(target, h);
console.log("✅ v341: freeze-kill patch installed");
console.log("  قبل:  " + before + " bytes");
console.log("  بعد:  " + h.length + " bytes");
console.log("  فرق:  +" + (h.length - before) + " bytes");
