const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) حذف جميع كتل <script> التي تحتوي على كود الإحالة ═══
// نبحث عن أي كتلة <script>...</script> تحتوي على "window.generateMyCode" أو "نظام الإحالة"
const scriptRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
html = html.replace(scriptRe, function(match, attrs, content) {
  if (/window\.generateMyCode|window\.applyReferralCode|نظام الإحالة|showRefError/.test(content)) {
    return '<!-- [كتلة إحالة قديمة محذوفة] -->';
  }
  return match;
});

// ═══ 2) حذف أي كتل "تم حذف الكود المعطوب" ═══
html = html.replace(/<!-- \[كتلة إحالة قديمة محذوفة\] -->/g, '');
html = html.replace(/\/\/ \[تم حذف الكود المعطوب\]/g, '');
html = html.replace(/\/\/ \[تم حذف الكتلة المعطوبة\]/g, '');
html = html.replace(/\/\/ \[محذوف:[^\]]*\]/g, '');
html = html.replace(/\/\/ \[saveFcmToken removed\]/g, '');
html = html.replace(/\/\/ \[تم حذف دالة saveFcmToken القديمة\]/g, '');
html = html.replace(/\/\/ \[تم حذف الكود القديم المعطوب\]/g, '');

// ═══ 3) كود الإحالة النظيف (مرة واحدة فقط) ═══
const cleanReferral = `
<script>
// ═══ نظام الإحالة (نسخة نهائية نظيفة) ═══
(function(){
  'use strict';
  window.generateMyCode = function() {
    if (!window.FB || !FB.currentUser) return null;
    return 'CHZ' + FB.currentUser.uid.substring(0, 6).toUpperCase();
  };
  window.showMyReferralCode = function() {
    var code = window.generateMyCode();
    if (!code) { if (window.toast) toast('سجل دخول أولاً', 'err'); return; }
    var el = document.getElementById('ref-code-value');
    if (el) el.textContent = code;
    var ov = document.getElementById('ref-modal-overlay');
    if (ov) { ov.classList.add('active'); ov.style.display = 'flex'; }
  };
  window.closeRefModal = function() {
    var ov = document.getElementById('ref-modal-overlay');
    if (ov) { ov.classList.remove('active'); ov.style.display = 'none'; }
  };
  window.copyRefCode = function() {
    var el = document.getElementById('ref-code-value');
    if (!el) return;
    var code = el.textContent.trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(function(){
        if (window.toast) toast('📋 تم نسخ الكود', 'suc');
      }).catch(function(){ fallback(code); });
    } else { fallback(code); }
    function fallback(t){
      var ta = document.createElement('textarea');
      ta.value = t; ta.style.position='fixed'; ta.style.left='-9999px';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); if (window.toast) toast('📋 تم نسخ الكود', 'suc'); } catch(e){}
      document.body.removeChild(ta);
    }
  };
  window.shareRefCode = function() {
    var el = document.getElementById('ref-code-value');
    if (!el) return;
    var code = el.textContent.trim();
    var msg = 'اكتشف CHIZEN! استخدم كود الإحالة: ' + code + ' واحصل على نقاط مجانية! 🎁';
    if (navigator.share) { navigator.share({title:'CHIZEN', text:msg}).catch(function(){}); }
    else if (navigator.clipboard) { navigator.clipboard.writeText(code); if (window.toast) toast('📋 الكود جاهز', 'suc'); }
  };
  window.applyReferralCode = async function() {
    if (!window.FB || !FB.currentUser) { showRefError('يجب تسجيل الدخول أولاً'); return; }
    var input = document.getElementById('ref-input');
    if (!input) return;
    var code = input.value.trim().toUpperCase();
    if (!code) { showRefError('يرجى إدخال الكود أولاً'); return; }
    if (!/^CHZ[A-Z0-9]{6}$/.test(code)) {
      showRefError('الكود غير صحيح.\\nيجب أن يبدأ بـ CHZ يليه 6 رموز.'); return;
    }
    try {
      var uid = FB.currentUser.uid;
      var userDoc = await FB.db.collection('users').doc(uid).get();
      var userData = userDoc.data() || {};
      if (userData.referredBy) { showRefError('لقد استخدمت كود إحالة من قبل.'); return; }
      var allUsers = await FB.db.collection('users').get();
      var found = null;
      allUsers.forEach(function(doc){
        if ('CHZ' + doc.id.substring(0,6).toUpperCase() === code) found = doc;
      });
      if (!found) { showRefError('الكود غير موجود في النظام.'); return; }
      if (found.id === uid) { showRefError('لا يمكنك استخدام كودك الخاص!'); return; }
      var foundData = found.data();
      var newPoints = (userData.loyaltyPoints || 0) + 10;
      await FB.db.collection('users').doc(uid).update({ loyaltyPoints: newPoints, referredBy: found.id });
      await FB.db.collection('users').doc(found.id).update({ loyaltyPoints: (foundData.loyaltyPoints || 0) + 10 });
      if (window.APP) {
        APP.state.loyaltyPoints = newPoints;
        APP.updateLoyalty();
        APP.addPointsTx('استخدام كود إحالة', 10);
        APP.renderPoints();
      }
      input.value = '';
      showRefSuccess('حصلت على 10 نقاط فوراً!');
    } catch(e) {
      console.error(e);
      showRefError('حدث خطأ غير متوقع.');
    }
  };
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
})();
</script>
`;

// ═══ 4) التأكد من إغلاق </body></html> ═══
if (!html.includes('</body>')) {
  html += '\n</body>';
}
if (!html.includes('</html>')) {
  html += '\n</html>';
}

// ═══ 5) حقن الكود قبل </body> ═══
html = html.replace('</body>', cleanReferral + '\n</body>');

// ═══ 6) حفظ ═══
fs.writeFileSync(file + '.bak_atomic_' + Date.now(), original);
fs.writeFileSync(file, html);

// ═══ 7) فحص ═══
console.log('✅ تم الحذف والحقن.');
console.log('  - generateMyCode: ' + (html.match(/window\.generateMyCode\s*=\s*function/g) || []).length + ' مرة');
console.log('  - applyReferralCode: ' + (html.match(/window\.applyReferralCode\s*=\s*async function/g) || []).length + ' مرة');
console.log('  - </body>: ' + (html.match(/<\/body>/g) || []).length);
console.log('  - </html>: ' + (html.match(/<\/html>/g) || []).length);
