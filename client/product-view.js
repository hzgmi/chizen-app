/* CHIZEN — Product View for Customer (matches admin preview) */
(function(){
  'use strict';
  
  window.ChzProductView = {
    render: function(p) {
      if (!p) return '';
      
      var name = p.name || '';
      var brand = p.brand || '';
      var desc = p.description || '';
      var priceYER = Number(p.price) || 0;
      var priceSAR = Number(p.priceSAR) || (priceYER / 350);
      var priceUSD = Number(p.priceUSD) || (priceYER / 1300);
      var oldPrice = Number(p.oldPrice) || 0;
      var stock = Number(p.stock) || 0;
      var images = Array.isArray(p.images) ? p.images : (p.img ? [p.img] : []);
      var sizes = Array.isArray(p.sizes) ? p.sizes : [];
      var colors = Array.isArray(p.colors) ? p.colors : [];
      
      var html = '<div style="background:#0a0418; min-height:100vh; padding-bottom:100px;">';
      
      // شريط الصور
      if (images.length) {
        html += '<div style="display:flex; gap:8px; overflow-x:auto; padding:16px; scrollbar-width:none;">';
        images.forEach(function(img, idx) {
          var isMain = idx === 0;
          html += '<div style="flex:0 0 auto; width:80px; height:80px; border-radius:14px; overflow:hidden; border:2.5px solid ' + (isMain ? '#ec4899' : 'rgba(255,255,255,0.1)') + '; box-shadow:' + (isMain ? '0 0 15px rgba(236,72,153,0.5)' : 'none') + ';">' +
            '<img src="' + img + '" style="width:100%; height:100%; object-fit:cover;">' +
          '</div>';
        });
        html += '</div>';
        
        // الصورة الرئيسية الكبيرة
        html += '<div style="padding:0 16px; margin-bottom:16px;">' +
          '<div style="position:relative; padding-top:100%; background:#1A2340; border-radius:20px; overflow:hidden;">' +
            '<img src="' + images[0] + '" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">' +
          '</div>' +
        '</div>';
      } else {
        html += '<div style="padding:0 16px; margin-bottom:16px;">' +
          '<div style="position:relative; padding-top:100%; background:#1A2340; border-radius:20px; display:flex; align-items:center; justify-content:center; font-size:60px; opacity:0.3;">📦</div>' +
        '</div>';
      }
      
      // الماركة والاسم
      if (brand) {
        html += '<div style="padding:0 16px;"><div style="font-size:13px; color:#a855f7; font-weight:900; margin-bottom:6px;">' + brand + '</div></div>';
      }
      html += '<h1 style="padding:0 16px; font-size:22px; color:#F2E3C6; font-weight:900; margin-bottom:10px; line-height:1.4;">' + name + '</h1>';
      
      // التقييم
      html += '<div style="padding:0 16px; display:flex; align-items:center; gap:8px; margin-bottom:16px;">' +
        '<span style="color:#fbbf24; font-size:14px;">⭐⭐⭐⭐⭐</span>' +
        '<span style="font-size:12px; color:#9ca3af; font-weight:700;">4.5 (151)</span>' +
      '</div>';
      
      // السعر
      if (priceYER > 0) {
        html += '<div style="padding:0 16px; margin-bottom:16px;">';
        if (oldPrice > 0 && oldPrice > priceYER) {
          html += '<div style="display:flex; align-items:center; gap:10px;">';
          html += '<span style="font-size:28px; font-weight:900; color:#ec4899;">' + Math.round(priceYER).toLocaleString() + '</span>';
          html += '<span style="font-size:13px; color:#9ca3af;">ر.ي</span>';
          html += '<span style="font-size:15px; color:#6b7280; text-decoration:line-through; margin-right:auto;">' + Math.round(oldPrice).toLocaleString() + ' ر.ي</span>';
          html += '</div>';
        } else {
          html += '<span style="font-size:28px; font-weight:900; color:#ec4899;">' + Math.round(priceYER).toLocaleString() + '</span>';
          html += '<span style="font-size:13px; color:#9ca3af;"> ر.ي</span>';
        }
        html += '</div>';
        
        // العملات
        html += '<div style="padding:0 16px; display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">';
        html += '<div style="background:rgba(0,0,0,0.4); padding:12px; border-radius:12px; text-align:center;"><div style="font-size:10px; color:#9ca3af;">🇸🇦 سعودي</div><div style="font-size:16px; color:#F2E3C6; font-weight:900; margin-top:4px;">' + priceSAR.toFixed(2) + '</div></div>';
        html += '<div style="background:rgba(0,0,0,0.4); padding:12px; border-radius:12px; text-align:center;"><div style="font-size:10px; color:#9ca3af;">🇺🇸 دولار</div><div style="font-size:16px; color:#F2E3C6; font-weight:900; margin-top:4px;">' + priceUSD.toFixed(2) + '</div></div>';
        html += '</div>';
      }
      
      // المخزون
      if (stock > 0) {
        html += '<div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:14px; padding:14px; margin:0 16px 16px; text-align:center; font-size:13px; color:#10b981; font-weight:900;">✅ متوفر — ' + stock + ' قطعة</div>';
      }
      
      // المميزات (من الوصف)
      if (desc) {
        var lines = desc.split('\n').filter(function(l) { return l.trim(); }).slice(0, 4);
        if (lines.length) {
          html += '<div style="background:rgba(197,160,89,0.08); border:1px solid rgba(197,160,89,0.25); border-radius:16px; padding:16px; margin:0 16px 16px;">' +
            '<div style="font-size:14px; font-weight:900; color:#C5A059; margin-bottom:10px;">✨ المميزات</div>' +
            lines.map(function(l) { return '<div style="font-size:13px; color:#9ca3af; padding:4px 0; border-bottom:1px dashed rgba(255,255,255,0.05);">• ' + l.trim() + '</div>'; }).join('') +
          '</div>';
        }
      }
      
      // المقاسات
      if (sizes.length) {
        html += '<div style="margin:0 16px 16px;">' +
          '<div style="font-size:14px; font-weight:900; color:#F2E3C6; margin-bottom:10px;">📏 المقاسات:</div>' +
          '<div style="display:flex; flex-wrap:wrap; gap:8px;">' +
          sizes.map(function(s) { return '<span style="padding:8px 18px; background:rgba(197,160,89,0.15); border:1.5px solid #C5A059; border-radius:10px; color:#C5A059; font-weight:900; font-size:13px;">' + s + '</span>'; }).join('') +
          '</div></div>';
      }
      
      // الألوان
      if (colors.length) {
        html += '<div style="margin:0 16px 16px;">' +
          '<div style="font-size:14px; font-weight:900; color:#F2E3C6; margin-bottom:10px;">🎨 الألوان:</div>' +
          '<div style="display:flex; flex-wrap:wrap; gap:10px;">' +
          colors.map(function(c) { return '<div style="display:flex; align-items:center; gap:8px; padding:8px 14px; background:rgba(0,0,0,0.3); border-radius:10px; border:1px solid rgba(255,255,255,0.1);"><div style="width:22px; height:22px; border-radius:50%; background:' + (c.hex || '#ccc') + '; border:2px solid #fff;"></div><span style="font-size:13px; color:#F2E3C6; font-weight:700;">' + c.name + '</span></div>'; }).join('') +
          '</div></div>';
      }
      
      // محدد الكمية
      html += '<div style="padding:0 16px; margin:16px 0;">' +
        '<div style="background:rgba(26,35,64,0.8); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:14px; display:flex; align-items:center; justify-content:space-between;">' +
          '<div style="display:flex; align-items:center; gap:12px;">' +
            '<button onclick="window._qty--; if(window._qty<1) window._qty=1; document.getElementById(\'chz-qty\').textContent=window._qty;" style="width:36px; height:36px; border-radius:50%; background:#ec4899; color:#fff; border:none; font-size:18px; font-weight:900; cursor:pointer;">−</button>' +
            '<span id="chz-qty" style="font-size:18px; font-weight:900; color:#F2E3C6;">1</span>' +
            '<button onclick="window._qty++; document.getElementById(\'chz-qty\').textContent=window._qty;" style="width:36px; height:36px; border-radius:50%; background:#ec4899; color:#fff; border:none; font-size:18px; font-weight:900; cursor:pointer;">+</button>' +
          '</div>' +
          '<div style="font-size:14px; color:#9ca3af; font-weight:800;">الكمية</div>' +
        '</div>' +
      '</div>';
      
      // زر أضف للسلة
      html += '<div style="padding:0 16px;">' +
        '<button onclick="window._addToCart && window._addToCart(\'' + (p.id || '') + '\')" style="width:100%; padding:16px; background:linear-gradient(135deg,#ec4899,#a855f7); color:#fff; border:none; border-radius:14px; font-weight:900; font-size:15px; cursor:pointer;">🛒 أضف للسلة</button>' +
      '</div>';
      
      html += '</div>';
      
      window._qty = 1;
      return html;
    },
    
    open: function(product) {
      var modal = document.createElement('div');
      modal.style.cssText = 'position:fixed; inset:0; background:#0a0418; z-index:99999; overflow-y:auto; direction:rtl;';
      modal.id = 'chz-product-modal';
      modal.innerHTML = '<div style="position:sticky; top:0; background:#0a0418; padding:16px; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center; z-index:10;">' +
        '<span style="font-size:16px; font-weight:900; color:#C5A059;">تفاصيل المنتج</span>' +
        '<button onclick="document.getElementById(\'chz-product-modal\').remove();" style="background:rgba(239,68,68,0.2); color:#ef4444; border:none; width:36px; height:36px; border-radius:50%; font-size:18px; cursor:pointer;">✕</button>' +
      '</div>' +
      this.render(product);
      document.body.appendChild(modal);
    }
  };
  
  console.log('[CHIZEN Product View] loaded');
})();
