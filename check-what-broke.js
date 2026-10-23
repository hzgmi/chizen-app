const fs = require('fs');
const html = fs.readFileSync('client/chizen.html', 'utf8');

console.log('════════════════════════════════════════');
console.log('  🔍 فحص ما الذي يعطل الشاشة');
console.log('════════════════════════════════════════\n');

// 1) هل #app أو #screens مخفي؟
console.log('📌 1) الحاويات الرئيسية:');
console.log('  #app: ' + (html.includes('id="app"') ? '✅' : '❌'));
console.log('  #screens: ' + (html.includes('id="screens"') ? '✅' : '❌'));
console.log('  #sc-home: ' + (html.includes('id="sc-home"') ? '✅' : '❌'));
console.log('  .screen.active: ' + (html.includes('class="screen active"') ? '✅' : '❌'));

// 2) هل هناك display:none على الشاشات الرئيسية؟
console.log('\n📌 2) display:none على الشاشات:');
const hideRegex = /\.screen\s*\{[^}]*display\s*:\s*none/;
console.log('  .screen { display: none }: ' + (hideRegex.test(html) ? '⚠️ موجود (طبيعي)' : '✅ لا'));
const appHide = /#app\s*\{[^}]*display\s*:\s*none/;
console.log('  #app { display: none }: ' + (appHide.test(html) ? '🔴 مشكلة!' : '✅ لا'));

// 3) هل init() موجودة؟
console.log('\n📌 3) init():');
console.log('  init:function: ' + (html.includes('init:function') || html.includes('init: function') ? '✅' : '❌'));
console.log('  APP.init(): ' + (html.includes('APP.init()') || html.includes('A.init()') ? '✅' : '❌'));
console.log('  DOMContentLoaded: ' + (html.includes("DOMContentLoaded") ? '✅' : '❌'));

// 4) هل هناك خطأ في localStorage؟
console.log('\n📌 4) localStorage keys:');
const lsKeys = ['chizen_app_pin', 'chizen_theme', 'chizen_lang', 'chizen_cart', 'chizen_favorites'];
lsKeys.forEach(k => console.log('  - ' + k + ': ' + (html.includes(k) ? '✅ مستخدم' : '—')));

// 5) هل firebase-config.js و firebase-service.js موجودة؟
const path = require('path');
console.log('\n📌 5) ملفات Firebase:');
['firebase-config.js', 'firebase-service.js', 'chat-widget.js', 'chizen-extra.js'].forEach(f => {
  const exists = fs.existsSync(path.join('client', f));
  console.log('  ' + (exists ? '✅' : '❌') + ' ' + f);
});

// 6) هل هناك setTimeout/setInterval يسبب مشكلة؟
console.log('\n📌 6) setTimeout/setInterval:');
const timeouts = (html.match(/setTimeout/g) || []).length;
const intervals = (html.match(/setInterval/g) || []).length;
console.log('  setTimeout: ' + timeouts);
console.log('  setInterval: ' + intervals);

// 7) هل هناك try/catch في init؟
console.log('\n📌 7) init body:');
const initStart = html.indexOf('init:function');
if (initStart !== -1) {
  const initEnd = html.indexOf('},', initStart);
  const initBody = html.slice(initStart, initEnd + 2);
  console.log(initBody.slice(0, 300).replace(/\n/g, '\n  '));
}

// 8) هل #bottom-nav أو body مخفي؟
console.log('\n📌 8) إخفاء body/bottom-nav:');
const bodyHide = /body\s*\{[^}]*display\s*:\s*none/;
console.log('  body { display: none }: ' + (bodyHide.test(html) ? '🔴 مشكلة!' : '✅ لا'));
const bnHide = /#bottom-nav\s*\{[^}]*display\s*:\s*none/;
console.log('  #bottom-nav { display: none }: ' + (bnHide.test(html) ? '⚠️ مخفي' : '✅ لا'));

// 9) هل هناك `<style>` يخفي كل شيء؟
console.log('\n📌 9) قواعد CSS عامة مخفية:');
const allHidden = html.match(/\*\s*\{[^}]*display\s*:\s*none/g);
console.log('  * { display: none }: ' + (allHidden ? '🔴 مشكلة!' : '✅ لا'));

// 10) هل z-index سالب على body؟
console.log('\n📌 10) z-index سالب:');
const negZ = html.match(/z-index\s*:\s*-\d+/g);
console.log('  z-index سالب: ' + (negZ ? '⚠️ ' + negZ.length + ' مرة' : '✅ لا'));
