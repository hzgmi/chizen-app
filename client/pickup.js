(function() {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  function patch() {
    if (!window.APP) { setTimeout(patch, 100); return; }
    if (window.APP._pickupPatched) return;
    window.APP._pickupPatched = true;

    // حقن CSS و HTML
    document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="pickup.css">');
    document.body.insertAdjacentHTML('beforeend', `
      <div class="pickup-modal-overlay" id="pickup-modal">
        <div class="pickup-modal-sheet">
          <div class="pickup-header"><h3 style="font-size:16px; font-weight:900;">📍 أين تريد استلام طلبك؟</h3><button class="pickup-close" onclick="APP.closePickupModal()">×</button></div>
          <div class="pickup-tabs"><button class="pickup-tab active" id="tab-aden" onclick="APP.switchPickupTab('aden', this)">🏙️ داخل عدن</button><button class="pickup-tab" id="tab-yemen" onclick="APP.switchPickupTab('yemen', this)">🚌 خارج عدن</button></div>
          <div class="pickup-content" id="pickup-content"></div>
        </div>
      </div>`);

    APP.pickupLocations = null;
    APP.selectedPickup = null;
    APP.currentPickupTab = 'aden';
    APP.currentDistrict = null;

    // إخفاء الـ select الأصلي واستبداله بالزر
    var oldSelect = document.getElementById('pickup-point');
    if (oldSelect) {
      var parent = oldSelect.closest('.field');
      if (parent) {
        parent.innerHTML = `
          <label class="field-label">نقطة التسليم</label>
          <button id="pickup-btn" onclick="APP.openPickupModal()" style="width:100%; padding:14px; background:rgba(2,8,35,.55); border:1.5px solid var(--nav-border); border-radius:12px; color:var(--muted); font-family:'Tajawal',sans-serif; font-size:14px; text-align:right; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition:all 0.2s;">
            <span id="pickup-btn-text">📍 اختر نقطة التسليم</span><span style="color:var(--muted-2); font-size:18px;">›</span>
          </button>
          <input type="hidden" id="pickup-point" value="">
        `;
      }
    }

    APP.openPickupModal = function() {
      document.getElementById('pickup-modal').classList.add('active');
      if (this.pickupLocations) { this.renderPickupContent(); return; }
      document.getElementById('pickup-content').innerHTML = '<div class="pickup-loading"><div class="spinner-sm" style="margin:0 auto 10px; border-top-color:var(--pink);"></div>جاري تحميل المناطق...</div>';
      var self = this;
      var fetchPromise = FB.getConfig('delivery_locations');
      var timeout = new Promise(function(_, reject) { setTimeout(function() { reject(new Error('timeout')); }, 3000); });
      Promise.race([fetchPromise, timeout]).then(function(data) {
        self.pickupLocations = data || self.getDefaultPickupLocations();
        self.renderPickupContent();
      }).catch(function() {
        self.pickupLocations = self.getDefaultPickupLocations();
        self.renderPickupContent();
      });
    };

    APP.getDefaultPickupLocations = function() {
      return {
        aden: [
          { district: "المعلا", areas: ["الشارع الرئيسي", "سوق المعلا", "شارع جمال"] },
          { district: "كريتر", areas: ["شارع الملكة أروى", "سوق الطويل"] },
          { district: "المنصورة", areas: ["شارع الميناء", "حي الزهراء"] },
          { district: "الشيخ عثمان", areas: ["شارع الستين", "المنطقة الصناعية"] }
        ],
        yemen: [
          { gov: "تعز", station: "مكتب باصات الحوبان" },
          { gov: "صنعاء", station: "مكتب باصات الشام" },
          { gov: "الحديدة", station: "مكتب باصات شارع صنعاء" },
          { gov: "إب", station: "مكتب باصات شارع تعز" }
        ]
      };
    };

    APP.switchPickupTab = function(tab, el) {
      this.currentPickupTab = tab; this.currentDistrict = null;
      document.querySelectorAll('.pickup-tab').forEach(function(b) { b.classList.remove('active'); });
      el.classList.add('active');
      this.renderPickupContent();
    };

    APP.renderPickupContent = function() {
      var c = document.getElementById('pickup-content');
      var data = this.pickupLocations;
      if (!data || !data[this.currentPickupTab] || data[this.currentPickupTab].length === 0) { c.innerHTML = '<div class="pickup-empty">لا توجد مناطق متاحة حالياً</div>'; return; }

      if (this.currentPickupTab === 'aden') {
        if (this.currentDistrict) {
          var district = data.aden.find(function(d) { return d.district === APP.currentDistrict; });
          if (!district) return;
          var h = '<button class="pickup-back" onclick="APP.currentDistrict=null; APP.renderPickupContent()">← رجوع للمديريات</button>';
          district.areas.forEach(function(area) { h += '<div class="pickup-area-item" onclick="APP.selectPickup(\'' + esc(district.district) + ' - ' + esc(area) + '\')"><span style="font-size:14px; font-weight:700; color:var(--cream);">' + esc(area) + '</span><span style="color:var(--pink);">اختيار ›</span></div>'; });
          c.innerHTML = h;
        } else {
          var h = '<div class="pickup-grid">';
          data.aden.forEach(function(dist) { h += '<div class="pickup-district-card" onclick="APP.currentDistrict=\'' + esc(dist.district) + '\'; APP.renderPickupContent()"><div class="icon">🏘️</div><div class="name">' + esc(dist.district) + '</div></div>'; });
          h += '</div>'; c.innerHTML = h;
        }
      } else {
        var h = '';
        data.yemen.forEach(function(station) { h += '<div class="pickup-station-item" onclick="APP.selectPickup(\'' + esc(station.gov) + ' - ' + esc(station.station) + '\')"><div><div class="gov">' + esc(station.gov) + '</div><div class="station">' + esc(station.station) + '</div></div><span style="color:var(--pink); font-weight:900;">اختيار ›</span></div>'; });
        c.innerHTML = h;
      }
    };

    APP.selectPickup = function(value) {
      this.selectedPickup = value;
      document.getElementById('pickup-point').value = value;
      var btn = document.getElementById('pickup-btn');
      var txt = document.getElementById('pickup-btn-text');
      if (btn && txt) { txt.innerHTML = '📍 ' + esc(value); btn.style.borderColor = 'var(--success)'; txt.style.color = 'var(--mint)'; }
      try { localStorage.setItem('chizen_last_pickup', value); } catch(e) {}
      this.closePickupModal();
      this.toast('تم اختيار: ' + value);
    };

    APP.closePickupModal = function() { document.getElementById('pickup-modal').classList.remove('active'); };

    // اعتراض goCheckout لاسترجاع الخيار المحفوظ
    var origGoCheckout = APP.goCheckout;
    APP.goCheckout = function() {
      try {
        var saved = localStorage.getItem('chizen_last_pickup');
        if (saved && !this.selectedPickup) this.selectPickup(saved);
      } catch(e) {}
      origGoCheckout.apply(this, arguments);
    };

    // اعتراض confirmOrder للتحقق من الاختيار
    var origConfirm = APP.confirmOrder;
    APP.confirmOrder = function() {
      var pickup = this.selectedPickup || document.getElementById('pickup-point').value;
      if (!pickup) { this.toast('الرجاء اختيار نقطة التسليم أولاً'); this.openPickupModal(); return; }
      document.getElementById('pickup-point').value = pickup;
      origConfirm.apply(this, arguments);
    };
  }
  patch();
})();
