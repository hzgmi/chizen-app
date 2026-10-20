const fs = require('fs');
let html = fs.readFileSync('chizen.html', 'utf8');

// ══════════════════════════════════════════════════
// ١. فحص واجهة صفحة القسم
// ══════════════════════════════════════════════════
console.log("=== فحص واجهة صفحة القسم ===");

// التأكد من وجود الصفحة
if (!html.includes('id="sc-category"')) {
    console.log("❌ صفحة القسم غير موجودة في HTML!");
} else {
    console.log("✅ صفحة القسم موجودة في HTML.");
}

// فحص تنسيقات الشاشة الكاملة
if (html.includes('#sc-category') && html.includes('position: fixed')) {
    console.log("✅ تنسيق الشاشة الكاملة موجود.");
} else {
    console.log("⚠️ تنسيق الشاشة الكاملة ناقص أو غير مكتمل.");
}

// فحص شبكة المنتجات
if (html.includes('id="cat-products-grid"')) {
    console.log("✅ شبكة المنتجات موجودة.");
} else {
    console.log("❌ شبكة المنتجات غير موجودة!");
}

// فحص دالة الفتح
if (html.includes('APP.openCategoryPage')) {
    console.log("✅ دالة فتح القسم موجودة.");
}

// ══════════════════════════════════════════════════
// ٢. مسح التنسيقات القديمة وإضافة تنسيقات نظيفة (Full Screen)
// ══════════════════════════════════════════════════
// مسح أي تنسيقات قديمة لصفحة القسم
html = html.replace(/<style>\s*#sc-category[\s\S]*?<\/style>/g, '');

// إضافة تنسيقات جديدة كاملة
const newStyles = `
<style id="category-fullscreen-styles">
/* صفحة القسم - شاشة كاملة */
#sc-category {
    display: none;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100% !important;
    height: 100vh !important;
    height: 100dvh !important;
    background: #0A0515 !important;
    z-index: 99999 !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    flex-direction: column;
    padding: 0 !important;
    margin: 0 !important;
}
#sc-category.active,
#sc-category[style*="display: block"] {
    display: flex !important;
}
#sc-category .st { height: env(safe-area-inset-top, 20px); }
#sc-category .sh2 {
    display: flex !important;
    align-items: center !important;
    padding: 15px 20px !important;
    background: #1F0D35 !important;
    border-bottom: 1px solid #333 !important;
    position: sticky;
    top: 0;
    z-index: 10;
}
#sc-category .sh2 .back {
    background: rgba(255,255,255,0.05) !important;
    border: none !important;
    color: #fff !important;
    width: 40px !important;
    height: 40px !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer;
    margin-left: 10px;
}
#sc-category .sh2 .back svg {
    width: 20px !important;
    height: 20px !important;
    stroke: currentColor !important;
    fill: none !important;
    stroke-width: 2 !important;
    transform: rotate(180deg);
}
#sc-category .sh2 .st2 {
    color: #fff !important;
    font-size: 18px !important;
    font-weight: bold !important;
    flex: 1;
    text-align: right;
}
#cat-products-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 12px !important;
    padding: 15px !important;
    padding-bottom: 100px !important;
    width: 100% !important;
    box-sizing: border-box;
}
.cat-prod-card {
    background: #1F0D35 !important;
    border-radius: 14px !important;
    overflow: hidden !important;
    padding-bottom: 10px !important;
    text-align: center !important;
    cursor: pointer;
    border: 1px solid #2a1540 !important;
    transition: transform 0.2s;
}
.cat-prod-card:active { transform: scale(0.97); }
.cat-prod-card img {
    width: 100% !important;
    height: 160px !important;
    object-fit: cover !important;
    display: block !important;
    background: #150a25;
}
.cat-prod-card .name {
    color: #fff !important;
    font-size: 13px !important;
    font-weight: 700 !important;
    padding: 10px 10px 4px !important;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 36px;
}
.cat-prod-card .price {
    color: #ff27c9 !important;
    font-size: 15px !important;
    font-weight: 900 !important;
    padding: 4px 10px 8px !important;
}
.cat-prod-card .price::after { content: ''; }
.cat-empty {
    text-align: center;
    padding: 80px 20px;
    color: #aaa;
    grid-column: 1 / -1;
    font-size: 15px;
}
</style>
`;
if (!html.includes('id="category-fullscreen-styles"')) {
    html = html.replace('</head>', newStyles + '</head>');
    console.log("✅ تمت إضافة تنسيقات الشاشة الكاملة لصفحة القسم.");
}

// ══════════════════════════════════════════════════
// ٣. تعديل دالة فتح القسم لضمان الشاشة الكاملة
// ══════════════════════════════════════════════════
// مسح الدالة القديمة
html = html.replace(/APP\.openCategoryPage\s*=\s*function\(catKey, catName\)\s*\{[\s\S]*?\n\};/g, '');
html = html.replace(/APP\.closeCategory\s*=\s*function\(\)\s*\{[\s\S]*?\n\};/g, '');

// إضافة الدالة المحسّنة
const newCatFn = `
APP.openCategoryPage = function(catKey, catName) {
    console.log('📂 فتح قسم:', catKey, '|', catName);
    
    // إخفاء كل الشاشات
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        if (s.id !== 'sc-category') s.style.display = 'none';
    });
    
    // إخفاء الـ nav-bar السفلي مؤقتاً
    const navBar = document.querySelector('.nav-bar, .bottom-nav, #bottom-nav');
    if (navBar) navBar.style.display = 'none';
    
    // إظهار صفحة القسم كشاشة كاملة
    const catScreen = document.getElementById('sc-category');
    if (!catScreen) {
        alert('خطأ: صفحة القسم غير موجودة');
        return;
    }
    
    catScreen.style.display = 'flex';
    catScreen.classList.add('active');
    
    // تعيين العنوان
    const titleEl = document.getElementById('cat-page-title');
    if (titleEl) titleEl.innerText = catName || 'القسم';
    
    // تعبئة شبكة المنتجات
    const grid = document.getElementById('cat-products-grid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="cat-empty">⏳ جاري تحميل المنتجات...</div>';

    if (!window.FB || !window.FB.getProducts) {
        grid.innerHTML = '<div class="cat-empty">⚠️ لا يمكن الاتصال بالبيانات</div>';
        return;
    }
    
    window.FB.getProducts().then(function(prods) {
        // فلترة دقيقة (تشمل category و cat)
        const filtered = prods.filter(function(p) {
            const pCat = (p.category || p.cat || '').toString().toLowerCase();
            const targetCat = (catKey || '').toString().toLowerCase();
            return pCat === targetCat;
        });
        
        console.log('✅ عدد المنتجات في القسم:', filtered.length);
        
        if (filtered.length === 0) {
            grid.innerHTML = '<div class="cat-empty">📭 لا توجد منتجات في هذا القسم حالياً</div>';
            return;
        }
        
        grid.innerHTML = filtered.map(function(p) {
            const imgUrl = p.img || p.image || 'https://via.placeholder.com/200?text=No+Image';
            const price = p.price || '0';
            return '<div class="cat-prod-card" onclick="APP.openProduct(\\'' + p.id + '\\')">' +
                   '<img src="' + imgUrl + '" onerror="this.src=\\'https://via.placeholder.com/200\\'">' +
                   '<div class="name">' + (p.name || 'منتج') + '</div>' +
                   '<div class="price">' + price + ' ر.س</div>' +
                   '</div>';
        }).join('');
    }).catch(function(err) {
        console.error('خطأ في جلب المنتجات:', err);
        grid.innerHTML = '<div class="cat-empty">⚠️ حدث خطأ في تحميل المنتجات</div>';
    });
};

APP.closeCategory = function() {
    const catScreen = document.getElementById('sc-category');
    if (catScreen) {
        catScreen.style.display = 'none';
        catScreen.classList.remove('active');
    }
    // إعادة إظهار الـ nav-bar
    const navBar = document.querySelector('.nav-bar, .bottom-nav, #bottom-nav');
    if (navBar) navBar.style.display = '';
    APP.goTab('home');
};
`;

html = html.replace('</script>', newCatFn + '\n</script>');

fs.writeFileSync('chizen.html', html);
console.log("\n✅ تم تحديث دالة فتح القسم لضمان الشاشة الكاملة.");

// ══════════════════════════════════════════════════
// ٤. الفحص النهائي
// ══════════════════════════════════════════════════
console.log("\n=== الفحص النهائي للأخطاء ===");
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
let match; let count = 0; let err = false;
while ((match = scriptRegex.exec(html)) !== null) {
    count++;
    if (!match[1].trim()) continue;
    try { new Function(match[1]); } catch (e) { 
        console.log('❌ خطأ في سكربت ' + count + ': ' + e.message); 
        err = true; 
    }
}
if (!err) console.log('✅ جميع السكربتات سليمة 100% (' + count + ' سكربت).');
