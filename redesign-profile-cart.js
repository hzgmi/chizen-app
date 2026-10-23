const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══════════════════════════════════════════
// 1) إعادة هيكلة "حسابي" (sc-profile)
// ═══════════════════════════════════════════
const profStart = html.indexOf('id="sc-profile"');
const profEnd = html.indexOf('<!-- SETTINGS -->', profStart);
if (profStart !== -1 && profEnd !== -1) {
  const newProfile = `id="sc-profile">
      <div class="st"></div>
      <div class="sh2"><div class="st2">👤 حسابي</div></div>
      
      <!-- بطاقة المستخدم -->
      <div class="profile-hero">
        <div class="profile-avatar-wrap">
          <div class="profile-avatar" id="prof-av">U</div>
          <button class="profile-edit-btn" onclick="APP.editProfile()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        </div>
        <div class="profile-name" id="prof-n">User</div>
        <div class="profile-email" id="prof-e">user@example.com</div>
        <div class="profile-stats">
          <div class="pstat">
            <div class="pstat-num" id="stat-orders">0</div>
            <div class="pstat-lbl">طلبات</div>
          </div>
          <div class="pstat-divider"></div>
          <div class="pstat">
            <div class="pstat-num" id="stat-favs">0</div>
            <div class="pstat-lbl">مفضلة</div>
          </div>
          <div class="pstat-divider"></div>
          <div class="pstat">
            <div class="pstat-num" id="prof-pts">0</div>
            <div class="pstat-lbl">نقطة</div>
          </div>
        </div>
      </div>

      <!-- قسم الطلبات والنشاط -->
      <div class="sg">
        <div class="sgt">📦 نشاطي</div>
        <div class="sit" onclick="APP.goTab('orders')">
          <div class="sii" style="background:rgba(59,130,246,.15);"><svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg></div>
          <div class="sit-t"><div class="sit-ti">طلباتي</div><div class="sit-d">تتبع طلباتك</div></div>
          <div class="mi-a">›</div>
        </div>
        <div class="sit" onclick="APP.goTab('favorites')">
          <div class="sii" style="background:rgba(255,39,201,.15);"><svg viewBox="0 0 24 24" fill="none" stroke="#ff27c9" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></div>
          <div class="sit-t"><div class="sit-ti">المفضلة</div><div class="sit-d">المنتجات المحفوظة</div></div>
          <div class="mi-a">›</div>
        </div>
        <div class="sit" onclick="APP.goTab('points')">
          <div class="sii" style="background:rgba(255,193,7,.15);"><svg viewBox="0 0 24 24" fill="none" stroke="#FFC107" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
          <div class="sit-t"><div class="sit-ti">نقاط الولاء</div><div class="sit-d" id="prof-pts-2">0 نقطة</div></div>
          <div class="mi-a">›</div>
        </div>
      </div>

      <!-- قسم الإعدادات والمساعدة -->
      <div class="sg">
        <div class="sgt">⚙️ الإعدادات</div>
        <div class="sit" onclick="APP.goTab('settings')">
          <div class="sii" style="background:rgba(141,36,255,.15);"><svg viewBox="0 0 24 24" fill="none" stroke="#8d24ff" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
          <div class="sit-t"><div class="sit-ti">الإعدادات</div><div class="sit-d">المظهر، الأمان، الخصوصية</div></div>
          <div class="mi-a">›</div>
        </div>
        <div class="sit" onclick="APP.goTab('help')">
          <div class="sii" style="background:rgba(0,212,160,.15);"><svg viewBox="0 0 24 24" fill="none" stroke="#00d4a0" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
          <div class="sit-t"><div class="sit-ti">المساعدة والدعم</div><div class="sit-d">تواصل معنا</div></div>
          <div class="mi-a">›</div>
        </div>
        <div class="sit" onclick="APP.logout()">
          <div class="sii" style="background:rgba(255,77,109,.15);"><svg viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div>
          <div class="sit-t"><div class="sit-ti" style="color:#ff4d6d;">تسجيل خروج</div></div>
          <div class="mi-a">›</div>
        </div>
      </div>

      <div style="padding: 20px; text-align: center; color: #6b7ba8; font-size: 11px;">CHIZEN v1.0.0</div>
    </div>
    
    `;
  html = html.slice(0, profStart) + newProfile + html.slice(profEnd);
  console.log('✅ تم إعادة هيكلة شاشة "حسابي".');
}

// ═══════════════════════════════════════════
// 2) إعادة هيكلة "السلة" (sc-cart)
// ═══════════════════════════════════════════
const cartStart = html.indexOf('id="sc-cart"');
const cartEnd = html.indexOf('<!-- CHECKOUT -->', cartStart);
if (cartStart !== -1 && cartEnd !== -1) {
  const newCart = `id="sc-cart">
      <div class="st"></div>
      <div class="sh2"><div class="st2">🛒 سلة التسوق</div></div>
      <div class="ch" id="cart-items" style="padding: 0 15px;"></div>
    </div>
    
    `;
  html = html.slice(0, cartStart) + newCart + html.slice(cartEnd);
  console.log('✅ تم إعادة هيكلة شاشة "السلة" (حذف البحث المكرر).');
}

// ═══════════════════════════════════════════
// 3) إضافة CSS للتصميم الجديد
// ═══════════════════════════════════════════
html = html.replace(/<style id="redesign-profile-cart">[\s\S]*?<\/style>/g, '');
const redesignCSS = `
<style id="redesign-profile-cart">
  /* ═══ بطاقة المستخدم (Hero) ═══ */
  .profile-hero {
    margin: 15px;
    padding: 30px 20px 20px;
    background: linear-gradient(135deg, rgba(255, 39, 201, 0.1), rgba(141, 36, 255, 0.1));
    border: 1px solid rgba(255, 39, 201, 0.2);
    border-radius: 24px;
    text-align: center;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(20px);
  }
  .profile-hero::before {
    content: '';
    position: absolute;
    top: -50px; right: -50px;
    width: 150px; height: 150px;
    background: radial-gradient(circle, rgba(255, 39, 201, 0.3), transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .profile-avatar-wrap {
    position: relative;
    display: inline-block;
    margin-bottom: 15px;
  }
  .profile-avatar {
    width: 90px; height: 90px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff27c9, #8d24ff);
    color: #fff;
    font-size: 36px;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 30px rgba(255, 39, 201, 0.4);
    border: 3px solid rgba(255, 255, 255, 0.2);
    font-family: 'Poppins', sans-serif;
  }
  .profile-edit-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff27c9, #8d24ff);
    border: 3px solid #02051b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(255, 39, 201, 0.5);
    transition: transform 0.2s;
  }
  .profile-edit-btn:active { transform: scale(0.9); }
  .profile-edit-btn svg { width: 14px; height: 14px; color: #fff; }
  
  .profile-name {
    font-size: 22px;
    font-weight: 900;
    color: #f8f9ff;
    margin-bottom: 4px;
  }
  .profile-email {
    font-size: 13px;
    color: #b8c5ee;
    margin-bottom: 20px;
  }
  
  /* إحصائيات */
  .profile-stats {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 15px 0 5px;
    border-top: 1px solid rgba(120, 150, 255, 0.16);
    margin-top: 10px;
  }
  .pstat {
    flex: 1;
    text-align: center;
  }
  .pstat-num {
    font-size: 20px;
    font-weight: 900;
    color: #ff27c9;
    line-height: 1.2;
  }
  .pstat-lbl {
    font-size: 11px;
    color: #b8c5ee;
    margin-top: 3px;
    font-weight: 700;
  }
  .pstat-divider {
    width: 1px;
    height: 30px;
    background: rgba(120, 150, 255, 0.16);
  }
  
  /* ═══ السلة ═══ */
  .ch {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  /* حالة السلة الفارغة */
  #cart-items:empty::before {
    content: '🛒\\A\\A سلتك فارغة\\A\\A ابدأ التسوق الآن';
    white-space: pre;
    display: block;
    text-align: center;
    padding: 60px 20px;
    color: #6b7ba8;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.8;
    background: rgba(7, 23, 71, 0.4);
    border: 2px dashed rgba(255, 39, 201, 0.25);
    border-radius: 20px;
    font-family: 'Tajawal', sans-serif;
  }
  
  /* عناصر السلة */
  .cart-item, .ci {
    background: rgba(7, 23, 71, 0.55) !important;
    border: 1px solid rgba(120, 150, 255, 0.16) !important;
    border-radius: 18px !important;
    padding: 15px !important;
    display: flex !important;
    gap: 12px !important;
    align-items: center !important;
    backdrop-filter: blur(15px);
  }
  
  /* شاشات صغيرة */
  @media (max-width: 400px) {
    .profile-avatar { width: 80px; height: 80px; font-size: 32px; }
    .profile-name { font-size: 20px; }
    .profile-stats { padding: 12px 0 5px; }
    .pstat-num { font-size: 18px; }
  }
</style>
`;
html = html.replace('</head>', redesignCSS + '\n</head>');

// حفظ
fs.writeFileSync(file + '.bak_redesign_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('✅ تم إعادة هيكلة الحساب والسلة.');

// فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'rd_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
