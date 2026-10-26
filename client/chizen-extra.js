/* ═══════════════════════════════════════════
   CHIZEN EXTRA — إضافات runtime لكل النواقص
   ═══════════════════════════════════════════ */
(function() {
  'use strict';
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

  var DEFAULT_PRODUCTS = [];

  var DEFAULT_CATEGORIES = [];

  var DEFAULT_BANNERS = [];

  var DEFAULT_PAYMENTS = [];

  function patch() {
    if (!window.APP) { setTimeout(patch, 150); return; }
    if (window.APP._extraPatched) return;
    window.APP._extraPatched = true;

    var A = window.APP;

    /* ═══ 1. إضافة البيانات الافتراضية ═══ */
    A.DEFAULT_PRODUCTS = DEFAULT_PRODUCTS;
    A.DEFAULT_CATEGORIES = DEFAULT_CATEGORIES;
    A.DEFAULT_BANNERS = DEFAULT_BANNERS;
    A.DEFAULT_PAYMENTS = DEFAULT_PAYMENTS;

    /* ═══ 2. تحميل البيانات الافتراضية فوراً ═══ */
    if (!A.products || !A.products.length) { A.products = DEFAULT_PRODUCTS.slice(); }
    if (!A.cats || !A.cats.length) { A.cats = DEFAULT_CATEGORIES.slice(); }
    if (!A.banners || !A.banners.length) { A.banners = DEFAULT_BANNERS.slice(); }
    if (!A.banks || !A.banks.length) { A.banks = DEFAULT_PAYMENTS.slice(); }

    /* ═══ 3. إعادة الرسم بالأساسيات ═══ */
    try { A.renderCats(); } catch(e) {}
    try { A.renderBanners(); } catch(e) {}
    try { A.renderProducts(); } catch(e) {}

    /* ═══ 4. حماية من Firebase الفارغ ═══ */
    if (window.FB && FB.ready) {
      var origReady = A.onUserReady;
      A.onUserReady = function(u) {
        origReady.call(this, u);
        setTimeout(function() {
          if (!A.products || !A.products.length) {
            A.products = DEFAULT_PRODUCTS.slice();
            try { A.renderProducts(); } catch(e) {}
          }
          if (!A.cats || !A.cats.length) {
            A.cats = DEFAULT_CATEGORIES.slice();
            try { A.renderCats(); } catch(e) {}
          }
          if (!A.banners || !A.banners.length) {
            A.banners = DEFAULT_BANNERS.slice();
            try { A.renderBanners(); } catch(e) {}
          }
          if (!A.banks || !A.banks.length) {
            A.banks = DEFAULT_PAYMENTS.slice();
            try { A.renderBanks(); } catch(e) {}
          }
        }, 800);
      };
    }

    /* ═══ 5. إضافة الأقسام المفقودة في الرئيسية ═══ */
    var homeScreen = document.getElementById('sc-home');
    if (homeScreen) {
      var prodsSection = homeScreen.querySelector('.sec:last-child');
      if (prodsSection) {
        var extraHTML =
          // ═══ chz-world-v47 — "عالم آخر" ═══
          '<div id="chz-world" style="position:relative;overflow:hidden;margin-top:32px;padding:40px 20px 30px;background:linear-gradient(180deg,transparent 0%,rgba(155,77,255,0.05) 30%,rgba(255,61,154,0.08) 70%,rgba(155,77,255,0.12) 100%);text-align:center;">' +
            // نجوم متحركة
            '<div class="chz-w-stars">' +
              '<span>✦</span><span>✧</span><span>✦</span><span>✧</span><span>✦</span><span>✧</span><span>✦</span><span>✧</span><span>✦</span><span>✧</span><span>✦</span><span>✧</span>' +
            '</div>' +
            // أيقونة "باب عالم آخر"
            '<div class="chz-w-portal">' +
              '<div class="chz-w-portal-ring"></div>' +
              '<div class="chz-w-portal-icon">🌌</div>' +
            '</div>' +
            // العنوان
            '<div class="chz-w-title">لم تنتهِ الحكاية بعد</div>' +
            '<div class="chz-w-sub">هناك عوالم أخرى تنتظرك داخل شيزن</div>' +
            // 4 أبواب لعوالم
            '<div class="chz-w-worlds">' +
              '<div class="chz-w-world" onclick="APP.goTab(\'cart\')"><div class="chz-w-world-i">🛍️</div><div class="chz-w-world-n">السوق</div></div>' +
              '<div class="chz-w-world" onclick="APP.goTab(\'booking\')"><div class="chz-w-world-i">✈️</div><div class="chz-w-world-n">السفر</div></div>' +
              '<div class="chz-w-world" onclick="APP.goTab(\'points\')"><div class="chz-w-world-i">💎</div><div class="chz-w-world-n">النقاط</div></div>' +
              '<div class="chz-w-world" onclick="APP.goTab(\'orders\')"><div class="chz-w-world-i">📦</div><div class="chz-w-world-n">طلباتي</div></div>' +
            '</div>' +
            // زر العودة للأعلى
            '<button class="chz-w-top" onclick="window.scrollTo({top:0,behavior:\'smooth\'})">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><polyline points="18 15 12 9 6 15"/></svg>' +
              '<span>العودة للأعلى</span>' +
            '</button>' +
            // Footer
            '<div class="chz-w-footer">' +
              '<div class="chz-w-logo">CHIZEN</div>' +
              '<div class="chz-w-tagline">✨ عالمك للتسوق والسفر ✨</div>' +
              '<div class="chz-w-copy">© 2026 CHIZEN — جميع الحقوق محفوظة</div>' +
            '</div>' +
          '</div>' +
          // CSS مدمج
          '<style id="chz-world-v47-css">' +
            '#chz-world{font-family:Tajawal,sans-serif;direction:rtl;}' +
            '.chz-w-stars{position:absolute;inset:0;pointer-events:none;opacity:.4;}' +
            '.chz-w-stars span{position:absolute;font-size:10px;color:#fff;animation:wSparkle 3s ease-in-out infinite;}' +
            '.chz-w-stars span:nth-child(1){top:8%;left:15%;animation-delay:0s;}' +
            '.chz-w-stars span:nth-child(2){top:15%;left:75%;animation-delay:.3s;}' +
            '.chz-w-stars span:nth-child(3){top:25%;left:30%;animation-delay:.6s;}' +
            '.chz-w-stars span:nth-child(4){top:12%;left:55%;animation-delay:.9s;}' +
            '.chz-w-stars span:nth-child(5){top:35%;left:85%;animation-delay:1.2s;}' +
            '.chz-w-stars span:nth-child(6){top:45%;left:10%;animation-delay:1.5s;}' +
            '.chz-w-stars span:nth-child(7){top:55%;left:70%;animation-delay:.4s;}' +
            '.chz-w-stars span:nth-child(8){top:65%;left:25%;animation-delay:.8s;}' +
            '.chz-w-stars span:nth-child(9){top:20%;left:45%;animation-delay:1.1s;}' +
            '.chz-w-stars span:nth-child(10){top:40%;left:60%;animation-delay:.2s;}' +
            '.chz-w-stars span:nth-child(11){top:70%;left:80%;animation-delay:.7s;}' +
            '.chz-w-stars span:nth-child(12){top:30%;left:5%;animation-delay:1.4s;}' +
            '@keyframes wSparkle{0%,100%{opacity:.2;transform:scale(.8);}50%{opacity:1;transform:scale(1.3);}}' +
            '.chz-w-portal{position:relative;width:100px;height:100px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;}' +
            '.chz-w-portal-ring{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,#FF3D9A,#9B4DFF,#4D8CFF,#FF8A00,#FF3D9A);animation:wRotate 8s linear infinite;filter:blur(6px);opacity:.7;}' +
            '.chz-w-portal-ring::after{content:\'\';position:absolute;inset:8px;background:var(--bg,#07091d);border-radius:50%;}' +
            '.chz-w-portal-icon{position:relative;font-size:44px;z-index:1;filter:drop-shadow(0 0 20px rgba(155,77,255,.8));animation:wFloat 3s ease-in-out infinite;}' +
            '@keyframes wRotate{to{transform:rotate(360deg);}}' +
            '@keyframes wFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}' +
            '.chz-w-title{font-size:22px;font-weight:900;color:var(--chz-text,#fff);margin-bottom:6px;letter-spacing:-.3px;}' +
            '.chz-w-sub{font-size:13px;color:var(--mt,#9ca3af);font-weight:600;margin-bottom:24px;line-height:1.5;}' +
            '.chz-w-worlds{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:24px;}' +
            '.chz-w-world{background:var(--nav,#1e2438);border:1.5px solid rgba(255,61,154,.15);border-radius:14px;padding:12px 4px;cursor:pointer;transition:all .2s ease;-webkit-tap-highlight-color:transparent;}' +
            '.chz-w-world:active{transform:scale(.94);background:rgba(255,61,154,.1);}' +
            '.chz-w-world-i{font-size:24px;line-height:1;margin-bottom:6px;}' +
            '.chz-w-world-n{font-size:10px;font-weight:800;color:var(--chz-text,#e8ecf5);}' +
            '.chz-w-top{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;background:linear-gradient(135deg,rgba(255,61,154,.12),rgba(155,77,255,.12));border:1.5px solid rgba(255,61,154,.3);border-radius:20px;color:#FF3D9A;font-family:Tajawal,sans-serif;font-size:12px;font-weight:900;cursor:pointer;margin-bottom:32px;-webkit-tap-highlight-color:transparent;transition:all .15s ease;}' +
            '.chz-w-top:active{transform:scale(.95);}' +
            '.chz-w-footer{border-top:1px solid rgba(155,77,255,.15);padding-top:24px;margin-top:8px;}' +
            '.chz-w-logo{font-family:Playfair Display,serif;font-size:32px;font-weight:900;background:linear-gradient(135deg,#FF3D9A 0%,#9B4DFF 50%,#4D8CFF 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:4px;margin-bottom:8px;}' +
            '.chz-w-tagline{font-size:12px;color:var(--mt,#9ca3af);font-weight:700;margin-bottom:6px;}' +
            '.chz-w-copy{font-size:10px;color:var(--mt2,#6b7280);font-weight:600;}' +
            '@media(max-width:359px){.chz-w-title{font-size:18px;}.chz-w-sub{font-size:11px;}.chz-w-portal{width:80px;height:80px;}.chz-w-portal-icon{font-size:36px;}.chz-w-logo{font-size:26px;}}' +
          '</style>';
        var prodsDiv = homeScreen.querySelector('#prods');
        if (prodsDiv && prodsDiv.parentElement) {
          prodsDiv.parentElement.insertAdjacentHTML('afterend', extraHTML);
        }
      }
    }

    /* ═══ 6. شاشة النجاح ═══ */
    if (!document.getElementById('sc-success')) {
      var screens = document.getElementById('screens');
      if (screens) {
        screens.insertAdjacentHTML('beforeend',
          '<div class="screen" id="sc-success">' +
            '<div class="st"></div>' +
            '<div style="padding:40px 24px;text-align:center;">' +
              '<div style="width:100px;height:100px;margin:20px auto 24px;background:linear-gradient(135deg,rgba(0,212,160,.2),rgba(0,223,255,.15));border:2px solid var(--gn);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:50px;">✓</div>' +
              '<div style="font-size:24px;font-weight:900;color:var(--cr);">تم استلام طلبك!</div>' +
              '<p style="font-size:14px;color:var(--mt);margin-top:12px;">رقم طلبك <span id="succ-oid" style="color:var(--pl);font-weight:900;"></span></p>' +
              '<button class="btn-p" style="margin-top:30px;" onclick="APP.goTab(\'orders\')">متابعة الطلب</button>' +
              '<button class="btn-c" style="margin-top:12px;width:100%;flex:none;" onclick="APP.goTab(\'home\')">العودة للرئيسية</button>' +
            '</div>' +
          '</div>'
        );
      }
    }

    /* ═══ 7. شاشة العناوين ═══ */
    if (!document.getElementById('sc-addresses')) {
      var screens2 = document.getElementById('screens');
      if (screens2) {
        screens2.insertAdjacentHTML('beforeend',
          '<div class="screen" id="sc-addresses">' +
            '<div class="st"></div>' +
            '<div class="sh2"><button class="back" onclick="APP.goTab(\'profile\')"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button><div class="st2">عناويني</div></div>' +
            '<div style="padding:8px 20px 20px;" id="addr-list"></div>' +
            '<div style="padding:0 20px 20px;"><button class="btn-p" onclick="APP.addAddress()">+ إضافة عنوان جديد</button></div>' +
          '</div>'
        );
      }
    }

    /* ═══ 8. شاشة طرق الدفع ═══ */
    if (!document.getElementById('sc-payment')) {
      var screens3 = document.getElementById('screens');
      if (screens3) {
        screens3.insertAdjacentHTML('beforeend',
          '<div class="screen" id="sc-payment">' +
            '<div class="st"></div>' +
            '<div class="sh2"><button class="back" onclick="APP.goTab(\'profile\')"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button><div class="st2">طرق الدفع</div></div>' +
            '<div style="padding:8px 20px 20px;" id="pay-list"></div>' +
          '</div>'
        );
      }
    }

    /* ═══ 9. إضافة خيارات للـ Profile ═══ */
    var profileScreen = document.getElementById('sc-profile');
    if (profileScreen) {
      var firstSG = profileScreen.querySelector('.sg');
      if (firstSG) {
        var firstSGT = firstSG.querySelector('.sgt');
        var firstSit = firstSG.querySelector('.sit');
        if (firstSit) {
          firstSit.insertAdjacentHTML('beforebegin',
            '<div class="sit" onclick="APP.goTab(\'addresses\')"><div class="sii"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div><div class="sit-t"><div class="sit-ti">عناويني</div></div><div class="mi-a">›</div></div>' +
            '<div class="sit" onclick="APP.goTab(\'payment\')"><div class="sii"><svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div><div class="sit-t"><div class="sit-ti">طرق الدفع</div></div><div class="mi-a">›</div></div>'
          );
        }
      }
    }

    /* ═══ 10. تحسين شاشة التفاصيل (مفضلة + مشاركة + مميزات) ═══ */
    var detailsScreen = document.getElementById('sc-details');
    if (detailsScreen) {
      var detImg = document.getElementById('det-img');
      if (detImg && !detImg.querySelector('.fav-btn')) {
        detImg.insertAdjacentHTML('beforeend',
          '<button id="fav-btn-det" style="position:absolute;top:16px;left:16px;width:42px;height:42px;background:rgba(2,5,27,.75);border:1.5px solid var(--bd);border-radius:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:3;" onclick="APP.togFavDet()">' +
            '<svg viewBox="0 0 24 24" style="width:20px;height:20px;stroke:var(--pl);stroke-width:2;fill:none;"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>' +
          '</button>' +
          '<button style="position:absolute;top:16px;left:70px;width:42px;height:42px;background:rgba(2,5,27,.75);border:1.5px solid var(--bd);border-radius:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:3;" onclick="APP.shareDet()">' +
            '<svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:var(--pl);stroke-width:2;fill:none;"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>' +
          '</button>'
        );
      }
      var detBody = detailsScreen.querySelector('.det-b');
      if (detBody && !document.getElementById('det-features')) {
        var detDesc = document.getElementById('det-desc');
        if (detDesc) {
          detDesc.insertAdjacentHTML('afterend',
            '<div class="det-f" id="det-features" style="margin-top:16px;display:flex;flex-direction:column;gap:8px;"></div>'
          );
        }
      }
    }

    /* ═══ 11. إضافة زر المفضلة التفاصيل ═══ */
    A.togFavDet = function() {
      if (!this.currentProd) return;
      this.togFav(this.currentProd.id, document.getElementById('fav-btn-det'));
      var isFav = this.favorites.indexOf(this.currentProd.id) > -1;
      var btn = document.getElementById('fav-btn-det');
      if (btn) {
        var svg = btn.querySelector('svg');
        if (svg) {
          if (isFav) { svg.style.fill = 'var(--pk)'; svg.style.stroke = 'var(--pk)'; }
          else { svg.style.fill = 'none'; svg.style.stroke = 'var(--pl)'; }
        }
      }
    };

    /* ═══ 12. مشاركة المنتج ═══ */
    A.shareDet = function() {
      if (!this.currentProd) return;
      var t = 'شاهد ' + this.currentProd.name + ' على CHIZEN بسعر ' + this.currentProd.price + ' ر.س';
      if (navigator.share) navigator.share({title:'CHIZEN', text:t}).catch(function(){});
      else this.toast('المشاركة غير مدعومة');
    };

    /* ═══ 13. تحسين openProduct لعرض المميزات ═══ */
    var origOpen = A.openProduct;
    A.openProduct = function(id) {
      origOpen.call(this, id);
      var p = this.currentProd;
      if (p && p.features && p.features.length) {
        var fh = '';
        p.features.forEach(function(f) {
          fh += '<div style="display:flex;align-items:center;gap:10px;font-size:13px;color:var(--cr);"><svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:var(--gn);stroke-width:2.5;fill:none;flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg>' + esc(f) + '</div>';
        });
        var fEl = document.getElementById('det-features');
        if (fEl) fEl.innerHTML = fh;
      }
      // تفعيل زر المفضلة
      var btn = document.getElementById('fav-btn-det');
      if (btn && p) {
        var svg = btn.querySelector('svg');
        var isFav = this.favorites.indexOf(p.id) > -1;
        if (svg) {
          if (isFav) { svg.style.fill = 'var(--pk)'; svg.style.stroke = 'var(--pk)'; }
          else { svg.style.fill = 'none'; svg.style.stroke = 'var(--pl)'; }
        }
      }
    };

    /* ═══ 14. عرض tracking widget ═══ */
    var origOnUserReady = A.onUserReady;
    A.onUserReady = function(u) {
      origOnUserReady.call(this, u);
      var self = this;
      setTimeout(function() {
        try { self.renderTrack && self.renderTrack(); } catch(e) {}
      }, 1200);
    };

    A.renderTrack = function() {
      var el = document.getElementById('tracking-w');
      if (!el) return;
      var po = null;
      for (var i = this.orders.length - 1; i >= 0; i--) {
        if (this.orders[i].status === 'pending' || this.orders[i].status === 'shipped') { po = this.orders[i]; break; }
      }
      if (!po) { el.innerHTML = ''; return; }
      el.innerHTML = '<div style="padding:14px 16px;background:linear-gradient(135deg,rgba(0,212,160,.13),rgba(0,223,255,.08));border:1px solid rgba(0,212,160,.3);border-radius:14px;display:flex;align-items:center;gap:12px;cursor:pointer;" onclick="APP.goTab(\'orders\')"><div style="width:42px;height:42px;background:rgba(0,212,160,.2);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;">🚚</div><div style="flex:1;"><div style="font-size:13px;font-weight:900;color:var(--cr);">طلبك #' + esc((po.id||'').substring(0,10)) + ' قيد التتبع</div><div style="font-size:11px;color:var(--mt);margin-top:2px;">اضغط لتتبع</div></div><div style="color:var(--gn);font-size:20px;font-weight:900;">›</div></div>';
    };

    /* ═══ 15. عرض العروض الخاطفة ═══ */
    A.renderFlash = function() {
      var c = document.getElementById('flash-c');
      var sec = document.getElementById('flash-sec');
      if (!c) return;
      var items = this.products.filter(function(p) { return p.old && (p.old - p.price) / p.old > 0.15; }).slice(0, 6);
      if (!items.length) { if (sec) sec.style.display = 'none'; return; }
      if (sec) sec.style.display = 'block';
      c.innerHTML = items.map(function(p) {
        return '<div style="flex-shrink:0;width:130px;background:var(--nav);border:1.5px solid var(--bd);border-radius:14px;overflow:hidden;cursor:pointer;" onclick="APP.openProduct(\'' + esc(p.id) + '\')"><div style="height:100px;position:relative;overflow:hidden;"><img src="' + esc(p.img||'') + '" style="width:100%;height:100%;object-fit:cover;"><div style="position:absolute;top:6px;right:6px;background:linear-gradient(135deg,#ff4d6d,#ff8b45);color:#fff;font-size:9px;font-weight:900;padding:3px 7px;border-radius:6px;">⚡ ' + esc(p.badge||'') + '</div></div><div style="padding:8px;"><div style="font-size:11px;font-weight:700;color:var(--cr);margin-bottom:4px;line-height:1.3;height:28px;overflow:hidden;">' + esc(p.name) + '</div><div style="display:flex;align-items:baseline;gap:4px;"><span style="font-size:13px;font-weight:900;color:var(--pl);">' + esc(p.price) + '</span><span style="font-size:9px;color:var(--mt2);text-decoration:line-through;">' + esc(p.old) + '</span></div></div></div>';
      }).join('');
    };

    /* ═══ 16. عرض العلامات التجارية ═══ */
    A.renderBrands = function() {
      var c = document.getElementById('brands');
      var sec = document.getElementById('brands-sec');
      if (!c) return;
      var brands = {};
      this.products.forEach(function(p) { if (p.brand) brands[p.brand] = true; });
      var brandList = Object.keys(brands);
      if (!brandList.length) { if (sec) sec.style.display = 'none'; return; }
      if (sec) sec.style.display = 'block';
      c.innerHTML = '<div style="flex-shrink:0;padding:10px 20px;background:var(--grad2);color:#fff;border-radius:14px;font-size:13px;font-weight:800;cursor:pointer;" onclick="APP.filterBrand(\'all\')">الكل</div>' +
        brandList.map(function(b) { return '<div style="flex-shrink:0;padding:10px 20px;background:var(--nav);border:1.5px solid var(--bd);border-radius:14px;font-size:13px;font-weight:800;color:var(--cr);cursor:pointer;" onclick="APP.filterBrand(\'' + esc(b) + '\')">' + esc(b) + '</div>'; }).join('');
    };

    A.filterBrand = function(b) {
      if (b === 'all') { this.renderProducts(this.products); return; }
      this.renderProducts(this.products.filter(function(p) { return p.brand === b; }));
    };

    /* ═══ 17. طرق دفع في صفحة payment ═══ */
    A.renderPaymentMethods = function() {
      var c = document.getElementById('pay-list');
      if (!c) return;
      c.innerHTML = this.banks.map(function(b) {
        return '<div style="display:flex;align-items:center;gap:14px;padding:16px;background:var(--nav);border:1.5px solid var(--bd);border-radius:14px;margin-bottom:10px;"><div style="width:44px;height:44px;background:' + esc(b.color||'#333') + '20;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;">' + esc(b.icon||'🏦') + '</div><div style="flex:1;"><div style="font-size:14px;font-weight:700;color:var(--cr);">' + esc(b.name) + '</div><div style="font-size:11px;color:var(--mt);margin-top:2px;">' + esc(b.account||'ادفع عند الاستلام') + '</div></div></div>';
      }).join('');
    };

    /* ═══ 18. العناوين ═══ */
    A.renderAddresses = function() {
      var c = document.getElementById('addr-list');
      if (!c) return;
      var list = [];
      try { list = JSON.parse(localStorage.getItem('chizen_addresses') || '[]'); } catch(e) {}
      if (!list.length) { c.innerHTML = '<div style="text-align:center;padding:40px;color:var(--mt);">لا توجد عناوين</div>'; return; }
      c.innerHTML = list.map(function(a, i) {
        return '<div style="display:flex;align-items:center;gap:14px;padding:16px;background:var(--nav);border:1.5px solid var(--bd);border-radius:14px;margin-bottom:10px;"><div style="flex:1;"><div style="font-size:14px;font-weight:700;color:var(--cr);">' + esc(a.name||'') + '</div><div style="font-size:11px;color:var(--mt);margin-top:2px;">' + esc(a.detail||'') + '</div></div><button style="background:rgba(255,77,109,.15);border:1px solid rgba(255,77,109,.4);color:var(--rd);border-radius:8px;padding:6px 10px;cursor:pointer;" onclick="APP.deleteAddress(' + i + ')">🗑️</button></div>';
      }).join('');
    };

    A.addAddress = function() {
      var self = this;
      this.showPrompt('اسم العنوان', '', function(name) {
        if (!name) return;
        self.showPrompt('العنوان الكامل', '', function(detail) {
          if (!detail) return;
          var list = [];
          try { list = JSON.parse(localStorage.getItem('chizen_addresses') || '[]'); } catch(e) {}
          list.push({name: name, detail: detail});
          try { localStorage.setItem('chizen_addresses', JSON.stringify(list)); } catch(e) {}
          self.renderAddresses();
          self.toast('✓ تمت الإضافة');
        });
      });
    };

    A.deleteAddress = function(i) {
      var self = this;
      var list = [];
      try { list = JSON.parse(localStorage.getItem('chizen_addresses') || '[]'); } catch(e) {}
      list.splice(i, 1);
      try { localStorage.setItem('chizen_addresses', JSON.stringify(list)); } catch(e) {}
      self.renderAddresses();
      self.toast('تم الحذف');
    };

    /* ═══ 19. ربط الشاشات الجديدة بـ navigate ═══ */
    var origNavigate = A.navigate;
    A.navigate = function(id, push) {
      origNavigate.call(this, id, push);
      if (id === 'addresses') this.renderAddresses();
      if (id === 'payment') this.renderPaymentMethods();
    };

    /* ═══ 20. إعادة عرض كل شيء بعد 500ms ═══ */
    setTimeout(function() {
      try { A.renderCats(); } catch(e) {}
      try { A.renderBanners(); } catch(e) {}
      try { A.renderProducts(); } catch(e) {}
      try { A.renderFlash && A.renderFlash(); } catch(e) {}
      try { A.renderBrands && A.renderBrands(); } catch(e) {}
      try { A.updateCartB && A.updateCartB(); } catch(e) {}
      try { A.updateNotifB && A.updateNotifB(); } catch(e) {}
    }, 600);

    /* ═══ 21. شاشة النجاح بعد الطلب ═══ */
    var origConfirm = A.confirmOrder;
    A.confirmOrder = async function() {
      var before = this.orders.length;
      await origConfirm.call(this);
      if (this.orders.length > before) {
        var last = this.orders[this.orders.length - 1];
        var succ = document.getElementById('succ-oid');
        if (succ) succ.textContent = '#' + last.id;
        this.navigate('success', true);
      }
    };

    
    /* ═══ 22. اعتراض فتح القسم للحجز ═══ */
    var origOpenCatPage = A.openCatPage;
    A.openCatPage = function(key, name, icon) {
      if (key === 'booking') {
        this.goTab('booking');
        return;
      }
      origOpenCatPage.call(this, key, name, icon);
    };

    console.log('✅ CHIZEN Extra Applied (17 fixes)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(patch, 300); });
  } else {
    setTimeout(patch, 300);
  }
})();
