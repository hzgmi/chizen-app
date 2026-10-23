const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) إضافة notifClick المفقودة ═══
if (!html.includes('window.notifClick')) {
  const notifClickFn = `
<script>
// ═══ notifClick (معالجة النقر على الإشعارات) ═══
window.notifClick = function(event, id) {
  if (window._longPressTriggered) {
    window._longPressTriggered = false;
    return;
  }
  if (window._selectMode) {
    window.toggleNotifSelection(id);
    return;
  }
  // النقر العادي: عرض تفاصيل الإشعار
  if (window.APP && APP.notifications) {
    var notif = APP.notifications.find(function(n) { return n.id === id; });
    if (notif && window.showSuccess) {
      showSuccess({
        title: notif.title || 'إشعار',
        message: notif.body || '',
        btn: 'حسناً'
      });
    }
  }
};
</script>
`;
  html = html.replace('</body>', notifClickFn + '\n</body>');
  console.log('✅ تم إضافة notifClick.');
}

// ═══ 2) ربط openTheme بالتبديل الجديد ═══
// نستبدل openTheme القديمة بنسخة تستدعي toggleThemeMode
const oldOpenTheme = /openTheme\s*:\s*function\s*\([^)]*\)\s*\{[\s\S]*?\n\s{2,4}\},/;
const newOpenTheme = `openTheme: function() {
    // استدعاء التبديل الفوري بين داكن/فاتح
    if (window.toggleThemeMode) {
      window.toggleThemeMode();
    }
  },`;

if (oldOpenTheme.test(html)) {
  html = html.replace(oldOpenTheme, newOpenTheme);
  console.log('✅ تم ربط openTheme بـ toggleThemeMode.');
}

// ═══ 3) ربط openLang بتغيير فعلي (إعادة تحميل) ═══
const oldOpenLang = /openLang\s*:\s*function\s*\([^)]*\)\s*\{[\s\S]*?\n\s{2,4}\},/;
const newOpenLang = `openLang: function() {
    var self = this;
    var current = localStorage.getItem('chizen_lang') || 'ar';
    var langs = [
      { v: 'ar', l: '🇾🇪 العربية' },
      { v: 'en', l: '🇬🇧 English' }
    ];
    this.openModal('اختر اللغة', langs, current, function(v) {
      if (v === current) return;
      localStorage.setItem('chizen_lang', v);
      self.state.lang = v;
      self.saveState();
      self.toast(v === 'ar' ? '🇾🇪 تم تفعيل العربية' : '🇬🇧 English activated', 'suc');
      // إعادة تحميل لتفعيل الترجمة (إذا وجدت)
      setTimeout(function() { location.reload(); }, 800);
    });
  },`;

if (oldOpenLang.test(html)) {
  html = html.replace(oldOpenLang, newOpenLang);
  console.log('✅ تم تحسين openLang.');
}

// ═══ 4) ربط openFont بتغيير فعلي لحجم الخط ═══
const oldOpenFont = /openFont\s*:\s*function\s*\([^)]*\)\s*\{[\s\S]*?\n\s{2,4}\},/;
const newOpenFont = `openFont: function() {
    var self = this;
    var current = localStorage.getItem('chizen_fontsize') || 'medium';
    var sizes = [
      { v: 'small', l: '🔤 صغير' },
      { v: 'medium', l: '🔤 متوسط (افتراضي)' },
      { v: 'large', l: '🔤 كبير' }
    ];
    this.openModal('حجم الخط', sizes, current, function(v) {
      localStorage.setItem('chizen_fontsize', v);
      self.state.fontSize = v;
      self.saveState();
      var body = document.body;
      body.style.fontSize = v === 'small' ? '14px' : v === 'large' ? '18px' : '16px';
      self.toast('✓ تم تغيير حجم الخط', 'suc');
    });
  },`;

if (oldOpenFont.test(html)) {
  html = html.replace(oldOpenFont, newOpenFont);
  console.log('✅ تم تحسين openFont.');
}

// ═══ 5) تطبيق حجم الخط المحفوظ عند التحميل ═══
const fontInitScript = `
<script>
// تطبيق الإعدادات المحفوظة عند التحميل
window.addEventListener('load', function() {
  var fontSize = localStorage.getItem('chizen_fontsize');
  if (fontSize) {
    document.body.style.fontSize = fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px';
  }
});
</script>
`;
html = html.replace('</body>', fontInitScript + '\n</body>');
console.log('✅ تم تطبيق حجم الخط المحفوظ عند التحميل.');

// 6) حفظ
fs.writeFileSync(file + '.bak_linksettings_' + Date.now(), original);
fs.writeFileSync(file, html);

// 7) فحص
console.log('\n═══ التحقق ═══');
console.log('  - notifClick: ' + (html.includes('window.notifClick') ? '✅' : '❌'));
console.log('  - openTheme (محدثة): ' + (html.includes('استدعاء التبديل الفوري') ? '✅' : '❌'));
console.log('  - openLang (محدثة): ' + (html.includes('chizen_lang') ? '✅' : '❌'));
console.log('  - openFont (محدثة): ' + (html.includes('chizen_fontsize') ? '✅' : '❌'));

// 8) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'lk_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
