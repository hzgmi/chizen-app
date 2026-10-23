const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// إزالة أي نسخة سابقة
html = html.replace(/<style id="section-headers-polish">[\s\S]*?<\/style>/g, '');

const polishCSS = `
<style id="section-headers-polish">
  /* ══════════════════════════════════════════════════════
     تحسين عناوين الأقسام (sh2) - Glassmorphism فاخر
     ══════════════════════════════════════════════════════ */
  
  /* الحاوية الرئيسية للعنوان */
  .sh2 {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    padding: 16px 20px !important;
    margin: 12px 15px 15px !important;
    background: linear-gradient(135deg, rgba(7, 23, 71, 0.7) 0%, rgba(37, 7, 76, 0.6) 100%) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255, 39, 201, 0.2) !important;
    border-radius: 18px !important;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
    position: relative !important;
    overflow: hidden !important;
  }
  
  /* توهج خفيف في الزاوية العلوية */
  .sh2::before {
    content: '' !important;
    position: absolute !important;
    top: -30px !important;
    right: -30px !important;
    width: 80px !important;
    height: 80px !important;
    background: radial-gradient(circle, rgba(255, 39, 201, 0.3) 0%, transparent 70%) !important;
    border-radius: 50% !important;
    pointer-events: none !important;
  }
  
  /* زر الرجوع داخل العنوان (إن وجد) */
  .sh2 .back {
    width: 38px !important;
    height: 38px !important;
    border-radius: 12px !important;
    background: rgba(255, 39, 201, 0.15) !important;
    border: 1px solid rgba(255, 39, 201, 0.3) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    flex-shrink: 0 !important;
  }
  .sh2 .back:active {
    transform: scale(0.92) !important;
    background: rgba(255, 39, 201, 0.25) !important;
  }
  .sh2 .back svg {
    width: 20px !important;
    height: 20px !important;
    stroke: #ff27c9 !important;
    stroke-width: 2.5 !important;
  }
  
  /* النص الرئيسي للعنوان */
  .sh2 .st2 {
    flex: 1 !important;
    font-size: 20px !important;
    font-weight: 900 !important;
    font-family: 'Tajawal', sans-serif !important;
    color: #f8f9ff !important;
    background: linear-gradient(135deg, #f8f9ff 0%, #ff27c9 70%, #00dfff 100%) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
    text-align: center !important;
    letter-spacing: 0.3px !important;
    filter: drop-shadow(0 2px 8px rgba(255, 39, 201, 0.4)) !important;
    margin: 0 !important;
  }
  
  /* الأزرار الإضافية داخل العنوان (مثل "مسح الكل") */
  .sh2 button:not(.back) {
    background: rgba(255, 39, 201, 0.15) !important;
    border: 1px solid rgba(255, 39, 201, 0.3) !important;
    color: #ff27c9 !important;
    padding: 8px 14px !important;
    border-radius: 10px !important;
    font-family: 'Tajawal', sans-serif !important;
    font-weight: 800 !important;
    font-size: 12px !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    white-space: nowrap !important;
  }
  .sh2 button:not(.back):active {
    transform: scale(0.95) !important;
    background: rgba(255, 39, 201, 0.25) !important;
  }
  
  /* ═══ تحسين العناوين القديمة (hd) داخل الشاشات التفصيلية ═══ */
  .hd {
    background: linear-gradient(135deg, rgba(7, 23, 71, 0.8) 0%, rgba(37, 7, 76, 0.7) 100%) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border-bottom: 1px solid rgba(255, 39, 201, 0.2) !important;
    padding: 14px 18px !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
  }
  .hd div[onclick] {
    width: 38px !important;
    height: 38px !important;
    border-radius: 12px !important;
    background: rgba(255, 39, 201, 0.15) !important;
    border: 1px solid rgba(255, 39, 201, 0.3) !important;
  }
  
  /* ═══ تحسين عناوين الأقسام الفرعية (sh, stl) ═══ */
  .sh {
    padding: 12px 15px !important;
    margin-top: 15px !important;
  }
  .stl {
    font-size: 18px !important;
    font-weight: 900 !important;
    font-family: 'Tajawal', sans-serif !important;
    color: #f8f9ff !important;
    background: linear-gradient(135deg, #f8f9ff, #00dfff) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    filter: drop-shadow(0 2px 6px rgba(0, 223, 255, 0.3)) !important;
  }
  
  /* ═══ تحسين البطاقات الخاصة (oc, cd, cs) ═══ */
  .oc {
    background: rgba(7, 23, 71, 0.55) !important;
    backdrop-filter: blur(15px) !important;
    border: 1px solid rgba(120, 150, 255, 0.16) !important;
    border-radius: 16px !important;
    padding: 16px !important;
    margin-bottom: 12px !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
  }
  
  /* ═══ حالة "لا توجد عناصر" ═══ */
  .cempty {
    padding: 40px 20px !important;
    text-align: center !important;
    background: rgba(7, 23, 71, 0.4) !important;
    border-radius: 18px !important;
    border: 1px dashed rgba(255, 39, 201, 0.25) !important;
    margin: 15px !important;
  }
  .cempty p {
    color: #b8c5ee !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    margin: 0 !important;
  }
  .cempty::before {
    content: '📭' !important;
    display: block !important;
    font-size: 36px !important;
    margin-bottom: 10px !important;
    opacity: 0.7 !important;
  }
  
  /* ═══ تحسين حقول الملفات ═══ */
  input[type="file"] {
    padding: 12px !important;
    border-radius: 12px !important;
    background: rgba(7, 23, 71, 0.6) !important;
    border: 1px dashed rgba(255, 39, 201, 0.4) !important;
    color: #b8c5ee !important;
    font-size: 13px !important;
  }
  input[type="file"]::file-selector-button {
    background: linear-gradient(135deg, #ff27c9, #8d24ff) !important;
    color: #fff !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 8px 16px !important;
    margin-left: 10px !important;
    cursor: pointer !important;
    font-weight: 700 !important;
    font-family: 'Tajawal', sans-serif !important;
  }
  
  /* ═══ تحسين قوائم الاختيار (select) ═══ */
  select {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ff27c9' stroke-width='3'%3e%3cpolyline points='6 9 12 15 18 9'/%3e%3c/svg%3e") !important;
    background-repeat: no-repeat !important;
    background-position: left 12px center !important;
    padding-left: 35px !important;
    appearance: none !important;
    -webkit-appearance: none !important;
  }
  
  /* ═══ شاشات صغيرة ═══ */
  @media (max-width: 400px) {
    .sh2 { padding: 12px 15px !important; margin: 10px 12px !important; }
    .sh2 .st2 { font-size: 17px !important; }
    .sh2 .back { width: 34px !important; height: 34px !important; }
  }
</style>
`;
html = html.replace('</head>', polishCSS + '\n</head>');

fs.writeFileSync(file + '.bak_headers_' + Date.now(), original);
fs.writeFileSync(file, html);
console.log('✅ تم تحسين جميع عناوين الأقسام والبطاقات.');

// فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'hd_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
