const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// ═══ 1) إضافة CSS للنوافذ الفاخرة ═══
html = html.replace(/<style id="elegant-dialogs-css">[\s\S]*?<\/style>/g, '');
const dialogsCSS = `
<style id="elegant-dialogs-css">
  /* ═══ نافذة تأكيد فاخرة ═══ */
  #chz-dialog-overlay {
    position: fixed;
    inset: 0;
    background: rgba(2, 5, 27, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 9999999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: dialogFadeIn 0.3s ease-out;
  }
  #chz-dialog-overlay.active { display: flex; }
  @keyframes dialogFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  #chz-dialog-box {
    background: linear-gradient(135deg, #040b31 0%, #25074c 100%);
    border: 1px solid rgba(255, 39, 201, 0.3);
    border-radius: 24px;
    padding: 28px 24px;
    max-width: 360px;
    width: 100%;
    box-shadow: 
      0 25px 70px rgba(255, 39, 201, 0.35),
      0 0 100px rgba(141, 36, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    text-align: center;
    animation: dialogPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
  }
  @keyframes dialogPop {
    0% { transform: scale(0.85); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  /* توهج خلفي */
  #chz-dialog-box::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(255, 39, 201, 0.3), transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  
  .chz-dialog-icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff27c9, #8d24ff);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 18px;
    box-shadow: 0 8px 25px rgba(255, 39, 201, 0.4);
    position: relative;
    z-index: 1;
  }
  .chz-dialog-icon svg {
    width: 36px;
    height: 36px;
    stroke: #fff;
    stroke-width: 2.5;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  
  .chz-dialog-title {
    font-size: 20px;
    font-weight: 900;
    color: #f8f9ff;
    margin-bottom: 10px;
    font-family: 'Tajawal', sans-serif;
    position: relative;
    z-index: 1;
  }
  
  .chz-dialog-message {
    font-size: 14px;
    color: #b8c5ee;
    line-height: 1.7;
    margin-bottom: 24px;
    font-family: 'Tajawal', sans-serif;
    position: relative;
    z-index: 1;
  }
  
  .chz-dialog-actions {
    display: flex;
    gap: 10px;
    position: relative;
    z-index: 1;
  }
  
  .chz-dialog-btn {
    flex: 1;
    padding: 14px;
    border: none;
    border-radius: 14px;
    font-family: 'Tajawal', sans-serif;
    font-size: 15px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s;
  }
  .chz-dialog-btn:active { transform: scale(0.96); }
  
  .chz-dialog-btn.confirm {
    background: linear-gradient(135deg, #ff27c9, #8d24ff);
    color: #fff;
    box-shadow: 0 6px 20px rgba(255, 39, 201, 0.4);
  }
  
  .chz-dialog-btn.cancel {
    background: rgba(7, 23, 71, 0.7);
    color: #b8c5ee;
    border: 1px solid rgba(120, 150, 255, 0.3);
  }
  
  .chz-dialog-btn.danger {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    color: #fff;
    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
  }
  
  /* حقل الإدخال (لـ prompt) */
  .chz-dialog-input {
    width: 100%;
    padding: 14px 16px;
    background: rgba(7, 23, 71, 0.6);
    border: 1px solid rgba(120, 150, 255, 0.3);
    border-radius: 14px;
    color: #f8f9ff;
    font-family: 'Tajawal', sans-serif;
    font-size: 15px;
    outline: none;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
    box-sizing: border-box;
  }
  .chz-dialog-input:focus {
    border-color: #ff27c9;
    box-shadow: 0 0 0 3px rgba(255, 39, 201, 0.15);
  }
  .chz-dialog-input::placeholder {
    color: #6b7ba8;
  }
</style>
`;
html = html.replace('</head>', dialogsCSS + '\n</head>');

// ═══ 2) إضافة HTML للنافذة ═══
html = html.replace(/<!-- ═══ CHIZEN ELEGANT DIALOG ═══ -->[\s\S]*?<!-- ═══ END CHIZEN DIALOG ═══ -->/g, '');
const dialogHTML = `
<!-- ═══ CHIZEN ELEGANT DIALOG ═══ -->
<div id="chz-dialog-overlay">
  <div id="chz-dialog-box">
    <div class="chz-dialog-icon" id="chz-dialog-icon">
      <svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>
    </div>
    <div class="chz-dialog-title" id="chz-dialog-title">تأكيد</div>
    <div class="chz-dialog-message" id="chz-dialog-message">هل أنت متأكد؟</div>
    <input type="text" class="chz-dialog-input" id="chz-dialog-input" style="display:none;" placeholder="">
    <div class="chz-dialog-actions">
      <button class="chz-dialog-btn cancel" id="chz-dialog-cancel" onclick="chzDialogCancel()">إلغاء</button>
      <button class="chz-dialog-btn confirm" id="chz-dialog-confirm" onclick="chzDialogConfirm()">تأكيد</button>
    </div>
  </div>
</div>
<!-- ═══ END CHIZEN DIALOG ═══ -->
`;
html = html.replace('</body>', dialogHTML + '\n</body>');

// ═══ 3) إضافة دوال الحوار الفاخر ═══
if (!html.includes('window.chzConfirm')) {
  const dialogJS = `
<script id="chz-dialogs-js">
// ═══ CHIZEN Elegant Dialog System ═══
(function() {
  'use strict';
  
  var currentResolver = null;
  var currentType = 'confirm'; // 'confirm', 'alert', 'prompt'
  
  function showDialog(options) {
    return new Promise(function(resolve) {
      currentResolver = resolve;
      currentType = options.type || 'confirm';
      
      var overlay = document.getElementById('chz-dialog-overlay');
      var icon = document.getElementById('chz-dialog-icon');
      var title = document.getElementById('chz-dialog-title');
      var message = document.getElementById('chz-dialog-message');
      var input = document.getElementById('chz-dialog-input');
      var cancelBtn = document.getElementById('chz-dialog-cancel');
      var confirmBtn = document.getElementById('chz-dialog-confirm');
      
      // الأيقونة
      var iconSVG = {
        'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
        'warning': '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
        'danger': '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
        'success': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        'lock': '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
      };
      
      var iconType = options.icon || 'warning';
      icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' + (iconSVG[iconType] || iconSVG['info']) + '</svg>';
      
      // تلوين الأيقونة حسب النوع
      if (iconType === 'danger') {
        icon.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
      } else if (iconType === 'success') {
        icon.style.background = 'linear-gradient(135deg, #00d4a0, #00b380)';
      } else if (iconType === 'lock') {
        icon.style.background = 'linear-gradient(135deg, #ff27c9, #8d24ff)';
      } else {
        icon.style.background = 'linear-gradient(135deg, #ff27c9, #8d24ff)';
      }
      
      // النصوص
      title.textContent = options.title || 'تأكيد';
      message.textContent = options.message || '';
      
      // الإدخال (prompt)
      if (options.type === 'prompt') {
        input.style.display = 'block';
        input.value = options.defaultValue || '';
        input.placeholder = options.placeholder || '';
        setTimeout(function() { input.focus(); }, 300);
      } else {
        input.style.display = 'none';
      }
      
      // الأزرار
      if (options.type === 'alert') {
        cancelBtn.style.display = 'none';
        confirmBtn.textContent = options.confirmText || 'حسناً';
        confirmBtn.className = 'chz-dialog-btn confirm';
      } else {
        cancelBtn.style.display = 'block';
        cancelBtn.textContent = options.cancelText || 'إلغاء';
        confirmBtn.textContent = options.confirmText || 'تأكيد';
        confirmBtn.className = 'chz-dialog-btn ' + (options.danger ? 'danger' : 'confirm');
      }
      
      overlay.classList.add('active');
    });
  }
  
  // ═══ Confirm ═══
  window.chzConfirm = function(message, title, options) {
    return showDialog({
      type: 'confirm',
      title: title || 'تأكيد',
      message: message,
      icon: options && options.icon || 'warning',
      confirmText: options && options.confirmText || 'تأكيد',
      cancelText: options && options.cancelText || 'إلغاء',
      danger: options && options.danger
    });
  };
  
  // ═══ Alert ═══
  window.chzAlert = function(message, title) {
    return showDialog({
      type: 'alert',
      title: title || 'تنبيه',
      message: message,
      icon: 'info',
      confirmText: 'حسناً'
    });
  };
  
  // ═══ Prompt ═══
  window.chzPrompt = function(message, defaultValue, title, placeholder) {
    return showDialog({
      type: 'prompt',
      title: title || 'إدخال',
      message: message,
      defaultValue: defaultValue || '',
      placeholder: placeholder || '',
      icon: 'info',
      confirmText: 'تأكيد'
    });
  };
  
  // ═══ الأزرار ═══
  window.chzDialogConfirm = function() {
    var input = document.getElementById('chz-dialog-input');
    var value = currentType === 'prompt' ? (input.value || '') : true;
    var resolve = currentResolver;
    
    document.getElementById('chz-dialog-overlay').classList.remove('active');
    currentResolver = null;
    
    if (resolve) resolve(value);
  };
  
  window.chzDialogCancel = function() {
    var resolve = currentResolver;
    document.getElementById('chz-dialog-overlay').classList.remove('active');
    currentResolver = null;
    
    if (resolve) resolve(currentType === 'prompt' ? null : false);
  };
  
  // ESC للإلغاء
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      var overlay = document.getElementById('chz-dialog-overlay');
      if (overlay && overlay.classList.contains('active')) chzDialogCancel();
    }
  });
  
  // Enter للتأكيد
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var overlay = document.getElementById('chz-dialog-overlay');
      if (overlay && overlay.classList.contains('active')) {
        var input = document.getElementById('chz-dialog-input');
        if (currentType === 'prompt' && document.activeElement === input) chzDialogConfirm();
        else if (currentType !== 'prompt') chzDialogConfirm();
      }
    }
  });
})();
</script>
`;
  html = html.replace('</body>', dialogJS + '\n</body>');
}

// ═══ 4) استبدال كل confirm() في الكود ═══
// هذا الاستبدال لا يلمس المحتوى الداخلي للدوال (نتجنب regex معقد)
// بدلاً من ذلك، نضيف wrapper
if (!html.includes('window._originalConfirm')) {
  const wrapperJS = `
<script>
// ═══ استبدال confirm و alert و prompt الافتراضية ═══
(function() {
  window._originalConfirm = window.confirm;
  window._originalAlert = window.alert;
  window._originalPrompt = window.prompt;
  
  // ملاحظة: استخدام confirm() المتزامن صعب مع نوافذنا async،
  // لذلك نستخدم window.chzConfirm مباشرة في الكود لاحقاً
})();
</script>
`;
  html = html.replace('</body>', wrapperJS + '\n</body>');
}

// ═══ 5) تحديث toggleBiometric لاستخدام chzConfirm ═══
const oldToggle = /window\.toggleBiometric\s*=\s*function\s*\([^)]*\)\s*\{[\s\S]*?\n\s*\}/;
const newToggle = `window.toggleBiometric = function() {
    if (!storedPin) {
      // لم يُعد PIN بعد
      var newPin = prompt('أدخل رقم سري مكون من 4 أرقام:');
      if (newPin && setupAppPin(newPin)) {
        return true;
      }
      return false;
    } else {
      // موجود → اسأل عن إزالته
      if (window.chzConfirm) {
        chzConfirm('هل تريد إلغاء قفل التطبيق؟', 'إلغاء القفل', {
          icon: 'lock',
          confirmText: 'نعم، إلغاء',
          cancelText: 'إبقاء القفل',
          danger: true
        }).then(function(ok) {
          if (ok) {
            removeAppPin();
            var bioSwitch = document.getElementById('t-bio');
            if (bioSwitch) bioSwitch.classList.remove('on');
          }
        });
      } else if (confirm('هل تريد إلغاء قفل التطبيق؟')) {
        removeAppPin();
        return false;
      }
      return true;
    }
  }`;

if (oldToggle.test(html)) {
  html = html.replace(oldToggle, newToggle);
  console.log('✅ تم تحديث toggleBiometric لاستخدام chzConfirm.');
}

// ═══ 6) تحديث logoutFromLock ═══
const oldLogout = /window\.logoutFromLock\s*=\s*function\s*\(\)\s*\{[\s\S]*?\n\s*\}/;
const newLogout = `window.logoutFromLock = function() {
    if (window.chzConfirm) {
      chzConfirm('هل تريد تسجيل الخروج من الحساب؟', 'تسجيل خروج', {
        icon: 'danger',
        confirmText: 'خروج',
        cancelText: 'إلغاء',
        danger: true
      }).then(function(ok) {
        if (ok) {
          localStorage.removeItem('chizen_app_pin');
          if (window.APP && APP.logout) APP.logout();
          else location.href = 'index.html';
        }
      });
    } else if (confirm('هل تريد تسجيل الخروج؟')) {
      localStorage.removeItem('chizen_app_pin');
      if (window.APP && APP.logout) APP.logout();
      else location.href = 'index.html';
    }
  }`;

if (oldLogout.test(html)) {
  html = html.replace(oldLogout, newLogout);
  console.log('✅ تم تحديث logoutFromLock.');
}

// ═══ 7) استخدام chzConfirm في clearCache ═══
html = html.replace(
  /this\.showConfirm\(['"]مسح الكاش\?['"][^)]*\)/g,
  "this.showConfirm('مسح الكاش؟','سيتم مسح الكاش دون التأثير على بياناتك')"
);

// 8) حفظ
fs.writeFileSync(file + '.bak_elegantdialogs_' + Date.now(), original);
fs.writeFileSync(file, html);

console.log('\n═══ التحقق ═══');
console.log('  - chz-dialog-overlay: ' + (html.includes('id="chz-dialog-overlay"') ? '✅' : '❌'));
console.log('  - chzConfirm: ' + (html.includes('window.chzConfirm') ? '✅' : '❌'));
console.log('  - chzAlert: ' + (html.includes('window.chzAlert') ? '✅' : '❌'));
console.log('  - chzPrompt: ' + (html.includes('window.chzPrompt') ? '✅' : '❌'));

// 9) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'dlg_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { errs++; console.log('❌ block #' + i); }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
