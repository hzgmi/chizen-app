const fs = require('fs');
const file = 'client/chizen.html';
let html = fs.readFileSync(file, 'utf8');
const original = html;

// 1) حذف أي نسخ سابقة من دوال الحجوزات
['submitFlight','submitBus','submitHotel','submitHajj'].forEach(fn => {
  const re = new RegExp(fn + '\\s*:\\s*(?:async\\s+)?function\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*?\\n\\s*\\},', 'g');
  html = html.replace(re, '');
});

// 2) كود الحجوزات الجديد
const bookingFunctions = `
  // ═══ الحجوزات الحقيقية (Firebase) ═══
  
  saveBooking: async function(type, data) {
    if (!window.FB || !FB.currentUser) {
      if (window.toast) toast('سجل دخول أولاً', 'err');
      return;
    }
    try {
      var booking = {
        type: type,
        userId: FB.currentUser.uid,
        userEmail: FB.currentUser.email || '',
        userName: (FB.currentUser.displayName || FB.currentUser.email || 'مستخدم'),
        data: data,
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      await FB.db.collection('bookings').add(booking);
      return true;
    } catch(e) {
      console.error('Booking save error:', e);
      if (window.toast) toast('حدث خطأ في الحفظ', 'err');
      return false;
    }
  },

  submitFlight: async function() {
    var airline = document.getElementById('fly-airline');
    var from = document.getElementById('fly-from');
    var to = document.getElementById('fly-to');
    var date = document.getElementById('fly-date');
    var pax = document.getElementById('fly-pax');
    var cls = document.getElementById('fly-class');
    var name = document.getElementById('fly-name');
    var passport = document.getElementById('fly-passport');
    var phone = document.getElementById('fly-phone');
    
    if (!from || !to || !date || !name || !phone || !from.value || !to.value || !date.value || !name.value || !phone.value) {
      if (window.toast) toast('املأ جميع الحقول المطلوبة', 'err');
      return;
    }
    
    var btn = event.target;
    btn.disabled = true;
    btn.textContent = '⏳ جاري الحجز...';
    
    var ok = await this.saveBooking('flight', {
      airline: airline ? airline.value : '',
      from: from.value,
      to: to.value,
      date: date.value,
      passengers: pax ? pax.value : '1',
      class: cls ? cls.value : 'economy',
      name: name.value,
      passport: passport ? passport.value : '',
      phone: phone.value
    });
    
    btn.disabled = false;
    btn.textContent = 'تأكيد حجز الطيران';
    
    if (ok && window.showSuccess) {
      showSuccess({
        title: 'تم تأكيد حجزك! 🎉',
        message: 'سنتواصل معك قريباً لتأكيد التفاصيل والدفع.',
        btn: 'العودة للرئيسية',
        onClose: function() { if (window.APP) APP.goTab('home'); }
      });
    }
  },

  submitBus: async function() {
    var to = document.getElementById('bus-to');
    var date = document.getElementById('bus-date');
    var time = document.getElementById('bus-time');
    var pax = document.getElementById('bus-pax');
    var name = document.getElementById('bus-name');
    var phone = document.getElementById('bus-phone');
    
    if (!to || !date || !name || !phone || !to.value || !date.value || !name.value || !phone.value) {
      if (window.toast) toast('املأ جميع الحقول المطلوبة', 'err');
      return;
    }
    
    var btn = event.target;
    btn.disabled = true;
    btn.textContent = '⏳ جاري الحجز...';
    
    var ok = await this.saveBooking('bus', {
      from: 'عدن',
      to: to.value,
      date: date.value,
      time: time ? time.value : '',
      passengers: pax ? pax.value : '1',
      name: name.value,
      phone: phone.value
    });
    
    btn.disabled = false;
    btn.textContent = 'تأكيد حجز الباص';
    
    if (ok && window.showSuccess) {
      showSuccess({
        title: 'تم تأكيد حجز الباص! 🎉',
        message: 'سنتواصل معك قريباً للتأكيد.',
        btn: 'العودة للرئيسية',
        onClose: function() { if (window.APP) APP.goTab('home'); }
      });
    }
  },

  submitHotel: async function() {
    var city = document.getElementById('hotel-city');
    var hname = document.getElementById('hotel-name');
    var checkin = document.getElementById('hotel-in');
    var checkout = document.getElementById('hotel-out');
    var rooms = document.getElementById('hotel-rooms');
    var guests = document.getElementById('hotel-guests');
    var name = document.getElementById('hotel-client-name');
    var phone = document.getElementById('hotel-phone');
    
    if (!city || !checkin || !checkout || !name || !phone || !city.value || !checkin.value || !checkout.value || !name.value || !phone.value) {
      if (window.toast) toast('املأ جميع الحقول المطلوبة', 'err');
      return;
    }
    
    var btn = event.target;
    btn.disabled = true;
    btn.textContent = '⏳ جاري الحجز...';
    
    var ok = await this.saveBooking('hotel', {
      city: city.value,
      hotelName: hname ? hname.value : '',
      checkin: checkin.value,
      checkout: checkout.value,
      rooms: rooms ? rooms.value : '1',
      guests: guests ? guests.value : '1',
      name: name.value,
      phone: phone.value
    });
    
    btn.disabled = false;
    btn.textContent = 'تأكيد حجز الفندق';
    
    if (ok && window.showSuccess) {
      showSuccess({
        title: 'تم تأكيد حجز الفندق! 🎉',
        message: 'سنتواصل معك قريباً للتأكيد.',
        btn: 'العودة للرئيسية',
        onClose: function() { if (window.APP) APP.goTab('home'); }
      });
    }
  },

  submitHajj: async function() {
    var type = document.getElementById('hajj-type');
    var date = document.getElementById('hajj-date');
    var pax = document.getElementById('hajj-pax');
    var name = document.getElementById('hajj-name');
    var passport = document.getElementById('hajj-passport');
    var phone = document.getElementById('hajj-phone');
    
    if (!date || !name || !phone || !date.value || !name.value || !phone.value) {
      if (window.toast) toast('املأ جميع الحقول المطلوبة', 'err');
      return;
    }
    
    var btn = event.target;
    btn.disabled = true;
    btn.textContent = '⏳ جاري الحجز...';
    
    var ok = await this.saveBooking('hajj', {
      type: type ? type.value : 'umrah',
      date: date.value,
      passengers: pax ? pax.value : '1',
      name: name.value,
      passport: passport ? passport.value : '',
      phone: phone.value
    });
    
    btn.disabled = false;
    btn.textContent = 'تأكيد الحجز';
    
    if (ok && window.showSuccess) {
      showSuccess({
        title: 'تم تأكيد الحجز! 🎉',
        message: 'سنتواصل معك قريباً لتأكيد التفاصيل.',
        btn: 'العودة للرئيسية',
        onClose: function() { if (window.APP) APP.goTab('home'); }
      });
    }
  },
`;

// 3) حقن الدوال في الكائن APP (قبل renderProducts)
const insertPoint = html.indexOf('renderProducts:');
if (insertPoint !== -1) {
  html = html.slice(0, insertPoint) + bookingFunctions + '\n  ' + html.slice(insertPoint);
  console.log('✅ تم حقن دوال الحجوزات في APP.');
} else {
  console.log('⚠️ لم يجد renderProducts، سيتم الحقن في نهاية APP.');
  const appEnd = html.lastIndexOf('};');
  if (appEnd !== -1) {
    html = html.slice(0, appEnd) + bookingFunctions + '\n' + html.slice(appEnd);
  }
}

// 4) حفظ
fs.writeFileSync(file + '.bak_bookings_' + Date.now(), original);
fs.writeFileSync(file, html);

// 5) فحص
console.log('\n═══ التحقق ═══');
['submitFlight','submitBus','submitHotel','submitHajj','saveBooking'].forEach(fn => {
  console.log('  - ' + fn + ': ' + (html.includes(fn + ':') ? '✅' : '❌'));
});
console.log('  - bookings collection: ' + (html.includes("collection('bookings')") ? '✅' : '❌'));

// 6) فحص Syntax
const os = require('os');
const path = require('path');
const scRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let sc, i = 0, errs = 0;
while ((sc = scRe.exec(html)) !== null) {
  i++;
  if (/src\s*=/.test(sc[1])) continue;
  if (!sc[2].trim()) continue;
  const tmp = path.join(os.tmpdir(), 'bk_' + i + '_' + Date.now() + '.js');
  try {
    fs.writeFileSync(tmp, sc[2]);
    require('child_process').execSync('node --check "' + tmp + '"', { stdio: 'pipe', timeout: 10000 });
  } catch (e) { 
    errs++; 
    const errLine = (e.stderr || '').toString().match(/:(\d+)/);
    console.log('❌ block #' + i + (errLine ? ' (سطر ' + errLine[1] + ')' : '')); 
  }
  finally { try { fs.unlinkSync(tmp); } catch(_){} }
}
console.log('\n════════ SYNTAX ════════');
console.log(errs === 0 ? '✅ SAFE TO COMMIT (' + i + ' blocks)' : '❌ ' + errs + ' errors');
