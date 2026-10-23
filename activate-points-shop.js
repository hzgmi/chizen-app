const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'client/chizen.html');
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) إضافة كود JavaScript (داخل <script>) ═══
const shopJS = `
// ═══ نظام شراء النقاط ═══
window.selectedPointsPackage = { points: 0, price: 0 };

window.selectPointsPackage = function(points, price) {
  window.selectedPointsPackage = { points: points, price: price };
  
  // تعبئة النافذة
  var infoPts = document.getElementById('modal-package-info');
  var infoPrice = document.getElementById('modal-price-info');
  if (infoPts) infoPts.textContent = points + ' نقطة';
  if (infoPrice) infoPrice.textContent = price + ' ر.س';
  
  // تفريغ الحقول
  var receipt = document.getElementById('pts-receipt-input');
  var notes = document.getElementById('pts-notes-input');
  if (receipt) receipt.value = '';
  if (notes) notes.value = '';
  
  // فتح النافذة
  var modal = document.getElementById('pts-purchase-modal');
  if (modal) { modal.style.display = 'flex'; }
};

window.closePointsModal = function() {
  var modal = document.getElementById('pts-purchase-modal');
  if (modal) modal.style.display = 'none';
};

window.submitPointsPurchase = async function() {
  if (!window.FB || !FB.currentUser) {
    if (window.toast) toast('سجل دخول أولاً', 'err');
    return;
  }
  
  var pkg = window.selectedPointsPackage;
  if (!pkg.points) { if (window.toast) toast('اختر باقة أولاً', 'err'); return; }
  
  var receiptInput = document.getElementById('pts-receipt-input');
  var notesInput = document.getElementById('pts-notes-input');
  
  if (!receiptInput || !receiptInput.files || !receiptInput.files[0]) {
    if (window.toast) toast('ارفع صورة الإيصال أولاً', 'err');
    return;
  }
  
  var file = receiptInput.files[0];
  
  // التحقق من نوع الملف
  if (!file.type.startsWith('image/')) {
    if (window.toast) toast('الملف يجب أن يكون صورة', 'err');
    return;
  }
  
  // التحقق من الحجم (أقل من 5MB)
  if (file.size > 5 * 1024 * 1024) {
    if (window.toast) toast('حجم الصورة أكبر من 5MB', 'err');
    return;
  }
  
  var btn = document.querySelector('#pts-purchase-modal button:last-child');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ جاري الرفع...'; }
  
  try {
    // 1) رفع الإيصال إلى ImgBB
    var formData = new FormData();
    formData.append('image', file);
    
    // المفتاح - استخدم مفتاح ImgBB الخاص بك
    var IMGBB_KEY = 'YOUR_IMGBB_API_KEY';
    
    var imgRes = await fetch('https://api.imgbb.com/1/upload?key=' + IMGBB_KEY, {
      method: 'POST',
      body: formData
    });
    var imgData = await imgRes.json();
    
    if (!imgData.success) {
      throw new Error('فشل رفع الصورة');
    }
    
    var receiptUrl = imgData.data.url;
    
    // 2) حفظ الطلب في Firebase
    var request = {
      userId: FB.currentUser.uid,
      userName: (FB.currentUser.displayName || FB.currentUser.email || 'مستخدم'),
      userEmail: FB.currentUser.email || '',
      points: pkg.points,
      price: pkg.price,
      receiptUrl: receiptUrl,
      notes: notesInput ? notesInput.value.trim() : '',
      status: 'pending',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    await FB.db.collection('points_requests').add(request);
    
    // 3) نجاح
    if (window.toast) toast('✅ تم إرسال الطلب! سيتم تفعيل النقاط بعد المراجعة', 'suc');
    closePointsModal();
    
    // إعادة تعيين
    if (receiptInput) receiptInput.value = '';
    if (notesInput) notesInput.value = '';
    window.selectedPointsPackage = { points: 0, price: 0 };
    
  } catch(e) {
    console.error('خطأ:', e);
    if (window.toast) toast('❌ حدث خطأ: ' + e.message, 'err');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '📤 إرسال الطلب'; }
  }
};
`;

// حقن قبل </body> في كتلة script منفصلة
const scriptBlock = '<script>\n' + shopJS + '\n</script>\n';
html = html.replace('</body>', scriptBlock + '</body>');
console.log('✅ تم حقن كود شراء النقاط.');

// ═══ 2) التأكد من أن onclick في الباقات صحيح ═══
// نصلح onclick في الباقات لاستخدام selectPointsPackage
html = html.replace(/onclick="selectPointsPackage\(100,\s*10\)"/g, 'onclick="selectPointsPackage(100, 10)"');
html = html.replace(/onclick="selectPointsPackage\(300,\s*25\)"/g, 'onclick="selectPointsPackage(300, 25)"');
html = html.replace(/onclick="selectPointsPackage\(600,\s*50\)"/g, 'onclick="selectPointsPackage(600, 50)"');

// ═══ 3) الحفظ والتحقق ═══
fs.writeFileSync(file + '.bak_shopsys_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('\n═══ التحقق النهائي ═══');
console.log('  - selectPointsPackage: ' + (html.includes('window.selectPointsPackage') ? '✅' : '❌'));
console.log('  - submitPointsPurchase: ' + (html.includes('window.submitPointsPurchase') ? '✅' : '❌'));
console.log('  - closePointsModal: ' + (html.includes('window.closePointsModal') ? '✅' : '❌'));
console.log('  - onclick=selectPointsPackage: ' + (html.match(/onclick="selectPointsPackage/g) || []).length + ' باقة');

// فحص Syntax
const os = require('os');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'shop_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; console.log('❌ block #' + i + ': ' + (e.stderr || '').toString().split('\n')[0]); }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT' : '❌ ' + errs + ' errors');
