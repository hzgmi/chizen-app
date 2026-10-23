const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) إزالة CSS السابق ═══
html = html.replace(/<style id="polish-buttons-css">[\s\S]*?<\/style>/g, '');

// ═══ 2) CSS الشامل للأزرار ═══
const buttonsCSS = `
<style id="polish-buttons-css">
  /* ═══════════════════════════════════════════════════
     زر أساسي - تدرج بنفسجي/وردي فاخر
     ═══════════════════════════════════════════════════ */
  .btn-primary-chz,
  button[onclick*="submitFlight"],
  button[onclick*="submitBus"],
  button[onclick*="submitHotel"],
  button[onclick*="submitHajj"],
  button[onclick*="confirmOrder"],
  button[onclick*="closeSuccessModal"] {
    background: linear-gradient(135deg, #ff27c9, #8d24ff) !important;
    color: #fff !important;
    border: none !important;
    border-radius: 14px !important;
    padding: 16px 24px !important;
    font-family: 'Tajawal', sans-serif !important;
    font-size: 15px !important;
    font-weight: 900 !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    box-shadow: 0 8px 25px rgba(255, 39, 201, 0.4) !important;
    width: 100% !important;
    margin-top: 15px !important;
    position: relative !important;
    overflow: hidden !important;
    letter-spacing: 0.3px !important;
  }
  .btn-primary-chz::before,
  button[onclick*="submitFlight"]::before,
  button[onclick*="submitBus"]::before,
  button[onclick*="submitHotel"]::before,
  button[onclick*="submitHajj"]::before,
  button[onclick*="confirmOrder"]::before,
  button[onclick*="closeSuccessModal"]::before {
    content: '' !important;
    position: absolute !important;
    inset: 0 !important;
    background: linear-gradient(135deg, #8d24ff, #00dfff) !important;
    opacity: 0 !important;
    transition: opacity 0.3s !important;
  }
  .btn-primary-chz:hover::before,
  button[onclick*="submitFlight"]:hover::before,
  button[onclick*="submitBus"]:hover::before,
  button[onclick*="submitHotel"]:hover::before,
  button[onclick*="submitHajj"]:hover::before,
  button[onclick*="confirmOrder"]:hover::before,
  button[onclick*="closeSuccessModal"]:hover::before {
    opacity: 1 !important;
  }
  .btn-primary-chz:active,
  button[onclick*="submitFlight"]:active,
  button[onclick*="submitBus"]:active,
  button[onclick*="submitHotel"]:active,
  button[onclick*="submitHajj"]:active,
  button[onclick*="confirmOrder"]:active,
  button[onclick*="closeSuccessModal"]:active {
    transform: scale(0.97) !important;
  }
  
  /* ═══ أزرار السلة +/- ═══ */
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
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s !important;
    padding: 0 !important;
    line-height: 1 !important;
  }
  .qb:active, .qb2:active {
    transform: scale(0.9) !important;
    background: rgba(255, 39, 201, 0.2) !important;
  }
  .qb:hover, .qb2:hover {
    background: rgba(255, 39, 201, 0.2) !important;
    border-color: #ff27c9 !important;
  }
  
  /* ═══ زر إغلاق النوافذ × ═══ */
  button[onclick*="closePointsModal"],
  #pts-modal-close-btn,
  #ref-modal-box .close-btn {
    width: 36px !important;
    height: 36px !important;
    border-radius: 50% !important;
    background: rgba(7, 23, 71, 0.8) !important;
    border: 1px solid rgba(120, 150, 255, 0.3) !important;
    color: #b8c5ee !important;
    font-size: 20px !important;
    font-weight: 700 !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s !important;
    position: absolute !important;
    top: 15px !important;
    left: 15px !important;
    padding: 0 !important;
    line-height: 1 !important;
  }
  button[onclick*="closePointsModal"]:hover,
  #pts-modal-close-btn:hover,
  #ref-modal-box .close-btn:hover {
    background: rgba(255, 77, 109, 0.2) !important;
    color: #ff4d6d !important;
    border-color: #ff4d6d !important;
  }
  button[onclick*="closePointsModal"]:active,
  #pts-modal-close-btn:active,
  #ref-modal-box .close-btn:active {
    transform: scale(0.9) !important;
  }
  
  /* ═══ أزرار الحجز (تبويبات) ═══ */
  .booking-tab {
    background: rgba(7, 23, 71, 0.6) !important;
    border: 1px solid rgba(120, 150, 255, 0.2) !important;
    color: #b8c5ee !important;
    padding: 12px 20px !important;
    border-radius: 14px !important;
    font-family: 'Tajawal', sans-serif !important;
    font-size: 13px !important;
    font-weight: 800 !important;
    cursor: pointer !important;
    transition: all 0.25s !important;
    white-space: nowrap !important;
  }
  .booking-tab.active {
    background: linear-gradient(135deg, #ff27c9, #8d24ff) !important;
    border-color: transparent !important;
    color: #fff !important;
    box-shadow: 0 6px 20px rgba(255, 39, 201, 0.4) !important;
    transform: scale(1.02) !important;
  }
  .booking-tab:active {
    transform: scale(0.95) !important;
  }
  
  /* ═══ زر "مسح الكل" ═══ */
  button[onclick*="clearAllNotifs"] {
    background: rgba(255, 77, 109, 0.15) !important;
    border: 1px solid rgba(255, 77, 109, 0.3) !important;
    color: #ff4d6d !important;
    padding: 8px 14px !important;
    border-radius: 10px !important;
    font-family: 'Tajawal', sans-serif !important;
    font-size: 12px !important;
    font-weight: 800 !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
  }
  button[onclick*="clearAllNotifs"]:hover {
    background: rgba(255, 77, 109, 0.25) !important;
  }
  button[onclick*="clearAllNotifs"]:active {
    transform: scale(0.95) !important;
  }
  
  /* ═══ زر "رجوع" ═══ */
  .back {
    width: 40px !important;
    height: 40px !important;
    border-radius: 12px !important;
    background: rgba(255, 39, 201, 0.15) !important;
    border: 1px solid rgba(255, 39, 201, 0.3) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    padding: 0 !important;
  }
  .back svg {
    width: 20px !important;
    height: 20px !important;
    stroke: #ff27c9 !important;
    stroke-width: 2.5 !important;
  }
  .back:active {
    transform: scale(0.9) !important;
    background: rgba(255, 39, 201, 0.25) !important;
  }
  
  /* ═══ أزرار النوافذ (إلغاء / تأكيد) ═══ */
  .dlb2 {
    flex: 1 !important;
    padding: 14px !important;
    border-radius: 14px !important;
    font-family: 'Tajawal', sans-serif !important;
    font-size: 15px !important;
    font-weight: 800 !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    border: none !important;
  }
  .dlb2.cancel {
    background: rgba(7, 23, 71, 0.7) !important;
    color: #b8c5ee !important;
    border: 1px solid rgba(120, 150, 255, 0.3) !important;
  }
  .dlb2.confirm {
    background: linear-gradient(135deg, #ff27c9, #8d24ff) !important;
    color: #fff !important;
    box-shadow: 0 6px 20px rgba(255, 39, 201, 0.4) !important;
  }
  .dlb2:active {
    transform: scale(0.96) !important;
  }
  
  /* ═══ الأزرار في نافذة نجاح الحجز ═══ */
  #booking-success-modal button {
    background: linear-gradient(135deg, #ff27c9, #8d24ff) !important;
    color: #fff !important;
    border: none !important;
    border-radius: 14px !important;
    padding: 14px 30px !important;
    font-family: 'Tajawal', sans-serif !important;
    font-weight: 900 !important;
    font-size: 15px !important;
    cursor: pointer !important;
    box-shadow: 0 8px 25px rgba(255, 39, 201, 0.4) !important;
    transition: all 0.2s !important;
  }
  #booking-success-modal button:active {
    transform: scale(0.96) !important;
  }
  
  /* ═══ زر "رجوع" في اختيار نقطة التسليم ═══ */
  button[onclick*="renderPickup"] {
    background: rgba(255, 39, 201, 0.15) !important;
    border: 1px solid rgba(255, 39, 201, 0.3) !important;
    color: #ff27c9 !important;
    padding: 10px 18px !important;
    border-radius: 12px !important;
    font-family: 'Tajawal', sans-serif !important;
    font-size: 13px !important;
    font-weight: 800 !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
  }
  button[onclick*="renderPickup"]:active {
    transform: scale(0.95) !important;
  }
  
  /* ═══ زر "ss-clear" (مسح البحث) ═══ */
  .ss-clear {
    width: 26px !important;
    height: 26px !important;
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
    width: 14px !important;
    height: 14px !important;
    stroke: #ff27c9 !important;
  }
  
  /* ═══ زر "العودة للرئيسية" في نافذة النجاح ═══ */
  .success-card button {
    background: linear-gradient(135deg, #ff27c9, #8d24ff) !important;
    color: #fff !important;
    border: none !important;
    border-radius: 14px !important;
    padding: 14px 30px !important;
    font-family: 'Tajawal', sans-serif !important;
    font-weight: 900 !important;
    font-size: 15px !important;
    cursor: pointer !important;
    box-shadow: 0 8px 25px rgba(255, 39, 201, 0.4) !important;
    transition: all 0.2s !important;
    margin-top: 15px !important;
  }
  .success-card button:active {
    transform: scale(0.96) !important;
  }
  
  /* ═══ زر الحجز في البنر ═══ */
  .sl-btn {
    background: linear-gradient(135deg, #ff27c9, #8d24ff) !important;
    color: #fff !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 12px 24px !important;
    font-family: 'Tajawal', sans-serif !important;
    font-weight: 900 !important;
    font-size: 14px !important;
    cursor: pointer !important;
    box-shadow: 0 6px 20px rgba(255, 39, 201, 0.4) !important;
    transition: all 0.2s !important;
  }
  .sl-btn:active {
    transform: scale(0.95) !important;
  }
</style>
`;
html = html.replace('</head>', buttonsCSS + '\n</head>');

// 3) حفظ
fs.writeFileSync(file + '.bak_polishbtns_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('✅ تم تطبيق CSS الشامل على كل الأزرار القبيحة.');

// 4) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'pb_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
