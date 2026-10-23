const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) إضافة نافذة إدخال PIN فاخرة (HTML + CSS) ═══
html = html.replace(/<style id="pin-setup-css">[\s\S]*?<\/style>/g, '');
html = html.replace(/<!-- ═══ PIN SETUP OVERLAY ═══ -->[\s\S]*?<!-- ═══ END PIN SETUP ═══ -->/g, '');

const pinSetupCSS = `
<style id="pin-setup-css">
  #pin-setup-overlay {
    position: fixed; inset: 0;
    background: rgba(2, 5, 27, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 9999999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  #pin-setup-overlay.active { display: flex; }
  
  #pin-setup-box {
    background: linear-gradient(135deg, #040b31, #25074c);
    border: 1px solid rgba(255, 39, 201, 0.3);
    border-radius: 24px;
    padding: 28px 24px;
    max-width: 360px;
    width: 100%;
    text-align: center;
    box-shadow: 0 25px 70px rgba(255, 39, 201, 0.35);
    animation: pinSetupPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  @keyframes pinSetupPop {
    0% { transform: scale(0.85); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .pin-setup-icon {
    width: 70px; height: 70px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff27c9, #8d24ff);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 18px;
    box-shadow: 0 8px 25px rgba(255, 39, 201, 0.4);
  }
  .pin-setup-icon svg {
    width: 36px; height: 36px;
    stroke: #fff;
    stroke-width: 2.5;
    fill: none;
  }
  
  .pin-setup-title {
    font-size: 20px;
    font-weight: 900;
    color: #f8f9ff;
    margin-bottom: 8px;
    font-family: 'Tajawal', sans-serif;
  }
  .pin-setup-desc {
    font-size: 13px;
    color: #b8c5ee;
    line-height: 1.6;
    margin-bottom: 20px;
    font-family: 'Tajawal', sans-serif;
  }
  
  .pin-setup-input {
    width: 100%;
    padding: 18px;
    background: rgba(7, 23, 71, 0.7);
    border: 2px solid rgba(255, 39, 201, 0.3);
    border-radius: 16px;
    color: #f8f9ff;
    font-family: 'Poppins', monospace;
    font-size: 28px;
    font-weight: 900;
    letter-spacing: 15px;
    text-align: center;
    outline: none;
    margin-bottom: 15px;
    box-sizing: border-box;
  }
  .pin-setup-input:focus {
    border-color: #ff27c9;
    box-shadow: 0 0 0 4px rgba(255, 39, 201, 0.15);
  }
  .pin-setup-input::placeholder {
    color: #6b7ba8;
    letter-spacing: 15px;
  }
  
  .pin-setup-hint {
    font-size: 11px;
    color: #6b7ba8;
    margin-bottom: 20px;
    font-family: 'Tajawal', sans-serif;
  }
  
  .pin-setup-actions {
    display: flex;
    gap: 10px;
  }
  .pin-setup-btn {
    flex: 1;
    padding: 14px;
    border: none;
    border-radius: 14px;
    font-family: 'Tajawal', sans-serif;
    font-size: 15px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s;
  }
  .pin-setup-btn:active { transform: scale(0.96); }
  .pin-setup-btn.confirm {
    background: linear-gradient(135deg, #ff27c9, #8d24ff);
    color: #fff;
    box-shadow: 0 6px 20px rgba(255, 39, 201, 0.4);
  }
  .pin-setup-btn.cancel {
    background: rgba(7, 23, 71, 0.7);
    color: #b8c5ee;
    border: 1px solid rgba(120, 150, 255, 0.3);
  }
</style>
`;
html = html.replace('</head>', pinSetupCSS + '\n</head>');

const pinSetupHTML = `
<!-- ═══ PIN SETUP OVERLAY ═══ -->
<div id="pin-setup-overlay">
  <div id="pin-setup-box">
    <div class="pin-setup-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    </div>
    <div class="pin-setup-title">🔒 قفل التطبيق</div>
    <div class="pin-setup-desc">أدخل رقم سري مكون من 4 أرقام لحماية التطبيق</div>
    <input type="tel" id="pin-setup-input" class="pin-setup-input" maxlength="4" placeholder="0000" inputmode="numeric" pattern="[0-9]{4}">
    <div class="pin-setup-hint">🔑 احفظ هذا الرقم جيداً — ستحتاجه عند كل فتح</div>
    <div class="pin-setup-actions">
      <button class="pin-setup-btn cancel" onclick="closePinSetup()">إلغاء</button>
      <button class="pin-setup-btn confirm" onclick="confirmPinSetup()">✓ تفعيل</button>
    </div>
  </div>
</div>
<!-- ═══ END PIN SETUP ═══ -->
`;
html = html.replace('</body>', pinSetupHTML + '\n</body>');

// ═══ 2) إضافة دوال النافذة ═══
html = html.replace(/<script id="pin-setup-js">[\s\S]*?<\/script>/g, '');
const pinSetupJS = `
<script id="pin-setup-js">
// ═══ PIN Setup Dialog ═══
window.openPinSetup = function() {
  var overlay = document.getElementById('pin-setup-overlay');
  var input = document.getElementById('pin-setup-input');
  if (overlay) overlay.classList.add('active');
  if (input) {
    input.value = '';
    setTimeout(function() { input.focus(); }, 300);
  }
};

window.closePinSetup = function() {
  var overlay = document.getElementById('pin-setup-overlay');
  if (overlay) overlay.classList.remove('active');
};

window.confirmPinSetup = function() {
  var input = document.getElementById('pin-setup-input');
  if (!input) return;
  var pin = input.value.trim();
  
  if (!/^\\d{4}$/.test(pin)) {
    input.style.borderColor = '#ff4d6d';
    input.style.animation = 'shake 0.4s';
    setTimeout(function() {
      input.style.borderColor = '';
      input.style.animation = '';
    }, 500);
    if (window.toast) toast('أدخل 4 أرقام بالضبط', 'err');
    return;
  }
  
  closePinSetup();
  
  // استدعاء setupAppPin
  if (window.setupAppPin) {
    if (setupAppPin(pin)) {
      // تحديث المفتاح البصري في الإعدادات
      var bioSwitch = document.getElementById('t-bio');
      if (bioSwitch) bioSwitch.classList.add('on');
    }
  }
};

// Enter للحفظ، ESC للإلغاء
document.addEventListener('keydown', function(e) {
  var overlay = document.getElementById('pin-setup-overlay');
  if (!overlay || !overlay.classList.contains('active')) return;
  if (e.key === 'Enter') confirmPinSetup();
  if (e.key === 'Escape') closePinSetup();
});
</script>
`;
html = html.replace('</body>', pinSetupJS + '\n</body>');

// ═══ 3) تحديث toggleBiometric لاستخدام النافذة الجديدة بدلاً من prompt ═══
const oldToggle = /window\.toggleBiometric\s*=\s*function\s*\([^)]*\)\s*\{[\s\S]*?\n\s*\}/;
const newToggle = `window.toggleBiometric = function() {
    if (!storedPin) {
      // لم يُعد PIN بعد → افتح نافذة الإدخال الفاخرة
      if (window.openPinSetup) {
        openPinSetup();
        return true;
      }
      return false;
    } else {
      // موجود → اسأل عن إزالته
      if (window.chzConfirm) {
        chzConfirm('هل تريد إلغاء قفل التطبيق؟', 'إلغاء القفل', {
          icon: 'lock',
          confirmText: 'نعم، إلغاء',
          cancelText: 'إبقاء القفل',
          danger: true
        }).then(function(ok) {
          if (ok) {
            removeAppPin();
            var bioSwitch = document.getElementById('t-bio');
            if (bioSwitch) bioSwitch.classList.remove('on');
          }
        });
      } else if (confirm('هل تريد إلغاء قفل التطبيق؟')) {
        removeAppPin();
        return false;
      }
      return true;
    }
  }`;

if (oldToggle.test(html)) {
  html = html.replace(oldToggle, newToggle);
  console.log('✅ تم تحديث toggleBiometric لاستخدام النافذة الفاخرة.');
}

// 4) حفظ
fs.writeFileSync(file + '.bak_pinsetup_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('\n═══ التحقق ═══');
console.log('  - pin-setup-overlay: ' + (html.includes('id="pin-setup-overlay"') ? '✅' : '❌'));
console.log('  - openPinSetup: ' + (html.includes('window.openPinSetup') ? '✅' : '❌'));
console.log('  - confirmPinSetup: ' + (html.includes('window.confirmPinSetup') ? '✅' : '❌'));

// 5) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'psetup_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
