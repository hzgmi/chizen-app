/* ═══════════════════════════════════════════════════════════════
   CHIZEN — iOS Wheel Picker (Premium)
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  var MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

  // صوت "طق" مثل الآيفون
  var audioCtx = null;
  function tick() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 1200;
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch(e) {}
  }

  function openPicker(targetId, label, isDob) {
    var input = document.getElementById(targetId);
    if (!input) return;

    var currentYear = new Date().getFullYear();
    var minYear = isDob ? 1930 : currentYear;
    var maxYear = isDob ? currentYear - 2 : currentYear + 2;

    // القيم الحالية
    var curY = maxYear, curM = 1, curD = 1;
    if (input.value && input.value.indexOf('-') !== -1) {
      var parts = input.value.split('-');
      if (parts.length === 3) {
        curY = parseInt(parts[0]) || curY;
        curM = parseInt(parts[1]) || 1;
        curD = parseInt(parts[2]) || 1;
      }
    }

    // بناء الحاويات
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;z-index:9999999;background:rgba(0,0,0,0.5);display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);';

    var sheet = document.createElement('div');
    sheet.style.cssText = 'background:#1A2340;width:100%;max-width:500px;border-radius:24px 24px 0 0;box-shadow:0 -10px 40px rgba(0,0,0,0.6);border-top:1px solid rgba(197,160,89,0.4);animation:chzSlideUp 0.3s ease;overflow:hidden;direction:rtl;';

    // الرأس
    var header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.1);';
    header.innerHTML = '<button id="chz-pk-cancel" style="background:none;border:none;color:#9ca3af;font-size:14px;font-weight:700;cursor:pointer;">إلغاء</button>' +
                       '<div style="color:#C5A059;font-weight:900;font-size:16px;">' + label + '</div>' +
                       '<button id="chz-pk-confirm" style="background:none;border:none;color:#C5A059;font-size:14px;font-weight:900;cursor:pointer;">تأكيد</button>';
    sheet.appendChild(header);

    // منطقة العجلات
    var wheelsWrap = document.createElement('div');
    wheelsWrap.style.cssText = 'position:relative;display:flex;justify-content:space-around;height:220px;padding:0 20px;';
    
    // خطوط التحديد (الخلفية)
    var highlight = document.createElement('div');
    highlight.style.cssText = 'position:absolute;top:50%;left:16px;right:16px;height:44px;transform:translateY(-50%);background:rgba(197,160,89,0.1);border-top:1px solid rgba(197,160,89,0.4);border-bottom:1px solid rgba(197,160,89,0.4);border-radius:8px;pointer-events:none;z-index:1;';
    wheelsWrap.appendChild(highlight);

    function buildWheel(items, startIdx, onSelect) {
      var wheel = document.createElement('div');
      wheel.style.cssText = 'flex:1;position:relative;z-index:2;height:100%;overflow-y:scroll;scroll-snap-type:y mandatory;scrollbar-width:none;-ms-overflow-style:none;';
      
      var spacerTop = document.createElement('div');
      spacerTop.style.cssText = 'height:88px;';
      wheel.appendChild(spacerTop);
      
      items.forEach(function(item, idx) {
        var itemEl = document.createElement('div');
        itemEl.textContent = item.label;
        itemEl.style.cssText = 'height:44px;line-height:44px;text-align:center;scroll-snap-align:center;font-size:16px;font-weight:700;color:' + (idx === startIdx ? '#C5A059' : '#6b7280') + ';transition:color 0.15s;';
        wheel.appendChild(itemEl);
      });
      
      var spacerBot = document.createElement('div');
      spacerBot.style.cssText = 'height:88px;';
      wheel.appendChild(spacerBot);
      
      // التمرير
      var lastIdx = startIdx;
      wheel.addEventListener('scroll', function() {
        var itemHeight = 44;
        var scrollTop = wheel.scrollTop;
        var newIdx = Math.round(scrollTop / itemHeight);
        newIdx = Math.max(0, Math.min(items.length - 1, newIdx));
        
        if (newIdx !== lastIdx) {
          lastIdx = newIdx;
          tick();
          // تحديث الألوان
          Array.from(wheel.querySelectorAll('div')).forEach(function(el, i) {
            if (el.style.height === '44px' && i > 0 && i <= items.length) {
              var realIdx = i - 1;
              el.style.color = realIdx === newIdx ? '#C5A059' : '#6b7280';
            }
          });
          onSelect(items[newIdx].value);
        }
      });
      
      // التمرير الأولي
      setTimeout(function() {
        wheel.scrollTop = startIdx * 44;
      }, 50);
      
      return wheel;
    }

    // بناء الأيام
    var daysItems = [];
    for (var d = 1; d <= 31; d++) daysItems.push({ label: d, value: d });
    var dayWheel = buildWheel(daysItems, curD - 1, function(val) { curD = val; });

    // بناء الأشهر
    var monthsItems = MONTHS.map(function(m, i) { return { label: m, value: i + 1 }; });
    var monthWheel = buildWheel(monthsItems, curM - 1, function(val) { curM = val; });

    // بناء السنوات
    var yearsItems = [];
    for (var y = maxYear; y >= minYear; y--) yearsItems.push({ label: y, value: y });
    var yearStartIdx = yearsItems.findIndex(function(item) { return item.value === curY; });
    var yearWheel = buildWheel(yearsItems, yearStartIdx >= 0 ? yearStartIdx : 0, function(val) { curY = val; });

    wheelsWrap.appendChild(dayWheel);
    wheelsWrap.appendChild(monthWheel);
    wheelsWrap.appendChild(yearWheel);
    sheet.appendChild(wheelsWrap);

    // أزرار التحكم
    var footer = document.createElement('div');
    footer.style.cssText = 'padding:16px 20px;';
    var confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'تأكيد';
    confirmBtn.style.cssText = 'width:100%;padding:16px;background:#C5A059;color:#1A2340;border:none;border-radius:14px;font-weight:900;font-size:16px;cursor:pointer;';
    footer.appendChild(confirmBtn);
    sheet.appendChild(footer);

    modal.appendChild(sheet);
    document.body.appendChild(modal);

    // تفاعلات
    header.querySelector('#chz-pk-cancel').onclick = function() { modal.remove(); };
    header.querySelector('#chz-pk-confirm').onclick = confirmBtn.onclick;
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

    confirmBtn.onclick = function() {
      var d = String(curD).padStart(2, '0');
      var m = String(curM).padStart(2, '0');
      var y = String(curY);
      input.value = y + '-' + m + '-' + d;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      if (window.APP && APP.tvlCalc) APP.tvlCalc('flight');
      modal.remove();
    };
  }

  function attachToAll() {
    var configs = [
      { id: 'fly-date', label: 'تاريخ المغادرة', isDob: false },
      { id: 'fly-return', label: 'تاريخ العودة', isDob: false },
      { id: 'fly-dob', label: 'تاريخ الميلاد', isDob: true },
      { id: 'bus-date', label: 'تاريخ الرحلة', isDob: false },
      { id: 'hotel-in', label: 'تاريخ الوصول', isDob: false },
      { id: 'hotel-out', label: 'تاريخ المغادرة', isDob: false },
      { id: 'hajj-date', label: 'تاريخ الرحلة', isDob: false }
    ];

    configs.forEach(function(cfg) {
      var el = document.getElementById(cfg.id);
      if (!el || el._iosReady) return;
      el._iosReady = true;
      el.setAttribute('readonly', 'readonly');
      el.style.cursor = 'pointer';
      el.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openPicker(cfg.id, cfg.label, cfg.isDob);
      });
    });
  }

  // تشغيل متكرر لالتقاط الحقول
  setInterval(attachToAll, 1000);
  document.addEventListener('DOMContentLoaded', attachToAll);
  setTimeout(attachToAll, 500);
  console.log('[iOS Wheel Picker] ready');
})();
