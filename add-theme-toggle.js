const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) إضافة CSS للوضع الفاتح (يُطبق فقط عند تفعيله) ═══
html = html.replace(/<style id="light-mode-override">[\s\S]*?<\/style>/g, '');
const lightCSS = `
<style id="light-mode-override">
  /* ═══ الوضع الفاتح (يُفعّل عبر data-theme="light") ═══ */
  html[data-theme="light"] body,
  html[data-theme="light"] #app,
  html[data-theme="light"] #screens,
  html[data-theme="light"] .screen {
    background: linear-gradient(180deg, #F5EFFF 0%, #FCEBF3 50%, #F8F9FA 100%) !important;
    background-attachment: fixed !important;
    color: #1f2937 !important;
  }
  html[data-theme="light"] body::before,
  html[data-theme="light"] body::after { display: none !important; }
  
  html[data-theme="light"] .loy,
  html[data-theme="light"] .sw,
  html[data-theme="light"] .ss-wrapper,
  html[data-theme="light"] .booking-row-container,
  html[data-theme="light"] .notif-card,
  html[data-theme="light"] .oc,
  html[data-theme="light"] .ch,
  html[data-theme="light"] .cs,
  html[data-theme="light"] .tb,
  html[data-theme="light"] .booking-form,
  html[data-theme="light"] .cd,
  html[data-theme="light"] .sg,
  html[data-theme="light"] .pt-btn-card,
  html[data-theme="light"] .sit,
  html[data-theme="light"] .sh2 {
    background: #ffffff !important;
    border-color: #e5e7eb !important;
    box-shadow: 0 4px 15px rgba(106, 27, 154, 0.05) !important;
  }
  
  html[data-theme="light"] .st2,
  html[data-theme="light"] .stl,
  html[data-theme="light"] .loy-t,
  html[data-theme="light"] .sit-ti,
  html[data-theme="light"] .ci-n,
  html[data-theme="light"] .det-n {
    color: #1f2937 !important;
    -webkit-text-fill-color: #1f2937 !important;
  }
  
  html[data-theme="light"] input,
  html[data-theme="light"] textarea,
  html[data-theme="light"] select,
  html[data-theme="light"] .fi {
    background: #f4f6fa !important;
    color: #1f2937 !important;
    border-color: #e5e7eb !important;
  }
  html[data-theme="light"] input::placeholder,
  html[data-theme="light"] textarea::placeholder,
  html[data-theme="light"] .search::placeholder {
    color: #9ca3af !important;
  }
  
  html[data-theme="light"] #bottom-nav {
    background: rgba(255, 255, 255, 0.95) !important;
    border-top: 1px solid #e5e7eb !important;
  }
  html[data-theme="light"] #bottom-nav .bn-it { color: #9ca3af !important; }
  html[data-theme="light"] #bottom-nav .bn-it.active { color: #D81B60 !important; }
  html[data-theme="light"] #bottom-nav .bn-it.active svg { stroke: #D81B60 !important; filter: none; }
  
  html[data-theme="light"] .chz-main {
    background: linear-gradient(105deg, #ffffff 0%, #f8f9fa 100%) !important;
    border-color: #e5e7eb !important;
  }
  html[data-theme="light"] .chz-glass-icon {
    background: #ffffff !important;
    border-color: #e5e7eb !important;
  }
  html[data-theme="light"] .chz-glass-icon svg { stroke: #6A1B9A !important; }
  html[data-theme="light"] .chz-logo {
    background: linear-gradient(135deg, #f0f0ff, #ffffff) !important;
    border-color: #e5e7eb !important;
  }
  html[data-theme="light"] .chz-ar { color: #1f2937 !important; }
  html[data-theme="light"] .chz-tag { color: #6b7280 !important; }
  html[data-theme="light"] .chz-prof-name { color: #1f2937 !important; }
  html[data-theme="light"] .chz-prof-welcome { color: #6b7280 !important; }
  
  html[data-theme="light"] .ss-dropdown {
    background: #ffffff !important;
    box-shadow: 0 10px 40px rgba(106, 27, 154, 0.15) !important;
  }
  html[data-theme="light"] .ss-item-name { color: #1f2937 !important; }
  html[data-theme="light"] .ss-item-cat { color: #6b7280 !important; }
  html[data-theme="light"] .ss-item:hover { background: #fdf2f8 !important; }
  
  html[data-theme="light"] .booking-tab {
    background: #f4f6fa !important;
    color: #6b7280 !important;
    border-color: #e5e7eb !important;
  }
  html[data-theme="light"] .booking-tab.active {
    background: linear-gradient(135deg, #6A1B9A, #D81B60) !important;
    color: #fff !important;
  }
  html[data-theme="light"] .booking-label { color: #374151 !important; }
  
  html[data-theme="light"] .sgt {
    background: #f4f6fa !important;
    color: #6A1B9A !important;
    border-bottom: 1px solid #e5e7eb !important;
  }
  html[data-theme="light"] .sii { background: #f4f6fa !important; }
  html[data-theme="light"] .sii svg { stroke: #6A1B9A !important; }
  html[data-theme="light"] .sit-d,
  html[data-theme="light"] .mi-v { color: #6b7280 !important; }
  
  /* النوافذ المنبثقة */
  html[data-theme="light"] #ref-modal-box,
  html[data-theme="light"] #pts-purchase-modal > div,
  html[data-theme="light"] #universal-success-box,
  html[data-theme="light"] #ref-error-box,
  html[data-theme="light"] #ref-success-box,
  html[data-theme="light"] #modal .ms {
    background: #ffffff !important;
    color: #1f2937 !important;
  }
  html[data-theme="light"] #ref-modal-box .modal-title,
  html[data-theme="light"] #universal-success-title,
  html[data-theme="light"] #ref-error-box .err-title,
  html[data-theme="light"] #ref-success-box .err-title {
    color: #1f2937 !important;
  }
  html[data-theme="light"] #ref-modal-box .modal-subtitle,
  html[data-theme="light"] #universal-success-message,
  html[data-theme="light"] #ref-error-box .err-message,
  html[data-theme="light"] #ref-success-box .err-message {
    color: #6b7280 !important;
  }
  
  html[data-theme="light"] .toast {
    background: linear-gradient(135deg, #6A1B9A, #D81B60) !important;
    color: #fff !important;
  }
  
  html[data-theme="light"] .pt-hn,
  html[data-theme="light"] .pt-hl,
  html[data-theme="light"] .pt-hi { color: #fff !important; }
  
  html[data-theme="light"] .cempty { color: #6b7280 !important; }
  
  html[data-theme="light"] .photo-cat-circle {
    background: #ffffff !important;
    border-color: #e5e7eb !important;
  }
  html[data-theme="light"] .lux-cat-img {
    background: #ffffff !important;
  }
</style>
`;
html = html.replace('</head>', lightCSS + '\n</head>');

// ═══ 2) إضافة زر التبديل في الإعدادات ═══
// نبحث عن مكان مناسب داخل sc-settings
const settingsMarker = '<div class="sgt">الأمان</div>';
if (html.includes(settingsMarker)) {
  const themeToggleHTML = `
        <div class="sgt">المظهر</div>
        <div class="sit" onclick="toggleThemeMode()">
          <div class="sii">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          </div>
          <div class="sit-t">
            <div class="sit-ti">الوضع</div>
            <div class="sit-d" id="theme-mode-label">داكن فاخر</div>
          </div>
          <div class="mi-v" id="theme-mode-value" style="font-size:11px; padding:6px 12px; background:linear-gradient(135deg,#ff27c9,#8d24ff); color:#fff; border-radius:10px; font-weight:900;">🌙 داكن</div>
        </div>
`;
  html = html.replace(settingsMarker, themeToggleHTML + '\n        ' + settingsMarker);
  console.log('✅ تم إضافة زر تبديل الوضع في الإعدادات.');
} else {
  console.log('⚠️ لم يجد sgt الأمان، سنجرب الحقن بعد "الحساب".');
}

// ═══ 3) إضافة دالة التبديل ═══
const themeFunction = `
<script>
// ═══ تبديل الوضع (داكن/فاتح) ═══
window.toggleThemeMode = function() {
  var current = document.documentElement.getAttribute('data-theme') || 'dark';
  var next = current === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('chizen_theme', next);
  
  // تحديث الزر
  var label = document.getElementById('theme-mode-label');
  var value = document.getElementById('theme-mode-value');
  if (next === 'light') {
    if (label) label.textContent = 'فاتح ناعم';
    if (value) {
      value.textContent = '☀️ فاتح';
      value.style.background = 'linear-gradient(135deg,#FFD700,#FF8B45)';
    }
  } else {
    if (label) label.textContent = 'داكن فاخر';
    if (value) {
      value.textContent = '🌙 داكن';
      value.style.background = 'linear-gradient(135deg,#ff27c9,#8d24ff)';
    }
  }
  
  if (window.toast) toast(next === 'light' ? '☀️ الوضع الفاتح' : '🌙 الوضع الداكن', 'suc');
  
  // اهتزاز خفيف
  if (navigator.vibrate) navigator.vibrate(20);
};

// تطبيق الوضع المحفوظ عند التحميل
window.addEventListener('load', function() {
  var saved = localStorage.getItem('chizen_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  
  var label = document.getElementById('theme-mode-label');
  var value = document.getElementById('theme-mode-value');
  if (saved === 'light' && label) {
    label.textContent = 'فاتح ناعم';
    if (value) {
      value.textContent = '☀️ فاتح';
      value.style.background = 'linear-gradient(135deg,#FFD700,#FF8B45)';
    }
  }
});
</script>
`;
html = html.replace('</body>', themeFunction + '\n</body>');

// 4) حفظ
fs.writeFileSync(file + '.bak_themetoggle_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('✅ تم إضافة دالة تبديل الوضع.');
console.log('  - data-theme: ' + (html.includes('data-theme') ? '✅' : '❌'));
console.log('  - toggleThemeMode: ' + (html.includes('window.toggleThemeMode') ? '✅' : '❌'));
console.log('  - زر في الإعدادات: ' + (html.includes('theme-mode-value') ? '✅' : '❌'));

// 5) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'thm_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
