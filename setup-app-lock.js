const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) إزالة أي نسخة سابقة ═══
html = html.replace(/<style id="app-lock-css">[\s\S]*?<\/style>/g, '');
html = html.replace(/<script id="app-lock-js">[\s\S]*?<\/script>/g, '');
html = html.replace(/<!-- ═══ APP LOCK SCREEN ═══ -->[\s\S]*?<!-- ═══ END APP LOCK ═══ -->/g, '');

// ═══ 2) CSS لشاشة القفل ═══
const lockCSS = `
<style id="app-lock-css">
  #app-lock-screen {
    position: fixed; inset: 0;
    background: radial-gradient(ellipse at top, #040b31 0%, #02051b 50%, #00010a 100%);
    z-index: 999999;
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 30px 20px;
    text-align: center;
  }
  #app-lock-screen.active { display: flex; }
  
  .lock-logo {
    width: 90px; height: 90px;
    border-radius: 24px;
    background: linear-gradient(135deg, #ff27c9, #8d24ff);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 15px 40px rgba(255, 39, 201, 0.5);
    animation: lockPulse 2s infinite;
  }
  @keyframes lockPulse {
    0%, 100% { transform: scale(1); box-shadow: 0 15px 40px rgba(255, 39, 201, 0.5); }
    50% { transform: scale(1.05); box-shadow: 0 20px 50px rgba(255, 39, 201, 0.7); }
  }
  .lock-logo svg { width: 45px; height: 45px; stroke: #fff; }
  
  .lock-title {
    font-size: 24px; font-weight: 900;
    color: #f8f9ff;
    margin-bottom: 8px;
    font-family: 'Tajawal', sans-serif;
  }
  .lock-subtitle {
    font-size: 14px;
    color: #b8c5ee;
    margin-bottom: 30px;
    font-family: 'Tajawal', sans-serif;
  }
  
  /* PIN Dots */
  .pin-dots {
    display: flex; gap: 12px;
    margin-bottom: 30px;
  }
  .pin-dot {
    width: 18px; height: 18px;
    border-radius: 50%;
    background: rgba(120, 150, 255, 0.2);
    border: 2px solid rgba(255, 39, 201, 0.3);
    transition: all 0.2s;
  }
  .pin-dot.filled {
    background: #ff27c9;
    border-color: #ff27c9;
    box-shadow: 0 0 15px rgba(255, 39, 201, 0.6);
  }
  
  /* PIN Pad */
  .pin-pad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    max-width: 280px;
    width: 100%;
  }
  .pin-key {
    height: 65px;
    background: rgba(7, 23, 71, 0.7);
    border: 1px solid rgba(120, 150, 255, 0.3);
    border-radius: 16px;
    color: #f8f9ff;
    font-size: 24px;
    font-weight: 700;
    font-family: 'Tajawal', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }
  .pin-key:active {
    transform: scale(0.92);
    background: rgba(255, 39, 201, 0.2);
    border-color: #ff27c9;
  }
  .pin-key.empty { visibility: hidden; }
  .pin-key.delete { background: rgba(255, 77, 109, 0.2); border-color: #ff4d6d; color: #ff4d6d; }
  
  /* Fingerprint button */
  .fingerprint-btn {
    width: 80px; height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff27c9, #8d24ff);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 20px auto;
    box-shadow: 0 10px 30px rgba(255, 39, 201, 0.4);
    transition: transform 0.2s;
  }
  .fingerprint-btn:active { transform: scale(0.92); }
  .fingerprint-btn svg { width: 40px; height: 40px; stroke: #fff; }
  
  .lock-error {
    color: #ff4d6d;
    font-size: 13px;
    margin-top: 15px;
    font-weight: 700;
    min-height: 18px;
    font-family: 'Tajawal', sans-serif;
  }
  
  .lock-link {
    color: #b8c5ee;
    font-size: 13px;
    margin-top: 25px;
    text-decoration: underline;
    cursor: pointer;
    font-family: 'Tajawal', sans-serif;
  }
</style>
`;
html = html.replace('</head>', lockCSS + '\n</head>');

// ═══ 3) HTML شاشة القفل ═══
const lockHTML = `
<!-- ═══ APP LOCK SCREEN ═══ -->
<div id="app-lock-screen">
  <div class="lock-logo">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  </div>
  
  <div class="lock-title">التطبيق مقفل</div>
  <div class="lock-subtitle" id="lock-subtitle">أدخل رقمك السري أو استخدم البصمة</div>
  
  <!-- PIN Dots -->
  <div class="pin-dots" id="pin-dots">
    <div class="pin-dot"></div>
    <div class="pin-dot"></div>
    <div class="pin-dot"></div>
    <div class="pin-dot"></div>
  </div>
  
  <!-- PIN Pad -->
  <div class="pin-pad" id="pin-pad">
    <div class="pin-key" onclick="lockPress('1')">1</div>
    <div class="pin-key" onclick="lockPress('2')">2</div>
    <div class="pin-key" onclick="lockPress('3')">3</div>
    <div class="pin-key" onclick="lockPress('4')">4</div>
    <div class="pin-key" onclick="lockPress('5')">5</div>
    <div class="pin-key" onclick="lockPress('6')">6</div>
    <div class="pin-key" onclick="lockPress('7')">7</div>
    <div class="pin-key" onclick="lockPress('8')">8</div>
    <div class="pin-key" onclick="lockPress('9')">9</div>
    <div class="pin-key empty"></div>
    <div class="pin-key" onclick="lockPress('0')">0</div>
    <div class="pin-key delete" onclick="lockPress('del')">⌫</div>
  </div>
  
  <!-- Fingerprint -->
  <button class="fingerprint-btn" id="fingerprint-btn" onclick="tryFingerprint()" style="display:none;">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/>
      <path d="M5 19.5C5.5 18 6 15 6 12c0-3.3 2.7-6 6-6s6 2.7 6 6c0 3-.5 6-.5 7.5"/>
      <path d="M8.5 19.5c.5-2 .5-5 .5-7.5 0-1.7 1.3-3 3-3s3 1.3 3 3c0 2.5 0 5.5-.5 7.5"/>
    </svg>
  </button>
  
  <div class="lock-error" id="lock-error"></div>
  <div class="lock-link" onclick="logoutFromLock()">تسجيل خروج</div>
</div>
<!-- ═══ END APP LOCK ═══ -->
`;
html = html.replace('</body>', lockHTML + '\n</body>');

// ═══ 4) JavaScript نظام القفل ═══
const lockJS = `
<script id="app-lock-js">
// ═══ App Lock System (PIN + Biometric) ═══
(function() {
  'use strict';
  
  var currentPin = '';
  var storedPin = null;
  var pinLength = 4;
  var biometricAvailable = false;
  var isLocked = false;
  var attempts = 0;
  
  // ═══ تحميل PIN المحفوظ ═══
  function loadPin() {
    storedPin = localStorage.getItem('chizen_app_pin');
    return storedPin;
  }
  
  // ═══ عرض النقاط ═══
  function updateDots() {
    var dots = document.querySelectorAll('.pin-dot');
    dots.forEach(function(d, i) {
      d.classList.toggle('filled', i < currentPin.length);
    });
  }
  
  // ═══ ضغط مفتاح ═══
  window.lockPress = function(key) {
    var err = document.getElementById('lock-error');
    if (err) err.textContent = '';
    
    if (key === 'del') {
      currentPin = currentPin.slice(0, -1);
    } else if (currentPin.length < pinLength) {
      currentPin += key;
      if (navigator.vibrate) navigator.vibrate(10);
    }
    
    updateDots();
    
    if (currentPin.length === pinLength) {
      setTimeout(checkPin, 200);
    }
  };
  
  // ═══ التحقق من PIN ═══
  function checkPin() {
    if (currentPin === storedPin) {
      unlockApp();
    } else {
      attempts++;
      var err = document.getElementById('lock-error');
      if (err) err.textContent = 'رقم سري خاطئ (' + attempts + '/3)';
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      
      currentPin = '';
      updateDots();
      
      if (attempts >= 3) {
        var err2 = document.getElementById('lock-error');
        if (err2) err2.textContent = 'محاولات كثيرة! أعد المحاولة بعد 30 ثانية';
        document.querySelectorAll('.pin-key').forEach(function(k) { k.style.pointerEvents = 'none'; });
        setTimeout(function() {
          attempts = 0;
          document.querySelectorAll('.pin-key').forEach(function(k) { k.style.pointerEvents = ''; });
          var err3 = document.getElementById('lock-error');
          if (err3) err3.textContent = '';
        }, 30000);
      }
    }
  }
  
  // ═══ فتح التطبيق ═══
  function unlockApp() {
    isLocked = false;
    var screen = document.getElementById('app-lock-screen');
    if (screen) screen.classList.remove('active');
    currentPin = '';
    updateDots();
    if (window.toast) toast('✅ مرحباً بك', 'suc');
  }
  
  // ═══ قفل التطبيق ═══
  window.lockApp = function() {
    if (!storedPin) return;
    isLocked = true;
    var screen = document.getElementById('app-lock-screen');
    if (screen) screen.classList.add('active');
    currentPin = '';
    updateDots();
    var err = document.getElementById('lock-error');
    if (err) err.textContent = '';
    
    // إظهار زر البصمة إذا كان متاحاً
    if (biometricAvailable) {
      var fpBtn = document.getElementById('fingerprint-btn');
      if (fpBtn) fpBtn.style.display = 'flex';
    }
  };
  
  // ═══ التحقق من دعم البصمة ═══
  async function checkBiometric() {
    if (window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      try {
        biometricAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (biometricAvailable) {
          var fpBtn = document.getElementById('fingerprint-btn');
          if (fpBtn) fpBtn.style.display = 'flex';
        }
      } catch(e) {}
    }
  }
  
  // ═══ محاولة البصمة ═══
  window.tryFingerprint = async function() {
    if (!biometricAvailable) {
      if (window.toast) toast('البصمة غير متاحة على هذا الجهاز', 'err');
      return;
    }
    
    try {
      var challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      
      var cred = await navigator.credentials.create({
        publicKey: {
          challenge: challenge,
          rp: { name: 'CHIZEN' },
          user: {
            id: new Uint8Array(16),
            name: 'user@chizen.com',
            displayName: 'CHIZEN User'
          },
          pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required'
          },
          timeout: 60000
        }
      });
      
      if (cred) unlockApp();
    } catch(e) {
      var err = document.getElementById('lock-error');
      if (err) err.textContent = 'فشلت البصمة';
    }
  };
  
  // ═══ إعداد PIN ═══
  window.setupAppPin = function(pin) {
    if (!pin || pin.length !== 4 || !/^\\d{4}$/.test(pin)) {
      if (window.toast) toast('الرقم يجب أن يكون 4 أرقام', 'err');
      return false;
    }
    localStorage.setItem('chizen_app_pin', pin);
    storedPin = pin;
    if (window.toast) toast('✅ تم تعيين الرقم السري', 'suc');
    return true;
  };
  
  // ═══ إزالة PIN ═══
  window.removeAppPin = function() {
    localStorage.removeItem('chizen_app_pin');
    storedPin = null;
    if (window.toast) toast('✅ تم إلغاء القفل', 'suc');
  };
  
  // ═══ التحقق من حالة القفل ═══
  window.isAppLocked = function() {
    return isLocked;
  };
  
  // ═══ تسجيل الخروج من شاشة القفل ═══
  window.logoutFromLock = function() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
      localStorage.removeItem('chizen_app_pin');
      if (window.APP && APP.logout) APP.logout();
      else location.href = 'index.html';
    }
  };
  
  // ═══ عند تحميل التطبيق ═══
  window.addEventListener('load', function() {
    loadPin();
    checkBiometric();
    
    // إذا كان هناك PIN محفوظ → اقفل التطبيق
    if (storedPin) {
      setTimeout(function() { lockApp(); }, 500);
    }
    
    // اقفل عند العودة من الخلفية (إذا كان هناك PIN)
    document.addEventListener('visibilitychange', function() {
      if (document.hidden && storedPin && !isLocked) {
        lockApp();
      }
    });
  });
  
  // ═══ التحكم من الإعدادات ═══
  window.toggleBiometric = function() {
    if (!storedPin) {
      // لم يُعد PIN بعد
      var newPin = prompt('أدخل رقم سري مكون من 4 أرقام:');
      if (newPin && setupAppPin(newPin)) {
        return true;
      }
      return false;
    } else {
      // موجود → اسأل عن إزالته
      if (confirm('هل تريد إلغاء قفل التطبيق؟')) {
        removeAppPin();
        return false;
      }
      return true;
    }
  };
})();
</script>
`;
html = html.replace('</body>', lockJS + '\n</body>');

// ═══ 5) ربط زر togBio بالقفل الجديد ═══
// نستبدل دالة togBio القديمة
const oldTogBio = /togBio\s*:\s*function\s*\([^)]*\)\s*\{[\s\S]*?\n\s{2,4}\},/;
const newTogBio = `togBio: function() {
    if (window.toggleBiometric) {
      var result = window.toggleBiometric();
      // تحديث المفتاح البصري
      var bioSwitch = document.getElementById('t-bio');
      if (bioSwitch) {
        if (result) bioSwitch.classList.add('on');
        else bioSwitch.classList.remove('on');
      }
    }
  },`;

if (oldTogBio.test(html)) {
  html = html.replace(oldTogBio, newTogBio);
  console.log('✅ تم ربط togBio بنظام القفل.');
}

// 6) حفظ
fs.writeFileSync(file + '.bak_applock_' + Date.now(), original);
fs.writeFileSync(file, html);

// 7) فحص
console.log('\n═══ التحقق ═══');
console.log('  - شاشة القفل: ' + (html.includes('id="app-lock-screen"') ? '✅' : '❌'));
console.log('  - lockPress: ' + (html.includes('window.lockPress') ? '✅' : '❌'));
console.log('  - lockApp: ' + (html.includes('window.lockApp') ? '✅' : '❌'));
console.log('  - setupAppPin: ' + (html.includes('window.setupAppPin') ? '✅' : '❌'));
console.log('  - tryFingerprint: ' + (html.includes('window.tryFingerprint') ? '✅' : '❌'));

// 8) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'lock_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; console.log('❌ block #' + i + ': ' + (e.stderr || '').toString().split('\n')[0]); }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
