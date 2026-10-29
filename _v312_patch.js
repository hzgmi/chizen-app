const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

if (h.indexOf("v312-formal-modal") !== -1) {
  console.log("⚠️ v312 مطبق مسبقاً");
  process.exit(0);
}

var startMarker = "window.__showLoginModal = function(actionLabel, pendingAction){";
var startIdx = h.indexOf(startMarker);
if (startIdx === -1) {
  console.error("❌ start not found");
  process.exit(1);
}

function findFnEnd(str, startIdx) {
  var i = str.indexOf("{", startIdx);
  if (i === -1) return -1;
  var depth = 0, inStr = null, inLine = false, inBlock = false;
  for (; i < str.length; i++) {
    const c = str[i], n = str[i+1];
    if (inLine) { if (c === "\n") inLine = false; continue; }
    if (inBlock) { if (c === "*" && n === "/") { inBlock = false; i++; } continue; }
    if (inStr) { if (c === "\\") { i++; continue; } if (c === inStr) inStr = null; continue; }
    if (c === "/" && n === "/") { inLine = true; i++; continue; }
    if (c === "/" && n === "*") { inBlock = true; i++; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) return i + 1; }
  }
  return -1;
}

var endIdx = findFnEnd(h, startIdx);
if (endIdx === -1) {
  console.error("❌ end not found");
  process.exit(1);
}

var oldLen = endIdx - startIdx;
var newFn = fs.readFileSync("_v312_new_modal.js", "utf8");
var marker = "/* v312-formal-modal */\n";
newFn = marker + newFn;

if (newFn.endsWith(";\n")) newFn = newFn.slice(0, -1);
else if (newFn.endsWith(";")) newFn = newFn.slice(0, -1);

h = h.slice(0, startIdx) + newFn + h.slice(endIdx);

fs.writeFileSync(target, h);

console.log("✅ v312: formal guest modal");
console.log("  old function:  " + oldLen + " bytes");
console.log("  new function:  " + newFn.length + " bytes");
console.log("  قبل:  " + before + " bytes");
console.log("  بعد:  " + h.length + " bytes");
console.log("  فرق:  " + (h.length - before) + " bytes");
