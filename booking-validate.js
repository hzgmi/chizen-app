/* ═══════════════════════════════════════════════════════════════
   CHIZEN — Booking Smart Validation v1.0
   نظام التحقق الذكي لكل حقول الحجز
   ═══════════════════════════════════════════════════════════════ */

(function(){
  'use strict';

  // ═══ 1) دوال مساعدة ═══
  function $(id) { return document.getElementById(id); }
  function val(id) { var el = $(id); return el ? (el.value || '').trim() : ''; }

  function showToast(msg, type) {
    type = type || 'err';
    // 1) APP.toast (دالة مضمونة في chizen.html)
    if (window.APP && typeof window.APP.toast === 'function') {
      try { window.APP.toast(msg); return; } catch(e) {}
    }
    // 2) window.toast إن كانت دالة
    if (typeof window.toast === 'function') {
      try { window.toast(msg, type); return; } catch(e) {}
    }
    // 3) fallback مخصص — مضمون 100%
    var bg = (type === 'suc') ? '#10b981' : '#EF4444';
    var bd = (type === 'suc') ? '#34d399' : '#F87171';
    var div = document.createElement('div');
    div.textContent = msg;
    div.style.cssText = 'position:fixed;top:20%;left:50%;transform:translateX(-50%);background:' + bg + ';color:#fff;padding:14px 22px;border-radius:12px;border:2px solid ' + bd + ';font-family:Tajawal,sans-serif;font-weight:800;font-size:14px;z-index:99999999;box-shadow:0 10px 40px rgba(0,0,0,0.5);max-width:85%;text-align:center;direction:rtl;line-height:1.5';
    document.body.appendChild(div);
    setTimeout(function(){ div.remove(); }, 3500);
  }

  function highlight(id) {
    var el = $(id);
    if (!el) return;
    el.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.6)';
    el.style.borderColor = '#EF4444';
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function(){ el.focus(); }, 300);
    setTimeout(function(){
      el.style.boxShadow = '';
      el.style.borderColor = '';
    }, 3500);
  }

  function fail(fieldId, msg) {
    showToast(msg, 'err');
    if (fieldId) highlight(fieldId);
    return false;
  }

  // ═══ 2) أدوات التحقق ═══
  function isArabicName3(name) {
    if (!name) return false;
    var parts = name.trim().split(/\s+/);
    return parts.length >= 3 && parts.every(function(p){ return p.length >= 2; });
  }

  function isPassport(p) {
    return p && p.replace(/\s/g, '').length >= 6;
  }

  function isPhone(p) {
    var clean = (p || '').replace(/\D/g, '');
    return clean.length >= 9 && clean.length <= 15;
  }

  function isFutureDate(d) {
    if (!d) return false;
    var today = new Date(); today.setHours(0,0,0,0);
    var given = new Date(d);
    return given > today;
  }

  function isAdult(dob) {
    if (!dob) return false;
    var birth = new Date(dob);
    var today = new Date();
    var age = today.getFullYear() - birth.getFullYear();
    var m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 18 && age <= 100;
  }

  // ═══ 3) قواعد التحقق لكل خدمة ═══
  var VALIDATORS = {

    flight: function() {
      var from = val('fly-from'), to = val('fly-to');
      if (!from) return fail('fly-from', 'أدخل مدينة المغادرة');
      if (!to) return fail('fly-to', 'أدخل الوجهة');
      if (from === to) return fail('fly-to', '⚠️ لا يمكن السفر من ' + from + ' إلى ' + from);

      var date = val('fly-date');
      if (date && !isFutureDate(date)) return fail('fly-date', 'تاريخ المغادرة يجب أن يكون في المستقبل');

      var name = val('fly-name');
      if (!name) return fail('fly-name', 'أدخل اسم المسافر');
      if (!isArabicName3(name)) return fail('fly-name', '⚠️ الاسم يجب أن يكون ثلاثياً كما في الجواز');

      var dob = val('fly-dob');
      if (!dob) return fail('fly-dob', 'أدخل تاريخ الميلاد');
      if (!isAdult(dob)) return fail('fly-dob', '⚠️ تاريخ الميلاد لا يناسب حامل الجواز (18+ سنة)');

      var passport = val('fly-passport');
      if (!passport) return fail('fly-passport', 'أدخل رقم الجواز');
      if (!isPassport(passport)) return fail('fly-passport', '⚠️ رقم الجواز غير صحيح (6 أحرف على الأقل)');

      var phone = val('fly-phone');
      if (!phone) return fail('fly-phone', 'أدخل رقم الجوال');
      if (!isPhone(phone)) return fail('fly-phone', '⚠️ رقم الجوال يجب أن يكون 9 أرقام على الأقل');

      return true;
    },

    bus: function() {
      var to = val('bus-to');
      if (!to) return fail('bus-to', 'اختر الوجهة');

      var date = val('bus-date');
      if (!date) return fail('bus-date', 'أدخل تاريخ السفر');
      if (!isFutureDate(date)) return fail('bus-date', 'تاريخ السفر يجب أن يكون في المستقبل');

      var name = val('bus-name');
      if (!name) return fail('bus-name', 'أدخل اسم المسافر');
      if (!isArabicName3(name)) return fail('bus-name', '⚠️ الاسم يجب أن يكون ثلاثياً');

      var phone = val('bus-phone');
      if (!phone) return fail('bus-phone', 'أدخل رقم الجوال');
      if (!isPhone(phone)) return fail('bus-phone', '⚠️ رقم الجوال يجب أن يكون 9 أرقام على الأقل');

      return true;
    },

    hajj: function() {
      var type = val('hajj-type');
      if (!type) return fail('hajj-type', 'اختر نوع الرحلة (عمرة/حج)');

      var date = val('hajj-date');
      if (!date) return fail('hajj-date', 'أدخل تاريخ السفر');
      if (!isFutureDate(date)) return fail('hajj-date', 'تاريخ السفر يجب أن يكون في المستقبل');

      var name = val('hajj-name');
      if (!name) return fail('hajj-name', 'أدخل اسم المسافر');
      if (!isArabicName3(name)) return fail('hajj-name', '⚠️ الاسم يجب أن يكون ثلاثياً كما في الجواز');

      var passport = val('hajj-passport');
      if (!passport) return fail('hajj-passport', 'أدخل رقم الجواز');
      if (!isPassport(passport)) return fail('hajj-passport', '⚠️ رقم الجواز غير صحيح (6 أحرف على الأقل)');

      var phone = val('hajj-phone');
      if (!phone) return fail('hajj-phone', 'أدخل رقم الجوال');
      if (!isPhone(phone)) return fail('hajj-phone', '⚠️ رقم الجوال يجب أن يكون 9 أرقام على الأقل');

      return true;
    },

    hotel: function() {
      var city = val('hotel-city');
      if (!city) return fail('hotel-city', 'أدخل مدينة الفندق');

      var checkin = val('hotel-in');
      if (!checkin) return fail('hotel-in', 'أدخل تاريخ الدخول');
      if (!isFutureDate(checkin)) return fail('hotel-in', 'تاريخ الدخول يجب أن يكون في المستقبل');

      var checkout = val('hotel-out');
      if (!checkout) return fail('hotel-out', 'أدخل تاريخ الخروج');
      if (new Date(checkout) <= new Date(checkin)) return fail('hotel-out', '⚠️ تاريخ الخروج يجب أن يكون بعد تاريخ الدخول');

      var name = val('hotel-client-name');
      if (!name) return fail('hotel-client-name', 'أدخل اسم صاحب الحجز');
      if (!isArabicName3(name)) return fail('hotel-client-name', '⚠️ الاسم يجب أن يكون ثلاثياً');

      var phone = val('hotel-phone');
      if (!phone) return fail('hotel-phone', 'أدخل رقم الجوال');
      if (!isPhone(phone)) return fail('hotel-phone', '⚠️ رقم الجوال يجب أن يكون 9 أرقام على الأقل');

      return true;
    },

    delivery: function() {
      var from = val('dlv-from'), to = val('dlv-to');
      if (!from) return fail('dlv-from', 'اختر موقع الانطلاق');
      if (!to) return fail('dlv-to', 'اختر الوجهة');
      if (from === to) return fail('dlv-to', '⚠️ لا يمكن التوصيل من ' + from + ' إلى ' + from);

      var date = val('dlv-date');
      if (!date) return fail('dlv-date', 'أدخل تاريخ التوصيل');

      var name = val('dlv-name');
      if (!name) return fail('dlv-name', 'أدخل اسمك');
      if (!isArabicName3(name)) return fail('dlv-name', '⚠️ الاسم يجب أن يكون ثلاثياً');

      var phone = val('dlv-phone');
      if (!phone) return fail('dlv-phone', 'أدخل رقم الجوال');
      if (!isPhone(phone)) return fail('dlv-phone', '⚠️ رقم الجوال يجب أن يكون 9 أرقام على الأقل');

      return true;
    }
  };

  // ═══ 4) ربط الدوال ═══
  // ننتظر حتى يصبح APP جاهزاً
  function setup() {
    if (!window.APP || !window.APP.tvlSubmit) {
      setTimeout(setup, 500);
      return;
    }

    if (window.APP.__validationReady) return;
    window.APP.__validationReady = true;

    // نحفظ الدالة الأصلية
    var originalSubmit = window.APP.tvlSubmit;

    // نلفها
    window.APP.tvlSubmit = async function(type, btn) {
      // 1) التحقق أولاً
      var validator = VALIDATORS[type];
      if (validator && !validator()) {
        return; // فشل التحقق — أظهرنا الإشعار
      }

      // 2) فحص الزائر — استخدام النظام المعتمد (Premium Modal)
      if (window.__checkGuest) {
        if (window.__checkGuest('لإتمام حجزك')) {
          return; // عرض Modal الزائر الرسمي
        }
      } else if (window.__isGuest && window.__isGuest()) {
        if (window.__showLoginModal) {
          window.__showLoginModal('لإتمام حجزك');
        }
        return;
      }

      // 3) الدالة الأصلية
      return originalSubmit.call(this, type, btn);
    };

    console.log('[BOOKING-VALIDATE] ✅ نظام التحقق الذكي جاهز');
  }

  // نبدأ بعد تحميل DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

  // نتحقق كل 3 ثوانٍ (احتياطياً)
  setInterval(setup, 3000);

})();

/* ═══════════════════════════════════════════════════════════════
   5) SMART UNLOCK — يُفعّل الزر تلقائياً دون الاعتماد على tvlCalc
   ═══════════════════════════════════════════════════════════════ */

(function(){
  'use strict';

  var WATCHED = {
    flight:   ['fly-from', 'fly-to', 'fly-date', 'fly-name', 'fly-dob', 'fly-passport', 'fly-phone'],
    bus:      ['bus-to', 'bus-date', 'bus-name', 'bus-phone'],
    hajj:     ['hajj-date', 'hajj-name', 'hajj-passport', 'hajj-phone'],
    hotel:    ['hotel-city', 'hotel-in', 'hotel-out', 'hotel-client-name', 'hotel-phone'],
    delivery: ['dlv-from', 'dlv-to', 'dlv-date', 'dlv-name', 'dlv-phone']
  };

  function $(id) { return document.getElementById(id); }
  function val(id) { var el = $(id); return el ? (el.value || '').trim() : ''; }

  // نفس أدوات التحقق
  function isArabicName3(name) {
    if (!name) return false;
    var parts = name.trim().split(/\s+/);
    return parts.length >= 3 && parts.every(function(p){ return p.length >= 2; });
  }
  function isPassport(p) { return p && p.replace(/\s/g, '').length >= 6; }
  function isPhone(p) { var c = (p || '').replace(/\D/g, ''); return c.length >= 9 && c.length <= 15; }
  function isFutureDate(d) {
    if (!d) return false;
    var today = new Date(); today.setHours(0,0,0,0);
    return new Date(d) > today;
  }
  function isAdult(dob) {
    if (!dob) return false;
    var birth = new Date(dob), today = new Date();
    var age = today.getFullYear() - birth.getFullYear();
    var m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 18 && age <= 100;
  }

  // فحص صامت — بدون Toast
  function isValid(type) {
    if (type === 'flight') {
      var from = val('fly-from'), to = val('fly-to');
      if (!from || !to || from === to) return false;
      var d = val('fly-date'); if (d && !isFutureDate(d)) return false;
      if (!isArabicName3(val('fly-name'))) return false;
      if (!isAdult(val('fly-dob'))) return false;
      if (!isPassport(val('fly-passport'))) return false;
      if (!isPhone(val('fly-phone'))) return false;
      return true;
    }
    if (type === 'bus') {
      if (!val('bus-to')) return false;
      var d = val('bus-date'); if (!d || !isFutureDate(d)) return false;
      if (!isArabicName3(val('bus-name'))) return false;
      if (!isPhone(val('bus-phone'))) return false;
      return true;
    }
    if (type === 'hajj') {
      var d = val('hajj-date'); if (!d || !isFutureDate(d)) return false;
      if (!isArabicName3(val('hajj-name'))) return false;
      if (!isPassport(val('hajj-passport'))) return false;
      if (!isPhone(val('hajj-phone'))) return false;
      return true;
    }
    if (type === 'hotel') {
      if (!val('hotel-city')) return false;
      var ci = val('hotel-in'), co = val('hotel-out');
      if (!ci || !co || !isFutureDate(ci)) return false;
      if (new Date(co) <= new Date(ci)) return false;
      if (!isArabicName3(val('hotel-client-name'))) return false;
      if (!isPhone(val('hotel-phone'))) return false;
      return true;
    }
    if (type === 'delivery') {
      var f = val('dlv-from'), t = val('dlv-to');
      if (!f || !t || f === t) return false;
      if (!val('dlv-date')) return false;
      if (!isArabicName3(val('dlv-name'))) return false;
      if (!isPhone(val('dlv-phone'))) return false;
      return true;
    }
    return false;
  }

  function updateButton(type) {
    var form = document.getElementById('form-' + type);
    if (!form) return;
    var submit = form.querySelector('.tvl-submit');
    if (!submit) return;

    var valid = isValid(type);
    console.log('[UNLOCK] type=' + type + ' valid=' + valid);
    if (valid) {
      submit.classList.remove('locked');
      submit.classList.add('ready');
    } else {
      submit.classList.remove('ready');
      submit.classList.add('locked');
    }
  }

  // ربط المراقبة لكل نموذج
  function attachWatchers() {
    Object.keys(WATCHED).forEach(function(type){
      WATCHED[type].forEach(function(fieldId){
        var el = document.getElementById(fieldId);
        if (!el || el.__watched) return;
        el.__watched = true;
        el.addEventListener('input', function(){ updateButton(type); });
        el.addEventListener('change', function(){ updateButton(type); });
      });
      // فحص أولي
      updateButton(type);
    });
  }

  // إعادة ربط عند فتح نموذج جديد
  document.addEventListener('click', function(e){
    if (e.target && e.target.closest && e.target.closest('.tvl-svc, .tvl-dlv-card, .tvl-chip')) {
      setTimeout(attachWatchers, 100);
    }
  });

  // تشغيل أولي + كل 2 ثانية احتياطياً
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachWatchers);
  } else {
    attachWatchers();
  }
  setInterval(attachWatchers, 2000);

  console.log('[BOOKING-VALIDATE] ✅ Smart Unlock جاهز');

  })();

// ═══ FINAL DEBUG — يعرض حالة النظام في مربع أحمر ═══
setTimeout(function(){
  var box = document.createElement('div');
  box.id = 'chz-final-debug';
  box.style.cssText = 'position:fixed;top:10px;left:5px;right:5px;background:#000;color:#0f0;padding:10px;z-index:99999999;font-size:10px;font-family:monospace;border:3px solid #ff0000;border-radius:6px;white-space:pre-wrap;direction:ltr;max-height:65vh;overflow:auto;cursor:pointer';
  box.onclick = function(){ box.remove(); };
  
  function build() {
    var lines = [];
    lines.push('=== SYSTEM STATUS ===');
    lines.push('window.toast: ' + typeof window.toast);
    lines.push('APP.toast: ' + (window.APP && typeof window.APP.toast));
    lines.push('APP.tvlSubmit: ' + (window.APP && typeof window.APP.tvlSubmit));
    lines.push('APP.__validationReady: ' + (window.APP && window.APP.__validationReady));
    lines.push('');
    var form = document.querySelector('.tvl-form.active');
    if (form) {
      var type = form.id.replace('form-', '');
      var submit = form.querySelector('.tvl-submit');
      lines.push('=== ACTIVE FORM: ' + type + ' ===');
      lines.push('submit exists: ' + (submit ? 'YES' : 'NO'));
      lines.push('submit class: ' + (submit ? submit.className : 'N/A'));
      lines.push('submit pointer-events: ' + (submit ? getComputedStyle(submit).pointerEvents : 'N/A'));
      lines.push('submit z-index: ' + (submit ? getComputedStyle(submit).zIndex : 'N/A'));
      lines.push('submit position: ' + (submit ? getComputedStyle(submit).position : 'N/A'));
    }
    box.textContent = lines.join('\n');
  }
  
  build();
  setInterval(build, 1000);
  
  // اختبار Toast
  setTimeout(function(){
    try {
      if (typeof window.APP.toast === 'function') {
        window.APP.toast('TEST — APP.toast works');
      } else {
        alert('APP.toast NOT a function');
      }
    } catch(e) { alert('APP.toast error: ' + e.message); }
  }, 2500);
  
  document.body.appendChild(box);
}, 3000);

/* ═══════════════════════════════════════════════════════════════
   6) SUCCESS MODAL — إشعار نجاح ذهبي ديناميكي
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  // نبني الـ Modal مرة واحدة عند الحاجة
  function buildSuccessModal() {
    if (document.getElementById('chz-success-overlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'chz-success-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(7,9,15,0.85);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:none;align-items:center;justify-content:center;z-index:99999999;padding:24px;direction:rtl;font-family:Tajawal,sans-serif';

    overlay.innerHTML = ''
      + '<div style="background:linear-gradient(135deg,#131E42 0%,#0A1024 100%);border:2px solid #C5A059;border-radius:24px;padding:32px 24px;max-width:340px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(197,160,89,0.4),0 0 0 1px rgba(197,160,89,0.2);animation:chzSuccessIn 0.4s cubic-bezier(0.34,1.56,0.64,1)">'
      +   '<div style="width:80px;height:80px;margin:0 auto 20px;background:linear-gradient(135deg,#F2E3C6 0%,#C5A059 50%,#9A7B4F 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:44px;box-shadow:0 8px 24px rgba(197,160,89,0.5)">✅</div>'
      +   '<h2 id="chz-success-title" style="color:#F2E3C6;font-size:22px;font-weight:900;margin:0 0 12px">تم بنجاح</h2>'
      +   '<p id="chz-success-msg" style="color:rgba(255,255,255,0.75);font-size:14px;line-height:1.6;margin:0 0 24px;font-weight:600"></p>'
      +   '<button id="chz-success-btn" onclick="window.__chzCloseSuccess()" style="width:100%;padding:14px;background:linear-gradient(135deg,#F2E3C6 0%,#C5A059 50%,#9A7B4F 100%);border:none;border-radius:14px;color:#07090F;font-family:Tajawal,sans-serif;font-size:16px;font-weight:900;cursor:pointer;letter-spacing:0.5px;box-shadow:0 4px 14px rgba(197,160,89,0.4)">حسناً</button>'
      + '</div>'
      + '<style>@keyframes chzSuccessIn{from{transform:scale(0.85);opacity:0}to{transform:scale(1);opacity:1}}</style>';

    document.body.appendChild(overlay);

    window.__chzCloseSuccess = function(){
      overlay.style.display = 'none';
      if (typeof window.__chzSuccessCallback === 'function') {
        var cb = window.__chzSuccessCallback;
        window.__chzSuccessCallback = null;
        try { cb(); } catch(e) {}
      }
    };
  }

  // إعادة تعريف showSuccess
  window.showSuccess = function(opts) {
    opts = opts || {};
    buildSuccessModal();
    var overlay = document.getElementById('chz-success-overlay');
    var title = document.getElementById('chz-success-title');
    var msg = document.getElementById('chz-success-msg');
    var btn = document.getElementById('chz-success-btn');

    if (title) title.textContent = opts.title || 'تم بنجاح';
    if (msg) msg.textContent = opts.message || '';
    if (btn) btn.textContent = opts.btn || 'حسناً';

    overlay.style.display = 'flex';
    window.__chzSuccessCallback = opts.onClose || null;
  };

  // إعادة تعريف showError أيضاً
  window.showError = function(opts) {
    opts = opts || {};
    buildSuccessModal();
    var overlay = document.getElementById('chz-success-overlay');
    var title = document.getElementById('chz-success-title');
    var msg = document.getElementById('chz-success-msg');
    var btn = document.getElementById('chz-success-btn');

    // تغيير الأيقونة إلى ❌ + لون أحمر
    var icon = overlay.querySelector('div div');
    if (icon) {
      icon.textContent = '❌';
      icon.style.background = 'linear-gradient(135deg,#F87171 0%,#EF4444 50%,#DC2626 100%)';
      icon.style.boxShadow = '0 8px 24px rgba(239,68,68,0.5)';
    }
    if (title) title.textContent = opts.title || 'حدث خطأ';
    if (msg) msg.textContent = opts.message || '';
    if (btn) btn.textContent = opts.btn || 'حسناً';

    overlay.style.display = 'flex';
    window.__chzSuccessCallback = opts.onClose || null;
  };

  console.log('[SUCCESS-MODAL] v1.0 loaded');
})();
