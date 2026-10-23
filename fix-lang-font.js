const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

console.log('🔍 فحص سريع قبل الإصلاح:');
console.log('  openModal موجودة: ' + (html.includes('openModal:') || html.includes('openModal =') ? '✅' : '❌'));
console.log('  showConfirm: ' + (html.includes('showConfirm:') || html.includes('showConfirm =') ? '✅' : '❌'));

// ═══ 1) إعادة كتابة openLang و openFont بدون openModal ═══
// نحذف القديمة ونضع جديدة تعمل بشكل مستقل

// حذف openLang القديمة
html = html.replace(/openLang\s*:\s*function\s*\([^)]*\)\s*\{[\s\S]*?\n\s{2,4}\},/g, '');
// حذف openFont القديمة  
html = html.replace(/openFont\s*:\s*function\s*\([^)]*\)\s*\{[\s\S]*?\n\s{2,4}\},/g, '');

// إضافة الدوال الجديدة في كتلة مستقلة
const newFunctions = `
<script>
// ═══ دوال اللغة والخط (تعمل بشكل مستقل) ═══
window.showLangModal = function() {
  var current = localStorage.getItem('chizen_lang') || 'ar';
  
  var overlay = document.createElement('div');
  overlay.id = 'lang-modal-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(2,5,27,0.85);backdrop-filter:blur(12px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';
  
  overlay.innerHTML = \`
    <div style="background:linear-gradient(135deg,#040b31,#25074c);border:1px solid rgba(255,39,201,0.3);border-radius:24px;padding:25px;max-width:340px;width:100%;box-shadow:0 25px 70px rgba(255,39,201,0.3);">
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:40px;">🌐</div>
        <div style="font-size:18px;font-weight:900;color:#f8f9ff;margin-top:8px;">اختر اللغة</div>
      </div>
      <div onclick="setLanguage('ar')" style="display:flex;align-items:center;gap:12px;padding:15px;margin-bottom:10px;background:\${current === 'ar' ? 'rgba(255,39,201,0.2)' : 'rgba(7,23,71,0.6)'};border:2px solid \${current === 'ar' ? '#ff27c9' : 'rgba(120,150,255,0.2)'};border-radius:14px;cursor:pointer;transition:all 0.2s;">
        <span style="font-size:24px;">🇾🇪</span>
        <div style="flex:1;">
          <div style="color:#f8f9ff;font-weight:800;font-size:15px;">العربية</div>
          <div style="color:#b8c5ee;font-size:11px;">اللغة العربية</div>
        </div>
        \${current === 'ar' ? '<span style="color:#ff27c9;font-size:20px;">✓</span>' : ''}
      </div>
      <div onclick="setLanguage('en')" style="display:flex;align-items:center;gap:12px;padding:15px;margin-bottom:15px;background:\${current === 'en' ? 'rgba(255,39,201,0.2)' : 'rgba(7,23,71,0.6)'};border:2px solid \${current === 'en' ? '#ff27c9' : 'rgba(120,150,255,0.2)'};border-radius:14px;cursor:pointer;transition:all 0.2s;">
        <span style="font-size:24px;">🇬🇧</span>
        <div style="flex:1;">
          <div style="color:#f8f9ff;font-weight:800;font-size:15px;">English</div>
          <div style="color:#b8c5ee;font-size:11px;">English language</div>
        </div>
        \${current === 'en' ? '<span style="color:#ff27c9;font-size:20px;">✓</span>' : ''}
      </div>
      <button onclick="document.getElementById('lang-modal-overlay').remove()" style="width:100%;padding:14px;background:rgba(7,23,71,0.7);color:#b8c5ee;border:1px solid rgba(120,150,255,0.2);border-radius:12px;font-family:inherit;font-weight:700;font-size:14px;cursor:pointer;">إلغاء</button>
    </div>
  \`;
  
  document.body.appendChild(overlay);
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
};

window.setLanguage = function(lang) {
  localStorage.setItem('chizen_lang', lang);
  var overlay = document.getElementById('lang-modal-overlay');
  if (overlay) overlay.remove();
  if (window.toast) toast(lang === 'ar' ? '🇾🇪 تم اختيار العربية' : '🇬🇧 English selected', 'suc');
  setTimeout(function() { location.reload(); }, 700);
};

window.showFontModal = function() {
  var current = localStorage.getItem('chizen_fontsize') || 'medium';
  
  var overlay = document.createElement('div');
  overlay.id = 'font-modal-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(2,5,27,0.85);backdrop-filter:blur(12px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';
  
  overlay.innerHTML = \`
    <div style="background:linear-gradient(135deg,#040b31,#25074c);border:1px solid rgba(255,39,201,0.3);border-radius:24px;padding:25px;max-width:340px;width:100%;box-shadow:0 25px 70px rgba(255,39,201,0.3);">
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:40px;">🔤</div>
        <div style="font-size:18px;font-weight:900;color:#f8f9ff;margin-top:8px;">حجم الخط</div>
      </div>
      <div onclick="setFontSize('small')" style="display:flex;align-items:center;gap:12px;padding:15px;margin-bottom:10px;background:\${current === 'small' ? 'rgba(255,39,201,0.2)' : 'rgba(7,23,71,0.6)'};border:2px solid \${current === 'small' ? '#ff27c9' : 'rgba(120,150,255,0.2)'};border-radius:14px;cursor:pointer;">
        <div style="font-size:14px;color:#f8f9ff;flex:1;font-weight:700;">صغير</div>
        <div style="color:#b8c5ee;font-size:11px;">Aa</div>
        \${current === 'small' ? '<span style="color:#ff27c9;font-size:20px;">✓</span>' : ''}
      </div>
      <div onclick="setFontSize('medium')" style="display:flex;align-items:center;gap:12px;padding:15px;margin-bottom:10px;background:\${current === 'medium' ? 'rgba(255,39,201,0.2)' : 'rgba(7,23,71,0.6)'};border:2px solid \${current === 'medium' ? '#ff27c9' : 'rgba(120,150,255,0.2)'};border-radius:14px;cursor:pointer;">
        <div style="font-size:16px;color:#f8f9ff;flex:1;font-weight:700;">متوسط (افتراضي)</div>
        <div style="color:#b8c5ee;font-size:13px;">Aa</div>
        \${current === 'medium' ? '<span style="color:#ff27c9;font-size:20px;">✓</span>' : ''}
      </div>
      <div onclick="setFontSize('large')" style="display:flex;align-items:center;gap:12px;padding:15px;margin-bottom:15px;background:\${current === 'large' ? 'rgba(255,39,201,0.2)' : 'rgba(7,23,71,0.6)'};border:2px solid \${current === 'large' ? '#ff27c9' : 'rgba(120,150,255,0.2)'};border-radius:14px;cursor:pointer;">
        <div style="font-size:18px;color:#f8f9ff;flex:1;font-weight:700;">كبير</div>
        <div style="color:#b8c5ee;font-size:15px;">Aa</div>
        \${current === 'large' ? '<span style="color:#ff27c9;font-size:20px;">✓</span>' : ''}
      </div>
      <button onclick="document.getElementById('font-modal-overlay').remove()" style="width:100%;padding:14px;background:rgba(7,23,71,0.7);color:#b8c5ee;border:1px solid rgba(120,150,255,0.2);border-radius:12px;font-family:inherit;font-weight:700;font-size:14px;cursor:pointer;">إلغاء</button>
    </div>
  \`;
  
  document.body.appendChild(overlay);
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
};

window.setFontSize = function(size) {
  localStorage.setItem('chizen_fontsize', size);
  var px = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
  document.body.style.fontSize = px;
  var overlay = document.getElementById('font-modal-overlay');
  if (overlay) overlay.remove();
  if (window.toast) toast('✓ تم تغيير حجم الخط', 'suc');
};
</script>
`;
html = html.replace('</body>', newFunctions + '\n</body>');

// ═══ 2) تحديث onclick في HTML لاستدعاء الدوال الجديدة ═══
// استبدال APP.openLang() و APP.openFont()
html = html.replace(/onclick="APP\.openLang\(\)"/g, 'onclick="showLangModal()"');
html = html.replace(/onclick="APP\.openFont\(\)"/g, 'onclick="showFontModal()"');

// 3) حفظ
fs.writeFileSync(file + '.bak_langfont_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('\n═══ التحقق ═══');
console.log('  - showLangModal: ' + (html.includes('window.showLangModal') ? '✅' : '❌'));
console.log('  - showFontModal: ' + (html.includes('window.showFontModal') ? '✅' : '❌'));
console.log('  - setLanguage: ' + (html.includes('window.setLanguage') ? '✅' : '❌'));
console.log('  - setFontSize: ' + (html.includes('window.setFontSize') ? '✅' : '❌'));
console.log('  - onclick="showLangModal()": ' + (html.includes('onclick="showLangModal()"') ? '✅' : '❌'));
console.log('  - onclick="showFontModal()": ' + (html.includes('onclick="showFontModal()"') ? '✅' : '❌'));

// 4) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'lf_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
