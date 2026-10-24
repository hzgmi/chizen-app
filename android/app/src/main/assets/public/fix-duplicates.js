const fs = require('fs');
let html = fs.readFileSync('chizen.html', 'utf8');

// ١. مسح كل أكواد صفحة الأقسام القديمة (المكررة)
// هنمسح من أول APP.openCategoryPage لحد نهاية الـ Event Listener بتاعها
const regex = /APP\.openCategoryPage\s*=\s*function[\s\S]*?APP\.closeCategory\s*=\s*function[\s\S]*?\};\s*\}\s*\);/g;
// هنمسح كل التكرارات الأول
let iterations = 0;
while (html.match(regex) && iterations < 5) {
    html = html.replace(regex, '');
    iterations++;
}

// هنمسح أي Event Listener قديم بيخص الأقسام عشان نمسحه ونحط واحد جديد
html = html.replace(/document\.addEventListener\('DOMContentLoaded',\s*function\(\)\s*\{\s*document\.body\.addEventListener\('click',[\s\S]*?const isCat[\s\S]*?\}\s*,\s*true\s*\);\s*\}\);/g, '');

// ٢. إضافة نسخة واحدة نظيفة ومضمونة
const cleanCatJs = `
APP.openCategoryPage = function(catKey, catName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const catScreen = document.getElementById('sc-category');
    if(!catScreen) return;
    catScreen.style.display = 'block';
    catScreen.classList.add('active');
    
    document.getElementById('cat-page-title').innerText = catName;
    const grid = document.getElementById('cat-products-grid');
    grid.innerHTML = '<div style="text-align:center;padding:50px;color:#fff;grid-column:1/-1;">جاري تحميل المنتجات...</div>';

    if(window.FB && window.FB.getProducts) {
        window.FB.getProducts().then(function(prods) {
            var filtered = prods.filter(function(p) { 
                return (p.category === catKey || p.cat === catKey); 
            });
            
            if(filtered.length === 0) {
                grid.innerHTML = '<div style="text-align:center;padding:50px;color:#fff;grid-column:1/-1;">لا توجد منتجات في هذا القسم حالياً</div>';
            } else {
                grid.innerHTML = filtered.map(function(p) {
                    return '<div class="cat-prod-card" onclick="APP.openProduct(\\''+p.id+'\\')">'+
                           '<img src="'+(p.img||p.image||'')+'" onerror="this.src=\\'https://via.placeholder.com/150\\'">'+
                           '<div class="name">'+p.name+'</div>'+
                           '<div class="price">'+p.price+' ر.س</div></div>';
                }).join('');
            }
        });
    }
};

APP.closeCategory = function() {
    const catScreen = document.getElementById('sc-category');
    if(catScreen) {
        catScreen.style.display = 'none';
        catScreen.classList.remove('active');
    }
    APP.goTab('home');
};

// ربط الأزرار (مرة واحدة بس)
document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('click', function(e) {
        const el = e.target.closest('.cat-card, .c-item, .category-item');
        if (!el) return;
        
        let key = el.getAttribute('data-cat') || el.getAttribute('data-key');
        let name = el.querySelector('.name, .title') ? el.querySelector('.name, .title').innerText : el.innerText.trim();
        
        if (!key && window.APP && window.APP.cats) {
            const catObj = window.APP.cats.find(c => c.name === name || name.includes(c.name));
            if (catObj) key = catObj.key;
        }

        if (key) {
            e.preventDefault();
            e.stopImmediatePropagation();
            APP.openCategoryPage(key, name);
        }
    }, true);
});
`;

// هنحط الكود النظيف مرة واحدة قبل إغلاق الـ script
html = html.replace('</script>', cleanCatJs + '\n</script>');

fs.writeFileSync('chizen.html', html);
console.log('✅ تم مسح التكرارات وتركيب نسخة واحدة نظيفة للأقسام!');

// فحص الأخطاء
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
let match; let count = 0; let err = false;
while ((match = scriptRegex.exec(html)) !== null) {
    count++;
    if (!match[1].trim()) continue;
    try { new Function(match[1]); } catch (e) { console.log('❌ خطأ في سكربت', count, ':', e.message); err = true; }
}
if (!err) console.log('✅ فحص الكود سليم 100%.');
