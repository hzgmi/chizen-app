const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'client/chizen.html');
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) حذف أي نسخة سابقة من النافذة (للتنظيف) ═══
html = html.replace(/<!-- ═══ نافذة شراء النقاط ═══ -->[\s\S]*?<!-- ═══ نهاية نافذة الشراء ═══ -->/g, '');

// ═══ 2) حقن CSS للنافذة (إذا لم يكن موجوداً) ═══
if (!html.includes('pts-purchase-modal {')) {
  const css = `
<style id="pts-modal-css">
  #pts-purchase-modal {
    position: fixed; inset: 0; background: rgba(10, 5, 25, 0.75);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    z-index: 15000; display: none; align-items: center; justify-content: center;
    padding: 20px; overflow-y: auto;
  }
  #pts-purchase-modal.open { display: flex !important; }
  #pts-purchase-modal > div {
    background: #ffffff; border-radius: 24px; padding: 25px;
    width: 100%; max-width: 400px; position: relative;
    box-shadow: 0 20px 60px rgba(106, 27, 154, 0.3);
    animation: ptsPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    margin: auto;
  }
  @keyframes ptsPop {
    0% { transform: scale(0.85); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  #pts-modal-close-btn {
    position: absolute; top: 12px; left: 12px;
    width: 32px; height: 32px; border-radius: 50%;
    background: #f4f6fa; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #6b7280; font-size: 20px; font-weight: bold;
    transition: all 0.2s;
  }
  #pts-modal-close-btn:hover { background: #fee2e2; color: #ef4444; }
  .pts-info-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0;
  }
  .pts-info-label { font-size: 14px; color: #6b7280; }
  .pts-info-value { font-size: 16px; font-weight: 900; color: #6A1B9A; }
  .pts-info-value.price { color: #D81B60; }
</style>
`;
  html = html.replace('</head>', css + '\n</head>');
  console.log('✅ تم حقن CSS للنافذة.');
}

// ═══ 3) حقن نافذة HTML ═══
const modalHTML = `
<!-- ═══ نافذة شراء النقاط ═══ -->
<div id="pts-purchase-modal">
  <div>
    <button id="pts-modal-close-btn" onclick="closePointsModal()">×</button>
    
    <div style="text-align:center; margin-bottom:20px;">
      <div style="font-size:48px;">💳</div>
      <div style="font-size:18px; font-weight:900; color:#1f2937; margin-top:8px;">تأكيد شراء النقاط</div>
    </div>
    
    <div style="background:#f4f6fa; border-radius:14px; padding:15px; margin-bottom:15px;">
      <div class="pts-info-row">
        <span class="pts-info-label">الباقة:</span>
        <span class="pts-info-value" id="modal-package-info">100 نقطة</span>
      </div>
      <div class="pts-info-row">
        <span class="pts-info-label">السعر:</span>
        <span class="pts-info-value price" id="modal-price-info">10 ر.س</span>
      </div>
    </div>
    
    <div style="background:#FEF3C7; border-radius:12px; padding:12px; margin-bottom:15px; font-size:12px; color:#92400e; line-height:1.7;">
      <b>📌 خطوات الدفع:</b><br>
      1. حوّل المبلغ إلى حسابنا البنكي (الكريمي/القطيبي).<br>
      2. ارفع صورة إيصال التحويل أدناه.<br>
      3. اضغط "إرسال الطلب" — سيتم تفعيل النقاط بعد المراجعة.
    </div>
    
    <div style="margin-bottom:15px;">
      <label style="display:block; font-size:13px; font-weight:bold; color:#374151; margin-bottom:8px;">📎 صورة الإيصال</label>
      <input type="file" id="pts-receipt-input" accept="image/*" style="width:100%; padding:10px; border:2px dashed #d1d5db; border-radius:12px; background:#fafbfc; font-size:12px; cursor:pointer;">
    </div>
    
    <div style="margin-bottom:15px;">
      <label style="display:block; font-size:13px; font-weight:bold; color:#374151; margin-bottom:8px;">📝 ملاحظات (اختياري)</label>
      <textarea id="pts-notes-input" placeholder="مثال: تم التحويل من حساب باسم..." style="width:100%; padding:10px; border:1px solid #e5e7eb; border-radius:12px; background:#f4f6fa; font-family:inherit; font-size:13px; height:60px; resize:none;"></textarea>
    </div>
    
    <button onclick="submitPointsPurchase()" style="width:100%; background:linear-gradient(135deg,#6A1B9A,#D81B60); color:#fff; border:none; border-radius:14px; padding:14px; font-family:inherit; font-weight:bold; font-size:15px; cursor:pointer; box-shadow:0 6px 20px rgba(216,27,96,0.3);">📤 إرسال الطلب</button>
  </div>
</div>
<!-- ═══ نهاية نافذة الشراء ═══ -->
`;

if (html.includes('</body>')) {
  html = html.replace('</body>', modalHTML + '\n</body>');
} else {
  html += '\n' + modalHTML;
}
console.log('✅ تم حقن نافذة HTML.');

// ═══ 4) تحديث دالة selectPointsPackage لتفتح النافذة بالشكل الصحيح ═══
// نحذف النسخ القديمة ونضع واحدة نظيفة
const oldSelectRegex = /window\.selectPointsPackage\s*=\s*function\s*\([^)]*\)\s*\{[\s\S]*?\}\s*;?/g;
html = html.replace(oldSelectRegex, '');

const cleanSelectFn = `
window.selectPointsPackage = function(points, price) {
  window.selectedPointsPackage = { points: points, price: price };
  var pts = document.getElementById('modal-package-info');
  var prc = document.getElementById('modal-price-info');
  if (pts) pts.textContent = points + ' نقطة';
  if (prc) prc.textContent = price + ' ر.س';
  var receipt = document.getElementById('pts-receipt-input');
  var notes = document.getElementById('pts-notes-input');
  if (receipt) receipt.value = '';
  if (notes) notes.value = '';
  var modal = document.getElementById('pts-purchase-modal');
  if (modal) { 
    modal.classList.add('open'); 
    modal.style.display = 'flex'; 
  } else {
    console.error('Modal not found!');
  }
};

window.closePointsModal = function() {
  var modal = document.getElementById('pts-purchase-modal');
  if (modal) { 
    modal.classList.remove('open'); 
    modal.style.display = 'none'; 
  }
};
`;

// نحذف الدوال القديمة closePointsModal أيضاً
html = html.replace(/window\.closePointsModal\s*=\s*function\s*\([^)]*\)\s*\{[\s\S]*?\}\s*;?/g, '');

// نضيف الدوال النظيفة في كتلة script جديدة قبل </body>
const finalScript = '<script>\n' + cleanSelectFn + '\n</script>\n';
html = html.replace('</body>', finalScript + '</body>');

// ═══ 5) حفظ والتحقق ═══
fs.writeFileSync(file + '.bak_ptsmodal_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('\n═══ التحقق النهائي ═══');
console.log('  - النافذة pts-purchase-modal: ' + (html.includes('id="pts-purchase-modal"') ? '✅' : '❌'));
console.log('  - الحقل modal-package-info: ' + (html.includes('id="modal-package-info"') ? '✅' : '❌'));
console.log('  - الحقل modal-price-info: ' + (html.includes('id="modal-price-info"') ? '✅' : '❌'));
console.log('  - الحقل pts-receipt-input: ' + (html.includes('id="pts-receipt-input"') ? '✅' : '❌'));
console.log('  - selectPointsPackage: ' + (html.match(/window\.selectPointsPackage/g) || []).length + ' مرة');
console.log('  - closePointsModal: ' + (html.match(/window\.closePointsModal/g) || []).length + ' مرة');

// فحص Syntax
const os = require('os');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'pmod_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; console.log('❌ block #' + i + ': ' + (e.stderr || '').toString().split('\n')[0]); }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT' : '❌ ' + errs + ' errors');
