/* ═══════════════════════════════════════════════════════════════
   CHIZEN — Smart Search (Autocomplete) v5
   يدعم: الطيران، الباصات، الفنادق
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  // ─── 1. قائمة الطيران (مطارات محلية ودولية) ───
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

  // ─── 2. قائمة الباصات (مدن ومحطات) ───
  var BUS_CITIES = [
    // ─── محطات داخلية ───
    { name: 'عدن', terminal: 'محطة عدن' },
    { name: 'صنعاء', terminal: 'محطة صنعاء' },
    { name: 'تعز', terminal: 'محطة تعز' },
    { name: 'إب', terminal: 'محطة إب' },
    { name: 'المكلا', terminal: 'محطة المكلا' },
    { name: 'سيئون', terminal: 'محطة سيئون' },
    { name: 'الحديدة', terminal: 'محطة الحديدة' },
    { name: 'مأرب', terminal: 'محطة مأرب' },
    // ─── وجهات دولية (نقل بري) ───
    { name: 'السعودية', terminal: 'نقل بري دولي (منفذ الوديعة)' },
    { name: 'عمان', terminal: 'نقل بري دولي' },
    { name: 'الإمارات', terminal: 'نقل بري دولي' },
    { name: 'الأردن', terminal: 'نقل بري دولي' },
    { name: 'مصر', terminal: 'نقل بري دولي' }
  ];

  // ─── 3. قائمة الفنادق (مدن) ───
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

  window.ChizenSearch = {
    init: function(inputId, list) {
      var input = document.getElementById(inputId);
      if (!input || input.dataset.acReady) return;
      input.dataset.acReady = '1';

      // إنشاء الحاوية
      var wrap = document.createElement('div');
      wrap.style.position = 'relative';
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);

      var dropdown = document.createElement('div');
      dropdown.className = 'chz-ac-dropdown';
      dropdown.style.display = 'none';
      wrap.appendChild(dropdown);

      var activeIndex = -1;
      var filtered = [];

      function renderList(query) {
        var q = query.trim().toLowerCase();
        if (q.length < 1) { dropdown.style.display = 'none'; return; }

        filtered = list.filter(function(c) {
          return c.name.toLowerCase().includes(q);
        });

        if (!filtered.length) {
          dropdown.innerHTML = '<div class="chz-ac-item chz-ac-empty">لا توجد نتائج</div>';
          dropdown.style.display = 'block';
          return;
        }

        var html = '';
        filtered.forEach(function(c, i) {
          var sub = c.airport || c.terminal || c.desc || '';
          var code = c.code ? ' <span class="chz-ac-code">' + c.code + '</span>' : '';
          html += '<div class="chz-ac-item" data-idx="' + i + '">' +
                    '<div class="chz-ac-name">' + c.name + code + '</div>' +
                    (sub ? '<div class="chz-ac-sub">' + sub + '</div>' : '') +
                  '</div>';
        });
        dropdown.innerHTML = html;
        dropdown.style.display = 'block';
        activeIndex = -1;

        dropdown.querySelectorAll('.chz-ac-item').forEach(function(item) {
          item.addEventListener('mousedown', function(e) {
            e.preventDefault();
            var idx = parseInt(item.getAttribute('data-idx'));
            if (filtered[idx]) {
              input.value = filtered[idx].name;
              if (filtered[idx].code) input.setAttribute('data-code', filtered[idx].code);
              dropdown.style.display = 'none';
              input.dispatchEvent(new Event('input', { bubbles: true }));
              input.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });
        });
      }

      input.addEventListener('input', function() { renderList(input.value); });
      input.addEventListener('focus', function() { if (input.value.trim()) renderList(input.value); });

      input.addEventListener('keydown', function(e) {
        if (dropdown.style.display === 'none') return;
        var items = dropdown.querySelectorAll('.chz-ac-item:not(.chz-ac-empty)');
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeIndex = (activeIndex + 1) % items.length;
          items[activeIndex].classList.add('active');
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeIndex = (activeIndex - 1 + items.length) % items.length;
          items[activeIndex].classList.add('active');
        } else if (e.key === 'Enter' && activeIndex >= 0) {
          e.preventDefault();
          items[activeIndex].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        } else if (e.key === 'Escape') {
          dropdown.style.display = 'none';
        }
      });

      document.addEventListener('mousedown', function(e) {
        if (!wrap.contains(e.target)) dropdown.style.display = 'none';
      });
    },

    initAll: function() {
      var self = this;
      // الطيران
      self.init('fly-from', FLIGHT_CITIES);
      self.init('fly-to', FLIGHT_CITIES);
      // الباصات
      self.init('bus-to', BUS_CITIES);
      // الفنادق
      self.init('hotel-city', HOTEL_CITIES);
    }
  };

  function boot() {
    if (!window.APP) { setTimeout(boot, 300); return; }
    if (window.APP.__searchInited) return;
    window.APP.__searchInited = true;
    window.ChizenSearch.initAll();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
