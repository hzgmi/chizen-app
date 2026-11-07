/* ═══════════════════════════════════════════════════════════════
   CHIZEN — Smart Search (Autocomplete) v4
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  // قاعدة بيانات شاملة: الوجهات من وإلى عدن + المدن المحلية
  var CITIES = [
    // ─── اليمن (محلي) ───
    { id: 'aden', name: 'عدن', airport: 'مطار عدن الدولي', code: 'ADE' },
    { id: 'sanaa', name: 'صنعاء', airport: 'مطار صنعاء الدولي', code: 'SAH' },
    { id: 'taiz', name: 'تعز', airport: 'مطار تعز', code: 'TAI' },
    { id: 'mukalla', name: 'المكلا', airport: 'مطار الريان', code: 'RIY' },
    { id: 'seiyun', name: 'سيئون', airport: 'مطار سيئون', code: 'GXF' },
    { id: 'hodeidah', name: 'الحديدة', airport: 'مطار الحديدة', code: 'HOD' },
    { id: 'ibb', name: 'إب', airport: 'إب', code: 'IBB' },
    { id: 'marib', name: 'مأرب', airport: 'مأرب', code: 'MYB' },
    { id: 'socotra', name: 'سقطرى', airport: 'مطار سقطرى', code: 'SCT' },

    // ─── دولي (من عدن) ───
    { id: 'cairo', name: 'القاهرة', airport: 'مطار القاهرة الدولي', code: 'CAI' },
    { id: 'jeddah', name: 'جدة', airport: 'مطار الملك عبدالعزيز', code: 'JED' },
    { id: 'riyadh', name: 'الرياض', airport: 'مطار الملك خالد', code: 'RUH' },
    { id: 'dubai', name: 'دبي', airport: 'مطار دبي الدولي', code: 'DXB' },
    { id: 'sharjah', name: 'الشارقة', airport: 'مطار الشارقة', code: 'SHJ' },
    { id: 'abu-dhabi', name: 'أبو ظبي', airport: 'مطار أبو ظبي', code: 'AUH' },
    { id: 'istanbul', name: 'اسطنبول', airport: 'مطار اسطنبول', code: 'IST' },
    { id: 'amman', name: 'عمان', airport: 'مطار الملكة علياء', code: 'AMM' },
    { id: 'doha', name: 'الدوحة', airport: 'مطار حمد الدولي', code: 'DOH' },
    { id: 'kuwait', name: 'الكويت', airport: 'مطار الكويت الدولي', code: 'KWI' },
    { id: 'muscat', name: 'مسقط', airport: 'مطار مسقط الدولي', code: 'MCT' },
    { id: 'bahrain', name: 'البحرين', airport: 'مطار البحرين الدولي', code: 'BAH' },
    { id: 'khartoum', name: 'الخرطوم', airport: 'مطار الخرطوم', code: 'KRT' },
    { id: 'addis', name: 'أديس أبابا', airport: 'مطار أديس أبابا', code: 'ADD' },
    { id: 'nairobi', name: 'نيروبي', airport: 'مطار نيروبي', code: 'NBO' },
    { id: 'london', name: 'لندن', airport: 'مطار لندن', code: 'LON' },
    { id: 'paris', name: 'باريس', airport: 'مطار باريس', code: 'PAR' },
    { id: 'frankfurt', name: 'فرانكفورت', airport: 'مطار فرانكفورت', code: 'FRA' },
    { id: 'new-york', name: 'نيويورك', airport: 'مطار نيويورك', code: 'NYC' },
    { id: 'mumbai', name: 'مومباي', airport: 'مطار مومباي', code: 'BOM' },
    { id: 'delhi', name: 'دلهي', airport: 'مطار دلهي', code: 'DEL' },
    { id: 'karachi', name: 'كراتشي', airport: 'مطار كراتشي', code: 'KHI' },
    { id: 'kuala-lumpur', name: 'كوالالمبور', airport: 'مطار كوالالمبور', code: 'KUL' },
    { id: 'jakarta', name: 'جاكرتا', airport: 'مطار جاكرتا', code: 'CGK' },

    // ─── مدن العمرة والحج ───
    { id: 'makkah', name: 'مكة المكرمة', airport: 'مكة', code: 'MAK' },
    { id: 'madinah', name: 'المدينة المنورة', airport: 'المدينة', code: 'MED' },
    { id: 'jeddah-hajj', name: 'جدة (حج/عمرة)', airport: 'مطار جدة', code: 'JED' }
  ];

  window.ChizenSearch = {
    init: function(inputId, type) {
      var input = document.getElementById(inputId);
      if (!input || input.dataset.acReady) return;
      input.dataset.acReady = '1';

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

        filtered = CITIES.filter(function(c) {
          return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || (c.airport && c.airport.toLowerCase().includes(q));
        });

        if (!filtered.length) {
          dropdown.innerHTML = '<div class="chz-ac-item chz-ac-empty">لا توجد نتائج</div>';
          dropdown.style.display = 'block';
          return;
        }

        var html = '';
        filtered.forEach(function(c, i) {
          html += '<div class="chz-ac-item" data-idx="' + i + '">' +
                    '<div class="chz-ac-name">' + c.name + ' <span class="chz-ac-code">' + c.code + '</span></div>' +
                    '<div class="chz-ac-sub">' + (c.airport || '') + '</div>' +
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
              input.setAttribute('data-code', filtered[idx].code);
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
      self.init('fly-from', 'from');
      self.init('fly-to', 'to');
      self.init('bus-to', 'to');
      self.init('hotel-city', 'city');
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
