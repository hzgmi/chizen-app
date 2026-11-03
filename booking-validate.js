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
    if (window.toast) {
      window.toast(msg, type || 'err');
    } else {
      alert(msg);
    }
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

      // 2) إذا نجح، نفذ الدالة الأصلية
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
