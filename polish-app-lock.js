const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) إزالة أي نسخة سابقة من التصميم المحسّن ═══
html = html.replace(/<style id="lock-polish-css">[\s\S]*?<\/style>/g, '');
html = html.replace(/<style id="app-lock-css">[\s\S]*?<\/style>/g, '');

// ═══ 2) CSS الفاخر الجديد ═══
const lockCSS = `
<style id="lock-polish-css">
  /* ═══════════════════════════════════════════════
     APP LOCK SCREEN (Premium Design)
     ═══════════════════════════════════════════════ */
  #app-lock-screen {
    position: fixed;
    inset: 0;
    background: radial-gradient(ellipse at top, #040b31 0%, #02051b 50%, #00010a 100%);
    z-index: 999999;
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 30px 20px;
    text-align: center;
    overflow-y: auto;
  }
  #app-lock-screen.active {
    display: flex;
    animation: lockFadeIn 0.4s ease-out;
  }
  @keyframes lockFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  /* جزيئات ضوئية في الخلفية */
  #app-lock-screen::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(255, 39, 201, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(141, 36, 255, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 50% 100%, rgba(0, 223, 255, 0.1) 0%, transparent 40%);
    pointer-events: none;
    animation: lockGlow 6s ease-in-out infinite;
  }
  @keyframes lockGlow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  
  /* محتوى الشاشة */
  #app-lock-screen > * {
    position: relative;
    z-index: 1;
  }
  
  /* الشعار الكبير */
  .lock-brand {
    font-family: 'Poppins', sans-serif;
    font-size: 32px;
    font-weight: 900;
    letter-spacing: 2px;
    background: linear-gradient(135deg, #ff27c9, #8d24ff, #00dfff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 4px 15px rgba(255, 39, 201, 0.5));
    margin-bottom: 8px;
    animation: lockShimmer 3s ease-in-out infinite;
  }
  @keyframes lockShimmer {
    0%, 100% { filter: drop-shadow(0 4px 15px rgba(255, 39, 201, 0.5)); }
    50% { filter: drop-shadow(0 4px 25px rgba(141, 36, 255, 0.8)); }
  }
  
  .lock-subtitle-brand {
    font-size: 11px;
    color: #6b7ba8;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 40px;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
  }
  
  /* قفل متحرك */
  .lock-logo {
    width: 100px;
    height: 100px;
    border-radius: 30px;
    background: linear-gradient(135deg, #ff27c9, #8d24ff);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 25px;
    box-shadow: 
      0 15px 40px rgba(255, 39, 201, 0.5),
      0 0 60px rgba(141, 36, 255, 0.3),
      inset 0 2px 0 rgba(255, 255, 255, 0.2);
    animation: lockPulse 2.5s infinite;
    position: relative;
  }
  .lock-logo::after {
    content: '';
    position: absolute;
    inset: -10px;
    border-radius: 35px;
    border: 2px solid rgba(255, 39, 201, 0.3);
    animation: lockRing 2s infinite;
  }
  @keyframes lockPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes lockRing {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.4); opacity: 0; }
  }
  .lock-logo svg {
    width: 50px;
    height: 50px;
    stroke: #fff;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  }
  
  /* العنوان والوصف */
  .lock-title {
    font-size: 26px;
    font-weight: 900;
    color: #f8f9ff;
    margin-bottom: 8px;
    font-family: 'Tajawal', sans-serif;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  }
  .lock-subtitle {
    font-size: 14px;
    color: #b8c5ee;
    margin-bottom: 25px;
    font-family: 'Tajawal', sans-serif;
    max-width: 280px;
    line-height: 1.6;
  }
  
  /* زر البصمة الكبير */
  .fingerprint-btn {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 39, 201, 0.15), rgba(141, 36, 255, 0.15));
    border: 2px solid rgba(255, 39, 201, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 0 auto 30px;
    transition: all 0.3s;
    position: relative;
    box-shadow: 0 10px 30px rgba(255, 39, 201, 0.2);
  }
  .fingerprint-btn::before {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 2px solid rgba(255, 39, 201, 0.3);
    animation: fpRing 2s infinite;
  }
  @keyframes fpRing {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.3); opacity: 0; }
  }
  .fingerprint-btn:active {
    transform: scale(0.95);
    background: linear-gradient(135deg, rgba(255, 39, 201, 0.3), rgba(141, 36, 255, 0.3));
  }
  .fingerprint-btn svg {
    width: 45px;
    height: 45px;
    stroke: #ff27c9;
    filter: drop-shadow(0 0 10px rgba(255, 39, 201, 0.5));
  }
  
  /* PIN Dots */
  .pin-dots {
    display: flex;
    gap: 16px;
    margin-bottom: 30px;
    justify-content: center;
  }
  .pin-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(120, 150, 255, 0.2);
    border: 2px solid rgba(255, 39, 201, 0.3);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .pin-dot.filled {
    background: #ff27c9;
    border-color: #ff27c9;
    box-shadow: 0 0 20px rgba(255, 39, 201, 0.8), 0 0 40px rgba(255, 39, 201, 0.4);
    transform: scale(1.2);
  }
  .pin-dot.error {
    background: #ff4d6d;
    border-color: #ff4d6d;
    box-shadow: 0 0 20px rgba(255, 77, 109, 0.8);
    animation: pinShake 0.4s;
  }
  @keyframes pinShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
  }
  
  /* PIN Pad */
  .pin-pad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    max-width: 300px;
    width: 100%;
    margin-bottom: 20px;
  }
  .pin-key {
    height: 68px;
    background: rgba(7, 23, 71, 0.7);
    border: 1px solid rgba(120, 150, 255, 0.2);
    border-radius: 18px;
    color: #f8f9ff;
    font-size: 26px;
    font-weight: 700;
    font-family: 'Poppins', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
  }
  .pin-key::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255, 39, 201, 0.4), transparent 70%);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .pin-key:active {
    transform: scale(0.92);
    background: rgba(255, 39, 201, 0.2);
    border-color: #ff27c9;
  }
  .pin-key:active::before {
    opacity: 1;
  }
  .pin-key.empty {
    visibility: hidden;
    pointer-events: none;
  }
  .pin-key.delete {
    background: rgba(255, 77, 109, 0.15);
    border-color: rgba(255, 77, 109, 0.4);
    color: #ff4d6d;
    font-size: 22px;
  }
  .pin-key.delete:active {
    background: rgba(255, 77, 109, 0.3);
  }
  
  /* الخطأ */
  .lock-error {
    color: #ff4d6d;
    font-size: 14px;
    margin-top: 10px;
    font-weight: 700;
    min-height: 22px;
    font-family: 'Tajawal', sans-serif;
    animation: errorFadeIn 0.3s;
  }
  @keyframes errorFadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* رابط تسجيل الخروج */
  .lock-link {
    color: #b8c5ee;
    font-size: 13px;
    margin-top: 25px;
    padding: 10px 20px;
    border-radius: 12px;
    cursor: pointer;
    font-family: 'Tajawal', sans-serif;
    transition: all 0.2s;
    display: inline-block;
  }
  .lock-link:hover {
    background: rgba(255, 77, 109, 0.1);
    color: #ff4d6d;
  }
  
  /* شاشات صغيرة */
  @media (max-width: 380px) {
    .lock-brand { font-size: 26px; }
    .lock-logo { width: 80px; height: 80px; }
    .lock-logo svg { width: 40px; height: 40px; }
    .lock-title { font-size: 22px; }
    .pin-key { height: 60px; font-size: 22px; }
    .fingerprint-btn { width: 75px; height: 75px; }
    .fingerprint-btn svg { width: 38px; height: 38px; }
  }
</style>
`;
html = html.replace('</head>', lockCSS + '\n</head>');

// ═══ 3) تحديث HTML الشاشة ═══
const lockHTML = `
<!-- ═══ APP LOCK SCREEN ═══ -->
<div id="app-lock-screen">
  <div class="lock-brand">CHIZEN</div>
  <div class="lock-subtitle-brand">SECURE ACCESS</div>
  
  <div class="lock-logo">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  </div>
  
  <div class="lock-title">التطبيق مقفل</div>
  <div class="lock-subtitle" id="lock-subtitle">أدخل رقمك السري للدخول</div>
  
  <!-- Fingerprint (يظهر فقط إذا كان متاحاً) -->
  <button class="fingerprint-btn" id="fingerprint-btn" onclick="tryFingerprint()" style="display:none;">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/>
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88"/>
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/>
      <path d="M2 12a10 10 0 0 1 18-6"/>
      <path d="M2 16h.01"/>
      <path d="M21.8 16c.2-2 .131-5.354 0-6"/>
      <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/>
      <path d="M8.65 22c.21-.66.45-1.32.57-2"/>
      <path d="M9 6.8a6 6 0 0 1 9 5.2v2"/>
    </svg>
  </button>
  
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
  
  <div class="lock-error" id="lock-error"></div>
  <div class="lock-link" onclick="logoutFromLock()">تسجيل الخروج من الحساب</div>
</div>
<!-- ═══ END APP LOCK ═══ -->
`;
html = html.replace(/<!-- ═══ APP LOCK SCREEN ═══ -->[\s\S]*?<!-- ═══ END APP LOCK ═══ -->/g, lockHTML);

// ═══ 4) إضافة تحديث رسالة "ضع بصمتك" عند ظهور الزر ═══
// نضيف تحديث ذكي في JS
if (!html.includes('lockUpdateSubtitle')) {
  const updateSubtitleJS = `
<script>
window.lockUpdateSubtitle = function(hasFingerprint) {
  var el = document.getElementById('lock-subtitle');
  if (!el) return;
  if (hasFingerprint) {
    el.textContent = 'ضع بصمتك أو أدخل الرقم السري';
  } else {
    el.textContent = 'أدخل رقمك السري للدخول';
  }
};
</script>
`;
  html = html.replace('</body>', updateSubtitleJS + '\n</body>');
}

// 5) حفظ
fs.writeFileSync(file + '.bak_lockpolish_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('✅ تم تطبيق التصميم الفاخر لشاشة القفل.');
console.log('  - شعار CHIZEN متوهج');
console.log('  - زر بصمة كبير مع حلقات متحركة');
console.log('  - لوحة أرقام بتصميم فاخر');
console.log('  - نقاط PIN متوهجة');
console.log('  - تأثيرات حركية ناعمة');

// 6) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'lp_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
