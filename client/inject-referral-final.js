const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'chizen.html');
let html = fs.readFileSync(file, 'utf8');
const original = html;

// 1) حذف أي بقايا قديمة لتجنب التكرار
html = html.replace(/<script>\s*\/\/ ═══ نظام الإحالة النظيف ═══[\s\S]*?<\/script>/g, '');
html = html.replace(/\/\/ ═══ نظام الإحالة النظيف ═══[\s\S]*?\/\/ ═══ نهاية نظام الإحالة ═══/g, '');

// 2) بناء كود الإحالة النظيف
const referralCode = `
<script>
// ═══ نظام الإحالة ═══
(function() {
  'use strict';
  
  window.generateMyCode = function() {
    if (!window.FB || !FB.currentUser) return null;
    return 'CHZ' + FB.currentUser.uid.substring(0, 6).toUpperCase();
  };
  
  window.showMyReferralCode = function() {
    var code = window.generateMyCode();
    if (!code) { if (window.toast) toast('سجل دخول أولاً', 'err'); return; }
    var codeEl = document.getElementById('ref-code-value');
    if (codeEl) codeEl.textContent = code;
    var overlay = document.getElementById('ref-modal-overlay');
    if (overlay) { overlay.classList.add('active'); overlay.style.display = 'flex'; }
  };
  
  window.closeRefModal = function() {
    var overlay = document.getElementById('ref-modal-overlay');
    if (overlay) { overlay.classList.remove('active'); overlay.style.display = 'none'; }
  };
  
  window.copyRefCode = function() {
    var codeEl = document.getElementById('ref-code-value');
    if (!codeEl) return;
    var code = codeEl.textContent.trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(function() {
        if (window.toast) toast('📋 تم نسخ الكود', 'suc');
      }).catch(function() { fallbackCopy(code); });
    } else { fallbackCopy(code); }
    function fallbackCopy(txt) {
      var temp = document.createElement('textarea');
      temp.value = txt; temp.style.position = 'fixed'; temp.style.left = '-9999px';
      document.body.appendChild(temp); temp.select();
      try { document.execCommand('copy'); if (window.toast) toast('📋 تم نسخ الكود', 'suc'); } catch(e) {}
      document.body.removeChild(temp);
    }
  };
  
  window.shareRefCode = function() {
    var codeEl = document.getElementById('ref-code-value');
    if (!codeEl) return;
    var code = codeEl.textContent.trim();
    var msg = 'اكتشف CHIZEN! استخدم كود الإحالة: ' + code + ' واحصل على نقاط مجانية! 🎁';
    if (navigator.share) {
      navigator.share({ title: 'CHIZEN', text: msg }).catch(function(){});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      if (window.toast) toast('📋 الكود جاهز للمشاركة', 'suc');
    }
  };
  
  window.applyReferralCode = async function() {
    if (!window.FB || !FB.currentUser) { showRefError('يجب تسجيل الدخول أولاً'); return; }
    var input = document.getElementById('ref-input');
    if (!input) return;
    var code = input.value.trim().toUpperCase();
    if (!code) { showRefError('يرجى إدخال الكود أولاً'); return; }
    if (!/^CHZ[A-Z0-9]{6}$/.test(code)) {
      showRefError('الكود غير صحيح.\\nيجب أن يبدأ بـ CHZ يليه 6 رموز.\\nمثال: CHZABC123');
      return;
    }
    try {
      var uid = FB.currentUser.uid;
      var userDoc = await FB.db.collection('users').doc(uid).get();
      var userData = userDoc.data() || {};
      if (userData.referredBy) {
        showRefError('لقد استخدمت كود إحالة من قبل.\\nلا يمكنك استخدام أكثر من كود واحد.');
        return;
      }
      var allUsers = await FB.db.collection('users').get();
      var referrerFound = null;
      allUsers.forEach(function(doc) {
        var expectedCode = 'CHZ' + doc.id.substring(0, 6).toUpperCase();
        if (expectedCode === code) referrerFound = doc;
      });
      if (!referrerFound) { showRefError('الكود غير موجود في النظام.'); return; }
      if (referrerFound.id === uid) { showRefError('لا يمكنك استخدام كودك الخاص!'); return; }
      var referrerData = referrerFound.data();
      var newPoints = (userData.loyaltyPoints || 0) + 10;
      await FB.db.collection('users').doc(uid).update({ loyaltyPoints: newPoints, referredBy: referrerFound.id });
      await FB.db.collection('users').doc(referrerFound.id).update({ loyaltyPoints: (referrerData.loyaltyPoints || 0) + 10 });
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
  
  window.showRefError = function(msg) {
    var box = document.getElementById('ref-error-overlay');
    var msgEl = document.getElementById('ref-error-message');
    if (msgEl) msgEl.innerHTML = msg.replace(/\\n/g, '<br>');
    if (box) { box.classList.add('active'); box.style.display = 'flex'; }
  };
  
  window.closeRefError = function() {
    var box = document.getElementById('ref-error-overlay');
    if (box) { box.classList.remove('active'); box.style.display = 'none'; }
  };
  
  window.showRefSuccess = function(msg) {
    var box = document.getElementById('ref-success-overlay');
    var msgEl = document.getElementById('ref-success-message');
    if (msgEl) msgEl.innerHTML = msg.replace(/\\n/g, '<br>');
    if (box) { box.classList.add('active'); box.style.display = 'flex'; }
  };
  
  window.closeRefSuccess = function() {
    var box = document.getElementById('ref-success-overlay');
    if (box) { box.classList.remove('active'); box.style.display = 'none'; }
  };
})();
</script>
`;

// 3) حقن الكود قبل </body>
if (html.includes('</body>')) {
  html = html.replace('</body>', referralCode + '\n</body>');
} else {
  html += '\n' + referralCode;
}

// 4) حفظ والتحقق
fs.writeFileSync(file + '.bak_injectfinal_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('✅ تم حقن نظام الإحالة النظيف.');

// 5) فحص سريع
const hasCode = html.includes('window.generateMyCode');
const hasApply = html.includes('window.applyReferralCode');
const hasShow = html.includes('window.showMyReferralCode');
console.log('  - generateMyCode: ' + (hasCode ? '✅' : '❌'));
console.log('  - applyReferralCode: ' + (hasApply ? '✅' : '❌'));
console.log('  - showMyReferralCode: ' + (hasShow ? '✅' : '❌'));
