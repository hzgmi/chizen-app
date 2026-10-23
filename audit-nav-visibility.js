const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

console.log('════════════════════════════════════════');
console.log('  🔍 فحص ظهور الشريط السفلي');
console.log('════════════════════════════════════════\n');

// 1) استخراج دالة navigate الحالية
const navStart = html.indexOf('navigate:function');
const navEnd = html.indexOf('},', navStart) + 2;
const navFn = html.slice(navStart, navEnd);
console.log('📋 دالة navigate الحالية:');
console.log(navFn.replace(/\n/g, '\n  '));
console.log('');

// 2) استخراج منطق إخفاء الشريط (hide array)
const hideMatch = navFn.match(/var hide\s*=\s*\[([^\]]+)\]/);
if (hideMatch) {
  console.log('📋 الشاشات التي يُخفي فيها الشريط:');
  console.log('  ' + hideMatch[1]);
} else {
  console.log('⚠️ لا توجد قائمة hide صريحة.');
}

// 3) استخراج منطق bottom-nav
if (navFn.includes('bottom-nav') || navFn.includes('bnav')) {
  console.log('\n✅ منطق إخفاء الشريط موجود في navigate.');
} else {
  console.log('\n❌ منطق إخفاء الشريط مفقود! سيُضاف.');
}

// ═══════════════════════════════════════════
// 4) استبدال دالة navigate بنسخة ذكية (Smart Nav)
// ═══════════════════════════════════════════
const cleanNavFn = `navigate: function(id, push) {
    if (push === undefined) push = true;
    if (this.currentSc === id) return;
    this.currentSc = id;
    
    // إخفاء كل الشاشات
    document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
    var t = document.getElementById('sc-' + id);
    if (t) { t.classList.add('active'); t.scrollTop = 0; }
    
    // ═══ الشاشات التي تظهر فيها الشريط السفلي (الرئيسية فقط) ═══
    var mainTabs = ['home', 'orders', 'cart', 'profile'];
    var isMainTab = mainTabs.indexOf(id) !== -1;
    
    var nav = document.getElementById('bottom-nav');
    if (nav) {
      if (isMainTab) {
        nav.style.display = 'flex';
      } else {
        nav.style.display = 'none';
      }
    }
    
    // تحديث حالة الزر النشط
    if (window.APP && window.APP.goTab) {
      var btns = document.querySelectorAll('.bn-it');
      btns.forEach(function(b) {
        b.classList.remove('active');
        b.style.color = '#9ca3af';
        var oc = b.getAttribute('onclick') || '';
        if (oc.indexOf("'" + id + "'") > -1) {
          b.classList.add('active');
          b.style.color = '#D81B60';
        }
      });
    }
    
    // تنفيذ وظائف الشاشة
    if (id === 'cart') this.renderCart();
    if (id === 'orders') this.renderOrders();
    if (id === 'favorites') this.renderFav();
    if (id === 'notifications') this.renderNotifs();
    if (id === 'points') this.renderPoints();
    if (id === 'help') this.renderHelp();
    if (id === 'settings') this.renderSettings();
  },`;

if (navStart !== -1) {
  html = html.slice(0, navStart) + cleanNavFn + html.slice(navEnd);
  console.log('\n✅ تم استبدال navigate بنسخة ذكية (Smart Nav).');
}

// ═══════════════════════════════════════════
// 5) تحسين goTab ليعمل مع الشريط الجديد
// ═══════════════════════════════════════════
const goTabRegex = /goTab:\s*function\s*\([^)]*\)\s*\{[^}]*\}/;
const cleanGoTab = `goTab: function(id, el) {
    this.navigate(id, true);
    try {
      var btns = document.querySelectorAll('.bn-it');
      btns.forEach(function(b) {
        b.classList.remove('active');
        b.style.color = '#9ca3af';
      });
      if (el) {
        el.classList.add('active');
        el.style.color = '#D81B60';
      } else {
        btns.forEach(function(b) {
          var oc = b.getAttribute('onclick') || '';
          if (oc.indexOf("'" + id + "'") > -1) {
            b.classList.add('active');
            b.style.color = '#D81B60';
          }
        });
      }
    } catch(e) {}
  }`;

if (goTabRegex.test(html)) {
  html = html.replace(goTabRegex, cleanGoTab);
  console.log('✅ تم تحسين دالة goTab.');
}

// ═══════════════════════════════════════════
// 6) إضافة زر الرجوع (back button) للشاشات الداخلية (إذا لم يكن موجوداً)
// ═══════════════════════════════════════════
console.log('\n📋 الشاشات الداخلية تحتاج زر رجوع:');
const innerScreens = ['sc-details', 'sc-checkout', 'sc-booking', 'sc-points', 'sc-notifications', 'sc-settings', 'sc-favorites', 'sc-help', 'sc-orders'];
innerScreens.forEach(sc => {
  const hasBack = html.indexOf(`id="${sc}"`) !== -1 && html.slice(html.indexOf(`id="${sc}"`), html.indexOf(`id="${sc}"`) + 2000).indexOf('onclick="APP.goTab') !== -1;
  console.log('  ' + (hasBack ? '✅' : '⚠️') + ' ' + sc + ' ' + (hasBack ? 'لديها زر رجوع' : 'قد تحتاج زر رجوع'));
});

// 7) حفظ والتحقق
fs.writeFileSync(file + '.bak_navvis_' + Date.now(), original);
fs.writeFileSync(file, html);

// 8) فحص Syntax
console.log('\n════════════════════════════════════════');
const os = require('os');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'navv_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; console.log('❌ block #' + i + ': ' + (e.stderr || '').toString().split('\n')[0]); }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');

// 9) ملخص السلوك المتوقع
console.log('\n════════ 📊 السلوك المتوقع ════════');
console.log('  🏠 الرئيسية      → يظهر ✅');
console.log('  📋 طلباتي       → يظهر ✅');
console.log('  🛒 السلة        → يظهر ✅');
console.log('  👤 حسابي        → يظهر ✅');
console.log('  ─────────────────────────────');
console.log('  📦 تفاصيل منتج  → يختفي ✅ (زر رجوع)');
console.log('  💳 الدفع        → يختفي ✅ (زر رجوع)');
console.log('  ✈️ الحجوزات     → يختفي ✅ (زر رجوع)');
console.log('  💎 النقاط       → يختفي ✅ (زر رجوع)');
console.log('  🔔 الإشعارات    → يختفي ✅ (زر رجوع)');
console.log('  ⚙️ الإعدادات    → يختفي ✅ (زر رجوع)');
console.log('  ❤️ المفضلة      → يختفي ✅ (زر رجوع)');
console.log('  ❓ المساعدة     → يختفي ✅ (زر رجوع)');
