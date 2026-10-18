(function(){
  function patch(){
    if(!window.APP) { setTimeout(patch, 100); return; }
    if(window.APP._featuresPatched) return;
    window.APP._featuresPatched = true;

    APP.coupons = [];
    APP.shipping = {fee:0, freeAbove:0};
    APP.appliedCoupon = null;

    if(window.FB && FB.ready) {
      FB.getConfig('coupons').then(function(c){ if(c && c.list) APP.coupons = c.list; });
      FB.getConfig('shipping').then(function(s){ if(s) APP.shipping = s; });
    }

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
        cp = '<div class="total-row" style="color:var(--success); margin-top:10px;"><span>خصم ('+esc(this.appliedCoupon.code)+')</span><span>-' + disc + ' ر.س <span style="cursor:pointer;color:var(--red); font-size:16px; margin-right:5px;" onclick="APP.removeCoupon()">✕</span></span></div>';
      } else {
        cp = '<div style="margin-top:15px; margin-bottom:15px; display:flex; gap:8px;">' +
               '<input type="text" id="coupon-input" placeholder="أدخل كود الخصم هنا..." style="flex:1; padding:12px; background:rgba(2,8,35,0.65); border:1.5px solid rgba(120,150,255,0.16); border-radius:12px; color:#FEF3E2; font-family:Cairo,sans-serif; font-size:13px; outline:none; text-align:right;">' +
               '<button onclick="APP.applyCoupon()" style="padding:0 20px; background:linear-gradient(135deg,#ff356f,#a72bff); border:none; border-radius:12px; color:white; font-family:Cairo,sans-serif; font-weight:900; font-size:13px; cursor:pointer; white-space:nowrap; box-shadow:0 4px 12px rgba(255,53,111,0.3);">تطبيق</button>' +
             '</div>';
      }

      var oldBox = c.querySelector('.total-box');
      if(oldBox) {
        oldBox.innerHTML = cp +
          '<div class="total-row" style="border-top:1px dashed rgba(58,31,90,0.4); padding-top:10px;"><span>المجموع</span><span>' + esc(sub) + ' ر.س</span></div>' +
          '<div class="total-row"><span>الشحن</span><span style="color:' + (shipFee === 0 ? 'var(--success)' : 'var(--muted)') + ';">' + (shipFee === 0 ? 'مجاني' : shipFee + ' ر.س') + '</span></div>' +
          '<div class="total-final"><span>الإجمالي</span><span>' + esc(total) + ' ر.س</span></div>';
      }
    };

    APP.applyCoupon = function() {
      var code = (document.getElementById('coupon-input').value || '').trim().toUpperCase();
      if (!code) { this.toast('أدخل كود الخصم أولاً'); return; }
      var cp = null;
      this.coupons.forEach(function(c){ if (c.code === code && c.active) cp = c; });
      if (!cp) { this.toast('كود الخصم غير صالح أو منتهي'); return; }
      if (cp.usageLimit && cp.usedCount >= cp.usageLimit) { this.toast('انتهت صلاحية الكود'); return; }
      var sub = this.cartTotal();
      if (cp.minOrder && sub < cp.minOrder) { this.toast('الحد الأدنى للطلب ' + cp.minOrder + ' ر.س'); return; }
      this.appliedCoupon = cp;
      this.toast('تم تطبيق الخصم بنجاح ✓');
      this.renderCart();
    };

    APP.removeCoupon = function() {
      this.appliedCoupon = null;
      this.toast('تم إزالة الخصم');
      this.renderCart();
    };

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
