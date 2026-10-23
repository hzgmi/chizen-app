const fs = require('fs');
const path = require('path');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// 1) استخراج الكتلة 28
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0;
let blockStart = -1, blockEnd = -1, blockContent = '';

while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (i !== 28) continue;
  if (/src\s*=/.test(sc[1])) continue;
  blockStart = sc.index;
  blockEnd = sc.index + sc[0].length;
  blockContent = sc[2];
  break;
}

if (blockStart === -1) {
  console.log('❌ لم يجد الكتلة 28');
  process.exit(1);
}

console.log('📦 الكتلة 28 الأصلية: ' + blockContent.length + ' حرف');

// 2) إعادة بناء الكتلة 28 من الصفر
const cleanBlockContent = `
// ═══ App Lock System (PIN + Biometric) ═══
(function() {
  'use strict';
  
  var currentPin = '';
  var storedPin = null;
  var pinLength = 4;
  var biometricAvailable = false;
  var isLocked = false;
  var attempts = 0;
  
  // تحميل PIN المحفوظ
  function loadPin() {
    storedPin = localStorage.getItem('chizen_app_pin');
    return storedPin;
  }
  
  // عرض النقاط
  function updateDots() {
    var dots = document.querySelectorAll('.pin-dot');
    dots.forEach(function(d, idx) {
      d.classList.toggle('filled', idx < currentPin.length);
    });
  }
  
  // ضغط مفتاح
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
  
  // التحقق من PIN
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
  
  // فتح التطبيق
  function unlockApp() {
    isLocked = false;
    var screen = document.getElementById('app-lock-screen');
    if (screen) screen.classList.remove('active');
    currentPin = '';
    updateDots();
    
    var welcome = document.createElement('div');
    welcome.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:999999;padding:20px 40px;background:linear-gradient(135deg,#00d4a0,#00b380);color:#fff;border-radius:20px;font-family:Tajawal,sans-serif;font-weight:900;font-size:18px;box-shadow:0 20px 50px rgba(0,212,160,0.5);';
    welcome.textContent = '✅ مرحباً بك!';
    document.body.appendChild(welcome);
    setTimeout(function() { welcome.remove(); }, 1500);
  }
  
  // قفل التطبيق
  window.lockApp = function() {
    if (!storedPin) return;
    isLocked = true;
    var screen = document.getElementById('app-lock-screen');
    if (screen) screen.classList.add('active');
    currentPin = '';
    updateDots();
    var err = document.getElementById('lock-error');
    if (err) err.textContent = '';
    
    if (biometricAvailable) {
      var fpBtn = document.getElementById('fingerprint-btn');
      if (fpBtn) fpBtn.style.display = 'flex';
    }
  };
  
  // التحقق من دعم البصمة
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
  
  // محاولة البصمة
  window.tryFingerprint = async function() {
    if (!biometricAvailable) {
      if (window.toast) toast('البصمة غير متاحة', 'err');
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
  
  // إعداد PIN
  window.setupAppPin = function(pin) {
    if (!pin || pin.length !== 4 || !/^\\d{4}$/.test(pin)) {
      if (window.toast) toast('الرقم يجب أن يكون 4 أرقام', 'err');
      return false;
    }
    localStorage.setItem('chizen_app_pin', pin);
    storedPin = pin;
    if (window.showPinSuccess) showPinSuccess('تم تفعيل القفل بنجاح! التطبيق محمي الآن.');
    else if (window.toast) toast('✅ تم تفعيل القفل', 'suc');
    return true;
  };
  
  // إزالة PIN
  window.removeAppPin = function() {
    localStorage.removeItem('chizen_app_pin');
    storedPin = null;
    if (window.toast) toast('✅ تم إلغاء القفل', 'suc');
  };
  
  // حالة القفل
  window.isAppLocked = function() { return isLocked; };
  
  // تسجيل الخروج من شاشة القفل
  window.logoutFromLock = function() {
    if (window.chzConfirm) {
      chzConfirm('هل تريد تسجيل الخروج من الحساب؟', 'تسجيل خروج', {
        icon: 'danger',
        confirmText: 'خروج',
        cancelText: 'إلغاء',
        danger: true
      }).then(function(ok) {
        if (ok) {
          localStorage.removeItem('chizen_app_pin');
          if (window.APP && APP.logout) APP.logout();
          else location.href = 'index.html';
        }
      });
    } else if (confirm('هل تريد تسجيل الخروج؟')) {
      localStorage.removeItem('chizen_app_pin');
      if (window.APP && APP.logout) APP.logout();
      else location.href = 'index.html';
    }
  };
  
  // عند تحميل التطبيق
  window.addEventListener('load', function() {
    loadPin();
    checkBiometric();
    
    if (storedPin) {
      setTimeout(function() { lockApp(); }, 500);
    }
    
    document.addEventListener('visibilitychange', function() {
      if (document.hidden && storedPin && !isLocked) {
        lockApp();
      }
    });
  });
  
  // التحكم من الإعدادات
  window.toggleBiometric = function() {
    if (!storedPin) {
      var newPin = prompt('أدخل رقم سري مكون من 4 أرقام:');
      if (newPin && setupAppPin(newPin)) {
        return true;
      }
      return false;
    } else {
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
  };
})();
`;

// 3) إعادة بناء الكتلة
const newBlock = '<script' + sc[1] + '>' + cleanBlockContent + '</script>';
html = html.slice(0, blockStart) + newBlock + html.slice(blockEnd);

// 4) حفظ
fs.writeFileSync(file + '.bak_b28atomic_' + Date.now(), original);
fs.writeFileSync(file, html);
console.log('✅ تم إعادة بناء الكتلة 28 (' + cleanBlockContent.length + ' حرف).');

// 5) فحص Syntax
const os = require('os');
const scRe2 = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc2, j = 0, errs = 0;
while ((sc2 = scRe2.exec(html)) !== null) {
  j++;
  if (/src\s*=/.test(sc2[1])) continue;
  if (!sc2[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'b28a_' + j + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc2[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; console.log('❌ block #' + j); }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + j + ' blocks)' : '❌ ' + errs + ' errors');
