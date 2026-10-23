const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// 1) إزالة CSS قديم
html = html.replace(/<style id="settings-polish-css">[\s\S]*?<\/style>/g, '');

// 2) CSS الشامل لشاشة الإعدادات
const settingsCSS = `
<style id="settings-polish-css">
  /* ═══════════════════════════════════════════════════
     POLISH SETTINGS SCREEN
     ═══════════════════════════════════════════════════ */
  
  /* حاوية المجموعة (.sg) */
  .sg {
    background: rgba(7, 23, 71, 0.55) !important;
    backdrop-filter: blur(15px) !important;
    -webkit-backdrop-filter: blur(15px) !important;
    border: 1px solid rgba(120, 150, 255, 0.16) !important;
    border-radius: 20px !important;
    margin: 0 15px 15px !important;
    overflow: hidden !important;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25) !important;
  }
  
  /* عنوان المجموعة (.sgt) */
  .sgt {
    padding: 14px 18px !important;
    background: linear-gradient(90deg, rgba(255, 39, 201, 0.12), rgba(141, 36, 255, 0.08)) !important;
    color: #ff27c9 !important;
    font-family: 'Tajawal', sans-serif !important;
    font-weight: 900 !important;
    font-size: 13px !important;
    letter-spacing: 0.5px !important;
    text-transform: uppercase !important;
    border-bottom: 1px solid rgba(120, 150, 255, 0.1) !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
  }
  
  /* صف الإعداد (.sit) */
  .sit {
    display: flex !important;
    align-items: center !important;
    gap: 14px !important;
    padding: 16px 18px !important;
    border-bottom: 1px solid rgba(120, 150, 255, 0.08) !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    position: relative !important;
  }
  .sit:last-child { border-bottom: none !important; }
  .sit:active {
    background: rgba(255, 39, 201, 0.05) !important;
    transform: scale(0.99) !important;
  }
  
  /* أيقونة الإعداد (.sii) */
  .sii {
    width: 42px !important;
    height: 42px !important;
    border-radius: 14px !important;
    background: rgba(255, 39, 201, 0.12) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    border: 1px solid rgba(255, 39, 201, 0.15) !important;
  }
  .sii svg {
    width: 20px !important;
    height: 20px !important;
    stroke: #ff27c9 !important;
    stroke-width: 2 !important;
  }
  .sii[style*="background:rgba(59,130,246"] { background: rgba(59, 130, 246, 0.15) !important; }
  .sii[style*="background:rgba(255,39,201"] { background: rgba(255, 39, 201, 0.15) !important; }
  .sii[style*="background:rgba(255,193,7"] { background: rgba(255, 193, 7, 0.15) !important; }
  .sii[style*="background:rgba(141,36,255"] { background: rgba(141, 36, 255, 0.15) !important; }
  .sii[style*="background:rgba(0,212,160"] { background: rgba(0, 212, 160, 0.15) !important; }
  .sii[style*="background:rgba(255,77,109"] { background: rgba(255, 77, 109, 0.15) !important; }
  
  /* نص الصف (.sit-t) */
  .sit-t {
    flex: 1 !important;
    min-width: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 3px !important;
  }
  .sit-ti {
    color: #f8f9ff !important;
    font-family: 'Tajawal', sans-serif !important;
    font-weight: 800 !important;
    font-size: 14px !important;
    line-height: 1.3 !important;
  }
  .sit-d {
    color: #b8c5ee !important;
    font-family: 'Tajawal', sans-serif !important;
    font-size: 12px !important;
    line-height: 1.4 !important;
    font-weight: 500 !important;
  }
  
  /* سهم اليسار (.mi-a) */
  .mi-a {
    color: #6b7ba8 !important;
    font-size: 22px !important;
    font-weight: 400 !important;
    transition: all 0.2s !important;
    flex-shrink: 0 !important;
    display: flex !important;
    align-items: center !important;
  }
  .sit:active .mi-a {
    color: #ff27c9 !important;
    transform: translateX(-4px) !important;
  }
  
  /* قيمة يسار (.mi-v) */
  .mi-v {
    color: #b8c5ee !important;
    font-family: 'Tajawal', sans-serif !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    padding: 6px 12px !important;
    background: rgba(7, 23, 71, 0.7) !important;
    border: 1px solid rgba(120, 150, 255, 0.2) !important;
    border-radius: 10px !important;
    flex-shrink: 0 !important;
  }
  
  /* زر التبديل (.tog) */
  .tog {
    width: 48px !important;
    height: 28px !important;
    border-radius: 14px !important;
    background: rgba(120, 150, 255, 0.2) !important;
    border: 1px solid rgba(120, 150, 255, 0.3) !important;
    position: relative !important;
    cursor: pointer !important;
    transition: all 0.3s !important;
    flex-shrink: 0 !important;
  }
  .tog::after {
    content: '' !important;
    position: absolute !important;
    top: 3px !important;
    left: 3px !important;
    width: 20px !important;
    height: 20px !important;
    border-radius: 50% !important;
    background: #b8c5ee !important;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
  }
  .tog.on {
    background: linear-gradient(135deg, #ff27c9, #8d24ff) !important;
    border-color: transparent !important;
    box-shadow: 0 0 15px rgba(255, 39, 201, 0.4) !important;
  }
  .tog.on::after {
    left: 23px !important;
    background: #fff !important;
  }
  
  /* زر "تسجيل الخروج" */
  .danger-b {
    background: linear-gradient(135deg, #ff4d6d, #dc2626) !important;
    color: #fff !important;
    border: none !important;
    border-radius: 14px !important;
    padding: 16px !important;
    width: 100% !important;
    font-family: 'Tajawal', sans-serif !important;
    font-weight: 900 !important;
    font-size: 15px !important;
    cursor: pointer !important;
    box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3) !important;
    transition: all 0.2s !important;
    margin-top: 10px !important;
  }
  .danger-b:active {
    transform: scale(0.97) !important;
  }
  
  /* أزرار +/- (سلة) */
  .qb, .qb2 {
    width: 38px !important;
    height: 38px !important;
    border-radius: 12px !important;
    background: rgba(7, 23, 71, 0.7) !important;
    border: 1px solid rgba(255, 39, 201, 0.3) !important;
    color: #ff27c9 !important;
    font-size: 20px !important;
    font-weight: 900 !important;
    cursor: pointer !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s !important;
    padding: 0 !important;
    line-height: 1 !important;
    font-family: 'Tajawal', sans-serif !important;
  }
  .qb:active, .qb2:active {
    transform: scale(0.9) !important;
    background: rgba(255, 39, 201, 0.25) !important;
  }
  .qb:hover, .qb2:hover {
    background: rgba(255, 39, 201, 0.2) !important;
    border-color: #ff27c9 !important;
  }
  
  /* زر مسح البحث (ss-clear) */
  .ss-clear {
    width: 30px !important;
    height: 30px !important;
    border-radius: 50% !important;
    background: rgba(255, 39, 201, 0.15) !important;
    border: 1px solid rgba(255, 39, 201, 0.3) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    padding: 0 !important;
  }
  .ss-clear:active {
    transform: scale(0.9) !important;
  }
  .ss-clear svg {
    width: 16px !important;
    height: 16px !important;
    stroke: #ff27c9 !important;
  }
  
  /* شاشات صغيرة */
  @media (max-width: 400px) {
    .sg { margin: 0 12px 12px !important; }
    .sit { padding: 14px 14px !important; gap: 12px !important; }
    .sii { width: 38px !important; height: 38px !important; border-radius: 12px !important; }
    .sii svg { width: 18px !important; height: 18px !important; }
    .sit-ti { font-size: 13px !important; }
    .sit-d { font-size: 11px !important; }
    .tog { width: 44px !important; height: 26px !important; }
    .tog.on::after { left: 21px !important; }
  }
</style>
`;
html = html.replace('</head>', settingsCSS + '\n</head>');

// 3) حفظ
fs.writeFileSync(file + '.bak_settingspolish_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('✅ تم تحسين شاشة الإعدادات بالكامل.');
console.log('  - حاويات .sg: خلفية زجاجية داكنة + ظل');
console.log('  - عناوين .sgt: تدرج بنفسجي + أيقونات');
console.log('  - صفوف .sit: مسافات محسّنة + hover');
console.log('  - أيقونات .sii: ألوان متناسقة');
console.log('  - مفاتيح .tog: تدرج عند التفعيل');
console.log('  - أزرار +/-: تصميم بنفسجي');
console.log('  - زر تسجيل الخروج: تدرج أحمر');

// 4) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'stg_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
