const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// 1) حذف أي نسخة سابقة
html = html.replace(/<!-- ═══ شريط تحديد الإشعارات ═══ -->[\s\S]*?<!-- ═══ نهاية شريط التحديد ═══ -->/g, '');
html = html.replace(/<style id="notif-select-css">[\s\S]*?<\/style>/g, '');
html = html.replace(/\/\/ ═══ نظام تحديد الإشعارات ═══[\s\S]*?\/\/ ═══ نهاية نظام التحديد ═══/g, '');

// 2) CSS
const css = `
<style id="notif-select-css">
  /* شريط التحديد العلوي */
  #notif-select-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    background: linear-gradient(135deg, #6A1B9A, #D81B60);
    color: #fff;
    padding: 15px 20px;
    z-index: 9000;
    display: none;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 20px rgba(106, 27, 154, 0.4);
    transform: translateY(-100%);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  #notif-select-bar.active {
    display: flex;
    transform: translateY(0);
  }
  #notif-select-bar .sel-count {
    font-size: 15px;
    font-weight: 900;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  #notif-select-bar .sel-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: #fff;
    padding: 8px 14px;
    border-radius: 10px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.2s;
  }
  #notif-select-bar .sel-btn:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.3);
  }
  #notif-select-bar .sel-btn.danger {
    background: rgba(220, 38, 38, 0.9);
  }

  /* بطاقة الإشعار */
  .notif-card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 15px;
    background: #ffffff;
    border-radius: 14px;
    margin-bottom: 10px;
    border: 1px solid #f0eaf5;
    transition: all 0.2s;
    cursor: pointer;
    position: relative;
  }
  .notif-card.selected {
    background: #fdf2f8;
    border-color: #D81B60;
    box-shadow: 0 4px 15px rgba(216, 27, 96, 0.15);
  }

  /* دائرة التحديد */
  .notif-checkbox {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
    margin-top: 2px;
  }
  .notif-card.selected .notif-checkbox {
    background: linear-gradient(135deg, #6A1B9A, #D81B60);
    border-color: transparent;
  }
  .notif-checkbox svg {
    width: 14px;
    height: 14px;
    stroke: #fff;
    stroke-width: 3;
    fill: none;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .notif-card.selected .notif-checkbox svg {
    opacity: 1;
  }

  /* محتوى الإشعار */
  .notif-content {
    flex: 1;
    min-width: 0;
  }
  .notif-title {
    font-size: 14px;
    font-weight: 900;
    color: #1f2937;
    margin-bottom: 5px;
  }
  .notif-body {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 6px;
  }
  .notif-time {
    font-size: 11px;
    color: #9ca3af;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  /* إخفاء زر مسح الكل القديم */
  #sc-notifications .sh2 button[onclick*="clearAllNotifs"] {
    display: none !important;
  }
</style>
`;
html = html.replace('</head>', css + '\n</head>');
console.log('✅ تم حقن CSS.');

// 3) شريط التحديد HTML
const selectBarHTML = `
<!-- ═══ شريط تحديد الإشعارات ═══ -->
<div id="notif-select-bar">
  <div class="sel-count">
    <span id="notif-selected-count">0</span>
    <span>محدد</span>
  </div>
  <div style="display: flex; gap: 8px;">
    <button class="sel-btn" onclick="selectAllNotifs()">تحديد الكل</button>
    <button class="sel-btn danger" onclick="deleteSelectedNotifs()">
      🗑️ حذف
    </button>
    <button class="sel-btn" onclick="exitSelectionMode()" style="background: rgba(0,0,0,0.2);">×</button>
  </div>
</div>
<!-- ═══ نهاية شريط التحديد ═══ -->
`;
html = html.replace('</body>', selectBarHTML + '\n</body>');
console.log('✅ تم حقن شريط التحديد.');

// 4) JavaScript
const selectJS = `
<script>
// ═══ نظام تحديد الإشعارات ═══
(function() {
  'use strict';

  window.notifSelectionMode = false;
  window.selectedNotifIds = new Set();
  window.currentNotifs = [];

  window.enterSelectionMode = function() {
    window.notifSelectionMode = true;
    var bar = document.getElementById('notif-select-bar');
    if (bar) bar.classList.add('active');
    document.body.style.paddingTop = '70px';
    renderNotifCards();
  };

  window.exitSelectionMode = function() {
    window.notifSelectionMode = false;
    window.selectedNotifIds.clear();
    var bar = document.getElementById('notif-select-bar');
    if (bar) bar.classList.remove('active');
    document.body.style.paddingTop = '';
    renderNotifCards();
  };

  window.toggleNotifSelection = function(id) {
    if (window.selectedNotifIds.has(id)) {
      window.selectedNotifIds.delete(id);
    } else {
      window.selectedNotifIds.add(id);
    }
    updateSelectedCount();
    renderNotifCards();
  };

  window.selectAllNotifs = function() {
    if (!window.currentNotifs) return;
    if (window.selectedNotifIds.size === window.currentNotifs.length) {
      window.selectedNotifIds.clear();
    } else {
      window.currentNotifs.forEach(function(n) {
        if (n.id) window.selectedNotifIds.add(n.id);
      });
    }
    updateSelectedCount();
    renderNotifCards();
  };

  window.updateSelectedCount = function() {
    var el = document.getElementById('notif-selected-count');
    if (el) el.textContent = window.selectedNotifIds.size;
  };

  window.renderNotifCards = function() {
    var c = document.getElementById('notif-list');
    if (!c) return;
    
    var notifs = window.currentNotifs || [];
    
    if (notifs.length === 0) {
      c.innerHTML = '<div class="cempty" style="padding:40px 20px;text-align:center;"><div style="font-size:60px;">🔔</div><p style="color:#6b7280;margin-top:15px;">لا توجد إشعارات</p></div>';
      return;
    }
    
    c.innerHTML = notifs.map(function(n) {
      var isSelected = window.selectedNotifIds.has(n.id);
      var timeStr = '';
      if (n.createdAt) {
        try {
          var d = n.createdAt.toDate ? n.createdAt.toDate() : new Date(n.createdAt);
          var diff = Math.floor((Date.now() - d.getTime()) / 60000);
          if (diff < 1) timeStr = 'الآن';
          else if (diff < 60) timeStr = 'قبل ' + diff + ' دقيقة';
          else if (diff < 1440) timeStr = 'قبل ' + Math.floor(diff / 60) + ' ساعة';
          else timeStr = 'قبل ' + Math.floor(diff / 1440) + ' يوم';
        } catch(e) {}
      }
      
      var longPressStart = 0;
      var longPressTimer = null;
      
      return '<div class="notif-card ' + (isSelected ? 'selected' : '') + '" ' +
        'data-id="' + n.id + '" ' +
        'onclick="handleNotifClick(event, \\'' + n.id + '\\')" ' +
        'onmousedown="handleNotifPressStart(event, \\'' + n.id + '\\')" ' +
        'onmouseup="handleNotifPressEnd(event)" ' +
        'onmouseleave="handleNotifPressEnd(event)" ' +
        'ontouchstart="handleNotifPressStart(event, \\'' + n.id + '\\')" ' +
        'ontouchend="handleNotifPressEnd(event)" ' +
        '>' +
        '<div class="notif-checkbox">' +
          '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>' +
        '</div>' +
        '<div class="notif-content">' +
          '<div class="notif-title">' + escapeHtml(n.title || '') + '</div>' +
          '<div class="notif-body">' + escapeHtml(n.body || '') + '</div>' +
          (timeStr ? '<div class="notif-time">🕐 ' + timeStr + '</div>' : '') +
        '</div>' +
        '</div>';
    }).join('');
  };

  window.escapeHtml = function(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, function(m) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
  };

  window.handleNotifPressStart = function(e, id) {
    if (window.notifSelectionMode) return;
    window._pressTimer = setTimeout(function() {
      window.enterSelectionMode();
      window.toggleNotifSelection(id);
    }, 500);
  };

  window.handleNotifPressEnd = function(e) {
    if (window._pressTimer) {
      clearTimeout(window._pressTimer);
      window._pressTimer = null;
    }
  };

  window.handleNotifClick = function(e, id) {
    if (window.notifSelectionMode) {
      e.preventDefault();
      e.stopPropagation();
      window.toggleNotifSelection(id);
    }
  };

  window.deleteSelectedNotifs = async function() {
    if (window.selectedNotifIds.size === 0) {
      if (window.toast) toast('اختر إشعاراً واحداً على الأقل', 'err');
      return;
    }
    
    if (!confirm('حذف ' + window.selectedNotifIds.size + ' إشعار؟')) return;
    
    if (!window.FB || !FB.db) {
      if (window.toast) toast('غير متصل', 'err');
      return;
    }
    
    try {
      var batch = FB.db.batch();
      var count = 0;
      window.selectedNotifIds.forEach(function(id) {
        batch.delete(FB.db.collection('notifications').doc(id));
        count++;
      });
      await batch.commit();
      
      // حذف من القائمة المحلية
      window.currentNotifs = window.currentNotifs.filter(function(n) {
        return !window.selectedNotifIds.has(n.id);
      });
      
      window.selectedNotifIds.clear();
      window.updateSelectedCount();
      
      if (window.currentNotifs.length === 0) {
        window.exitSelectionMode();
      } else {
        window.renderNotifCards();
      }
      
      if (window.updateBadges) window.updateBadges();
      if (window.toast) toast('✅ تم حذف ' + count + ' إشعار', 'suc');
      
    } catch(e) {
      console.error('Delete error:', e);
      if (window.toast) toast('خطأ في الحذف', 'err');
    }
  };

  // تحديث renderNotifs الأصلية لاستخدام currentNotifs
  var originalRenderNotifs = window.APP && window.APP.renderNotifs;
  
  // override بعد تحميل APP
  setTimeout(function() {
    if (window.APP && window.APP.renderNotifs) {
      window.APP.renderNotifs = async function() {
        var c = document.getElementById('notif-list');
        if (!c) return;
        
        c.innerHTML = '<div class="cempty" style="padding:40px;text-align:center;"><p>⏳ جاري التحميل...</p></div>';
        
        try {
          if (!window.FB || !FB.db) {
            c.innerHTML = '<div class="cempty"><p>غير متصل</p></div>';
            return;
          }
          
          var snap = await FB.db.collection('notifications').orderBy('createdAt', 'desc').limit(100).get();
          var list = [];
          snap.forEach(function(doc) {
            var d = doc.data();
            d.id = doc.id;
            list.push(d);
          });
          
          window.currentNotifs = list;
          this.notifications = list;
          
          if (window.notifSelectionMode) {
            window.renderNotifCards();
          } else {
            window.renderNotifCards();
          }
          
        } catch(e) {
          console.error('Notifs error:', e);
          c.innerHTML = '<div class="cempty" style="padding:40px;text-align:center;"><p>حدث خطأ</p></div>';
        }
      };
    }
  }, 100);

})();
</script>
`;
html = html.replace('</body>', selectJS + '\n</body>');
console.log('✅ تم حقن JavaScript.');

// 5) حفظ
fs.writeFileSync(file + '.bak_notifselect_' + Date.now(), original);
fs.writeFileSync(file, html);

// 6) فحص
console.log('\n═══ التحقق ═══');
console.log('  - شريط التحديد: ' + (html.includes('id="notif-select-bar"') ? '✅' : '❌'));
console.log('  - CSS: ' + (html.includes('notif-select-css') ? '✅' : '❌'));
console.log('  - enterSelectionMode: ' + (html.includes('window.enterSelectionMode') ? '✅' : '❌'));
console.log('  - deleteSelectedNotifs: ' + (html.includes('window.deleteSelectedNotifs') ? '✅' : '❌'));

// 7) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'ns_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
