const fs = require('fs');
const path = require('path');

console.log("=== ١. فحص أخطاء الجافاسكريبت في كل الملفات ===");
const files = fs.readdirSync('.');
let jsFiles = files.filter(f => f.endsWith('.js'));
let hasError = false;

jsFiles.forEach(f => {
    const code = fs.readFileSync(f, 'utf8');
    try {
        new Function(code);
        console.log(`✅ ${f} - سليم`);
    } catch (e) {
        console.log(`❌ ${f} - خطأ: ${e.message}`);
        hasError = true;
    }
});

if (!hasError) console.log("✅ جميع ملفات الجافاسكريبت سليمة 100%.\n");

console.log("=== ٢. فحص الدوال الأساسية في chizen.html ===");
const html = fs.readFileSync('chizen.html', 'utf8');
const requiredFunctions = [
    'APP.openCategoryPage', 'APP.closeCategory', 'APP.renderColorSwatches', 
    'APP.toggleFavorite', 'APP.renderFavorites', 'APP.saveNewAddress', 
    'APP.getTimelineHtml', 'APP.clearAllNotifs'
];

requiredFunctions.forEach(fn => {
    if (html.includes(fn) || files.some(f => fs.readFileSync(f, 'utf8').includes(fn))) {
        console.log(`✅ ${fn} - موجود`);
    } else {
        console.log(`❌ ${fn} - مفقود!`);
    }
});

console.log("\n=== ٣. فحص شريط البحث ===");
if (html.includes('global-search') && html.includes('searchInput.addEventListener')) {
    console.log("✅ شريط البحث موجود ومربوط.");
} else {
    console.log("❌ شريط البحث ناقص أو غير مربوط.");
}

console.log("\n=== ٤. فحص واجهة الواتساب (Chat Widget) ===");
if (files.includes('chat-widget.js') && files.includes('chat-widget.css')) {
    const chatJs = fs.readFileSync('chat-widget.js', 'utf8');
    if (chatJs.includes('callOpenRouterAI')) {
        console.log("✅ الذكاء الاصطناعي (OpenRouter) مربوط.");
    } else {
        console.log("⚠️ دالة الذكاء الاصطناعي غير موجودة.");
    }
    if (chatJs.includes('OPENROUTER_KEY') && chatJs.includes('ضع_المفتاح_هنا')) {
        console.log("⚠️ تحذير: مفتاح OpenRouter لم يتم استبداله بعد!");
    } else {
        console.log("✅ مفتاح OpenRouter تم إعداده.");
    }
} else {
    console.log("❌ ملفات الشات مفقودة.");
}

console.log("\n=== ٥. فحص إعدادات Capacitor ===");
if (fs.existsSync('../capacitor.config.json')) {
    const cap = JSON.parse(fs.readFileSync('../capacitor.config.json', 'utf8'));
    if (cap.appId === 'com.cheezan.app' && cap.webDir === 'client') {
        console.log("✅ إعدادات Capacitor صحيحة.");
    } else {
        console.log("⚠️ إعدادات Capacitor تحتاج مراجعة:", cap);
    }
} else {
    console.log("❌ ملف capacitor.config.json غير موجود.");
}
