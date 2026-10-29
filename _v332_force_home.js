const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

if (h.indexOf("v332-force-home") !== -1) {
  console.log("⚠️ v332 مطبق مسبقاً");
  process.exit(0);
}

var js = '\n<script id="v332-force-home">\n' +
'(function(){\n' +
'  function ensureHome(){\n' +
'    try {\n' +
'      // 1. لا نتدخل إذا كان هناك pending action (يفتحه المستخدم)\n' +
'      var pending = null;\n' +
'      try { pending = localStorage.getItem("chizen_pending_action"); } catch(e){}\n' +
'      if (pending) return;\n' +
'      \n' +
'      // 2. هل الرئيسية active؟\n' +
'      var home = document.getElementById("sc-home");\n' +
'      if (!home) return;\n' +
'      \n' +
'      var wasWrong = !home.classList.contains("active");\n' +
'      var badHash = location.hash && location.hash !== "#home" && location.hash !== "";\n' +
'      \n' +
'      if (wasWrong || badHash) {\n' +
'        // 3. مسح hash غير مرغوب\n' +
'        if (badHash) {\n' +
'          try { history.replaceState(null, "", location.pathname + location.search); } catch(e){}\n' +
'        }\n' +
'        \n' +
'        // 4. إزالة active من كل الشاشات + وضعها على الرئيسية\n' +
'        document.querySelectorAll(".screen").forEach(function(s){\n' +
'          s.classList.remove("active");\n' +
'        });\n' +
'        home.classList.add("active");\n' +
'        \n' +
'        // 5. تحديث APP.currentSc\n' +
'        if (window.APP) {\n' +
'          window.APP.currentSc = "home";\n' +
'        }\n' +
'        \n' +
'        // 6. تحديث الـ nav\n' +
'        document.querySelectorAll(".nav-item").forEach(function(n){\n' +
'          n.classList.remove("active");\n' +
'        });\n' +
'        var homeNav = document.querySelector(".nav-item[onclick*=\\\'home\\\']");\n' +
'        if (homeNav) homeNav.classList.add("active");\n' +
'        \n' +
'        console.log("[v332] forced home (wrong=" + wasWrong + ", badHash=" + badHash + ")");\n' +
'      }\n' +
'    } catch(e) {\n' +
'      console.warn("[v332] error:", e);\n' +
'    }\n' +
'  }\n' +
'  \n' +
'  // تحقق عدة مرات (بعد تحميل APP، وبعد Firebase، وبعد v302)\n' +
'  setTimeout(ensureHome, 800);\n' +
'  setTimeout(ensureHome, 2000);\n' +
'  setTimeout(ensureHome, 4000);\n' +
'  \n' +
'  // عند تغيير auth (تسجيل دخول/خروج)\n' +
'  if (window.FB && window.FB.auth) {\n' +
'    window.FB.auth.onAuthStateChanged(function(){\n' +
'      setTimeout(ensureHome, 500);\n' +
'    });\n' +
'  }\n' +
'})();\n' +
'</script>\n';

var bodyEnd = h.lastIndexOf("</body>");
if (bodyEnd === -1) { console.error("❌ </body>"); process.exit(1); }
h = h.slice(0, bodyEnd) + js + h.slice(bodyEnd);

fs.writeFileSync(target, h);
console.log("✅ v332: force home on load");
console.log("  قبل:  " + before + " bytes");
console.log("  بعد:  " + h.length + " bytes");
console.log("  فرق:  +" + (h.length - before) + " bytes");
