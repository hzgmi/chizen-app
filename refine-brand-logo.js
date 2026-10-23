const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// 1) حذف أي تعديل سابق
html = html.replace(/<style id="brand-refine">[\s\S]*?<\/style>/g, '');

// 2) CSS المُحسّن
const refineCSS = `
<style id="brand-refine">
  /* ═══ صف الشعار + CHIZEN ═══ */
  .chz-en-row {
    display: flex !important;
    flex-direction: row !important;   /* ترتيب LTR: الشعار أولاً (يسار) ثم CHIZEN */
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
    direction: ltr !important;        /* يجبر الترتيب من اليسار */
    margin-bottom: 1px !important;
    margin-top: -3px !important;      /* رفع الكلمة قليلاً */
  }
  
  /* ═══ الشعار (C) ═══ */
  .chz-logo {
    width: 28px !important;
    height: 28px !important;
    border-radius: 8px !important;
    background: linear-gradient(135deg, #0A1028 0%, #1A2340 100%) !important;
    border: 1.5px solid rgba(255, 39, 201, 0.4) !important;
    box-shadow: 0 2px 8px rgba(255, 39, 201, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1) !important;
    flex-shrink: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    overflow: hidden !important;
    order: -1 !important;            /* يُعرض أولاً (يسار) */
  }
  .chz-logo img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
  }
  
  /* ═══ كلمة CHIZEN ═══ */
  .chz-en {
    font-size: 22px !important;
    font-weight: 900 !important;
    font-family: 'Poppins', sans-serif !important;
    letter-spacing: 0.5px !important;
    line-height: 1 !important;
    margin: 0 !important;
    transform: translateY(-1px) !important;   /* رفع طفيف جداً للتوزان */
    order: 1 !important;             /* يُعرض ثانياً (يمين الشعار) */
  }
  
  /* ═══ "شيزن" العربية ═══ */
  .chz-ar {
    font-size: 13px !important;
    font-weight: 800 !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    line-height: 1.1 !important;
    text-align: center !important;
  }
  
  /* ═══ العبارة التعريفية ═══ */
  .chz-tag {
    font-size: 9px !important;
    margin-top: 2px !important;
    margin-bottom: 0 !important;
    line-height: 1.1 !important;
    text-align: center !important;
  }
  
  /* ═══ الحاوية العامة ═══ */
  .chz-brand-group {
    gap: 0 !important;
    padding: 0 !important;
    line-height: 1 !important;
  }
</style>
`;
html = html.replace('</head>', refineCSS + '\n</head>');

// حفظ
fs.writeFileSync(file + '.bak_brandrefine_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('✅ تم تحسين ترتيب الشعار + CHIZEN.');
console.log('  - الشعار على اليسار بجانب حرف C');
console.log('  - CHIZEN مرفوعة قليلاً للتوزان');

// فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'br_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
