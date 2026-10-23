const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) حذف أي نسخة سابقة ═══
html = html.replace(/<!-- ═══ النافذة الموحدة للنجاح ═══ -->[\s\S]*?<!-- ═══ نهاية النافذة الموحدة ═══ -->/g, '');
html = html.replace(/<style id="success-modal-css">[\s\S]*?<\/style>/g, '');
html = html.replace(/\/\/ ═══ showSuccess الموحدة ═══[\s\S]*?\/\/ ═══ نهاية showSuccess ═══/g, '');

// ═══ 2) CSS للنافذة ═══
const successCSS = `
<style id="success-modal-css">
  #universal-success-overlay {
    position: fixed; inset: 0;
    background: rgba(10, 5, 25, 0.75);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    z-index: 99999;
    display: none; align-items: center; justify-content: center;
    padding: 25px;
    opacity: 0; transition: opacity 0.3s;
  }
  #universal-success-overlay.active {
    display: flex; opacity: 1;
  }
  #universal-success-box {
    background: #fff;
    border-radius: 28px;
    padding: 35px 28px 28px;
    width: 100%; max-width: 380px;
    text-align: center;
    box-shadow: 0 25px 70px rgba(106, 27, 154, 0.4), 0 10px 30px rgba(216, 27, 96, 0.2);
    position: relative;
    animation: successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    overflow: hidden;
  }
  #universal-success-box::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 6px;
    background: linear-gradient(90deg, #6A1B9A, #D81B60, #FF3D9A);
  }
  @keyframes successPop {
    0% { transform: scale(0.6) translateY(30px); opacity: 0; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
  
  .success-icon-wrapper {
    width: 90px; height: 90px;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4);
    animation: successPulse 2s infinite;
    position: relative;
  }
  .success-icon-wrapper::before {
    content: '';
    position: absolute; inset: -6px;
    border-radius: 50%;
    border: 2px solid rgba(34, 197, 94, 0.3);
    animation: successRing 1.5s infinite;
  }
  @keyframes successPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes successRing {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.4); opacity: 0; }
  }
  .success-icon-wrapper svg {
    width: 45px; height: 45px;
    stroke: #fff; stroke-width: 3;
    stroke-linecap: round; stroke-linejoin: round;
    fill: none;
    animation: checkDraw 0.6s ease-out 0.3s forwards;
    stroke-dasharray: 50;
    stroke-dashoffset: 50;
  }
  @keyframes checkDraw {
    to { stroke-dashoffset: 0; }
  }
  
  .success-title {
    font-size: 22px; font-weight: 900;
    color: #1f2937;
    margin-bottom: 10px;
    line-height: 1.3;
  }
  .success-message {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.7;
    margin-bottom: 25px;
    padding: 0 5px;
  }
  .success-btn {
    background: linear-gradient(135deg, #6A1B9A, #D81B60);
    color: #fff;
    border: none; border-radius: 14px;
    padding: 15px 30px;
    font-family: inherit; font-size: 16px; font-weight: 800;
    width: 100%; cursor: pointer;
    box-shadow: 0 8px 25px rgba(216, 27, 96, 0.35);
    transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .success-btn:active { transform: scale(0.97); }
  .success-btn svg { width: 20px; height: 20px; stroke: currentColor; }
</style>
`;
html = html.replace('</head>', successCSS + '\n</head>');

// ═══ 3) HTML للنافذة ═══
const successHTML = `
<!-- ═══ النافذة الموحدة للنجاح ═══ -->
<div id="universal-success-overlay">
  <div id="universal-success-box">
    <div class="success-icon-wrapper">
      <svg viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
    <div class="success-title" id="universal-success-title">تم بنجاح!</div>
    <div class="success-message" id="universal-success-message">سنتواصل معك قريباً</div>
    <button class="success-btn" onclick="hideSuccess()">
      <span id="universal-success-btn-text">تسوق المزيد</span>
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
    </button>
  </div>
</div>
<!-- ═══ نهاية النافذة الموحدة ═══ -->
`;
html = html.replace('</body>', successHTML + '\n</body>');

// ═══ 4) JavaScript موحد ═══
const successJS = `
<script>
// ═══ showSuccess الموحدة ═══
(function() {
  'use strict';
  
  window.showSuccess = function(options) {
    // دعم الاستدعاء القديم showSuccess('عنوان', 'رسالة')
    var opts = typeof options === 'string' 
      ? { title: options, message: arguments[1] || '', btn: arguments[2] || 'تسوق المزيد' }
      : (options || {});
    
    var overlay = document.getElementById('universal-success-overlay');
    var titleEl = document.getElementById('universal-success-title');
    var msgEl = document.getElementById('universal-success-message');
    var btnEl = document.getElementById('universal-success-btn-text');
    
    if (!overlay) return;
    
    if (titleEl) titleEl.textContent = opts.title || 'تم بنجاح!';
    if (msgEl) msgEl.textContent = opts.message || '';
    if (btnEl) btnEl.textContent = opts.btn || 'تسوق المزيد';
    
    // إعادة تشغيل الأنيميشن
    var iconWrapper = overlay.querySelector('.success-icon-wrapper');
    if (iconWrapper) {
      iconWrapper.style.animation = 'none';
      setTimeout(function() { iconWrapper.style.animation = ''; }, 10);
    }
    
    overlay.classList.add('active');
    overlay.style.display = 'flex';
    
    // إجراء بعد الإغلاق (اختياري)
    window._successCallback = opts.onClose || null;
  };
  
  window.hideSuccess = function() {
    var overlay = document.getElementById('universal-success-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.style.display = 'none';
    }
    if (typeof window._successCallback === 'function') {
      var cb = window._successCallback;
      window._successCallback = null;
      cb();
    }
  };
})();
</script>
`;
html = html.replace('</body>', successJS + '\n</body>');

// ═══ 5) حفظ والتحقق ═══
fs.writeFileSync(file + '.bak_success_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('✅ تم حقن النافذة الموحدة للنجاح.');
console.log('  - universal-success-overlay: ' + (html.includes('id="universal-success-overlay"') ? '✅' : '❌'));
console.log('  - showSuccess: ' + (html.includes('window.showSuccess') ? '✅' : '❌'));
console.log('  - hideSuccess: ' + (html.includes('window.hideSuccess') ? '✅' : '❌'));

// فحص Syntax
const os = require('os');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'suc_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; console.log('❌ block #' + i + ': ' + (e.stderr || '').toString().split('\n')[0]); }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT' : '❌ ' + errs + ' errors');
