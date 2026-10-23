const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) إضافة data-i18n للهيدر ═══
html = html.replace(
  /<div class="chz-ar">شيزن<\/div>/,
  '<div class="chz-ar" data-i18n="brand.ar" data-i18n-ar="شيزن">شيزن</div>'
);
html = html.replace(
  /<div class="chz-tag">تسوق ذكي \.\. لحياة أجمل<\/div>/,
  '<div class="chz-tag" data-i18n="brand.slogan" data-i18n-ar="تسوق ذكي .. لحياة أجمل">تسوق ذكي .. لحياة أجمل</div>'
);
html = html.replace(
  /<span class="welcome">أهلاً بك<\/span>/g,
  '<span class="welcome" data-i18n="header.welcome" data-i18n-ar="أهلاً بك">أهلاً بك</span>'
);

// ═══ 2) الشريط السفلي ═══
html = html.replace(
  /<button class="bn-it active"[^>]*onclick="APP\.goTab\('home'[^>]*>([\s\S]*?)<span>الرئيسية<\/span>/,
  '<button class="bn-it active" onclick="APP.goTab(\'home\', this)" style="flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#D81B60;font-family:inherit;font-size:11px;font-weight:800;cursor:pointer;padding:8px 0;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg><span data-i18n="nav.home" data-i18n-ar="الرئيسية">الرئيسية</span>'
);

html = html.replace(
  /<button class="bn-it"[^>]*onclick="APP\.goTab\('orders'[^>]*>([\s\S]*?)<span>طلباتي<\/span>/,
  '<button class="bn-it" onclick="APP.goTab(\'orders\', this)" style="flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#9ca3af;font-family:inherit;font-size:11px;font-weight:800;cursor:pointer;padding:8px 0;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg><span data-i18n="nav.orders" data-i18n-ar="طلباتي">طلباتي</span>'
);

html = html.replace(
  /<button class="bn-it"[^>]*onclick="APP\.goTab\('cart'[^>]*>([\s\S]*?)<span>السلة<\/span>/,
  '<button class="bn-it" onclick="APP.goTab(\'cart\', this)" style="flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#9ca3af;font-family:inherit;font-size:11px;font-weight:800;cursor:pointer;padding:8px 0;position:relative;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg><span data-i18n="nav.cart" data-i18n-ar="السلة">السلة</span>'
);

html = html.replace(
  /<button class="bn-it"[^>]*onclick="APP\.goTab\('profile'[^>]*>([\s\S]*?)<span>حسابي<\/span>/,
  '<button class="bn-it" onclick="APP.goTab(\'profile\', this)" style="flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#9ca3af;font-family:inherit;font-size:11px;font-weight:800;cursor:pointer;padding:8px 0;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span data-i18n="nav.profile" data-i18n-ar="حسابي">حسابي</span>'
);

// ═══ 3) شريط الحجوزات ═══
html = html.replace(
  /<span class="booking-label">فنادق<\/span>/,
  '<span class="booking-label" data-i18n="booking.hotels" data-i18n-ar="فنادق">فنادق</span>'
);
html = html.replace(
  /<span class="booking-label">حافلات<\/span>/,
  '<span class="booking-label" data-i18n="booking.buses" data-i18n-ar="حافلات">حافلات</span>'
);
html = html.replace(
  /<span class="booking-label">حج وعمرة<\/span>/,
  '<span class="booking-label" data-i18n="booking.hajj" data-i18n-ar="حج وعمرة">حج وعمرة</span>'
);
html = html.replace(
  /<span class="booking-label">رحلات طيران<\/span>/,
  '<span class="booking-label" data-i18n="booking.flights" data-i18n-ar="رحلات طيران">رحلات طيران</span>'
);

// ═══ 4) الأكثر مبيعاً + عرض الكل ═══
html = html.replace(
  /<div class="stl" style="font-weight:900; font-size:20px; color:#1f2937;">🔥 الأكثر مبيعاً<\/div>/,
  '<div class="stl" style="font-weight:900; font-size:20px; color:#1f2937;" data-i18n="home.best_sellers" data-i18n-ar="🔥 الأكثر مبيعاً">🔥 الأكثر مبيعاً</div>'
);
html = html.replace(
  /<a onclick="APP\.filterCat\('all'\)"[^>]*>عرض الكل<\/a>/,
  '<a onclick="APP.filterCat(\'all\')" style="color:#D81B60; font-size:13px; font-weight:bold; cursor:pointer;" data-i18n="home.view_all" data-i18n-ar="عرض الكل">عرض الكل</a>'
);

// ═══ 5) عناوين الشاشات (sh2) ═══
const screenTitles = [
  { ar: 'حسابي', key: 'profile.title' },
  { ar: 'سلة التسوق', key: 'cart.title' },
  { ar: 'طلباتي', key: 'orders.title' },
  { ar: 'الإعدادات', key: 'settings.title' },
  { ar: 'نقاطي', key: 'points.title' },
  { ar: 'المفضلة', key: 'favorites.title' },
  { ar: 'المساعدة', key: 'help.title' },
  { ar: 'الإشعارات', key: 'notifications.title' }
];

screenTitles.forEach(item => {
  const regex = new RegExp('<div class="st2">([^<]*' + item.ar + '[^<]*)</div>', 'g');
  html = html.replace(regex, `<div class="st2" data-i18n="${item.key}" data-i18n-ar="$1">$1</div>`);
});

// ═══ 6) البحث ═══
html = html.replace(
  /placeholder="ابحث عن منتج، علامة تجارية\.\.\."/g,
  'placeholder="ابحث عن منتج، علامة تجارية..." data-i18n-placeholder="home.search" data-i18n-placeholder-ar="ابحث عن منتج، علامة تجارية..."'
);

// ═══ 7) تحديث ملف en.json ═══
const enJSON = {
  "brand.ar": "شيزن",
  "brand.slogan": "Smart Shopping.. For a Better Life",
  "header.welcome": "Welcome",
  "nav.home": "Home",
  "nav.orders": "My Orders",
  "nav.cart": "Cart",
  "nav.profile": "Account",
  "booking.hotels": "Hotels",
  "booking.buses": "Buses",
  "booking.hajj": "Hajj & Umrah",
  "booking.flights": "Flights",
  "home.best_sellers": "🔥 Best Sellers",
  "home.view_all": "View All",
  "home.search": "Search for a product, brand...",
  "profile.title": "My Account",
  "cart.title": "Shopping Cart",
  "orders.title": "My Orders",
  "settings.title": "Settings",
  "points.title": "My Points",
  "favorites.title": "Favorites",
  "help.title": "Help",
  "notifications.title": "Notifications"
};

fs.writeFileSync('client/i18n/en.json', JSON.stringify(enJSON, null, 2));
console.log('✅ تم تحديث ملف en.json بـ ' + Object.keys(enJSON).length + ' ترجمة.');

// حفظ
fs.writeFileSync(file + '.bak_translate_' + Date.now(), original);
fs.writeFileSync(file, html);

// فحص
const countI18n = (html.match(/data-i18n=/g) || []).length;
console.log('\n═══ التحقق ═══');
console.log('  - عناصر data-i18n: ' + countI18n);
console.log('  - عناصر data-i18n-placeholder: ' + (html.match(/data-i18n-placeholder=/g) || []).length);

// فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'tr_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
