const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// إزالة أي نسخة سابقة من التصميم الجديد
html = html.replace(/<style id="ultra-premium-ui">[\s\S]*?<\/style>/g, '');

const newCSS = `
<style id="ultra-premium-ui">
  /* ═══════════════════════════════════════════════
     ULTRA PREMIUM UI (MATCHING THE NEW DESIGN)
     ═══════════════════════════════════════════════ */

  /* 1. شريط الإعلانات العلوي */
  .chz-banner, .top-marquee {
    background: linear-gradient(90deg, #ff5e00 0%, #ff007f 35%, #0055ff 70%, #00ccff 100%) !important;
    border-radius: 20px !important;
    margin: 10px 15px !important;
    padding: 10px 15px !important;
    height: 45px !important;
    box-shadow: 0 8px 25px rgba(0, 85, 255, 0.3) !important;
    border: 1px solid rgba(255,255,255,0.2) !important;
  }
  .chz-marquee-content { display: flex; align-items: center; gap: 10px; }

  /* 2. الهيدر (الشعار والأيقونات) */
  .chz-main {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    padding: 5px 15px 15px !important;
  }
  
  /* مربع الأيقونات (يسار) */
  .chz-icons-group {
    background: rgba(10, 15, 40, 0.8) !important;
    border: 1px solid rgba(255, 61, 154, 0.4) !important;
    border-radius: 22px !important;
    padding: 8px 12px !important;
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4) !important;
    backdrop-filter: blur(10px) !important;
  }
  .chz-icon-box {
    background: transparent !important;
    border: none !important;
    width: 32px !important;
    height: 32px !important;
    box-shadow: none !important;
  }
  .chz-icon-box svg { stroke: #fff !important; width: 22px !important; height: 22px !important; }
  
  /* الشعار (الوسط) */
  .chz-brand-group {
    text-align: center !important;
    flex: 1 !important;
  }
  .chz-en {
    font-size: 28px !important;
    font-weight: 900 !important;
    background: linear-gradient(90deg, #ffcc00 0%, #ff3d9a 50%, #00ccff 100%) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    letter-spacing: 1px !important;
    filter: drop-shadow(0 2px 8px rgba(255, 61, 154, 0.4));
  }
  .chz-ar {
    color: #fff !important;
    font-size: 16px !important;
    font-weight: 900 !important;
    margin: 2px 0 !important;
  }
  .chz-tag {
    color: #a0a5c0 !important;
    font-size: 11px !important;
  }

  /* المستخدم (يمين) */
  .chz-profile-group {
    background: linear-gradient(135deg, #ff3d9a, #7c3aed) !important;
    padding: 3px !important;
    border-radius: 50% !important;
    box-shadow: 0 0 15px rgba(255, 61, 154, 0.4) !important;
  }
  .chz-prof-avatar {
    width: 44px !important; height: 44px !important;
    background: #0a0a15 !important;
    border-radius: 50% !important;
  }
  .chz-prof-avatar svg { stroke: #ff3d9a !important; }
  .chz-prof-txt { display: none !important; } /* إخفاء الاسم لتبدو دائرة */

  /* 3. شريط النقاط */
  .loy {
    background: linear-gradient(90deg, #2a0845 0%, #140a2e 100%) !important;
    border: 1px solid rgba(124, 58, 237, 0.4) !important;
    border-radius: 20px !important;
    padding: 12px 15px !important;
    margin: 0 15px 15px !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.15) !important;
  }
  .loy-t { color: #fff !important; font-size: 12px !important; }
  .loy-p { color: #ff3d9a !important; font-size: 20px !important; font-weight: 900 !important; }
  
  /* قسم "اربح المزيد" - نظيف بدون تعديل HTML */
  .loy::after {
    content: '🎁 اربح المزيد من النقاط ›' !important;
    color: #a0a5c0 !important;
    font-size: 12px !important;
    font-weight: bold !important;
    border-right: 1px solid rgba(255,255,255,0.1) !important;
    padding-right: 15px !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
  }

  /* 4. شريط البحث */
  .ss-wrapper {
    background: rgba(10, 15, 40, 0.8) !important;
    border: 1.5px solid #7c3aed !important;
    border-radius: 25px !important;
    box-shadow: 0 0 15px rgba(124, 58, 237, 0.3) !important;
    padding: 6px 8px 6px 15px !important;
  }
  .ss-input { color: #fff !important; font-size: 13px !important; }
  .ss-icon { stroke: #fff !important; }
  .ss-clear {
    background: rgba(255,255,255,0.1) !important;
    border-radius: 50% !important;
    width: 24px !important; height: 24px !important;
  }
  .ss-clear svg { stroke: #fff !important; }
  /* أيقونة البحث اليمنى */
  .ss-wrapper::after {
    content: '🔍' !important;
    background: linear-gradient(135deg, #ff3d9a, #7c3aed) !important;
    width: 36px !important; height: 36px !important;
    border-radius: 50% !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    margin-left: 5px !important;
  }

  /* 5. الأقسام (حلقات التوهج) */
  .photo-cat-circle {
    border: 3px solid transparent !important;
    background: linear-gradient(#0a0a15, #0a0a15) padding-box,
                linear-gradient(45deg, #ff5e00, #ff007f, #00ccff) border-box !important;
    padding: 2px !important;
    box-shadow: 0 0 15px rgba(255, 0, 127, 0.3) !important;
  }
  .photo-cat-name { color: #fff !important; font-size: 13px !important; font-weight: 900 !important; margin-top: 8px !important; }

  /* 6. شريط الحجوزات */
  .booking-row-container {
    background: rgba(10, 15, 40, 0.9) !important;
    border: 1px solid rgba(0, 204, 255, 0.3) !important;
    border-radius: 20px !important;
    padding: 15px 10px !important;
    margin: 15px !important;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
  }
  .booking-icon {
    background: rgba(255,255,255,0.05) !important;
    border-radius: 50% !important;
    width: 45px !important; height: 45px !important;
    margin: 0 auto 5px !important;
    box-shadow: 0 0 10px rgba(255,255,255,0.1) !important;
  }
  .booking-label { color: #fff !important; font-size: 11px !important; font-weight: bold !important; }
  .booking-divider { background: rgba(255,255,255,0.1) !important; height: 35px !important; }

  /* 7. الشريط السفلي */
  #bottom-nav {
    background: rgba(5, 8, 20, 0.95) !important;
    border-top: 1px solid rgba(255, 61, 154, 0.2) !important;
    box-shadow: 0 -5px 20px rgba(0,0,0,0.5) !important;
    backdrop-filter: blur(15px) !important;
  }
  #bottom-nav .bn-it {
    color: #6b7280 !important;
    position: relative !important;
  }
  #bottom-nav .bn-it.active {
    color: #ff3d9a !important;
    text-shadow: 0 0 10px rgba(255, 61, 154, 0.5) !important;
  }
  #bottom-nav .bn-it.active::after {
    content: '' !important;
    position: absolute !important;
    bottom: 5px !important;
    width: 20px !important;
    height: 3px !important;
    background: #ff3d9a !important;
    border-radius: 3px !important;
    box-shadow: 0 0 8px #ff3d9a !important;
  }
  /* شارة السلة */
  #cart-b, .chz-badge {
    background: #ff3d9a !important;
    color: #fff !important;
    border: 2px solid #0a0a15 !important;
    box-shadow: 0 0 10px #ff3d9a !important;
  }
</style>
`;

html = html.replace('</head>', newCSS + '\n</head>');
fs.writeFileSync(file + '.bak_newdesign_' + Date.now(), original);
fs.writeFileSync(file, html);
console.log('✅ تم تطبيق التصميم الفاخر الجديد بنجاح.');

// فحص سريع للأخطاء
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'nd_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT' : '❌ FIX NEEDED');
