const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// 1) حذف جميع الكتل <script> التي تحتوي على "window.selectPointsPackage" أو "window.submitPointsPurchase"
const scriptRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
html = html.replace(scriptRe, function(match, attrs, content) {
  if (/window\.selectPointsPackage|window\.submitPointsPurchase|window\.closePointsModal/.test(content)) {
    return '<!-- [محذوف: كتلة دوال الشراء القديمة] -->';
  }
  return match;
});

// 2) تنظيف التعليقات
html = html.replace(/<!-- \[محذوف: كتلة دوال الشراء القديمة\] -->/g, '');

// 3) التأكد من وجود CSS (سبق حقنه)
if (!html.includes('pts-purchase-modal {')) {
  console.log('⚠️ CSS مفقود، سيُحقن.');
  const css = `
<style id="pts-modal-css">
  #pts-purchase-modal { position: fixed; inset: 0; background: rgba(10,5,25,0.75); backdrop-filter: blur(10px); z-index: 15000; display: none; align-items: center; justify-content: center; padding: 20px; overflow-y: auto; }
  #pts-purchase-modal.open { display: flex !important; }
  #pts-purchase-modal > div { background: #fff; border-radius: 24px; padding: 25px; width: 100%; max-width: 400px; position: relative; box-shadow: 0 20px 60px rgba(106,27,154,0.3); margin: auto; }
</style>
`;
  html = html.replace('</head>', css + '\n</head>');
}

// 4) التأكد من وجود نافذة HTML (سبق حقنها، لكن للاحتياط)
if (!html.includes('id="pts-purchase-modal"')) {
  console.log('⚠️ النافذة مفقودة، ستُحقن.');
  const modalHTML = `
<div id="pts-purchase-modal" style="display:none; position:fixed; inset:0; background:rgba(10,5,25,0.75); z-index:15000; align-items:center; justify-content:center; padding:20px;">
  <div style="background:#fff; border-radius:24px; padding:25px; width:100%; max-width:400px;">
    <button onclick="closePointsModal()" style="float:left; background:none; border:none; font-size:24px; cursor:pointer;">×</button>
    <div style="text-align:center; margin-bottom:20px; font-weight:900;">💳 تأكيد شراء النقاط</div>
    <div style="background:#f4f6fa; padding:15px; border-radius:12px; margin-bottom:15px;">
      <div>الباقة: <span id="modal-package-info" style="font-weight:bold;">100</span></div>
      <div>السعر: <span id="modal-price-info" style="font-weight:bold; color:#D81B60;">10 ر.س</span></div>
    </div>
    <input type="file" id="pts-receipt-input" accept="image/*" style="width:100%; margin-bottom:10px; padding:8px; border:1px dashed #ccc; border-radius:8px;">
    <textarea id="pts-notes-input" placeholder="ملاحظات" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px; height:60px; margin-bottom:10px;"></textarea>
    <button onclick="submitPointsPurchase()" style="width:100%; background:linear-gradient(135deg,#6A1B9A,#D81B60); color:#fff; border:none; border-radius:12px; padding:14px; font-weight:bold; cursor:pointer;">📤 إرسال الطلب</button>
  </div>
</div>
`;
  html = html.replace('</body>', modalHTML + '\n</body>');
}

// 5) حقن كود JavaScript النظيف (مرة واحدة فقط) في كتلة جديدة
const cleanJS = `
<script>
// ═══ نظام شراء النقاط (نسخة نظيفة) ═══
(function() {
  'use strict';
  
  window.selectedPointsPackage = { points: 0, price: 0 };
  
  window.selectPointsPackage = function(points, price) {
    window.selectedPointsPackage = { points: points, price: price };
    var pts = document.getElementById('modal-package-info');
    var prc = document.getElementById('modal-price-info');
    if (pts) pts.textContent = points + ' نقطة';
    if (prc) prc.textContent = price + ' ر.س';
    var r = document.getElementById('pts-receipt-input');
    var n = document.getElementById('pts-notes-input');
    if (r) r.value = '';
    if (n) n.value = '';
    var m = document.getElementById('pts-purchase-modal');
    if (m) { m.classList.add('open'); m.style.display = 'flex'; }
  };
  
  window.closePointsModal = function() {
    var m = document.getElementById('pts-purchase-modal');
    if (m) { m.classList.remove('open'); m.style.display = 'none'; }
  };
  
  window.submitPointsPurchase = async function() {
    if (!window.FB || !FB.currentUser) {
      if (window.toast) toast('سجل دخول أولاً', 'err');
      return;
    }
    
    var pkg = window.selectedPointsPackage;
    if (!pkg.points) {
      if (window.toast) toast('اختر باقة أولاً', 'err');
      return;
    }
    
    var receiptInput = document.getElementById('pts-receipt-input');
    var notesInput = document.getElementById('pts-notes-input');
    
    if (!receiptInput || !receiptInput.files || !receiptInput.files[0]) {
      if (window.toast) toast('ارفع صورة الإيصال أولاً', 'err');
      return;
    }
    
    var file = receiptInput.files[0];
    if (!file.type.startsWith('image/')) {
      if (window.toast) toast('الملف يجب أن يكون صورة', 'err');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      if (window.toast) toast('حجم الصورة أكبر من 5MB', 'err');
      return;
    }
    
    var btn = document.querySelector('#pts-purchase-modal button:last-child');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ جاري الرفع...'; }
    
    try {
      var formData = new FormData();
      formData.append('image', file);
      var IMGBB_KEY = 'YOUR_IMGBB_API_KEY';
      
      var imgRes = await fetch('https://api.imgbb.com/1/upload?key=' + IMGBB_KEY, {
        method: 'POST',
        body: formData
      });
      var imgData = await imgRes.json();
      
      if (!imgData.success) throw new Error('فشل رفع الصورة');
      
      var request = {
        userId: FB.currentUser.uid,
        userName: (FB.currentUser.displayName || FB.currentUser.email || 'مستخدم'),
        userEmail: FB.currentUser.email || '',
        points: pkg.points,
        price: pkg.price,
        receiptUrl: imgData.data.url,
        notes: notesInput ? notesInput.value.trim() : '',
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      await FB.db.collection('points_requests').add(request);
      
      if (window.toast) toast('✅ تم إرسال الطلب! سيتم تفعيل النقاط بعد المراجعة', 'suc');
      closePointsModal();
      if (receiptInput) receiptInput.value = '';
      if (notesInput) notesInput.value = '';
      window.selectedPointsPackage = { points: 0, price: 0 };
      
    } catch(e) {
      console.error(e);
      if (window.toast) toast('❌ حدث خطأ: ' + e.message, 'err');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '📤 إرسال الطلب'; }
    }
  };
})();
</script>
`;

html = html.replace('</body>', cleanJS + '\n</body>');

// 6) حفظ
fs.writeFileSync(file + '.bak_atomicpts_' + Date.now(), original);
fs.writeFileSync(file, html);

// 7) فحص
console.log('✅ تم الحذف والحقن النظيف.');
console.log('  selectPointsPackage: ' + (html.match(/window\.selectPointsPackage\s*=/g) || []).length + ' مرة');
console.log('  submitPointsPurchase: ' + (html.match(/window\.submitPointsPurchase\s*=/g) || []).length + ' مرة');
console.log('  النافذة: ' + (html.includes('id="pts-purchase-modal"') ? '✅' : '❌'));
