const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// إزالة أي نسخة سابقة
html = html.replace(/<style id="ultra-premium-responsive">[\s\S]*?<\/style>/g, '');

const responsiveCSS = `
<style id="ultra-premium-responsive">
  /* ═══════════════════════════════════════════════
     ULTRA PREMIUM RESPONSIVE (ALL SCREENS)
     ═══════════════════════════════════════════════ */

  /* 1. الهيدر والشعار */
  .chz-main { padding: clamp(5px, 2vw, 15px) clamp(10px, 3vw, 20px) !important; }
  .chz-icons-group { padding: clamp(4px, 1.5vw, 8px) clamp(6px, 2vw, 12px) !important; gap: clamp(4px, 1.5vw, 10px) !important; border-radius: clamp(12px, 4vw, 22px) !important; }
  .chz-icon-box { width: clamp(22px, 6.5vw, 32px) !important; height: clamp(22px, 6.5vw, 32px) !important; }
  .chz-icon-box svg { width: clamp(16px, 4.5vw, 22px) !important; height: clamp(16px, 4.5vw, 22px) !important; }
  .chz-en { font-size: clamp(20px, 6.5vw, 30px) !important; }
  .chz-ar { font-size: clamp(12px, 3.5vw, 16px) !important; }
  .chz-tag { font-size: clamp(8px, 2.5vw, 11px) !important; }
  .chz-prof-avatar { width: clamp(32px, 9vw, 44px) !important; height: clamp(32px, 9vw, 44px) !important; }
  .chz-prof-avatar svg { width: clamp(16px, 4.5vw, 20px) !important; height: clamp(16px, 4.5vw, 20px) !important; }

  /* 2. شريط النقاط */
  .loy { margin: 0 clamp(10px, 3vw, 20px) clamp(10px, 3vw, 20px) !important; padding: clamp(8px, 2.5vw, 15px) !important; border-radius: clamp(12px, 4vw, 20px) !important; }
  .loy-t { font-size: clamp(10px, 2.5vw, 13px) !important; }
  .loy-p { font-size: clamp(14px, 4.5vw, 20px) !important; }
  .loy::after { font-size: clamp(9px, 2.2vw, 12px) !important; padding-right: clamp(8px, 2vw, 15px) !important; }

  /* 3. شريط البحث */
  .ss-wrapper { padding: clamp(4px, 1vw, 6px) clamp(6px, 2vw, 8px) clamp(4px, 1vw, 6px) clamp(10px, 3vw, 15px) !important; border-radius: clamp(18px, 5vw, 25px) !important; }
  .ss-input { font-size: clamp(11px, 3vw, 14px) !important; }
  .ss-wrapper::after { width: clamp(28px, 8vw, 36px) !important; height: clamp(28px, 8vw, 36px) !important; font-size: clamp(14px, 4vw, 18px) !important; }

  /* 4. الأقسام (الحلقات) */
  #cats { gap: clamp(8px, 2.5vw, 15px) !important; padding: clamp(10px, 3vw, 15px) !important; }
  .photo-cat-card { min-width: clamp(60px, 18vw, 80px) !important; }
  .photo-cat-circle { width: clamp(55px, 16vw, 75px) !important; height: clamp(55px, 16vw, 75px) !important; }
  .photo-cat-name { font-size: clamp(10px, 3vw, 13px) !important; margin-top: clamp(4px, 1.5vw, 8px) !important; }

  /* 5. شريط الحجوزات */
  .booking-row-container { margin: clamp(10px, 3vw, 20px) !important; padding: clamp(8px, 2.5vw, 15px) 0 !important; border-radius: clamp(12px, 4vw, 20px) !important; }
  .booking-icon { width: clamp(32px, 9vw, 45px) !important; height: clamp(32px, 9vw, 45px) !important; }
  .booking-icon svg { width: clamp(18px, 5vw, 24px) !important; height: clamp(18px, 5vw, 24px) !important; }
  .booking-label { font-size: clamp(9px, 2.5vw, 12px) !important; }
  .booking-divider { height: clamp(25px, 7vw, 35px) !important; }

  /* 6. الشريط السفلي */
  #bottom-nav { height: clamp(55px, 15vw, 70px) !important; }
  #bottom-nav .bn-it span { font-size: clamp(9px, 2.5vw, 12px) !important; }
  #bottom-nav .bn-it svg { width: clamp(20px, 5.5vw, 26px) !important; height: clamp(20px, 5.5vw, 26px) !important; }

  /* 7. معالجة الشاشات الصغيرة جداً (أقل من 360px) */
  @media (max-width: 360px) {
    .chz-tag { display: none !important; }
    .loy::after { display: none !important; }
    .chz-en { font-size: 18px !important; }
    .chz-ar { font-size: 11px !important; }
    .loy { justify-content: center !important; gap: 10px !important; }
    .loy-t { font-size: 9px !important; }
    .booking-label { font-size: 8px !important; }
  }

  /* 8. معالجة الشاشات الكبيرة (أكبر من 430px) */
  @media (min-width: 431px) {
    .chz-en { font-size: 34px !important; }
    .loy-p { font-size: 24px !important; }
    .photo-cat-circle { width: 85px !important; height: 85px !important; }
  }
</style>
`;

html = html.replace('</head>', responsiveCSS + '\n</head>');
fs.writeFileSync(file + '.bak_responsive_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('✅ تم تطبيق التصميم المتجاوب لجميع الشاشات.');

// فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'rp_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT' : '❌ FIX NEEDED');
