(function(){
  function patch(){
    if(!window.APP) { setTimeout(patch, 100); return; }
    if(window.APP._featuresPatched) return;
    window.APP._featuresPatched = true;

    APP.coupons = [];
    APP.shipping = {fee:0, freeAbove:0};
    APP.appliedCoupon = null;

    // جلب بيانات الكوبونات والشحن
    if(window.FB && FB.ready) {
      FB.getConfig('coupons').then(function(c){ if(c && c.list) APP.coupons = c.list; });
      FB.getConfig('shipping').then(function(s){ if(s) APP.shipping = s; });
    }

    // اعتراض دالة عرض السلة لإضافة الكوبون
    var origRenderCart = APP.renderCart;
    APP.renderCart = function() {
      origRenderCart.apply(this, arguments);
      var c = document.getElementById('cart-wrap');
      if(!c || !this.cart.length) return;

      var sub = this.cartTotal();
      var disc = 0;
      if(this.appliedCoupon) {
        if(this.appliedCoupon.type === 'percent') disc = Math.floor(sub * (this.appliedCoupon.value / 100));
        else disc = this.appliedCoupon.value;
      }
      var shipFee = 0;
      var freeAbove = this.shipping.freeAbove || 0;
      var baseShipFee = this.shipping.fee || 0;
      if(sub > 0 && (!freeAbove || sub < freeAbove)) shipFee = baseShipFee;
      var total = Math.max(0, sub - disc + shipFee);

      var cp = '';
      if(this.appliedCoupon) {
        cp = '<div class="total-row" style="color:var(--success);"><span>خصم ('+esc(this.appliedCoupon.code)+')</span><span>-' + disc + ' ر.س <span style="cursor:pointer;color:var(--red);" onclick="APP.removeCoupon()">✕</span></span></div>';
      } else {
        cp = '<div class="field" style="margin-top:10px;margin-bottom:10px;display:flex;gap:8px;"><input type="text" id="coupon-input" class="field-input" placeholder="كود الخصم..." style="flex:1;"><button class="btn btn-primary" onclick="APP.applyCoupon()">تطبيق</button></div>';
      }

      var oldBox = c.querySelector('.total-box');
      if(oldBox) {
        oldBox.innerHTML = cp +
          '<div class="total-row"><span>المجموع</span><span>' + esc(sub) + ' ر.س</span></div>' +
          '<div class="total-row"><span>الشحن</span><span style="color:' + (shipFee === 0 ? 'var(--success)' : 'var(--muted)') + ';">' + (shipFee === 0 ? 'مجاني' : shipFee + ' ر.س') + '</span></div>' +
          '<div class="total-final"><span>الإجمالي</span><span>' + esc(total) + ' ر.س</span></div>';
      }
    };

    APP.applyCoupon = function() {
      var code = (document.getElementById('coupon-input').value || '').trim().toUpperCase();
      if (!code) return;
      var cp = null;
      this.coupons.forEach(function(c){ if (c.code === code && c.active) cp = c; });
      if (!cp) { this.toast('كود الخصم غير صالح أو منتهي'); return; }
      if (cp.usageLimit && cp.usedCount >= cp.usageLimit) { this.toast('انتهت صلاحية الكود'); return; }
      var sub = this.cartTotal();
      if (cp.minOrder && sub < cp.minOrder) { this.toast('الحد الأدنى للطلب ' + cp.minOrder + ' ر.س'); return; }
      this.appliedCoupon = cp;
      this.toast('تم تطبيق الخصم ✓');
      this.renderCart();
    };

    APP.removeCoupon = function() {
      this.appliedCoupon = null;
      this.renderCart();
    };

    // اعتراض صفحة الدفع لتحديث الإجمالي
    var origGoCheckout = APP.goCheckout;
    APP.goCheckout = function() {
      origGoCheckout.apply(this, arguments);
      var sub = this.cartTotal();
      var disc = 0;
      if(this.appliedCoupon) {
        if(this.appliedCoupon.type === 'percent') disc = Math.floor(sub * (this.appliedCoupon.value / 100));
        else disc = this.appliedCoupon.value;
      }
      var shipFee = 0;
      var freeAbove = this.shipping.freeAbove || 0;
      var baseShipFee = this.shipping.fee || 0;
      if(sub > 0 && (!freeAbove || sub < freeAbove)) shipFee = baseShipFee;
      var total = Math.max(0, sub - disc + shipFee);

      var ss = document.getElementById('checkout-subtotal'); if (ss) ss.textContent = sub + ' ر.س';
      var sf = document.getElementById('checkout-shipping'); if (sf) sf.textContent = shipFee === 0 ? 'مجاني' : shipFee + ' ر.س';
      var sd = document.getElementById('checkout-discount'); if (sd) sd.textContent = disc > 0 ? '-' + disc + ' ر.س' : '0 ر.س';
      var st = document.getElementById('checkout-total'); if (st) st.textContent = total + ' ر.س';
    };
  }
  patch();
})();
