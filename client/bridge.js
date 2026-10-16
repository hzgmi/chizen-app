/* ═══════════════════════════════════════════
   CHIZEN BRIDGE v2
   ═══════════════════════════════════════════ */

window.Bridge = {

  getProducts: function() {
    var fbProducts = [];
    try { fbProducts = JSON.parse(localStorage.getItem('chizen_fb_products') || '[]'); } catch(e) {}

    var adminProducts = [];
    try { adminProducts = JSON.parse(localStorage.getItem('chizen_admin_products') || '[]'); } catch(e) {}

    var merged = (window.DEFAULT_PRODUCTS || [])
      .concat(adminProducts)
      .concat(fbProducts);

    var seen = {};
    var out = [];
    for (var i = merged.length - 1; i >= 0; i--) {
      var p = merged[i];
      if (p && p.id != null && !seen[p.id]) {
        seen[p.id] = true;
        out.unshift(p);
      }
    }
    return out;
  },

  getBanners: function() {
    try {
      var b = JSON.parse(localStorage.getItem('chizen_banners') || 'null');
      if (b && b.length > 0) return b;
    } catch(e) {}
    return window.DEFAULT_BANNERS || [];
  },

  getCategories: function() {
    try {
      var c = JSON.parse(localStorage.getItem('chizen_categories') || 'null');
      if (c && c.length > 0) return c;
    } catch(e) {}
    return window.DEFAULT_CATEGORIES || [];
  },

  getPayments: function() {
    try {
      var p = JSON.parse(localStorage.getItem('chizen_payments') || 'null');
      if (p && p.length > 0) return p;
    } catch(e) {}
    return window.DEFAULT_PAYMENTS || [];
  },

  getContact: function() {
    try {
      var c = JSON.parse(localStorage.getItem('chizen_contact') || '{}');
      return {
        phone:    c.phone    || '+967 77 123 4567',
        whatsapp: c.whatsapp || '967771234567',
        email:    c.email    || 'support@chizen.com'
      };
    } catch(e) {
      return { phone:'+967 77 123 4567', whatsapp:'967771234567', email:'support@chizen.com' };
    }
  },

  getAds: function() {
    try {
      var a = JSON.parse(localStorage.getItem('chizen_ads') || '{}');
      return {
        adsenseId: a.adsenseId || '',
        admobId:   a.admobId   || '',
        mode:      a.mode      || 'placeholder'
      };
    } catch(e) {
      return { adsenseId:'', admobId:'', mode:'placeholder' };
    }
  },

  getDeals: function() {
    try { return JSON.parse(localStorage.getItem('chizen_deals') || 'null'); } catch(e) { return null; }
  },

  getNotifications: function() {
    try { return JSON.parse(localStorage.getItem('chizen_notifications') || '[]'); } catch(e) { return []; }
  },

  renderAd: function(slotId) {
    var el = document.getElementById(slotId);
    if (!el) return;
    var ads = this.getAds();
    if (ads.mode === 'off') { el.style.display = 'none'; return; }

    if (ads.mode === 'adsense' && ads.adsenseId) {
      el.innerHTML = '<ins class="adsbygoogle" style="display:block" data-ad-client="'
        + window.esc(ads.adsenseId) + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
    } else if (ads.mode === 'admob' && ads.admobId) {
      el.innerHTML = '<div class="ad-content">AdMob: ' + window.esc(ads.admobId) + '</div>';
    } else {
      el.innerHTML = '<div class="ad-content">مساحة إعلانية</div>';
    }
  },

  cacheImages: async function() {
    if (!('caches' in window)) return;
    try {
      var cache = await caches.open('chizen-images-v1');
      var products = this.getProducts();
      var banners = this.getBanners();
      var urls = [];
      products.forEach(function(p){ if (p.img) urls.push(p.img); });
      banners.forEach(function(b){ if (b.img) urls.push(b.img); });
      for (var i = 0; i < urls.length; i++) {
        var cached = await cache.match(urls[i]);
        if (!cached) { try { await cache.add(urls[i]); } catch(e) {} }
      }
    } catch(e) {}
  },

  syncFromFirebase: async function() {
    if (!window.FB || !FB.ready) return false;
    try {
      var products = await FB.getProducts();
      if (products && products.length) {
        var mapped = products.map(function(p) {
          return {
            id: p.id, category: p.category || 'home', brand: p.brand || '',
            name: p.name || '', nameEn: p.nameEn || '', price: p.price || 0,
            old: p.old || null, badge: p.badge || '', rating: p.rating || 4.5,
            reviews: p.reviews || 0, sold: p.sold || 0, img: p.img || '',
            desc: p.desc || '', features: p.features || []
          };
        });
        localStorage.setItem('chizen_fb_products', JSON.stringify(mapped));
      }

      var banners = await FB.getBanners();
      if (banners && banners.length) {
        localStorage.setItem('chizen_banners', JSON.stringify(banners));
      }

      var cats = await FB.getConfig('categories');
      if (cats && cats.list) localStorage.setItem('chizen_categories', JSON.stringify(cats.list));

      var pays = await FB.getConfig('payments');
      if (pays && pays.list) localStorage.setItem('chizen_payments', JSON.stringify(pays.list));

      var contact = await FB.getConfig('contact');
      if (contact) localStorage.setItem('chizen_contact', JSON.stringify(contact));

      var ads = await FB.getConfig('ads');
      if (ads) localStorage.setItem('chizen_ads', JSON.stringify(ads));

      var deal = await FB.getDeal();
      if (deal) localStorage.setItem('chizen_deals', JSON.stringify(deal));

      return true;
    } catch(e) {
      console.log('[Bridge] Sync failed:', e);
      return false;
    }
  }
};