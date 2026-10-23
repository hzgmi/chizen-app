const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) دالة إرسال إشعار داخلي (تُستخدم من أي مكان) ═══
const notifHelper = `
<script>
// ═══ إرسال إشعار داخلي إلى Firebase ═══
window.pushUserNotification = async function(title, body, type, data) {
  try {
    if (!window.FB || !FB.db || !FB.currentUser) return;
    await FB.db.collection('notifications').add({
      userId: FB.currentUser.uid,
      title: title,
      body: body,
      type: type || 'general',
      data: data || {},
      read: false,
      isGlobal: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    if (window.updateBadges) updateBadges();
  } catch(e) {
    console.log('Push notif error:', e);
  }
};
</script>
`;
html = html.replace('</body>', notifHelper + '\n</body>');

// ═══ 2) إضافة إشعارات تلقائية عند الحجز ═══
// في نهاية دالة saveBooking
html = html.replace(
  /(saveBooking:[\s\S]*?await FB\.db\.collection\('bookings'\)\.add\(booking\);)([\s\S]*?return true;)/,
  `$1
      
      // إشعار تلقائي للحجز
      var bookingTitle = type === 'flight' ? '✈️ حجز طيران' : type === 'bus' ? '🚌 حجز باص' : type === 'hotel' ? '🏨 حجز فندق' : '🕋 حجز حج وعمرة';
      if (window.pushUserNotification) {
        await window.pushUserNotification(
          bookingTitle + ' - قيد المراجعة',
          'تم استلام حجزك بنجاح، سنتواصل معك قريباً للتأكيد.',
          'booking',
          { bookingId: 'pending', type: type }
        );
      }
      $2`
);

// ═══ 3) إشعار تلقائي عند الطلب ═══
// في دالة confirmOrder - نبحث عن حفظ الطلب
html = html.replace(
  /(collection\('orders'\)\.add\(order\)[\s\S]*?\.then\([\s\S]*?\))(;|\})/,
  `$1
      if (window.pushUserNotification) {
        window.pushUserNotification(
          '🎉 تم استلام طلبك',
          'طلبك قيد المعالجة، سنتواصل معك قريباً للتوصيل.',
          'order',
          { orderId: ref.id }
        );
      }
      $2`
);

// ═══ 4) إشعار عند إضافة نقاط (تسجيل/إحالة/شراء) ═══
html = html.replace(
  /(await FB\.db\.collection\('users'\)\.doc\(uid\)\.update\(\{\s*loyaltyPoints: newPoints,\s*lastCheckin: today\s*\}\);)/,
  `$1
      if (window.pushUserNotification) {
        await window.pushUserNotification('🎁 +1 نقطة', 'سجلت دخولك اليومي وحصلت على نقطة!', 'points', { points: 1 });
      }`
);

// ═══ 5) إشعار عند استخدام كود الإحالة ═══
html = html.replace(
  /(input\.value = '';\s*showRefSuccess\('حصلت على 10 نقاط فوراً!'\))/,
  `if (window.pushUserNotification) {
      await window.pushUserNotification('🎟️ مبروك! +10 نقاط', 'تم استخدام كود الإحالة بنجاح.', 'referral', { points: 10 });
    }
    $1`
);

// ═══ 6) تحديث renderNotifs لعرض كل الأنواع بأيقونات مختلفة ═══
const oldRenderNotifs = /renderNotifs\s*:\s*async\s+function\s*\([^)]*\)\s*\{[\s\S]*?\n\s{2,4}\},/;
const newRenderNotifs = `renderNotifs: async function() {
    var c = document.getElementById('notif-list');
    if (!c) return;
    
    c.innerHTML = '<div class="cempty"><p>⏳ جاري التحميل...</p></div>';
    
    try {
      if (!window.FB || !FB.db) {
        c.innerHTML = '<div class="cempty"><p>غير متصل</p></div>';
        return;
      }
      
      var uid = FB.currentUser ? FB.currentUser.uid : null;
      var all = [];
      
      // 1) الإشعارات العامة (بدون userId أو isGlobal)
      try {
        var globalSnap = await FB.db.collection('notifications').orderBy('createdAt', 'desc').limit(50).get();
        globalSnap.forEach(function(doc) {
          var d = doc.data();
          d.id = doc.id;
          if (!d.userId || d.userId === uid || d.isGlobal) {
            all.push(d);
          }
        });
      } catch(e) {
        console.warn('Global notifs error:', e);
      }
      
      // ترتيب حسب التاريخ
      all.sort(function(a, b) {
        var ta = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate().getTime() : 0;
        var tb = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate().getTime() : 0;
        return tb - ta;
      });
      
      this.notifications = all;
      
      if (!all.length) {
        c.innerHTML = '<div class="cempty"><p>لا توجد إشعارات</p></div>';
        return;
      }
      
      var typeIcons = {
        'booking': '✈️',
        'order': '🛒',
        'points': '💎',
        'referral': '🎟️',
        'promo': '🎁',
        'system': '🔔',
        'general': '📢'
      };
      
      var typeColors = {
        'booking': '#3b82f6',
        'order': '#10b981',
        'points': '#8b5cf6',
        'referral': '#f59e0b',
        'promo': '#ec4899',
        'system': '#6b7280',
        'general': '#6A1B9A'
      };
      
      c.innerHTML = all.map(function(n) {
        var timeStr = '';
        if (n.createdAt && n.createdAt.toDate) {
          var diff = Math.floor((Date.now() - n.createdAt.toDate().getTime()) / 60000);
          if (diff < 1) timeStr = 'الآن';
          else if (diff < 60) timeStr = 'قبل ' + diff + ' دقيقة';
          else if (diff < 1440) timeStr = 'قبل ' + Math.floor(diff / 60) + ' ساعة';
          else timeStr = 'قبل ' + Math.floor(diff / 1440) + ' يوم';
        }
        
        var type = n.type || 'general';
        var icon = typeIcons[type] || '🔔';
        var color = typeColors[type] || '#6A1B9A';
        var isSelected = window._selectedNotifs && window._selectedNotifs.indexOf(n.id) !== -1;
        var isUnread = n.read === false;
        
        return '<div class="notif-card' + (isSelected ? ' selected' : '') + (isUnread ? ' unread' : '') + '" data-id="' + n.id + '"' +
          ' ontouchstart="notifTouchStart(event, \\'' + n.id + '\\')"' +
          ' ontouchend="notifTouchEnd(event)"' +
          ' ontouchmove="notifTouchEnd(event)"' +
          ' onclick="notifClick(event, \\'' + n.id + '\\')">' +
          '<div class="notif-checkbox"></div>' +
          '<div class="notif-content" style="display:flex; gap:12px; align-items:flex-start;">' +
            '<div style="width:38px; height:38px; border-radius:50%; background:' + color + '15; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:18px;">' + icon + '</div>' +
            '<div style="flex:1;">' +
              '<div style="color:#1f2937; font-weight:900; font-size:14px;">' + esc(n.title || '') + '</div>' +
              '<div style="color:#6b7280; font-size:13px; margin-top:4px; line-height:1.6;">' + esc(n.body || '') + '</div>' +
              (timeStr ? '<div style="color:#9ca3af; font-size:11px; margin-top:6px;">' + timeStr + '</div>' : '') +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    } catch(e) {
      console.error('Notifs error:', e);
      c.innerHTML = '<div class="cempty"><p>حدث خطأ في التحميل</p></div>';
    }
  },
`;

if (oldRenderNotifs.test(html)) {
  html = html.replace(oldRenderNotifs, newRenderNotifs);
  console.log('✅ تم تحديث renderNotifs لعرض كل الأنواع مع أيقونات.');
}

// 7) حفظ
fs.writeFileSync(file + '.bak_univnotif_' + Date.now(), original);
fs.writeFileSync(file, html);

// 8) فحص
console.log('\n═══ التحقق ═══');
console.log('  - pushUserNotification: ' + (html.includes('window.pushUserNotification') ? '✅' : '❌'));
console.log('  - إشعار عند الحجز: ' + (html.includes('bookingTitle') ? '✅' : '❌'));
console.log('  - أيقونات الأنواع: ' + (html.includes('typeIcons') ? '✅' : '❌'));

// 9) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'un_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
