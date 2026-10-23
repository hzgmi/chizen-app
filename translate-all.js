const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

let count = 0;
function tr(regex, key, ar) {
  const before = html;
  html = html.replace(regex, (match, ...groups) => {
    // إذا كان النص بالفعل يحتوي data-i18n، تخطاه
    if (match.includes('data-i18n=')) return match;
    return match.replace(ar, `<span data-i18n="${key}" data-i18n-ar="${ar}" style="display:inline;">${ar}</span>`);
  });
  if (html !== before) count++;
}

// ═══ 1) شاشة الحساب (profile) ═══
const profileTranslations = [
  ['نشاطي', 'profile.section_activity'],
  ['⚙️ الإعدادات', 'profile.section_settings'],
  ['طلباتي', 'profile.orders'],
  ['تتبع طلباتك', 'profile.track_orders'],
  ['المفضلة', 'profile.favorites'],
  ['المنتجات المحفوظة', 'profile.saved_products'],
  ['نقاط الولاء', 'profile.loyalty_points'],
  ['الإعدادات', 'profile.settings'],
  ['المظهر، الأمان، الخصوصية', 'profile.settings_desc'],
  ['المساعدة والدعم', 'profile.help'],
  ['تواصل معنا', 'profile.contact_us'],
  ['تسجيل خروج', 'profile.logout'],
  ['طلبات', 'profile.orders_stat'],
  ['مفضلة', 'profile.favs_stat'],
  ['نقطة', 'profile.points_stat']
];

profileTranslations.forEach(([ar, key]) => {
  const regex = new RegExp('<div class="sit-ti">' + ar + '<\\/div>|<div class="pstat-lbl">' + ar + '<\\/div>|<div class="sgt">' + ar + '<\\/div>', 'g');
  html = html.replace(regex, match => {
    if (match.includes('data-i18n=')) return match;
    return match.replace('>' + ar + '<', `><span data-i18n="${key}" data-i18n-ar="${ar}">${ar}</span><`);
  });
  count++;
});

// نصوص الوصف (sit-d)
['تتبع طلباتك', 'المنتجات المحفوظة', 'المظهر، الأمان، الخصوصية', 'تواصل معنا'].forEach(ar => {
  const regex = new RegExp('<div class="sit-d"[^>]*>' + ar + '<\\/div>', 'g');
  html = html.replace(regex, match => {
    if (match.includes('data-i18n=')) return match;
    return match.replace('>' + ar + '<', `><span data-i18n="desc.${ar}" data-i18n-ar="${ar}">${ar}</span><`);
  });
  count++;
});

// ═══ 2) السلة ═══
const cartTranslations = [
  ['سلة التسوق', 'cart.title'],
  ['سلتك فارغة', 'cart.empty'],
  ['ابدأ التسوق الآن', 'cart.start'],
  ['إتمام الشراء', 'cart.checkout'],
  ['المجموع', 'cart.subtotal'],
  ['الشحن', 'cart.shipping'],
  ['الإجمالي', 'cart.total'],
  ['مجاني', 'cart.free']
];

cartTranslations.forEach(([ar, key]) => {
  const regex = new RegExp('>' + ar + '<', 'g');
  html = html.replace(regex, match => {
    if (match.includes('data-i18n=')) return match;
    return `><span data-i18n="${key}" data-i18n-ar="${ar}">${ar}</span><`;
  });
});

// ═══ 3) صفحة الدفع (Checkout) ═══
const checkoutTranslations = [
  ['نقطة التسليم', 'checkout.delivery'],
  ['اختر نقطة التسليم', 'checkout.choose_delivery'],
  ['معلومات الاتصال', 'checkout.contact'],
  ['الاسم', 'checkout.name'],
  ['الهاتف', 'checkout.phone'],
  ['طريقة الدفع', 'checkout.payment'],
  ['أرفق صورة إيصال التحويل (اختياري)', 'checkout.receipt'],
  ['تأكيد الطلب', 'checkout.confirm'],
  ['اسمك الكامل', 'checkout.name_placeholder']
];

checkoutTranslations.forEach(([ar, key]) => {
  const regex = new RegExp('>' + ar + '<', 'g');
  html = html.replace(regex, match => {
    if (match.includes('data-i18n=')) return match;
    return `><span data-i18n="${key}" data-i18n-ar="${ar}">${ar}</span><`;
  });
  // placeholder
  const phRegex = new RegExp('placeholder="' + ar + '"', 'g');
  html = html.replace(phRegex, `placeholder="${ar}" data-i18n-placeholder="${key}" data-i18n-placeholder-ar="${ar}"`);
});

// ═══ 4) الحجوزات (Booking) ═══
const bookingTranslations = [
  ['مركز الحجوزات', 'booking.center'],
  ['✈️ طيران', 'booking.flight_tab'],
  ['🚌 باصات', 'booking.bus_tab'],
  ['🕋 حج وعمرة', 'booking.hajj_tab'],
  ['🏨 فنادق', 'booking.hotel_tab'],
  ['✈️ تفاصيل الرحلة', 'booking.flight_details'],
  ['🚌 تفاصيل رحلة الباص', 'booking.bus_details'],
  ['🕋 رحلات الحج والعمرة', 'booking.hajj_details'],
  ['🏨 تفاصيل الفندق', 'booking.hotel_details'],
  ['تأكيد حجز الطيران', 'booking.confirm_flight'],
  ['تأكيد حجز الباص', 'booking.confirm_bus'],
  ['تأكيد الحجز', 'booking.confirm_hajj'],
  ['تأكيد حجز الفندق', 'booking.confirm_hotel'],
  ['شركة الطيران', 'booking.airline'],
  ['من', 'booking.from'],
  ['إلى', 'booking.to'],
  ['التاريخ', 'booking.date'],
  ['المسافرين', 'booking.passengers'],
  ['الدرجة', 'booking.class'],
  ['الاسم الكامل', 'booking.full_name'],
  ['رقم الجواز', 'booking.passport'],
  ['رقم الجوال', 'booking.phone'],
  ['الوقت', 'booking.time'],
  ['عدد المقاعد', 'booking.seats'],
  ['نوع الرحلة', 'booking.trip_type'],
  ['عمرة', 'booking.umrah'],
  ['حج', 'booking.hajj'],
  ['تاريخ السفر التقريبي', 'booking.travel_date'],
  ['عدد الأشخاص', 'booking.people'],
  ['المدينة', 'booking.city'],
  ['اسم الفندق (إن وجد)', 'booking.hotel_name'],
  ['تاريخ الدخول', 'booking.checkin'],
  ['تاريخ الخروج', 'booking.checkout'],
  ['الغرف', 'booking.rooms'],
  ['الضيوف', 'booking.guests']
];

bookingTranslations.forEach(([ar, key]) => {
  const regex = new RegExp('>' + ar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '<', 'g');
  html = html.replace(regex, match => {
    if (match.includes('data-i18n=')) return match;
    return `><span data-i18n="${key}" data-i18n-ar="${ar}">${ar}</span><`;
  });
});

// placeholders الحجوزات
['الاسم كما في الجواز', 'رقم الجوال', 'الاسم', 'رقم الجواز', 'مثال: القاهرة'].forEach(ar => {
  const phRegex = new RegExp('placeholder="' + ar + '"', 'g');
  html = html.replace(phRegex, `placeholder="${ar}" data-i18n-placeholder="ph.${ar}" data-i18n-placeholder-ar="${ar}"`);
});

// ═══ 5) تفاصيل المنتج ═══
const detailsTranslations = [
  ['الكمية', 'details.quantity'],
  ['أضف للسلة', 'details.add_to_cart'],
  ['اشترِ الآن', 'details.buy_now']
];

detailsTranslations.forEach(([ar, key]) => {
  const regex = new RegExp('>' + ar + '<', 'g');
  html = html.replace(regex, match => {
    if (match.includes('data-i18n=')) return match;
    return `><span data-i18n="${key}" data-i18n-ar="${ar}">${ar}</span><`;
  });
});

// ═══ 6) الإعدادات ═══
const settingsTranslations = [
  ['المظهر', 'settings.appearance'],
  ['اللغة', 'settings.language'],
  ['الوضع', 'settings.theme'],
  ['حجم الخط', 'settings.font'],
  ['الأمان', 'settings.security'],
  ['فتح بالبصمة', 'settings.biometric'],
  ['قفل التطبيق ببصمة', 'settings.biometric_desc'],
  ['تغيير كلمة المرور', 'settings.password'],
  ['الإشعارات', 'settings.notifications'],
  ['إشعارات التطبيق', 'settings.app_notifs'],
  ['إشعارات العروض', 'settings.offer_notifs'],
  ['إشعارات الطلبات', 'settings.order_notifs'],
  ['دفتر العناوين', 'settings.address_book'],
  ['البيانات', 'settings.data'],
  ['مسح الكاش', 'settings.clear_cache'],
  ['نسخ احتياطي', 'settings.backup'],
  ['الخصوصية والقانونية', 'settings.legal'],
  ['سياسة الخصوصية', 'settings.privacy'],
  ['الشروط والأحكام', 'settings.terms'],
  ['عن التطبيق', 'settings.about'],
  ['الحساب', 'settings.account'],
  ['تعديل الملف', 'settings.edit_profile'],
  ['حذف الحساب', 'settings.delete_account']
];

settingsTranslations.forEach(([ar, key]) => {
  const regex = new RegExp('>' + ar + '<', 'g');
  html = html.replace(regex, match => {
    if (match.includes('data-i18n=')) return match;
    return `><span data-i18n="${key}" data-i18n-ar="${ar}">${ar}</span><`;
  });
});

// ═══ 7) النقاط ═══
const pointsTranslations = [
  ['نقاط الولاء', 'points.loyalty'],
  ['نقطة ولاء', 'points.unit'],
  ['تسجيل يومي', 'points.checkin'],
  ['كودي', 'points.mycode'],
  ['شحن رصيد', 'points.buy'],
  ['شارك', 'points.share'],
  ['اشتري', 'points.buy_btn'],
  ['ادعُ صديقاً واكسبوا معاً!', 'points.invite_title'],
  ['أدخل كود صديقك لتحصل أنت وهو على 10 نقاط لكل منكما', 'points.invite_desc'],
  ['تطبيق', 'points.apply'],
  ['عرض كودي', 'points.show_code'],
  ['شحن رصيد النقاط', 'points.buy_title'],
  ['اشترِ نقاطاً واستخدمها في أي وقت', 'points.buy_desc']
];

pointsTranslations.forEach(([ar, key]) => {
  const regex = new RegExp('>' + ar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '<', 'g');
  html = html.replace(regex, match => {
    if (match.includes('data-i18n=')) return match;
    return `><span data-i18n="${key}" data-i18n-ar="${ar}">${ar}</span><`;
  });
});

// placeholders
['أدخل الكود (CHZ...)'].forEach(ar => {
  const phRegex = new RegExp('placeholder="' + ar + '"', 'g');
  html = html.replace(phRegex, `placeholder="${ar}" data-i18n-placeholder="points.code_placeholder" data-i18n-placeholder-ar="${ar}"`);
});

// ═══ 8) تحديث ملف en.json ═══
const enTranslations = {
  // البراند
  "brand.ar": "CHIZEN",
  "brand.slogan": "Smart Shopping.. For a Better Life",
  "header.welcome": "Welcome",
  
  // Nav
  "nav.home": "Home",
  "nav.orders": "My Orders",
  "nav.cart": "Cart",
  "nav.profile": "Account",
  
  // Booking row
  "booking.hotels": "Hotels",
  "booking.buses": "Buses",
  "booking.hajj": "Hajj & Umrah",
  "booking.flights": "Flights",
  
  // Home
  "home.best_sellers": "🔥 Best Sellers",
  "home.view_all": "View All",
  "home.search": "Search for a product, brand...",
  
  // Screen titles
  "profile.title": "My Account",
  "cart.title": "Shopping Cart",
  "orders.title": "My Orders",
  "settings.title": "Settings",
  "points.title": "My Points",
  "favorites.title": "Favorites",
  "help.title": "Help",
  "notifications.title": "Notifications",
  
  // Profile
  "profile.section_activity": "📦 My Activity",
  "profile.section_settings": "⚙️ Settings",
  "profile.orders": "My Orders",
  "profile.track_orders": "Track your orders",
  "profile.favorites": "Favorites",
  "profile.saved_products": "Saved products",
  "profile.loyalty_points": "Loyalty Points",
  "profile.settings": "Settings",
  "profile.settings_desc": "Appearance, security, privacy",
  "profile.help": "Help & Support",
  "profile.contact_us": "Contact us",
  "profile.logout": "Logout",
  "profile.orders_stat": "Orders",
  "profile.favs_stat": "Favorites",
  "profile.points_stat": "Points",
  "desc.تتبع طلباتك": "Track your orders",
  "desc.المنتجات المحفوظة": "Saved products",
  "desc.المظهر، الأمان، الخصوصية": "Appearance, security, privacy",
  "desc.تواصل معنا": "Contact us",
  
  // Cart
  "cart.empty": "Your cart is empty",
  "cart.start": "Start shopping now",
  "cart.checkout": "Checkout",
  "cart.subtotal": "Subtotal",
  "cart.shipping": "Shipping",
  "cart.total": "Total",
  "cart.free": "Free",
  
  // Checkout
  "checkout.delivery": "Delivery Point",
  "checkout.choose_delivery": "Choose delivery point",
  "checkout.contact": "Contact Info",
  "checkout.name": "Name",
  "checkout.phone": "Phone",
  "checkout.payment": "Payment Method",
  "checkout.receipt": "Attach payment receipt (optional)",
  "checkout.confirm": "Confirm Order",
  "checkout.name_placeholder": "Your full name",
  
  // Booking
  "booking.center": "Booking Center",
  "booking.flight_tab": "✈️ Flight",
  "booking.bus_tab": "🚌 Buses",
  "booking.hajj_tab": "🕋 Hajj & Umrah",
  "booking.hotel_tab": "🏨 Hotels",
  "booking.flight_details": "✈️ Flight Details",
  "booking.bus_details": "🚌 Bus Details",
  "booking.hajj_details": "🕋 Hajj & Umrah Trips",
  "booking.hotel_details": "🏨 Hotel Details",
  "booking.confirm_flight": "Confirm Flight Booking",
  "booking.confirm_bus": "Confirm Bus Booking",
  "booking.confirm_hajj": "Confirm Booking",
  "booking.confirm_hotel": "Confirm Hotel Booking",
  "booking.airline": "Airline",
  "booking.from": "From",
  "booking.to": "To",
  "booking.date": "Date",
  "booking.passengers": "Passengers",
  "booking.class": "Class",
  "booking.full_name": "Full Name",
  "booking.passport": "Passport No.",
  "booking.phone": "Phone",
  "booking.time": "Time",
  "booking.seats": "Seats",
  "booking.trip_type": "Trip Type",
  "booking.umrah": "Umrah",
  "booking.hajj": "Hajj",
  "booking.travel_date": "Approx. Travel Date",
  "booking.people": "People",
  "booking.city": "City",
  "booking.hotel_name": "Hotel name (if any)",
  "booking.checkin": "Check-in",
  "booking.checkout": "Check-out",
  "booking.rooms": "Rooms",
  "booking.guests": "Guests",
  
  // Placeholders
  "ph.الاسم كما في الجواز": "Name as in passport",
  "ph.رقم الجوال": "Phone number",
  "ph.الاسم": "Name",
  "ph.رقم الجواز": "Passport number",
  "ph.مثال: القاهرة": "e.g. Cairo",
  
  // Details
  "details.quantity": "Quantity",
  "details.add_to_cart": "Add to Cart",
  "details.buy_now": "Buy Now",
  
  // Settings
  "settings.appearance": "Appearance",
  "settings.language": "Language",
  "settings.theme": "Theme",
  "settings.font": "Font Size",
  "settings.security": "Security",
  "settings.biometric": "Biometric Lock",
  "settings.biometric_desc": "Lock app with fingerprint",
  "settings.password": "Change Password",
  "settings.notifications": "Notifications",
  "settings.app_notifs": "App Notifications",
  "settings.offer_notifs": "Offer Notifications",
  "settings.order_notifs": "Order Notifications",
  "settings.address_book": "Address Book",
  "settings.data": "Data",
  "settings.clear_cache": "Clear Cache",
  "settings.backup": "Backup",
  "settings.legal": "Privacy & Legal",
  "settings.privacy": "Privacy Policy",
  "settings.terms": "Terms & Conditions",
  "settings.about": "About App",
  "settings.account": "Account",
  "settings.edit_profile": "Edit Profile",
  "settings.delete_account": "Delete Account",
  
  // Points
  "points.loyalty": "Loyalty Points",
  "points.unit": "loyalty points",
  "points.checkin": "Daily Check-in",
  "points.mycode": "My Code",
  "points.buy": "Buy Points",
  "points.share": "Share",
  "points.buy_btn": "Buy",
  "points.invite_title": "Invite a friend and win together!",
  "points.invite_desc": "Enter your friend's code so both of you get 10 points",
  "points.apply": "Apply",
  "points.show_code": "Show My Code",
  "points.buy_title": "Buy Loyalty Points",
  "points.buy_desc": "Buy points and use them anytime",
  "points.code_placeholder": "Enter code (CHZ...)"
};

fs.writeFileSync('client/i18n/en.json', JSON.stringify(enTranslations, null, 2));
console.log('✅ تم تحديث en.json بـ ' + Object.keys(enTranslations).length + ' ترجمة.');

// حفظ
fs.writeFileSync(file + '.bak_translateall_' + Date.now(), original);
fs.writeFileSync(file, html);

// فحص
const countI18n = (html.match(/data-i18n=/g) || []).length;
const countI18nPh = (html.match(/data-i18n-placeholder=/g) || []).length;
console.log('\n═══ التحقق ═══');
console.log('  - عناصر data-i18n: ' + countI18n);
console.log('  - عناصر data-i18n-placeholder: ' + countI18nPh);

// فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'ta_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
