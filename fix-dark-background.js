const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// إزالة أي نسخة سابقة
html = html.replace(/<style id="force-dark-bg">[\s\S]*?<\/style>/g, '');

// CSS لإجبار الخلفية الداكنة على كل الطبقات
const forceDarkCSS = `
<style id="force-dark-bg">
  /* ═══ إجبار الخلفية الداكنة على كل الطبقات ═══ */
  html,
  body,
  #app,
  #screens,
  .screen,
  #sc-home,
  #sc-cart,
  #sc-orders,
  #sc-profile,
  #sc-settings,
  #sc-points,
  #sc-favorites,
  #sc-notifications,
  #sc-help,
  #sc-booking,
  #sc-details,
  #sc-checkout,
  #sc-cat,
  #sc-addresses,
  #sc-wishlist,
  #sc-success {
    background: transparent !important;
    background-color: transparent !important;
    background-image: none !important;
  }
  
  /* لكن نضع الخلفية الداكنة على html/body */
  html, body {
    background: radial-gradient(ellipse at top, #040b31 0%, #02051b 50%, #00010a 100%) !important;
    background-attachment: fixed !important;
  }
  
  /* إزالة أي خلفية بيضاء من الأقسام الداخلية */
  .sec, .sec *, 
  #sc-home > *:not(.chz-main):not(.chz-banner):not(.booking-row-container),
  #sc-home > div:not(.chz-main):not(.chz-banner):not(.booking-row-container) {
    background-color: transparent !important;
  }
  
  /* البطاقات فقط داكنة شفافة */
  .loy, .sw, .ss-wrapper, .booking-row-container,
  .cat-i, .photo-cat-circle, .notif-card, .oc,
  .ch, .cs, .tb, .bank, .booking-form, .cd, .sg, .ph,
  .pt-btn-card, .pts-package, .pt-a, .sit, .sh2 {
    background: rgba(7, 23, 71, 0.55) !important;
  }
  
  /* إزالة أي خلفية بيضاء من البحث */
  .sw, .sb, .search, #global-search {
    background: rgba(7, 23, 71, 0.7) !important;
  }
  
  /* إزالة أي خلفية بيضاء من الحقول */
  input, textarea, select, .fi {
    background: rgba(7, 23, 71, 0.6) !important;
    color: #f8f9ff !important;
  }
  
  /* النصوص البيضاء على داكن */
  .pt-num, .pt-hn, .loy-p, .ci-p, .det-p,
  .price, .pt-ap, .tt, .total, .tf span {
    color: #ff27c9 !important;
  }
  
  /* الخلفية العامة لكل الشاشات بدون استثناء */
  #sc-home::before,
  #sc-cart::before,
  #sc-orders::before {
    content: none !important;
    background: none !important;
  }
  
  /* إجبار أي خلفية فاتحة على الاختفاء */
  [style*="background: #f"],
  [style*="background:#f"],
  [style*="background: white"],
  [style*="background:white"],
  [style*="background:#fff"],
  [style*="background: #fff"],
  [style*="background-color: white"],
  [style*="background-color:white"] {
    background: rgba(7, 23, 71, 0.55) !important;
  }
</style>
`;
html = html.replace('</head>', forceDarkCSS + '\n</head>');

// حفظ
fs.writeFileSync(file + '.bak_forcebg_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('✅ تم فرض الخلفية الداكنة على كل الطبقات.');

// فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'fbg_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
