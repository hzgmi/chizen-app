const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) ربط renderOrders بـ Firebase ═══
const oldRenderOrders = /renderOrders\s*:\s*function\s*\([^)]*\)\s*\{[\s\S]*?\n\s{2,4}\},/;
const newRenderOrders = `renderOrders: async function() {
    var c = document.getElementById('orders-list');
    if (!c) return;
    
    c.innerHTML = '<div class="cempty"><p>⏳ جاري التحميل...</p></div>';
    
    try {
      if (!window.FB || !FB.currentUser || !FB.getUserOrders) {
        c.innerHTML = '<div class="cempty"><p>سجل دخول لعرض طلباتك</p></div>';
        return;
      }
      
      var orders = await FB.getUserOrders();
      this.orders = orders || [];
      
      if (!this.orders.length) {
        c.innerHTML = '<div class="cempty"><p>لا توجد طلبات</p></div>';
        return;
      }
      
      var list = this.orders.slice().reverse();
      c.innerHTML = list.map(function(o) {
        var timelineHtml = APP.getTimelineHtml(o.status);
        var ic = 0;
        if (o.items) o.items.forEach(function(i) { ic += i.qty; });
        return '<div class="oc">' +
          '<div class="oh">' +
            '<div class="oi">#' + esc((o.id || '').substring(0, 14)) + '</div>' +
            '<div class="os ' + (o.status || 'pending') + '">' +
              (o.status === 'pending' ? 'قيد المعالجة' : 
               o.status === 'shipped' ? 'في الطريق' : 
               o.status === 'completed' ? 'تم التسليم' : 
               o.status === 'cancelled' ? 'ملغي' : o.status) +
            '</div>' +
          '</div>' +
          timelineHtml +
          '<div class="ob">' + (o.total || 0) + ' ر.س · ' + ic + ' منتج</div>' +
          '</div>';
      }).join('');
    } catch(e) {
      console.error('Orders error:', e);
      c.innerHTML = '<div class="cempty"><p>حدث خطأ في التحميل</p></div>';
    }
  },`;

if (oldRenderOrders.test(html)) {
  html = html.replace(oldRenderOrders, newRenderOrders);
  console.log('✅ تم تحديث renderOrders (Firebase).');
} else {
  console.log('⚠️ لم يجد renderOrders، سنجرب طريقة بديلة.');
}

// ═══ 2) ربط renderNotifs بـ Firebase ═══
const oldRenderNotifs = /renderNotifs\s*:\s*function\s*\([^)]*\)\s*\{[\s\S]*?\n\s{2,4}\},/;
const newRenderNotifs = `renderNotifs: async function() {
    var c = document.getElementById('notif-list');
    if (!c) return;
    
    c.innerHTML = '<div class="cempty"><p>⏳ جاري التحميل...</p></div>';
    
    try {
      if (!window.FB || !FB.db) {
        c.innerHTML = '<div class="cempty"><p>غير متصل</p></div>';
        return;
      }
      
      var snap = await FB.db.collection('notifications').orderBy('createdAt', 'desc').limit(50).get();
      var list = [];
      snap.forEach(function(doc) {
        var d = doc.data();
        d.id = doc.id;
        list.push(d);
      });
      
      this.notifications = list;
      
      if (!list.length) {
        c.innerHTML = '<div class="cempty"><p>لا توجد إشعارات</p></div>';
        return;
      }
      
      c.innerHTML = list.map(function(n) {
        var timeStr = '';
        if (n.createdAt && n.createdAt.toDate) {
          var diff = Math.floor((Date.now() - n.createdAt.toDate().getTime()) / 60000);
          if (diff < 1) timeStr = 'الآن';
          else if (diff < 60) timeStr = 'قبل ' + diff + ' دقيقة';
          else if (diff < 1440) timeStr = 'قبل ' + Math.floor(diff / 60) + ' ساعة';
          else timeStr = 'قبل ' + Math.floor(diff / 1440) + ' يوم';
        }
        return '<div class="oc" style="padding:15px;">' +
          '<div style="display:flex;justify-content:space-between;align-items:start;gap:10px;">' +
            '<div style="flex:1;">' +
              '<div style="color:#1f2937;font-weight:900;font-size:14px;">' + esc(n.title || '') + '</div>' +
              '<div style="color:#6b7280;font-size:13px;margin-top:6px;line-height:1.6;">' + esc(n.body || '') + '</div>' +
              (timeStr ? '<div style="color:#9ca3af;font-size:11px;margin-top:6px;">' + timeStr + '</div>' : '') +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    } catch(e) {
      console.error('Notifs error:', e);
      c.innerHTML = '<div class="cempty"><p>حدث خطأ في التحميل</p></div>';
    }
  },`;

if (oldRenderNotifs.test(html)) {
  html = html.replace(oldRenderNotifs, newRenderNotifs);
  console.log('✅ تم تحديث renderNotifs (Firebase).');
} else {
  console.log('⚠️ لم يجد renderNotifs، سنجرب طريقة بديلة.');
}

// 3) حفظ
fs.writeFileSync(file + '.bak_ordernotif_' + Date.now(), original);
fs.writeFileSync(file, html);

// 4) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'on_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { 
    errs++; 
    const errLine = (e.stderr || '').toString().match(/:(\d+)/);
    console.log('❌ block #' + i + (errLine ? ' (سطر ' + errLine[1] + ')' : '')); 
  }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
