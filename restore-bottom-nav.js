const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// 1) حذف أي نسخة سابقة
html = html.replace(/<!-- ═══ BOTTOM NAV ═══ -->[\s\S]*?<!-- ═══ نهاية BOTTOM NAV ═══ -->/g, '');
html = html.replace(/<div id="bottom-nav"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g, '');

// 2) الشريط السفلي الجديد
const bottomNavHTML = `
<!-- ═══ BOTTOM NAV ═══ -->
<div id="bottom-nav" style="position:fixed;bottom:0;left:0;right:0;z-index:9999;display:flex;justify-content:space-around;align-items:center;background:#ffffff;box-shadow:0 -4px 20px rgba(106,27,154,0.08);border-top:1px solid #e5e7eb;height:65px;">
  
  <button class="bn-it active" onclick="APP.goTab('home', this)" style="flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#D81B60;font-family:inherit;font-size:11px;font-weight:800;cursor:pointer;padding:8px 0;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    <span>الرئيسية</span>
  </button>

  <button class="bn-it" onclick="APP.goTab('orders', this)" style="flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#9ca3af;font-family:inherit;font-size:11px;font-weight:800;cursor:pointer;padding:8px 0;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14h6"/><path d="M9 18h6"/></svg>
    <span>طلباتي</span>
  </button>

  <button class="bn-it" onclick="APP.goTab('cart', this)" style="flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#9ca3af;font-family:inherit;font-size:11px;font-weight:800;cursor:pointer;padding:8px 0;position:relative;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
    <span>السلة</span>
    <div id="cart-b" style="position:absolute;top:2px;right:25%;background:#D81B60;color:#fff;font-size:9px;font-weight:900;border-radius:50%;min-width:16px;height:16px;display:none;align-items:center;justify-content:center;border:2px solid #fff;">0</div>
  </button>

  <button class="bn-it" onclick="APP.goTab('profile', this)" style="flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#9ca3af;font-family:inherit;font-size:11px;font-weight:800;cursor:pointer;padding:8px 0;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    <span>حسابي</span>
  </button>

</div>
<!-- ═══ نهاية BOTTOM NAV ═══ -->
`;

// 3) حقن قبل </body>
if (html.includes('</body>')) {
  html = html.replace('</body>', bottomNavHTML + '\n</body>');
} else {
  html += '\n' + bottomNavHTML;
}

// 4) إضافة padding للـ body لتفادي تغطية المحتوى
if (!html.includes('padding-bottom: 80px')) {
  const paddingStyle = `
<style id="bottom-nav-padding">
  body, #app, #screens, #sc-home, .screen { padding-bottom: 80px !important; }
</style>
`;
  html = html.replace('</head>', paddingStyle + '\n</head>');
}

// 5) حفظ والتحقق
fs.writeFileSync(file + '.bak_nav_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('✅ تم إعادة حقن الشريط السفلي.');
console.log('  - id="bottom-nav": ' + (html.includes('id="bottom-nav"') ? '✅' : '❌'));
console.log('  - bn-it: ' + (html.match(/class="bn-it/g) || []).length + ' مرة');
console.log('  - bn-it active: ' + (html.match(/class="bn-it active"/g) || []).length + ' مرة');

// فحص Syntax
const os = require('os');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'bnav_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT' : '❌ ' + errs + ' errors');
