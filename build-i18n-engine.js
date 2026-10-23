const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// 1) إزالة أي نسخة سابقة
html = html.replace(/<script id="i18n-engine">[\s\S]*?<\/script>/g, '');

// 2) محرك الترجمة
const i18nEngine = `
<script id="i18n-engine">
// ═══ i18n Engine (تحميل الترجمات + Cache) ═══
window.I18N = {
  lang: 'ar',
  translations: {},
  cache: {},
  isLoaded: false,

  // تحميل ملف الترجمة من الإنترنت أو من الكاش
  load: async function(lang) {
    if (lang === 'ar') {
      this.lang = 'ar';
      this.translations = {};
      localStorage.setItem('chizen_lang', 'ar');
      this.apply();
      return true;
    }

    // التحقق من الكاش
    var cached = localStorage.getItem('chizen_i18n_' + lang);
    if (cached) {
      try {
        this.translations = JSON.parse(cached);
        this.lang = lang;
        this.isLoaded = true;
        console.log('✅ ترجمة محملة من الكاش (' + lang + ')');
        this.apply();
        return true;
      } catch(e) {
        console.warn('كاش تالف، سيُعاد التحميل');
      }
    }

    // تحميل من الإنترنت
    try {
      var url = 'https://hzgmi.github.io/chizen-app/i18n/' + lang + '.json?v=' + Date.now();
      var res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();

      this.translations = data;
      this.lang = lang;
      this.isLoaded = true;

      // حفظ في الكاش
      localStorage.setItem('chizen_i18n_' + lang, JSON.stringify(data));
      localStorage.setItem('chizen_lang', lang);

      console.log('✅ ترجمة محملة من الإنترنت (' + lang + ')');
      this.apply();
      return true;
    } catch(e) {
      console.error('❌ فشل تحميل الترجمة:', e);
      if (window.toast) toast('فشل تحميل الترجمة، تحقق من الإنترنت', 'err');
      return false;
    }
  },

  // ترجمة نص
  t: function(key, fallback) {
    if (this.lang === 'ar' || !this.isLoaded) return fallback || key;
    return this.translations[key] || fallback || key;
  },

  // تطبيق الترجمة على العناصر التي تحمل data-i18n
  apply: function() {
    var self = this;
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var original = el.getAttribute('data-i18n-ar') || el.textContent;
      var translated = self.t(key, original);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translated;
      } else {
        el.textContent = translated;
      }
    });

    // تحديث اتجاه الصفحة
    if (this.lang === 'en') {
      document.documentElement.dir = 'ltr';
      document.body.dir = 'ltr';
    } else {
      document.documentElement.dir = 'rtl';
      document.body.dir = 'rtl';
    }

    // تحديث عناصر data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var original = el.getAttribute('data-i18n-placeholder-ar') || el.placeholder;
      el.placeholder = self.t(key, original);
    });
  }
};

// تحميل اللغة المحفوظة عند التحميل
window.addEventListener('DOMContentLoaded', function() {
  var saved = localStorage.getItem('chizen_lang') || 'ar';
  if (saved !== 'ar') {
    I18N.load(saved);
  }
});
</script>
`;
html = html.replace('</body>', i18nEngine + '\n</body>');

// 3) حفظ
fs.writeFileSync(file + '.bak_i18n_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('✅ تم إضافة محرك الترجمة i18n.');
console.log('  - I18N.load(): ' + (html.includes('load: async function') ? '✅' : '❌'));
console.log('  - I18N.t(): ' + (html.includes('t: function') ? '✅' : '❌'));
console.log('  - data-i18n support: ' + (html.includes('data-i18n') ? '✅' : '❌'));

// فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'i18n_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; console.log('❌ block #' + i); }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
