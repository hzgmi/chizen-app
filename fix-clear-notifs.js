const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// 1) حذف أي نسخة قديمة
html = html.replace(/clearAllNotifs\s*:\s*(?:async\s+)?function\s*\([^)]*\)\s*\{[\s\S]*?\n\s{2,4}\},/g, '');

// 2) دالة clearAllNotifs الجديدة
const clearFn = `
  clearAllNotifs: async function() {
    if (!window.FB || !FB.currentUser) {
      if (window.toast) toast('سجل دخول أولاً', 'err');
      return;
    }
    
    if (!confirm('هل تريد مسح كل الإشعارات؟')) return;
    
    try {
      var c = document.getElementById('notif-list');
      if (c) c.innerHTML = '<div class="cempty"><p>⏳ جاري المسح...</p></div>';
      
      var snap = await FB.db.collection('notifications')
        .where('userId', '==', FB.currentUser.uid)
        .get();
      
      if (snap.empty) {
        // جرب بدون فلتر userId (للإشعارات العامة)
        snap = await FB.db.collection('notifications').get();
      }
      
      var batch = FB.db.batch();
      var deleted = 0;
      snap.forEach(function(doc) {
        // احذف فقط إشعارات المستخدم أو العامة
        var d = doc.data();
        if (!d.userId || d.userId === FB.currentUser.uid || d.isGlobal) {
          batch.delete(doc.ref);
          deleted++;
        }
      });
      
      if (deleted > 0) {
        await batch.commit();
      }
      
      this.notifications = [];
      this.renderNotifs();
      if (window.updateBadges) updateBadges();
      if (window.toast) toast('✅ تم مسح ' + deleted + ' إشعار', 'suc');
      
    } catch(e) {
      console.error('Clear notifs error:', e);
      if (window.toast) toast('حدث خطأ: ' + e.message, 'err');
    }
  },
`;

// حقن قبل renderNotifs
const insertPoint = html.indexOf('renderNotifs:');
if (insertPoint !== -1) {
  html = html.slice(0, insertPoint) + clearFn + '\n  ' + html.slice(insertPoint);
  console.log('✅ تم حقن clearAllNotifs قبل renderNotifs.');
} else {
  console.log('⚠️ لم يجد renderNotifs.');
}

// 3) التأكد من أن الزر يستدعي الدالة
// (نبحث عن onclick="APP.clearAllNotifs()" ونبقيه كما هو)

// 4) حفظ
fs.writeFileSync(file + '.bak_clearnotif_' + Date.now(), original);
fs.writeFileSync(file, html);

// 5) فحص
console.log('\n═══ التحقق ═══');
console.log('  - clearAllNotifs: ' + (html.includes('clearAllNotifs: async function') ? '✅' : '❌'));
console.log('  - زر onclick: ' + (html.includes('APP.clearAllNotifs()') ? '✅' : '❌'));

// 6) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'cn_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
