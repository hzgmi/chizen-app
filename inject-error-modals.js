const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'client/chizen.html');
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) حقن CSS (إذا لم يكن موجوداً) ═══
if (!html.includes('ref-error-overlay {')) {
  const css = `
<style id="ref-modals-css">
  #ref-error-overlay, #ref-success-overlay {
    position: fixed; inset: 0; background: rgba(10, 5, 25, 0.75);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    z-index: 20000; display: none; align-items: center; justify-content: center;
    padding: 25px; opacity: 0; transition: opacity 0.3s;
  }
  #ref-error-overlay.active, #ref-success-overlay.active { 
    display: flex !important; opacity: 1; 
  }
  #ref-error-box, #ref-success-box {
    background: #ffffff; border-radius: 24px; padding: 30px 25px;
    width: 100%; max-width: 340px; text-align: center;
    position: relative; animation: modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  #ref-error-box { box-shadow: 0 20px 60px rgba(220, 38, 38, 0.3); }
  #ref-success-box { box-shadow: 0 20px 60px rgba(34, 197, 94, 0.3); }
  @keyframes modalPop {
    0% { transform: scale(0.7); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  .modal-icon-big { font-size: 60px; margin-bottom: 15px; }
  .modal-title-big { font-size: 18px; font-weight: 900; margin-bottom: 10px; }
  .modal-title-big.error { color: #dc2626; }
  .modal-title-big.success { color: #16a34a; }
  .modal-message { font-size: 14px; color: #6b7280; line-height: 1.7; margin-bottom: 20px; }
  .modal-btn-close {
    color: #fff; border: none; border-radius: 14px;
    padding: 14px 30px; font-family: inherit; font-weight: bold;
    font-size: 15px; cursor: pointer; width: 100%;
    transition: transform 0.2s;
  }
  .modal-btn-close.error { background: linear-gradient(135deg, #dc2626, #b91c1c); box-shadow: 0 6px 20px rgba(220,38,38,0.35); }
  .modal-btn-close.success { background: linear-gradient(135deg, #16a34a, #15803d); box-shadow: 0 6px 20px rgba(34,197,94,0.35); }
  .modal-btn-close:active { transform: scale(0.96); }
</style>
`;
  html = html.replace('</head>', css + '\n</head>');
  console.log('✅ تم حقن CSS.');
}

// ═══ 2) حقن نوافذ HTML (إذا لم تكن موجودة) ═══
if (!html.includes('id="ref-error-overlay"')) {
  const modalsHTML = `
<!-- ═══ نافذة الخطأ ═══ -->
<div id="ref-error-overlay">
  <div id="ref-error-box">
    <div class="modal-icon-big">⚠️</div>
    <div class="modal-title-big error">عذراً!</div>
    <div class="modal-message" id="ref-error-message">حدث خطأ</div>
    <button class="modal-btn-close error" onclick="closeRefError()">حسناً، فهمت</button>
  </div>
</div>

<!-- ═══ نافذة النجاح ═══ -->
<div id="ref-success-overlay">
  <div id="ref-success-box">
    <div class="modal-icon-big">🎉</div>
    <div class="modal-title-big success">مبروك!</div>
    <div class="modal-message" id="ref-success-message">+10 نقاط!</div>
    <button class="modal-btn-close success" onclick="closeRefSuccess()">رائع</button>
  </div>
</div>
`;
  if (html.includes('</body>')) {
    html = html.replace('</body>', modalsHTML + '\n</body>');
  } else {
    html += '\n' + modalsHTML;
  }
  console.log('✅ تم حقن نوافذ HTML.');
}

// ═══ 3) التأكد من وجود الدوال ═══
if (!html.includes('window.showRefError')) {
  const funcs = `
<script>
window.showRefError = function(m) {
  var b = document.getElementById('ref-error-overlay');
  var e = document.getElementById('ref-error-message');
  if (e) e.innerHTML = m.replace(/\\n/g, '<br>');
  if (b) { b.classList.add('active'); b.style.display='flex'; }
};
window.closeRefError = function() {
  var b = document.getElementById('ref-error-overlay');
  if (b) { b.classList.remove('active'); b.style.display='none'; }
};
window.showRefSuccess = function(m) {
  var b = document.getElementById('ref-success-overlay');
  var e = document.getElementById('ref-success-message');
  if (e) e.innerHTML = m.replace(/\\n/g, '<br>');
  if (b) { b.classList.add('active'); b.style.display='flex'; }
};
window.closeRefSuccess = function() {
  var b = document.getElementById('ref-success-overlay');
  if (b) { b.classList.remove('active'); b.style.display='none'; }
};
</script>
`;
  if (html.includes('</body>')) {
    html = html.replace('</body>', funcs + '\n</body>');
  } else {
    html += '\n' + funcs;
  }
  console.log('✅ تم حقن الدوال.');
}

// ═══ 4) حفظ والتحقق ═══
fs.writeFileSync(file + '.bak_modals_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('\n═══ التحقق النهائي ═══');
console.log('  - ref-error-overlay: ' + (html.includes('id="ref-error-overlay"') ? '✅' : '❌'));
console.log('  - ref-success-overlay: ' + (html.includes('id="ref-success-overlay"') ? '✅' : '❌'));
console.log('  - ref-error-message: ' + (html.includes('id="ref-error-message"') ? '✅' : '❌'));
console.log('  - ref-success-message: ' + (html.includes('id="ref-success-message"') ? '✅' : '❌'));
console.log('  - CSS: ' + (html.includes('ref-error-overlay {') ? '✅' : '❌'));
console.log('  - showRefError: ' + (html.includes('window.showRefError') ? '✅' : '❌'));
console.log('  - closeRefError: ' + (html.includes('window.closeRefError') ? '✅' : '❌'));
console.log('  - showRefSuccess: ' + (html.includes('window.showRefSuccess') ? '✅' : '❌'));
console.log('  - closeRefSuccess: ' + (html.includes('window.closeRefSuccess') ? '✅' : '❌'));
