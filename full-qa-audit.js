const fs = require('fs');
const path = require('path');
const file = 'client/chizen.html';
const html = fs.readFileSync(file, 'utf8');
const sizeKB = (html.length / 1024).toFixed(1);
const lines = html.split('\n').length;

console.log('════════════════════════════════════════════════════');
console.log('  🎯 الفحص الشامل (Full QA Audit) - CHIZEN');
console.log('════════════════════════════════════════════════════\n');
console.log('📊 الملف: ' + sizeKB + ' KB | ' + lines + ' سطر\n');

let totalScore = 0;
let totalChecks = 0;

function check(category, name, condition, points = 1) {
  totalChecks++;
  if (condition) { totalScore += points; console.log('  ✅ ' + name); return true; }
  else { console.log('  ❌ ' + name); return false; }
}

// ═══════════════════════════════════════════
// 1) الهيكل الأساسي
// ═══════════════════════════════════════════
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 1) الهيكل الأساسي');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('structure', 'DOCTYPE موجود', html.includes('<!DOCTYPE'));
check('structure', '<html> و <body> و </body>', html.includes('<html') && html.includes('<body') && html.includes('</body>'));
check('structure', 'شاشة الرئيسية sc-home', html.includes('id="sc-home"'));
check('structure', 'الشريط السفلي bottom-nav', html.includes('id="bottom-nav"'));
check('structure', 'شاشة النقاط sc-points', html.includes('id="sc-points"'));
check('structure', 'شاشة الحجوزات sc-booking', html.includes('id="sc-booking"'));
check('structure', 'شاشة السلة sc-cart', html.includes('id="sc-cart"'));
check('structure', 'شاشة الدفع sc-checkout', html.includes('id="sc-checkout"'));
check('structure', 'شاشة الحساب sc-profile', html.includes('id="sc-profile"'));

// ═══════════════════════════════════════════
// 2) الهيدر والتصميم
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 2) الهيدر والتصميم');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('header', 'الهيدر الزجاجي (chz-main)', html.includes('class="chz-main"'));
check('header', 'الشريط الماشي (chz-banner)', html.includes('class="chz-banner"'));
check('header', 'شعار CHIZEN (chz-en)', html.includes('class="chz-en"'));
check('header', 'الأزرار الثلاثة (icons)', (html.match(/class="chz-icon-box"/g) || []).length >= 3);
check('header', 'صورة المستخدم (chz-prof-avatar)', html.includes('chz-prof-avatar'));
check('header', 'التدرج الملكي (#6A1B9A)', html.includes('#6A1B9A'));
check('header', 'اللون الوردي (#D81B60)', html.includes('#D81B60'));

// ═══════════════════════════════════════════
// 3) الأقسام والبحث
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 3) الأقسام والبحث');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('search', 'حاوية الأقسام (id=cats)', html.includes('id="cats"'));
check('search', 'الأقسام السبعة (FIXED_CATS)', html.includes('window.FIXED_CATS'));
check('search', 'شريط البحث الذكي (search-in)', html.includes('id="search-in"'));
check('search', 'القائمة المنسدلة (search-dropdown)', html.includes('id="search-dropdown"'));
check('search', 'دالة البحث (APP.search)', html.includes('APP.search'));

// ═══════════════════════════════════════════
// 4) المنتجات والسلة
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 4) المنتجات والسلة');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('products', 'حاوية المنتجات (id=prods)', html.includes('id="prods"'));
check('products', 'دالة عرض المنتجات', html.includes('renderProducts'));
check('products', 'دالة إضافة للسلة (addCart)', html.includes('addCart'));
check('products', 'دالة حذف من السلة (removeCart)', html.includes('removeCart'));
check('products', 'تفاصيل المنتج (openProduct)', html.includes('openProduct'));
check('products', 'المفضلة (togFav)', html.includes('togFav'));

// ═══════════════════════════════════════════
// 5) الحجوزات
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 5) الحجوزات');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('booking', 'شريط الحجوزات (booking-row-container)', html.includes('booking-row-container'));
check('booking', 'حجز طيران (submitFlight)', html.includes('submitFlight'));
check('booking', 'حجز باص (submitBus)', html.includes('submitBus'));
check('booking', 'حجز فندق (submitHotel)', html.includes('submitHotel'));
check('booking', 'حجز حج وعمرة (submitHajj)', html.includes('submitHajj'));
check('booking', 'نافذة نجاح الحجز (booking-success-modal)', html.includes('booking-success-modal') || html.includes('universal-success-overlay'));

// ═══════════════════════════════════════════
// 6) الدفع والطلبات
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 6) الدفع والطلبات');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('checkout', 'شاشة الدفع (sc-checkout)', html.includes('id="sc-checkout"'));
check('checkout', 'رفع الإيصال (co-receipt)', html.includes('id="co-receipt"'));
check('checkout', 'دالة تأكيد الطلب (confirmOrder)', html.includes('confirmOrder'));
check('checkout', 'حقول الاتصال (co-name, co-phone)', html.includes('id="co-name"') && html.includes('id="co-phone"'));
check('checkout', 'اختيار نقطة التسليم (pickup)', html.includes('pickup-val'));
check('checkout', 'البنوك (bank-list)', html.includes('id="bank-list"'));

// ═══════════════════════════════════════════
// 7) نظام النقاط والإحالة
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 7) نظام النقاط والإحالة');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('points', 'شاشة النقاط (sc-points)', html.includes('id="sc-points"'));
check('points', 'بطاقة الرصيد (pt-num)', html.includes('id="pt-num"'));
check('points', 'تسجيل يومي (dailyCheckinSafe)', html.includes('dailyCheckinSafe'));
check('points', 'كود الإحالة (generateMyCode)', html.includes('window.generateMyCode'));
check('points', 'تطبيق الكود (applyReferralCode)', html.includes('window.applyReferralCode'));
check('points', 'حقل الإدخال (ref-input)', html.includes('id="ref-input"'));
check('points', 'النافذة المنبثقة (ref-modal-overlay)', html.includes('id="ref-modal-overlay"'));
check('points', 'رسالة الخطأ (ref-error-overlay)', html.includes('id="ref-error-overlay"'));
check('points', 'رسالة النجاح (ref-success-overlay)', html.includes('id="ref-success-overlay"'));
check('points', 'شراء النقاط (selectPointsPackage)', html.includes('window.selectPointsPackage'));
check('points', 'النافذة المنبثقة للشراء (pts-purchase-modal)', html.includes('id="pts-purchase-modal"'));

// ═══════════════════════════════════════════
// 8) النوافذ الموحدة للنجاح
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 8) النوافذ الموحدة للنجاح');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('success', 'universal-success-overlay', html.includes('id="universal-success-overlay"'));
check('success', 'showSuccess', html.includes('window.showSuccess'));
check('success', 'hideSuccess', html.includes('window.hideSuccess'));

// ═══════════════════════════════════════════
// 9) Firebase والأمان
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 9) Firebase والأمان');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('firebase', 'firebase-config.js', html.includes('firebase-config.js'));
check('firebase', 'firebase-service.js', html.includes('firebase-service.js'));
check('firebase', 'firebase-auth-compat.js', html.includes('firebase-auth-compat'));
check('firebase', 'firebase-firestore-compat.js', html.includes('firebase-firestore-compat'));
check('firebase', 'firebase-messaging (FCM)', html.includes('messaging') || html.includes('PushNotifications'));
check('firebase', 'رفع الإيصال (ImgBB)', html.includes('imgbb') || html.includes('IMGBB') || html.includes('api.imgbb'));

// ═══════════════════════════════════════════
// 10) الملفات الخارجية
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 10) الملفات الخارجية');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const externalScripts = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m => m[1]);
externalScripts.forEach(s => console.log('  📦 ' + s));
const localScripts = externalScripts.filter(s => !s.startsWith('http'));
localScripts.forEach(s => {
  const exists = fs.existsSync(path.join('client', s));
  check('files', s + ' موجود', exists);
});

// ═══════════════════════════════════════════
// 11) فحص Syntax
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 11) فحص Syntax');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const os = require('os');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, syntaxErrs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'audit_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { syntaxErrs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
check('syntax', 'جميع كتل JavaScript سليمة (' + i + ' كتلة)', syntaxErrs === 0);

// ═══════════════════════════════════════════
// 12) الأداء
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 12) الأداء');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('performance', 'حجم الملف < 500 KB (' + sizeKB + ' KB)', html.length < 500 * 1024);
check('performance', 'حجم الملف < 200 KB (' + sizeKB + ' KB) (مثالي)', html.length < 200 * 1024);
check('performance', 'لا توجد صور base64 (لتخفيف الحجم)', !/data:image\/(png|jpg|jpeg)/i.test(html));
check('performance', 'خدمة العملاء عبر واتساب', html.includes('wa.me') || html.includes('whatsapp'));

// ═══════════════════════════════════════════
// التقييم النهائي
// ═══════════════════════════════════════════
console.log('\n════════════════════════════════════════════════════');
console.log('  📊 التقييم النهائي');
console.log('════════════════════════════════════════════════════');
const percent = Math.round((totalScore / totalChecks) * 100);
console.log('  مجموع الفحوصات: ' + totalScore + ' / ' + totalChecks);
console.log('  النتيجة: ' + percent + '%');
console.log('');
if (percent >= 95) console.log('  🏆 ممتاز! جاهز للإطلاق');
else if (percent >= 85) console.log('  ✅ جيد جداً - جاهز تقريباً');
else if (percent >= 70) console.log('  ⚠️ يحتاج بعض التحسينات');
else console.log('  ❌ يحتاج عمل كثير');
console.log('════════════════════════════════════════════════════');
