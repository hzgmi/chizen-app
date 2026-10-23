const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) إضافة CSS لشاشة النجاح ═══
html = html.replace(/<style id="pin-success-css">[\s\S]*?<\/style>/g, '');
const successCSS = `
<style id="pin-success-css">
  #pin-success-overlay {
    position: fixed;
    inset: 0;
    background: radial-gradient(ellipse at top, #040b31 0%, #02051b 50%, #00010a 100%);
    z-index: 1000000;
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 30px 20px;
    text-align: center;
  }
  #pin-success-overlay.active {
    display: flex;
    animation: successFadeIn 0.4s ease-out;
  }
  @keyframes successFadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  
  /* دائرة النجاح */
  .pin-success-circle {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00d4a0, #00b380);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    box-shadow: 
      0 20px 50px rgba(0, 212, 160, 0.5),
      0 0 80px rgba(0, 212, 160, 0.3),
      inset 0 2px 0 rgba(255, 255, 255, 0.3);
    animation: successPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
  }
  @keyframes successPop {
    0% { transform: scale(0); opacity: 0; }
    70% { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }
  .pin-success-circle::before {
    content: '';
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    border: 3px solid rgba(0, 212, 160, 0.4);
    animation: successRing 1.5s infinite;
  }
  @keyframes successRing {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  .pin-success-circle svg {
    width: 70px;
    height: 70px;
    stroke: #fff;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: successCheck 0.6s 0.4s forwards;
    filter: drop-shadow(0 2px 5px rgba(0,0,0,0.2));
  }
  @keyframes successCheck {
    to { stroke-dashoffset: 0; }
  }
  
  /* النص */
  .pin-success-title {
    font-size: 28px;
    font-weight: 900;
    color: #f8f9ff;
    margin-bottom: 12px;
    font-family: 'Tajawal', sans-serif;
    background: linear-gradient(135deg, #00d4a0, #00dfff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: successTextGlow 2s ease-in-out infinite;
  }
  @keyframes successTextGlow {
    0%, 100% { filter: drop-shadow(0 0 10px rgba(0, 212, 160, 0.5)); }
    50% { filter: drop-shadow(0 0 20px rgba(0, 212, 160, 0.9)); }
  }
  
  .pin-success-message {
    font-size: 15px;
    color: #b8c5ee;
    margin-bottom: 40px;
    font-family: 'Tajawal', sans-serif;
    max-width: 300px;
    line-height: 1.6;
  }
  
  /* زر "تم التفعيل" */
  .pin-success-btn {
    background: linear-gradient(135deg, #00d4a0, #00b380);
    color: #fff;
    border: none;
    border-radius: 18px;
    padding: 18px 50px;
    font-family: 'Tajawal', sans-serif;
    font-size: 17px;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 
      0 10px 30px rgba(0, 212, 160, 0.4),
      0 0 0 0 rgba(0, 212, 160, 0.7);
    transition: all 0.3s;
    animation: successBtnPulse 2s infinite;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  @keyframes successBtnPulse {
    0%, 100% { box-shadow: 0 10px 30px rgba(0, 212, 160, 0.4), 0 0 0 0 rgba(0, 212, 160, 0.7); }
    50% { box-shadow: 0 10px 30px rgba(0, 212, 160, 0.6), 0 0 0 15px rgba(0, 212, 160, 0); }
  }
  .pin-success-btn:active {
    transform: scale(0.96);
  }
  .pin-success-btn svg {
    width: 22px;
    height: 22px;
    stroke: currentColor;
    stroke-width: 3;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  
  /* تأثير الجزيئات المحتفلة */
  .pin-confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #ff27c9;
    border-radius: 50%;
    animation: confettiFall 2s ease-out forwards;
    pointer-events: none;
  }
  @keyframes confettiFall {
    0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
</style>
`;
html = html.replace('</head>', successCSS + '\n</head>');

// ═══ 2) إضافة شاشة النجاح HTML ═══
html = html.replace(/<!-- ═══ PIN SUCCESS OVERLAY ═══ -->[\s\S]*?<!-- ═══ END PIN SUCCESS ═══ -->/g, '');
const successHTML = `
<!-- ═══ PIN SUCCESS OVERLAY ═══ -->
<div id="pin-success-overlay">
  <div class="pin-success-circle">
    <svg viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  </div>
  <div class="pin-success-title">تم التفعيل بنجاح! 🎉</div>
  <div class="pin-success-message" id="pin-success-message">أصبح التطبيق محمياً الآن. سيُطلب منك الرمز السري عند كل فتح.</div>
  <button class="pin-success-btn" onclick="hidePinSuccess()">
    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
    تم، فهمت
  </button>
</div>
<!-- ═══ END PIN SUCCESS ═══ -->
`;
html = html.replace('</body>', successHTML + '\n</body>');

// ═══ 3) تحديث دالة setupAppPin لعرض الشاشة الجديدة ═══
const oldSetup = /window\.setupAppPin\s*=\s*function\s*\([^)]*\)\s*\{[\s\S]*?return true;\s*\}/;
const newSetup = `window.setupAppPin = function(pin) {
    if (!pin || pin.length !== 4 || !/^\\d{4}$/.test(pin)) {
      if (window.toast) toast('الرقم يجب أن يكون 4 أرقام', 'err');
      return false;
    }
    localStorage.setItem('chizen_app_pin', pin);
    storedPin = pin;
    showPinSuccess('تم تفعيل القفل بنجاح! التطبيق محمي الآن.');
    return true;
  }`;

if (oldSetup.test(html)) {
  html = html.replace(oldSetup, newSetup);
  console.log('✅ تم تحديث setupAppPin ليعرض شاشة النجاح.');
}

// ═══ 4) تحديث unlockApp (عند فتح التطبيق) ═══
const oldUnlock = /function unlockApp\s*\(\)\s*\{[\s\S]*?\n\s*\}/;
const newUnlock = `function unlockApp() {
    isLocked = false;
    var screen = document.getElementById('app-lock-screen');
    if (screen) screen.classList.remove('active');
    currentPin = '';
    updateDots();
    
    // عرض شاشة النجاح للترحيب (اختياري - يمكن تعطيلها)
    var welcome = document.createElement('div');
    welcome.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:999999;padding:20px 40px;background:linear-gradient(135deg,#00d4a0,#00b380);color:#fff;border-radius:20px;font-family:Tajawal,sans-serif;font-weight:900;font-size:18px;box-shadow:0 20px 50px rgba(0,212,160,0.5);animation:successPop 0.5s;';
    welcome.textContent = '✅ مرحباً بك!';
    document.body.appendChild(welcome);
    setTimeout(function() { welcome.remove(); }, 1500);
  }`;

if (oldUnlock.test(html)) {
  html = html.replace(oldUnlock, newUnlock);
  console.log('✅ تم تحديث unlockApp لعرض رسالة ترحيب.');
}

// ═══ 5) إضافة دالة showPinSuccess ═══
if (!html.includes('window.showPinSuccess')) {
  const successJS = `
<script>
// ═══ إظهار شاشة النجاح ═══
window.showPinSuccess = function(message) {
  var overlay = document.getElementById('pin-success-overlay');
  var msg = document.getElementById('pin-success-message');
  if (msg && message) msg.textContent = message;
  if (overlay) overlay.classList.add('active');
  
  // إطلاق القصاصات الملونة
  spawnConfetti();
  
  // اهتزاز احتفالي
  if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 100]);
};

window.hidePinSuccess = function() {
  var overlay = document.getElementById('pin-success-overlay');
  if (overlay) overlay.classList.remove('active');
};

// ═══ القصاصات الملونة ═══
function spawnConfetti() {
  var overlay = document.getElementById('pin-success-overlay');
  if (!overlay) return;
  
  var colors = ['#ff27c9', '#8d24ff', '#00dfff', '#00d4a0', '#ff8b45', '#FFD700'];
  for (var i = 0; i < 30; i++) {
    setTimeout(function() {
      var c = document.createElement('div');
      c.className = 'pin-confetti';
      c.style.left = Math.random() * 100 + '%';
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.width = (Math.random() * 8 + 6) + 'px';
      c.style.height = c.style.width;
      c.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
      c.style.animationDelay = Math.random() * 0.3 + 's';
      overlay.appendChild(c);
      setTimeout(function() { c.remove(); }, 2500);
    }, i * 30);
  }
}
</script>
`;
  html = html.replace('</body>', successJS + '\n</body>');
  console.log('✅ تم إضافة showPinSuccess + confetti.');
}

// 6) حفظ
fs.writeFileSync(file + '.bak_pinsuccess_' + Date.now(), original);
fs.writeFileSync(file, html);

// 7) فحص
console.log('\n═══ التحقق ═══');
console.log('  - pin-success-overlay: ' + (html.includes('id="pin-success-overlay"') ? '✅' : '❌'));
console.log('  - showPinSuccess: ' + (html.includes('window.showPinSuccess') ? '✅' : '❌'));
console.log('  - confetti: ' + (html.includes('spawnConfetti') ? '✅' : '❌'));
console.log('  - زر "تم، فهمت": ' + (html.includes('تم، فهمت') ? '✅' : '❌'));

// 8) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'ps_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; console.log('❌ block #' + i); }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
