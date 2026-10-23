const fs = require('fs');
const file = 'client/chizen.html';
const html = fs.readFileSync(file, 'utf8');

console.log('════════════════════════════════════════════════════');
console.log('  🔍 الفحص الحقيقي (Real Data Audit)');
console.log('════════════════════════════════════════════════════\n');

let score = 0, total = 0;
function check(name, condition) {
  total++;
  if (condition) { score++; console.log('  ✅ ' + name); }
  else { console.log('  ❌ ' + name); }
}

// ═══════════════════════════════════════════
// 1) هل يوجد بيانات وهمية (Mock Data)؟
// ═══════════════════════════════════════════
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 1) البحث عن البيانات الوهمية');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('لا يوجد dummy products', !/dummyProducts|mockProducts|fakeProducts/.test(html));
check('لا يوجد sample orders', !/sampleOrders|mockOrders/.test(html));
check('لا يوجد hardcoded products', !/products\s*=\s*\[\s*\{\s*name:\s*['"]منتج/.test(html));
check('لا يوجد placeholder notifications', !/notifications\s*=\s*\[\s*\{\s*title:\s*['"]إشعار/.test(html));
check('لا يوجد mock users', !/mockUsers|dummyUsers/.test(html));

// ═══════════════════════════════════════════
// 2) ربط Firebase للطلبات
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 2) ربط الطلبات بـ Firebase');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('collection orders موجودة', /collection\(['"]orders['"]\)/.test(html));
check('getOrders من Firebase', /getOrders/.test(html) || /getUserOrders/.test(html));
check('renderOrders تستدعي Firebase', /renderOrders[\s\S]{0,500}(getOrders|getUserOrders|collection\(['"]orders['"]\))/.test(html));
check('لا توجد طلبات وهمية في renderOrders', !/renderOrders[\s\S]{0,1000}\[\s*\{\s*id:\s*['"]ORD/.test(html));
check('حفظ الطلب في Firebase', /collection\(['"]orders['"]\)\.add/.test(html) || /collection\(['"]orders['"]\)\.doc/.test(html));

// ═══════════════════════════════════════════
// 3) ربط Firebase للإشعارات
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 3) ربط الإشعارات بـ Firebase');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('collection notifications موجودة', /collection\(['"]notifications['"]\)/.test(html));
check('renderNotifs تستدعي Firebase', /renderNotifs[\s\S]{0,800}(getNotifs|getNotifications|collection\(['"]notifications['"]\))/.test(html));
check('لا توجد إشعارات وهمية', !/renderNotifs[\s\S]{0,800}\[\s*\{\s*id:\s*['"]N/.test(html));

// ═══════════════════════════════════════════
// 4) ربط Firebase للحجوزات
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 4) ربط الحجوزات بـ Firebase');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('collection bookings موجودة', /collection\(['"]bookings['"]\)/.test(html));
check('submitFlight يحفظ في Firebase', /submitFlight[\s\S]{0,800}(collection\(['"]bookings['"]\)\.add|addDoc)/.test(html));
check('submitBus يحفظ في Firebase', /submitBus[\s\S]{0,800}(collection\(['"]bookings['"]\)\.add|addDoc)/.test(html));
check('submitHotel يحفظ في Firebase', /submitHotel[\s\S]{0,800}(collection\(['"]bookings['"]\)\.add|addDoc)/.test(html));
check('submitHajj يحفظ في Firebase', /submitHajj[\s\S]{0,800}(collection\(['"]bookings['"]\)\.add|addDoc)/.test(html));

// ═══════════════════════════════════════════
// 5) ربط Firebase للمنتجات
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 5) ربط المنتجات بـ Firebase');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('FB.getProducts موجودة', /getProducts/.test(html));
check('collection products موجودة', /collection\(['"]products['"]\)/.test(html));
check('المتغير this.products يُملأ من Firebase', /this\.products\s*=\s*d|self\.products\s*=\s*d|self\.products\s*=\s*prods/.test(html));
check('لا توجد منتجات وهمية', !/this\.products\s*=\s*\[/.test(html) || /this\.products\s*=\s*\[\]/.test(html));

// ═══════════════════════════════════════════
// 6) ربط Firebase للمستخدم
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 6) ربط المستخدم بـ Firebase');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('firebase.auth موجودة', /firebase\.auth\(\)/.test(html));
check('currentUser يُستخدم', /currentUser/.test(html));
check('collection users موجودة', /collection\(['"]users['"]\)/.test(html));
check('بيانات المستخدم من Firestore', /getUserProfile|FB\.getUserProfile|collection\(['"]users['"]\)\.doc/.test(html));
check('تحديث ملف المستخدم', /updateUserProfile|FB\.updateUserProfile|collection\(['"]users['"]\)\.doc.*update/.test(html));

// ═══════════════════════════════════════════
// 7) ربط Firebase للنقاط
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 7) ربط النقاط بـ Firebase');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('loyaltyPoints من Firebase', /loyaltyPoints/.test(html));
check('dailyCheckinSafe تحفظ في Firebase', /dailyCheckinSafe[\s\S]{0,800}(\.update|loyaltyPoints: newPoints)/.test(html));
check('applyReferralCode تحفظ في Firebase', /applyReferralCode[\s\S]{0,800}(\.update|loyaltyPoints)/.test(html));

// ═══════════════════════════════════════════
// 8) ربط Firebase للمفضلة
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 8) ربط المفضلة بـ Firebase');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('togFav يحفظ في Firebase أو localStorage', /togFav[\s\S]{0,800}(localStorage|favorites|FB\.)/.test(html));
check('renderFav يقرأ من مصدر حقيقي', /renderFav[\s\S]{0,500}(this\.favorites|localStorage|FB\.)/.test(html));

// ═══════════════════════════════════════════
// 9) ربط Firebase للإشعارات Push
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 9) ربط Push FCM');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
check('saveFcmToken في الكود', /saveFcmToken|FCM_TOKEN/.test(html));
check('PushNotifications للـ APK', /PushNotifications/.test(html));
check('WebPush للمتصفح', /WebPush|web-push/.test(html));

// ═══════════════════════════════════════════
// 10) البحث عن بيانات وهمية قديمة (كلمات مفتاحية)
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 10) البحث عن بيانات وهمية قديمة');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const mockKeywords = ['demo data', 'بيانات تجريبية', 'sample data', 'dummy data', 'fake data', 'placeholder data'];
mockKeywords.forEach(kw => {
  const found = new RegExp(kw, 'i').test(html);
  if (!found) { console.log('  ✅ لا يوجد: "' + kw + '"'); score++; }
  else { console.log('  ⚠️ يوجد: "' + kw + '"'); }
  total++;
});

// ═══════════════════════════════════════════
// التقييم النهائي
// ═══════════════════════════════════════════
console.log('\n════════════════════════════════════════════════════');
console.log('  📊 التقييم النهائي');
console.log('════════════════════════════════════════════════════');
const pct = Math.round((score / total) * 100);
console.log('  مجموع: ' + score + ' / ' + total + ' (' + pct + '%)');
if (pct >= 90) console.log('  🏆 ممتاز - كل شيء حقيقي 100%');
else if (pct >= 75) console.log('  ✅ جيد - معظم الأشياء حقيقية');
else if (pct >= 50) console.log('  ⚠️ يحتاج تحسين - بعض الأشياء وهمية');
else console.log('  ❌ يحتاج عمل كبير');
console.log('════════════════════════════════════════════════════');
