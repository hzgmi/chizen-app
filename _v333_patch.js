const fs = require("fs");

// ═══ 1. index.html — إعادة توجيه للرئيسية افتراضياً ═══
var ih = fs.readFileSync("client/index.html", "utf8");
var ib = ih.length;

if (ih.indexOf("v333-first-launch") === -1) {
  var redirectScript = '\n<script id="v333-first-launch">\n' +
  '  (function(){\n' +
  '    try {\n' +
  '      var params = new URLSearchParams(location.search);\n' +
  '      // إذا طلب المستخدم الدخول صراحة → ابق في صفحة الدخول\n' +
  '      if (params.get("login") === "1") return;\n' +
  '      // وإلا → الرئيسية (guest mode تلقائياً من v300)\n' +
  '      window.location.replace("chizen.html");\n' +
  '    } catch(e){}\n' +
  '  })();\n' +
  '</script>\n';
  
  var headStart = ih.indexOf("<head>");
  if (headStart === -1) { console.error("❌ head not found"); process.exit(1); }
  var insertAt = headStart + "<head>".length;
  ih = ih.slice(0, insertAt) + redirectScript + ih.slice(insertAt);
  fs.writeFileSync("client/index.html", ih);
  console.log("✅ index.html: redirect to chizen.html added | " + ib + " → " + ih.length);
} else {
  console.log("⚠️ v333 index.html مطبق مسبقاً");
}

// ═══ 2. chizen.html — تحديث أزرار "تسجيل الآن" لاستخدام ?login=1 ═══
var ch = fs.readFileSync("client/chizen.html", "utf8");
var cb = ch.length;
var changes = 0;

// أنماط: window.location.href = "index.html" أو 'index.html'
ch = ch.replace(/window\.location\.href = "index\.html"/g, function(){
  changes++;
  return 'window.location.href = "index.html?login=1"';
});
ch = ch.replace(/window\.location\.href = 'index\.html'/g, function(){
  changes++;
  return "window.location.href = 'index.html?login=1'";
});

if (changes > 0) {
  fs.writeFileSync("client/chizen.html", ch);
  console.log("✅ chizen.html: " + changes + " تحويل إلى index.html?login=1");
} else {
  console.log("ℹ️ chizen.html: no changes needed");
}

console.log("━━━━━━━━━━━━━━━━━━");
