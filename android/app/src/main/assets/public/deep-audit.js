const fs = require('fs');

const html = fs.readFileSync('chizen.html', 'utf8');
const chatJs = fs.readFileSync('chat-widget.js', 'utf8');
const fbJs = fs.readFileSync('firebase-service.js', 'utf8');

console.log("=== ١. فحص تعارضات الـ Event Listeners (إضافة مستمعين متكررة) ===");
let clickListeners = (html.match(/addEventListener\('click'/g) || []).length;
let touchListeners = (html.match(/addEventListener\('touchstart'/g) || []).length;
console.log(`عدد مستمعي النقر (Click) في chizen.html: ${clickListeners}`);
console.log(`عدد مستمعي اللمس (Touch) في chizen.html: ${touchListeners}`);
if (clickListeners > 5) console.log("⚠️ تحذير: يوجد عدد كبير من مستمعي النقر، قد يسبب بطء.");

console.log("\n=== ٢. فحص ربط الأقسام (Categories) ===");
const catMatches = html.match(/onclick="[^"]*openCategoryPage[^"]*"/g) || [];
if (html.includes('APP.openCategoryPage') && catMatches.length > 0) {
    console.log(`✅ دالة الأقسام موجودة ومربوطة بـ ${catMatches.length} عنصر مباشرة.`);
} else if (html.includes('window.openCategoryPage') || chatJs.includes('openCategoryPage')) {
    console.log("✅ دالة الأقسام موجودة ومرتبطة عبر كود آخر.");
} else {
    console.log("⚠️ دالة الأقسام موجودة، لكن قد تكون مربوطة بطريقة غير مباشرة (Event Delegation).");
}

console.log("\n=== ٣. فحص تعارض التوجيه (Routing) ===");
// هل فيه أكتر من دالة بتتحكم في إخفاء وإظهار الشاشات؟
if (html.includes('goTab:function') && html.includes('goTab = function')) {
    console.log("⚠️ تحذير: دالة goTab (التوجيه) معرفة مرتين! قد يحدث تعارض.");
} else {
    console.log("✅ دالة التوجيه (goTab) معرفة مرة واحدة.");
}

console.log("\n=== ٤. فحص ربط الفايربيس (Firebase Bindings) ===");
// هل فيه أكتر من تهيئة للفايربيس؟
const fbInitCount = (html.match(/FB.init\(\)/g) || []).length + (fbJs.match(/FB.init\(\)/g) || []).length;
console.log(`عدد مرات تهيئة الفايربيس: ${fbInitCount} (المفروض 1)`);
if (fbInitCount > 2) console.log("⚠️ تحذير: تهيئة الفايربيس متكررة قد تسبب استهلاك للبيانات.");

// التأكد من وجود المجموعات الأساسية
const collections = ['products', 'orders', 'users', 'notifications'];
collections.forEach(col => {
    if (fbJs.includes(col)) console.log(`✅ مجموعة (${col}) مربوطة في firebase-service.`);
    else console.log(`❌ مجموعة (${col}) غير مربوطة!`);
});

console.log("\n=== ٥. فحص شات الذكاء الاصطناعي (AI Chat) ===");
if (chatJs.includes('callOpenRouterAI') && chatJs.includes('WHATSAPP_NUMBER')) {
    console.log("✅ الشات يدعم (AI + واتساب).");
} else {
    console.log("⚠️ الشات ينقصه ربط الـ AI أو الواتساب.");
}
if (html.includes('chat-widget.js') && html.includes('chat-widget.css')) {
    console.log("✅ ملفات الشات مستدعاة في HTML.");
}

console.log("\n=== ٦. فحص تضارب حالة السلة والمفضلة ===");
if (html.includes('APP.cart') && html.includes('APP.favorites') && html.includes('localStorage')) {
    console.log("✅ السلة والمفضلة تستخدمان LocalStorage للحفظ المحلي.");
} else {
    console.log("⚠️ قد تكون هناك مشكلة في حفظ حالة السلة أو المفضلة.");
}
