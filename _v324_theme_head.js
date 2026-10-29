const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

// فحص: مطبق مسبقاً؟
if (h.indexOf("v324-theme-instant") !== -1) {
  console.log("⚠️ v324 مطبق مسبقاً");
  process.exit(0);
}

// script صغير في <head> — يضبط الثيم فوراً قبل كل شيء
var themeScript = '\n<script id="v324-theme-instant">\n' +
'  (function(){\n' +
'    try {\n' +
'      var mode = localStorage.getItem("chizen_theme_mode");\n' +
'      // إذا لم يختر المستخدم شيئاً، أو اختار auto → light (الرسمي)\n' +
'      var theme = (!mode || mode === "auto") ? "light" : mode;\n' +
'      document.documentElement.setAttribute("data-theme", theme);\n' +
'      if (theme === "light") {\n' +
'        document.documentElement.classList.add("chz-light");\n' +
'        document.documentElement.classList.remove("chz-dark");\n' +
'      } else {\n' +
'        document.documentElement.classList.add("chz-dark");\n' +
'        document.documentElement.classList.remove("chz-light");\n' +
'      }\n' +
'    } catch(e){}\n' +
'  })();\n' +
'</script>\n';

// إدراج كأول شيء داخل <head> (قبل v322، v323)
var headStart = h.indexOf("<head>");
if (headStart === -1) { console.error("❌ <head> not found"); process.exit(1); }
var insertPos = headStart + "<head>".length;

h = h.slice(0, insertPos) + themeScript + h.slice(insertPos);

fs.writeFileSync(target, h);
console.log("✅ v324: theme script added to <head> (top)");
console.log("  قبل:  " + before + " bytes");
console.log("  بعد:  " + h.length + " bytes");
console.log("  فرق:  +" + (h.length - before) + " bytes");
