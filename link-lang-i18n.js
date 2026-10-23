const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');

// استبدال setLanguage القديمة
html = html.replace(
  /window\.setLanguage\s*=\s*function\s*\([^)]*\)\s*\{[\s\S]*?\}\s*;/,
  `window.setLanguage = function(lang) {
    var overlay = document.getElementById('lang-modal-overlay');
    if (overlay) overlay.remove();
    
    if (lang === 'ar') {
      localStorage.setItem('chizen_lang', 'ar');
      if (window.toast) toast('🇾🇪 تم تفعيل العربية', 'suc');
      setTimeout(function() { location.reload(); }, 700);
      return;
    }
    
    // تحميل الترجمة من الإنترنت/الكاش
    if (window.toast) toast('⏳ جاري تحميل الترجمة...', 'suc');
    
    if (window.I18N) {
      I18N.load(lang).then(function(ok) {
        if (ok) {
          if (window.toast) toast('✅ تم تفعيل English', 'suc');
        }
      });
    }
  };`
);

fs.writeFileSync(file, html);
console.log('✅ تم ربط زر اللغة بمحرك الترجمة i18n.');
