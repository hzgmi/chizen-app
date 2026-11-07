/* ═══════════════════════════════════════════════════════════════
   CHIZEN — Smart Search (Autocomplete) v5 — Robust
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  var FLIGHT_CITIES = [
    { name: 'عدن', airport: 'مطار عدن الدولي', code: 'ADE' },
    { name: 'صنعاء', airport: 'مطار صنعاء الدولي', code: 'SAH' },
    { name: 'تعز', airport: 'مطار تعز', code: 'TAI' },
    { name: 'المكلا', airport: 'مطار الريان', code: 'RIY' },
    { name: 'سيئون', airport: 'مطار سيئون', code: 'GXF' },
    { name: 'الحديدة', airport: 'مطار الحديدة', code: 'HOD' },
    { name: 'سقطرى', airport: 'مطار سقطرى', code: 'SCT' },
    { name: 'القاهرة', airport: 'مطار القاهرة الدولي', code: 'CAI' },
    { name: 'جدة', airport: 'مطار الملك عبدالعزيز', code: 'JED' },
    { name: 'الرياض', airport: 'مطار الملك خالد', code: 'RUH' },
    { name: 'دبي', airport: 'مطار دبي الدولي', code: 'DXB' },
    { name: 'الشارقة', airport: 'مطار الشارقة', code: 'SHJ' },
    { name: 'أبو ظبي', airport: 'مطار أبو ظبي', code: 'AUH' },
    { name: 'اسطنبول', airport: 'مطار اسطنبول', code: 'IST' },
    { name: 'عمان', airport: 'مطار الملكة علياء', code: 'AMM' },
    { name: 'الدوحة', airport: 'مطار حمد الدولي', code: 'DOH' },
    { name: 'الكويت', airport: 'مطار الكويت الدولي', code: 'KWI' },
    { name: 'مسقط', airport: 'مطار مسقط الدولي', code: 'MCT' },
    { name: 'البحرين', airport: 'مطار البحرين الدولي', code: 'BAH' },
    { name: 'الخرطوم', airport: 'مطار الخرطوم', code: 'KRT' },
    { name: 'أديس أبابا', airport: 'مطار أديس أبابا', code: 'ADD' },
    { name: 'نيروبي', airport: 'مطار نيروبي', code: 'NBO' },
    { name: 'لندن', airport: 'مطار لندن', code: 'LON' },
    { name: 'باريس', airport: 'مطار باريس', code: 'PAR' },
    { name: 'مكة المكرمة', airport: 'مكة', code: 'MAK' },
    { name: 'المدينة المنورة', airport: 'المدينة', code: 'MED' }
  ];

  var BUS_CITIES = [
    { name: 'عدن', terminal: 'محطة عدن' },
    { name: 'صنعاء', terminal: 'محطة صنعاء' },
    { name: 'تعز', terminal: 'محطة تعز' },
    { name: 'إب', terminal: 'محطة إب' },
    { name: 'المكلا', terminal: 'محطة المكلا' },
    { name: 'سيئون', terminal: 'محطة سيئون' },
    { name: 'الحديدة', terminal: 'محطة الحديدة' },
    { name: 'مأرب', terminal: 'محطة مأرب' },
    { name: 'السعودية', terminal: 'نقل بري دولي (منفذ الوديعة)' },
    { name: 'عمان', terminal: 'نقل بري دولي' },
    { name: 'الإمارات', terminal: 'نقل بري دولي' },
    { name: 'الأردن', terminal: 'نقل بري دولي' },
    { name: 'مصر', terminal: 'نقل بري دولي' }
  ];

  var HOTEL_CITIES = [
    { name: 'مكة', desc: 'فنادق مكة' },
    { name: 'المدينة', desc: 'فنادق المدينة' },
    { name: 'جدة', desc: 'فنادق جدة' },
    { name: 'القاهرة', desc: 'فنادق القاهرة' },
    { name: 'دبي', desc: 'فنادق دبي' },
    { name: 'اسطنبول', desc: 'فنادق اسطنبول' },
    { name: 'صنعاء', desc: 'فنادق صنعاء' },
    { name: 'عدن', desc: 'فنادق عدن' },
    { name: 'تعز', desc: 'فنادق تعز' }
  ];

  function attachSearch(inputId, list, label) {
    var input = document.getElementById(inputId);
    if (!input) return;
    if (input.dataset.chzAc === '1') return;
    input.dataset.chzAc = '1';

    var wrap = document.createElement('div');
    wrap.style.position = 'relative';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);

    var dd = document.createElement('div');
    dd.className = 'chz-ac-dropdown';
    dd.style.display = 'none';
    wrap.appendChild(dd);

    var filtered = [];
    var activeIdx = -1;

    function render(q) {
      q = (q || '').trim().toLowerCase();
      if (q.length < 1) { dd.style.display = 'none'; return; }
      filtered = list.filter(function(c) { return c.name.toLowerCase().indexOf(q) !== -1; });
      if (!filtered.length) {
        dd.innerHTML = '<div class="chz-ac-item chz-ac-empty">لا توجد نتائج</div>';
        dd.style.display = 'block';
        return;
      }
      var html = '';
      filtered.forEach(function(c, i) {
        var sub = c.airport || c.terminal || c.desc || '';
        var code = c.code ? ' <span class="chz-ac-code">' + c.code + '</span>' : '';
        html += '<div class="chz-ac-item" data-idx="' + i + '"><div class="chz-ac-name">' + c.name + code + '</div>' + (sub ? '<div class="chz-ac-sub">' + sub + '</div>' : '') + '</div>';
      });
      dd.innerHTML = html;
      dd.style.display = 'block';
      activeIdx = -1;
      dd.querySelectorAll('.chz-ac-item').forEach(function(it) {
        it.addEventListener('mousedown', function(e) {
          e.preventDefault();
          var idx = parseInt(it.getAttribute('data-idx'));
          if (filtered[idx]) {
            input.value = filtered[idx].name;
            if (filtered[idx].code) input.setAttribute('data-code', filtered[idx].code);
            dd.style.display = 'none';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      });
    }

    input.addEventListener('input', function() { render(input.value); });
    input.addEventListener('focus', function() { if (input.value.trim()) render(input.value); });
    input.addEventListener('click', function() { if (input.value.trim()) render(input.value); });
    input.addEventListener('keydown', function(e) {
      if (dd.style.display === 'none') return;
      var items = dd.querySelectorAll('.chz-ac-item:not(.chz-ac-empty)');
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = (activeIdx + 1) % items.length; items[activeIdx].classList.add('active'); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = (activeIdx - 1 + items.length) % items.length; items[activeIdx].classList.add('active'); }
      else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); items[activeIdx].dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); }
      else if (e.key === 'Escape') { dd.style.display = 'none'; }
    });
    document.addEventListener('mousedown', function(e) { if (!wrap.contains(e.target)) dd.style.display = 'none'; });
  }

  // تشغيل ذكي: نحاول الآن، ثم كل 500ms حتى تنجح (لمدة 10 ثوانٍ)
  var attempts = 0;
  function tryInit() {
    attempts++;
    var flyFrom = document.getElementById('fly-from');
    var busTo = document.getElementById('bus-to');
    if (flyFrom && busTo) {
      attachSearch('fly-from', FLIGHT_CITIES, 'from');
      attachSearch('fly-to', FLIGHT_CITIES, 'to');
      attachSearch('bus-to', BUS_CITIES, 'bus');
      attachSearch('hotel-city', HOTEL_CITIES, 'hotel');
      console.log('[ChizenSearch] initialized after', attempts, 'attempts');
      return;
    }
    if (attempts < 20) {
      setTimeout(tryInit, 500);
    } else {
      console.warn('[ChizenSearch] fields not found after 20 attempts');
    }
  }
  tryInit();

  // إعادة المحاولة عند تغيير التبويب
  document.addEventListener('click', function(e) {
    if (e.target.closest('[data-tab], .tvl-svc, [onclick*="tvlSwitch"]')) {
      setTimeout(function() {
        attachSearch('fly-from', FLIGHT_CITIES, 'from');
        attachSearch('fly-to', FLIGHT_CITIES, 'to');
        attachSearch('bus-to', BUS_CITIES, 'bus');
        attachSearch('hotel-city', HOTEL_CITIES, 'hotel');
      }, 300);
    }
  });
})();
