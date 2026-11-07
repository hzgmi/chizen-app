/* ═══════════════════════════════════════════════════════════════
   CHIZEN — iOS-Style Wheel Date Picker v2.0
   Bottom Sheet + 3 scrolling wheels + tick sound
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  var MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

  var currentYear = new Date().getFullYear();
  var RANGES = {
    'fly-dob': { min: 1930, max: currentYear - 2, label: 'تاريخ الميلاد' },
    'default': { min: currentYear, max: currentYear + 5, label: 'التاريخ' }
  };

  // ═══ 1) صوت "طق" ═══
  var audioCtx = null;
  function tick() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 1200;
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch(e) {}
  }

  // ═══ 2) بناء الـ Modal ═══
  var modal = null;
  var currentTarget = null;
  var currentRange = null;
  var wheels = { d: null, m: null, y: null };

  function buildModal() {
    if (modal) return;
    modal = document.createElement('div');
    modal.className = 'chz-wheel-modal';
    modal.innerHTML = ''
      + '<div class="chz-wheel-backdrop"></div>'
      + '<div class="chz-wheel-sheet">'
      +   '<div class="chz-wheel-header">'
      +     '<button class="chz-wheel-cancel">إلغاء</button>'
      +     '<div class="chz-wheel-title">التاريخ</div>'
      +     '<button class="chz-wheel-confirm">تأكيد</button>'
      +   '</div>'
      +   '<div class="chz-wheel-body">'
      +     '<div class="chz-wheel-col" data-wheel="d"><div class="chz-wheel-list"></div></div>'
      +     '<div class="chz-wheel-col" data-wheel="m"><div class="chz-wheel-list"></div></div>'
      +     '<div class="chz-wheel-col" data-wheel="y"><div class="chz-wheel-list"></div></div>'
      +     '<div class="chz-wheel-indicator"></div>'
      +   '</div>'
      + '</div>';

    document.body.appendChild(modal);

    wheels.d = modal.querySelector('[data-wheel="d"] .chz-wheel-list');
    wheels.m = modal.querySelector('[data-wheel="m"] .chz-wheel-list');
    wheels.y = modal.querySelector('[data-wheel="y"] .chz-wheel-list');

    modal.querySelector('.chz-wheel-backdrop').addEventListener('click', close);
    modal.querySelector('.chz-wheel-cancel').addEventListener('click', close);
    modal.querySelector('.chz-wheel-confirm').addEventListener('click', confirmSelection);

    // مراقبة السكرول في كل عجلة
    [wheels.d, wheels.m, wheels.y].forEach(function(list){
      var lastIndex = -1;
      list.addEventListener('scroll', function(){
        var idx = Math.round(list.scrollTop / 44);
        if (idx !== lastIndex && idx >= 0) {
          lastIndex = idx;
          tick();
        }
      }, { passive: true });

      // scroll end → snap
      var scrollTimer;
      list.addEventListener('scroll', function(){
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function(){
          var idx = Math.round(list.scrollTop / 44);
          list.scrollTop = idx * 44;
        }, 120);
      }, { passive: true });
    });
  }

  // ═══ 3) ملء العجلات ═══
  function fillWheel(list, items, selectedIndex) {
    list.innerHTML = '';
    items.forEach(function(item){
      var div = document.createElement('div');
      div.className = 'chz-wheel-item';
      div.textContent = item.t;
      div.dataset.value = item.v;
      list.appendChild(div);
    });
    // نضيف padding علوي/سفلي لمحاذاة المنتصف
    var padTop = document.createElement('div');
    padTop.style.height = '132px';
    padTop.className = 'chz-wheel-pad';
    var padBot = padTop.cloneNode();
    list.insertBefore(padTop, list.firstChild);
    list.appendChild(padBot);

    // نسكرول للعنصر المحدد
    if (selectedIndex >= 0) {
      setTimeout(function(){
        list.scrollTop = selectedIndex * 44;
      }, 10);
    }
  }

  // ═══ 4) فتح العجلة ═══
  function open(targetId) {
    buildModal();
    currentTarget = targetId;
    currentRange = RANGES[targetId] || RANGES.default;

    // نقرأ القيمة الحالية إن وجدت
    var hidden = document.getElementById(targetId);
    var current = hidden ? hidden.value : '';
    var curY = current ? parseInt(current.split('-')[0], 10) : null;
    var curM = current ? parseInt(current.split('-')[1], 10) : null;
    var curD = current ? parseInt(current.split('-')[2], 10) : null;

    // يوم: 1-31
    var days = [];
    for (var d = 1; d <= 31; d++) days.push({ v: String(d), t: String(d) });
    var dayIdx = curD ? curD - 1 : 15;

    // شهر: 1-12
    var months = MONTHS.map(function(n, i){ return { v: String(i+1), t: n }; });
    var monthIdx = curM ? curM - 1 : new Date().getMonth();

    // سنة: حسب النطاق (تنازلي)
    var years = [];
    for (var y = currentRange.max; y >= currentRange.min; y--) {
      years.push({ v: String(y), t: String(y) });
    }
    var yearIdx = curY ? (currentRange.max - curY) : 5;
    if (yearIdx < 0) yearIdx = 0;
    if (yearIdx >= years.length) yearIdx = years.length - 1;

    fillWheel(wheels.d, days, dayIdx);
    fillWheel(wheels.m, months, monthIdx);
    fillWheel(wheels.y, years, yearIdx);

    // العنوان حسب الحقل
    var titles = {
      'fly-date': 'تاريخ المغادرة',
      'fly-return': 'تاريخ العودة',
      'fly-dob': 'تاريخ الميلاد',
      'bus-date': 'تاريخ السفر',
      'hajj-date': 'تاريخ السفر',
      'hotel-in': 'تاريخ الدخول',
      'hotel-out': 'تاريخ الخروج',
      'dlv-date': 'تاريخ التوصيل'
    };
    modal.querySelector('.chz-wheel-title').textContent = titles[targetId] || 'التاريخ';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // ═══ 5) إغلاق ═══
  function close() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ═══ 6) تأكيد ═══
  function confirmSelection() {
    if (!currentTarget) return close();

    var d = getWheelValue(wheels.d);
    var m = getWheelValue(wheels.m);
    var y = getWheelValue(wheels.y);

    var hidden = document.getElementById(currentTarget);
    if (hidden && d && m && y) {
      var mm = String(m).length === 1 ? '0' + m : String(m);
      var dd = String(d).length === 1 ? '0' + d : String(d);
      hidden.value = y + '-' + mm + '-' + dd;
      hidden.dispatchEvent(new Event('change', { bubbles: true }));
      hidden.dispatchEvent(new Event('input', { bubbles: true }));
    }

    close();
  }

  function getWheelValue(list) {
    var idx = Math.round(list.scrollTop / 44);
    var items = list.querySelectorAll('.chz-wheel-item');
    if (items[idx]) return items[idx].dataset.value;
    return null;
  }

  // ═══ 7) ربط الحقول ═══
  function initWrap(wrap) {
    if (wrap.__chzWheelInit) return;
    wrap.__chzWheelInit = true;

    var target = wrap.getAttribute('data-target');
    if (!target) return;

    // نص عرض
    var display = document.createElement('button');
    display.type = 'button';
    display.className = 'chz-date-display';
    display.textContent = 'اختر التاريخ';
    wrap.appendChild(display);
    wrap.__display = display;

    display.addEventListener('click', function(){
      open(target);
    });
  }

  function initAll() {
    document.querySelectorAll('.chz-date-group').forEach(initWrap);
  }

  // تحديث نص العرض عند تغيير الحقل المخفي
  document.addEventListener('change', function(e){
    if (e.target && e.target.type === 'hidden' && e.target.id && e.target.id.match(/date|dob|in|out|return/)) {
      var wrap = document.querySelector('[data-target="' + e.target.id + '"]');
      if (wrap && wrap.__display && e.target.value) {
        var parts = e.target.value.split('-');
        if (parts.length === 3) {
          wrap.__display.textContent = parts[2] + ' / ' + parts[1] + ' / ' + parts[0];
        }
      }
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
  setInterval(initAll, 1000);

  console.log('[WHEEL-PICKER] loaded v2.0');
})();
