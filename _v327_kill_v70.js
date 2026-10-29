const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

// ═══ 1. حذف v70 (auto theme) ═══
var v70Start = h.indexOf('<script id="chz-theme-v70">');
if (v70Start === -1) {
  console.log("⚠️ v70 not found (already disabled?)");
} else {
  var v70End = h.indexOf('</script>', v70Start) + '</script>'.length;
  var v70Size = v70End - v70Start;
  h = h.slice(0, v70Start) + '<!-- v70 auto-theme DISABLED v327 -->' + h.slice(v70End);
  console.log("✅ v70 disabled (" + v70Size + " bytes)");
}

// ═══ 2. Force S.defaultTheme = 'light' ═══
var dtMatches = h.match(/defaultTheme\s*[:=]\s*['"]dark['"]/g) || [];
if (dtMatches.length > 0) {
  h = h.replace(/defaultTheme\s*[:=]\s*['"]dark['"]/g, 'defaultTheme: "light"');
  console.log("✅ defaultTheme: " + dtMatches.length + " fixed → light");
} else {
  console.log("ℹ️ defaultTheme: no 'dark' found");
}

// ═══ 3. Migration: auto → light ═══
var migrationScript = '\n<script id="v327-migrate">\n' +
'  (function(){\n' +
'    try {\n' +
'      var m = localStorage.getItem("chizen_theme_mode");\n' +
'      if (!m || m === "auto") {\n' +
'        localStorage.setItem("chizen_theme_mode", "light");\n' +
'        console.log("[v327] migrated auto→light");\n' +
'      }\n' +
'    } catch(e){}\n' +
'  })();\n' +
'</script>\n';

var headStart = h.indexOf('<head>');
h = h.slice(0, headStart + 6) + migrationScript + h.slice(headStart + 6);
console.log("✅ migration script inserted");

// ═══ 4. Safety net: MutationObserver ═══
var safetyScript = '\n<script id="v327-safety">\n' +
'  (function(){\n' +
'    // Safety net: force light if something switches to dark without explicit user choice\n' +
'    var checkAndFix = function(){\n' +
'      try {\n' +
'        var mode = localStorage.getItem("chizen_theme_mode");\n' +
'        var current = document.documentElement.getAttribute("data-theme");\n' +
'        if (current === "dark" && mode !== "dark") {\n' +
'          document.documentElement.setAttribute("data-theme", "light");\n' +
'          console.log("[v327] safety net: forced light (mode=" + mode + ")");\n' +
'        }\n' +
'      } catch(e){}\n' +
'    };\n' +
'    setTimeout(checkAndFix, 800);\n' +
'    setTimeout(checkAndFix, 1500);\n' +
'    setTimeout(checkAndFix, 3000);\n' +
'  })();\n' +
'</script>\n';

var bodyEnd = h.lastIndexOf("</body>");
h = h.slice(0, bodyEnd) + safetyScript + h.slice(bodyEnd);
console.log("✅ safety net added");

fs.writeFileSync(target, h);
console.log("━━━━━━━━━━━━━━━━━━");
console.log("قبل:  " + before + " bytes");
console.log("بعد:  " + h.length + " bytes");
console.log("فرق:  " + (h.length - before) + " bytes");
