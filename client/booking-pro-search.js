/* ═══════════════════════════════════════════════════════════════
   CHIZEN — Pro Search (Airbnb-style Bottom Sheet)
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  var CITIES = [
    { name: 'عدن', type: 'مطار', code: 'ADE' },
    { name: 'صنعاء', type: 'مطار', code: 'SAH' },
    { name: 'تعز', type: 'مطار', code: 'TAI' },
    { name: 'المكلا', type: 'مطار', code: 'RIY' },
    { name: 'سيئون', type: 'مطار', code: 'GXF' },
    { name: 'الحديدة', type: 'مطار', code: 'HOD' },
    { name: 'سقطرى', type: 'مطار', code: 'SCT' },
    { name: 'القاهرة', type: 'مدينة', code: 'CAI' },
    { name: 'جدة', type: 'مدينة', code: 'JED' },
    { name: 'الرياض', type: 'مدينة', code: 'RUH' },
    { name: 'دبي', type: 'مدينة', code: 'DXB' },
    { name: 'الشارقة', type: 'مدينة', code: 'SHJ' },
    { name: 'أبو ظبي', type: 'مدينة', code: 'AUH' },
    { name: 'اسطنبول', type: 'مدينة', code: 'IST' },
    { name: 'عمان', type: 'مدينة', code: 'AMM' },
    { name: 'الدوحة', type: 'مدينة', code: 'DOH' },
    { name: 'الكويت', type: 'مدينة', code: 'KWI' },
    { name: 'مسقط', type: 'مدينة', code: 'MCT' },
    { name: 'البحرين', type: 'مدينة', code: 'BAH' },
    { name: 'الخرطوم', type: 'مدينة', code: 'KRT' },
    { name: 'أديس أبابا', type: 'مدينة', code: 'ADD' },
    { name: 'نيروبي', type: 'مدينة', code: 'NBO' },
    { name: 'لندن', type: 'مدينة', code: 'LON' },
    { name: 'باريس', type: 'مدينة', code: 'PAR' },
    { name: 'مكة المكرمة', type: 'مدينة', code: 'MAK' },
    { name: 'المدينة المنورة', type: 'مدينة', code: 'MED' }
  ];

  function openSearchModal(targetId, label) {
    var input = document.getElementById(targetId);
    if (!input) return;

    // Bottom Sheet
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,0.8);display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px);';

    var sheet = document.createElement('div');
    sheet.style.cssText = 'background:#0f172a;width:100%;max-width:500px;border-radius:24px 24px 0 0;padding:20px;box-shadow:0 -10px 40px rgba(0,0,0,0.5);border-top:1px solid rgba(197,160,89,0.3);max-height:80vh;overflow-y:auto;direction:rtl;animation:slideUp 0.3s ease;';

    // Header
    var header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.1);';
    header.innerHTML = '<div style="color:#C5A059;font-weight:900;font-size:18px;">' + label + '</div>' +
                       '<button id="close-search" style="background:rgba(255,255,255,0.1);border:none;color:#fff;width:36px;height:36px;border-radius:50%;font-size:18px;cursor:pointer;">✕</button>';
    sheet.appendChild(header);

    // Search Input
    var searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = 'ابحث عن مدينة أو مطار...';
    searchBox.style.cssText = 'width:100%;padding:14px;border-radius:12px;border:1.5px solid rgba(197,160,89,0.3);background:#1A2340;color:#fff;font-size:16px;font-family:inherit;margin-bottom:16px;box-sizing:border-box;';
    sheet.appendChild(searchBox);

    // List
    var list = document.createElement('div');
    sheet.appendChild(list);

    function renderList(query) {
      var q = (query || '').trim().toLowerCase();
      var filtered = q ? CITIES.filter(function(c){ return c.name.toLowerCase().indexOf(q) !== -1 || c.code.toLowerCase().indexOf(q) !== -1; }) : CITIES;
      var html = '';
      filtered.forEach(function(c) {
        var icon = c.type === 'مطار' ? '✈️' : '🏙️';
        html += '<div data-name="' + c.name + '" style="display:flex;align-items:center;gap:12px;padding:14px;border-bottom:1px solid rgba(255,255,255,0.05);cursor:pointer;">' +
                  '<div style="font-size:20px;">' + icon + '</div>' +
                  '<div style="flex:1;">' +
                    '<div style="color:#fff;font-weight:700;font-size:15px;">' + c.name + '</div>' +
                    '<div style="color:#9ca3af;font-size:12px;">' + c.type + ' — ' + c.code + '</div>' +
                  '</div>' +
                '</div>';
      });
      list.innerHTML = html || '<div style="text-align:center;color:#9ca3af;padding:20px;">لا توجد نتائج</div>';
      list.querySelectorAll('div[data-name]').forEach(function(item) {
        item.onclick = function() {
          input.value = item.getAttribute('data-name');
          modal.remove();
          if (window.APP && APP.tvlCalc) APP.tvlCalc('flight');
          if (window.APP && APP.renderPassengers) APP.renderPassengers();
        };
      });
    }

    searchBox.addEventListener('input', function(){ renderList(searchBox.value); });
    renderList('');

    sheet.querySelector('#close-search').onclick = function() { modal.remove(); };
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
    modal.appendChild(sheet);
    document.body.appendChild(modal);
    setTimeout(function() { searchBox.focus(); }, 300);
  }

  window.ChizenProSearch = {
    init: function() {
      var flyFrom = document.getElementById('fly-from');
      var flyTo = document.getElementById('fly-to');
      
      if (flyFrom && !flyFrom._proReady) {
        flyFrom._proReady = true;
        flyFrom.setAttribute('readonly', 'readonly');
        flyFrom.style.cursor = 'pointer';
        flyFrom.addEventListener('click', function(e) {
          e.preventDefault();
          openSearchModal('fly-from', 'مدينة المغادرة');
        });
      }
      
      if (flyTo && !flyTo._proReady) {
        flyTo._proReady = true;
        flyTo.setAttribute('readonly', 'readonly');
        flyTo.style.cursor = 'pointer';
        flyTo.addEventListener('click', function(e) {
          e.preventDefault();
          openSearchModal('fly-to', 'مدينة الوصول');
        });
      }
    }
  };

  setInterval(function() { if (window.ChizenProSearch) window.ChizenProSearch.init(); }, 1000);
  document.addEventListener('DOMContentLoaded', function() { window.ChizenProSearch.init(); });
  setTimeout(function() { window.ChizenProSearch.init(); }, 500);
})();
