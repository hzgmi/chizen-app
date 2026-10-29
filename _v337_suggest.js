const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

if (h.indexOf("v337-suggest-fix") !== -1) {
  console.log("⚠️ v337 مطبق مسبقاً");
  process.exit(0);
}

// ═══ 1. السلة الفارغة — أضف suggestions ═══
var emptyCartOld = "if(!this.cart.length){c.innerHTML='<div class=\"cempty\"><svg viewBox=\"0 0 24 24\"><circle cx=\"9\" cy=\"21\" r=\"1\"/><circle cx=\"20\" cy=\"21\" r=\"1\"/><path d=\"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6\"/></svg><p><span data-i18n=\"cart.empty\" data-i18n-ar=\"سلتك فارغة\">سلتك فارغة</span></p><button class=\"btn-p\" style=\"margin-top:16px;max-width:200px;\" onclick=\"APP.goTab(\\'home\\')\">تسوق الآن</button></div>';return;}";

var emptyCartNew = "if(!this.cart.length){c.innerHTML='<div class=\"cempty\"><svg viewBox=\"0 0 24 24\"><circle cx=\"9\" cy=\"21\" r=\"1\"/><circle cx=\"20\" cy=\"21\" r=\"1\"/><path d=\"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6\"/></svg><p><span data-i18n=\"cart.empty\" data-i18n-ar=\"سلتك فارغة\">سلتك فارغة</span></p><button class=\"btn-p\" style=\"margin-top:16px;max-width:200px;\" onclick=\"APP.goTab(\\'home\\')\">تسوق الآن</button></div>'+(window.__v336RenderSuggested?window.__v336RenderSuggested():'');return;}";

if (h.indexOf(emptyCartOld) !== -1) {
  h = h.replace(emptyCartOld, emptyCartNew);
  console.log("✅ 1: empty cart + suggested");
} else {
  console.log("⚠️ 1: empty cart pattern not matched (trying regex)");
  h = h.replace(/if\(!this\.cart\.length\)\{c\.innerHTML='([^']*(?:\\'[^']*)*[^']*)';return;\}/, function(match){
    // إعادة البناء بإضافة suggestions
    return match.replace(/\}\s*$/, "}+(window.__v336RenderSuggested?window.__v336RenderSuggested():'');return;}");
  });
}

// ═══ 2. نقل suggestions قبل صندوق المجموع ═══
// الحالي: c.innerHTML=html + (window.__v336RenderSuggested?...) في آخر الدالة
// الجديد: html += suggestions قبل html+='<div class="tb">'

var oldIHtml = "    c.innerHTML=html + (window.__v336RenderSuggested ? window.__v336RenderSuggested() : '');";
var newIHtml = "    c.innerHTML=html;";

if (h.indexOf(oldIHtml) !== -1) {
  h = h.replace(oldIHtml, newIHtml);
  console.log("✅ 2a: remove suggestion from c.innerHTML");
}

// إضافة suggestions قبل total box
var oldTotalBox = "html+='<div class=\"tb\">'+cp";
var newTotalBox = "html+=(window.__v336RenderSuggested?window.__v336RenderSuggested():'');html+='<div class=\"tb\">'+cp";

if (h.indexOf(oldTotalBox) !== -1) {
  h = h.replace(oldTotalBox, newTotalBox);
  console.log("✅ 2b: suggestions before total box");
} else {
  console.log("⚠️ 2b: total box pattern not matched");
}

fs.writeFileSync(target, h);
console.log("━━━━━━━━━━━━━━━━━━");
console.log("قبل:  " + before + " bytes");
console.log("بعد:  " + h.length + " bytes");
console.log("فرق:  " + (h.length - before) + " bytes");
