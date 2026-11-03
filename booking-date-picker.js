/* ═══════════════════════════════════════════════════════════════
   CHIZEN — Date Picker (3 dropdowns → hidden YYYY-MM-DD)
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  var MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

  // نطاقات السنوات
  var RANGES = {
    'fly-dob': { min: 1930, max: 2010, label: 'سنة الميلاد' },
    default:  { min: 2024, max: 2030, label: 'السنة' }
  };

  function buildSelect(className, options, placeholder) {
    var sel = document.createElement('select');
    sel.className = className;
    if (placeholder) {
      var ph = document.createElement('option');
      ph.value = '';
      ph.textContent = placeholder;
      ph.disabled = true;
      ph.selected = true;
      sel.appendChild(ph);
    }
    options.forEach(function(o){
      var opt = document.createElement('option');
      opt.value = o.v;
      opt.textContent = o.t;
      sel.appendChild(opt);
    });
    return sel;
  }

  function updateHidden(wrap) {
    var target = wrap.getAttribute('data-target');
    if (!target) return;
    var y = wrap.querySelector('.chz-date-y').value;
    var m = wrap.querySelector('.chz-date-m').value;
    var d = wrap.querySelector('.chz-date-d').value;
    var hidden = document.getElementById(target);
    if (!hidden) return;
    if (y && m && d) {
      var mm = m.length === 1 ? '0' + m : m;
      var dd = d.length === 1 ? '0' + d : d;
      hidden.value = y + '-' + mm + '-' + dd;
    } else {
      hidden.value = '';
    }
    // نطلق change للـ tvlCalc
    hidden.dispatchEvent(new Event('change', { bubbles: true }));
    hidden.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function initWrap(wrap) {
    if (wrap.__chzDateInit) return;
    wrap.__chzDateInit = true;

    var target = wrap.getAttribute('data-target');
    var range = RANGES[target] || RANGES.default;

    // سنوات
    var years = [];
    for (var y = range.max; y >= range.min; y--) {
      years.push({ v: String(y), t: String(y) });
    }
    wrap.appendChild(buildSelect('chz-date-y', years, 'سنة'));

    // أشهر
    var months = MONTHS.map(function(name, i){
      var n = i + 1;
      return { v: String(n), t: name };
    });
    wrap.appendChild(buildSelect('chz-date-m', months, 'شهر'));

    // أيام (1-31)
    var days = [];
    for (var d = 1; d <= 31; d++) {
      days.push({ v: String(d), t: String(d) });
    }
    wrap.appendChild(buildSelect('chz-date-d', days, 'يوم'));

    // مراقبة التغييرات
    wrap.querySelectorAll('select').forEach(function(s){
      s.addEventListener('change', function(){ updateHidden(wrap); });
    });
  }

  function initAll() {
    document.querySelectorAll('.chz-date-group').forEach(initWrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
  setInterval(initAll, 1000);

  console.log('[DATE-PICKER] loaded');
})();
