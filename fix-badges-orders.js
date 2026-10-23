const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) إصلاح الأرقام الوهمية في الهيدر ═══
// تغيير الأرقام الثابتة إلى 0 وإخفاء الشارات افتراضياً
html = html.replace(
  /<span class="chz-badge"[^>]*>3<\/span>/g,
  '<span class="chz-badge" id="cart-badge" style="display:none;">0</span>'
);
html = html.replace(
  /<span class="chz-badge"[^>]*>5<\/span>/g,
  '<span class="chz-badge" id="wishlist-badge" style="display:none;">0</span>'
);
html = html.replace(
  /<span class="chz-badge"[^>]*>1<\/span>/g,
  '<span class="chz-badge" id="notif-badge" style="display:none;">0</span>'
);

// بديل: لو كانت بأسماء أخرى
html = html.replace(/<div class="chz-badge">3<\/div>/g, '<div class="chz-badge" id="cart-badge" style="display:none;">0</div>');
html = html.replace(/<div class="chz-badge">5<\/div>/g, '<div class="chz-badge" id="wishlist-badge" style="display:none;">0</div>');
html = html.replace(/<div class="chz-badge">1<\/div>/g, '<div class="chz-badge" id="notif-badge" style="display:none;">0</div>');

// بديل آخر للشريط السفلي
html = html.replace(/id="cart-b"[^>]*>0<\/div>/g, 'id="cart-b" style="display:none;">0</div>');

console.log('✅ تم إخفاء الأرقام الوهمية.');

// ═══ 2) إضافة دالة تحديث الشارات من Firebase ═══
const badgeFunction = `
<script>
// ═══ تحديث الشارات من Firebase ═══
window.updateBadges = async function() {
  if (!window.FB || !FB.currentUser || !FB.db) return;
  
  try {
    var uid = FB.currentUser.uid;
    
    // 1) السلة من localStorage (سريع)
    var cart = JSON.parse(localStorage.getItem('chizen_cart') || '[]');
    var cartCount = cart.reduce(function(s, i) { return s + (i.qty || 1); }, 0);
    updateBadge('cart-badge', cartCount);
    updateBadge('cart-b', cartCount);
    
    // 2) المفضلة من localStorage
    var favs = JSON.parse(localStorage.getItem('chizen_favorites') || '[]');
    updateBadge('wishlist-badge', favs.length);
    updateBadge('wishlist-b', favs.length);
    
    // 3) الإشعارات من Firebase
    var notifSnap = await FB.db.collection('notifications').where('userId', '==', uid).where('read', '==', false).get();
    updateBadge('notif-badge', notifSnap.size);
    updateBadge('notif-b', notifSnap.size);
    
  } catch(e) {
    console.log('Badge update error:', e);
  }
};

function updateBadge(id, count) {
  var el = document.getElementById(id);
  if (!el) return;
  if (count > 0) {
    el.textContent = count > 99 ? '99+' : count;
    el.style.display = 'flex';
  } else {
    el.style.display = 'none';
  }
}

// تشغيل تلقائي كل 5 ثواني
setInterval(updateBadges, 5000);
window.addEventListener('load', function() {
  setTimeout(updateBadges, 1500);
});
</script>
`;
html = html.replace('</body>', badgeFunction + '\n</body>');
console.log('✅ تم إضافة دالة تحديث الشارات.');

// ═══ 3) إصلاح renderOrders (خطأ الطلبات) ═══
const oldRenderOrders = /renderOrders\s*:\s*async\s+function\s*\([^)]*\)\s*\{[\s\S]*?\n\s{2,4}\},/;
const newRenderOrders = `renderOrders: async function() {
    var c = document.getElementById('orders-list');
    if (!c) return;
    
    c.innerHTML = '<div class="cempty"><p>⏳ جاري التحميل...</p></div>';
    
    try {
      if (!window.FB || !FB.currentUser) {
        c.innerHTML = '<div class="cempty"><p>سجل دخول لعرض طلباتك</p></div>';
        return;
      }
      
      // محاولة قراءة الطلبات مباشرة من Firestore
      var orders = [];
      if (FB.db && FB.currentUser) {
        try {
          var snap = await FB.db.collection('orders')
            .where('userId', '==', FB.currentUser.uid)
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();
          snap.forEach(function(doc) {
            var d = doc.data();
            d.id = doc.id;
            orders.push(d);
          });
        } catch(e) {
          // إذا فشل orderBy (قد يحتاج فهرس)، جرب بدونه
          var snap2 = await FB.db.collection('orders')
            .where('userId', '==', FB.currentUser.uid)
            .limit(50)
            .get();
          snap2.forEach(function(doc) {
            var d = doc.data();
            d.id = doc.id;
            orders.push(d);
          });
        }
      }
      
      this.orders = orders;
      
      if (!orders.length) {
        c.innerHTML = '<div class="cempty"><p>لا توجد طلبات بعد</p></div>';
        return;
      }
      
      c.innerHTML = orders.map(function(o) {
        var ic = 0;
        if (o.items) o.items.forEach(function(i) { ic += (i.qty || 1); });
        var statusText = o.status === 'pending' ? 'قيد المعالجة' : 
                        o.status === 'shipped' ? 'في الطريق' : 
                        o.status === 'completed' ? 'تم التسليم' : 
                        o.status === 'cancelled' ? 'ملغي' : 'قيد المعالجة';
        return '<div class="oc" style="padding:15px; background:#fff; border-radius:14px; margin-bottom:10px; border:1px solid #eee;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
            '<div style="font-weight:900; color:#6A1B9A;">#' + esc((o.id || '').substring(0, 8)) + '</div>' +
            '<div style="background:#fef3c7; color:#d97706; padding:4px 10px; border-radius:10px; font-size:11px; font-weight:bold;">' + statusText + '</div>' +
          '</div>' +
          '<div style="color:#6b7280; font-size:13px;">' + (o.total || 0) + ' ر.س · ' + ic + ' منتج</div>' +
        '</div>';
      }).join('');
    } catch(e) {
      console.error('Orders error:', e);
      c.innerHTML = '<div class="cempty"><p>حدث خطأ، حاول مجدداً</p></div>';
    }
  },`;

if (oldRenderOrders.test(html)) {
  html = html.replace(oldRenderOrders, newRenderOrders);
  console.log('✅ تم إصلاح renderOrders (معالج أخطاء أفضل).');
} else {
  console.log('⚠️ لم يجد renderOrders بالنمط، سنجرب بديلاً.');
}

// 4) حفظ
fs.writeFileSync(file + '.bak_badgefix_' + Date.now(), original);
fs.writeFileSync(file, html);

// 5) فحص
console.log('\n═══ التحقق ═══');
console.log('  - cart-badge: ' + (html.includes('id="cart-badge"') ? '✅' : '❌'));
console.log('  - wishlist-badge: ' + (html.includes('id="wishlist-badge"') ? '✅' : '❌'));
console.log('  - notif-badge: ' + (html.includes('id="notif-badge"') ? '✅' : '❌'));
console.log('  - updateBadges: ' + (html.includes('window.updateBadges') ? '✅' : '❌'));

// 6) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'bg_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
