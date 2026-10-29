const fs = require("fs");
const target = "client/index.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

// 1. احذف زر v306-floating-guest (anchor)
var re1 = /<a href="#" id="v306-floating-guest"[\s\S]*?<\/a>/;
var match1 = h.match(re1);
if (match1) {
  h = h.replace(re1, "");
  console.log("✅ removed v306 floating anchor (" + match1[0].length + " bytes)");
} else {
  console.log("⚠️ v306 anchor not found");
}

// 2. احذف CSS v306-css
var re2 = /<style id="v306-css">[\s\S]*?<\/style>/;
var match2 = h.match(re2);
if (match2) {
  h = h.replace(re2, "");
  console.log("✅ removed v306-css (" + match2[0].length + " bytes)");
} else {
  console.log("⚠️ v306-css not found");
}

fs.writeFileSync(target, h);
console.log("━━━━━━━━━━━━━━━━━━");
console.log("قبل:  " + before + " bytes");
console.log("بعد:  " + h.length + " bytes");
console.log("فرق:  " + (h.length - before) + " bytes");
