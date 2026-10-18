/* ═══════════════════════════════════════════
   CHIZEN EXTRA — إضافات runtime لكل النواقص
   ═══════════════════════════════════════════ */
(function() {
  'use strict';
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

  var DEFAULT_PRODUCTS = [
    {id:1,category:'electronics',brand:'Sony',name:'سماعات Sony WH-1000XM5',price:1299,old:1899,badge:'-32%',rating:4.9,reviews:1240,sold:5420,img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',desc:'سماعات لاسلكية احترافية',features:['إلغاء ضوضاء','30 ساعة','شحن سريع']},
    {id:2,category:'electronics',brand:'Apple',name:'ساعة Apple Watch S9',price:1599,old:1999,badge:'-20%',rating:4.8,reviews:856,sold:3200,img:'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',desc:'ساعة ذكية',features:['Retina','S9','ECG']},
    {id:3,category:'clothes',brand:'Nike',name:'حذاء Nike Air Max',price:599,old:849,badge:'-29%',rating:4.7,reviews:2103,sold:8900,img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',desc:'حذاء رياضي',features:['Air Max','جلد','خفيف']},
    {id:4,category:'beauty',brand:'Dior',name:'عطر Dior Sauvage',price:450,old:null,badge:'جديد',rating:4.9,reviews:3421,sold:12000,img:'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80',desc:'عطر رجالي شرقي',features:['شرقي','100ml','أصلي']},
    {id:5,category:'home',brand:'Philips',name:'آلة قهوة Philips',price:2899,old:3499,badge:'-17%',rating:4.8,reviews:678,sold:1200,img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',desc:'آلة قهوة',features:['LatteGo','12 نوع','1.8 لتر']},
    {id:6,category:'school',brand:'Moleskine',name:'دفتر Moleskine',price:89,old:120,badge:'-26%',rating:4.6,reviews:1890,sold:6700,img:'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80',desc:'دفتر فاخر',features:['جلد','A5','مطاطي']},
    {id:7,category:'electronics',brand:'Apple',name:'iPhone 15 Pro Max',price:5499,old:5999,badge:'-8%',rating:4.9,reviews:5621,sold:9800,img:'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',desc:'أقوى iPhone',features:['تيتانيوم','A17','48MP']},
    {id:8,category:'beauty',brand:'Chanel',name:'عطر Chanel No.5',price:680,old:850,badge:'-20%',rating:4.9,reviews:4210,sold:15000,img:'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80',desc:'عطر نسائي',features:['زهري','100ml','أصلي']},
    {id:9,category:'clothes',brand:'Adidas',name:'جاكيت Adidas',price:399,old:550,badge:'-27%',rating:4.5,reviews:1023,sold:3400,img:'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',desc:'جاكيت رياضي',features:['قطنية','سحاب','أحجام']},
    {id:10,category:'home',brand:'IKEA',name:'كرسي IKEA POÄNG',price:899,old:1200,badge:'-25%',rating:4.7,reviews:2340,sold:4100,img:'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80',desc:'كرسي هزاز',features:['خشب','وسائد','إسكندنافي']},
    {id:11,category:'school',brand:'Faber-Castell',name:'طقم Faber-Castell',price:159,old:220,badge:'-28%',rating:4.8,reviews:1567,sold:5600,img:'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80',desc:'طقم أقلام',features:['رصاص','ألوان','ألماني']},
    {id:12,category:'electronics',brand:'JBL',name:'مكبر JBL Charge 5',price:549,old:749,badge:'-27%',rating:4.7,reviews:3456,sold:7200,img:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',desc:'مكبر صوت',features:['JBL','IP67','20 ساعة']},
    {id:13,category:'beauty',brand:'Maybelline',name:'أحمر شفاه Maybelline',price:79,old:120,badge:'-34%',rating:4.6,reviews:2890,sold:11000,img:'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80',desc:'أحمر شفاه',features:['12 ساعة','مات','مرطب']},
    {id:14,category:'food',brand:'Nescafé',name:'قهوة Nescafé Gold',price:65,old:85,badge:'-24%',rating:4.5,reviews:1890,sold:8400,img:'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',desc:'قهوة فورية',features:['حبوب','200g','سريعة']},
    {id:15,category:'games',brand:'Sony',name:'PlayStation 5 DualSense',price:299,old:399,badge:'-25%',rating:4.9,reviews:4521,sold:6800,img:'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80',desc:'ذراع تحكم PS5',features:['لمسية','USB-C','بطارية']},
    {id:16,category:'home',brand:'Dyson',name:'مكنسة Dyson V15',price:3499,old:4299,badge:'-18%',rating:4.8,reviews:1230,sold:980,img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',desc:'مكنسة لاسلكية',features:['شفط','ليزر','Hepa']}
  ];

  var DEFAULT_CATEGORIES = [
    {key:'home',name:'منزلية',icon:'🏠'},{key:'beauty',name:'تجميل',icon:'💄'},
    {key:'school',name:'مدرسية',icon:'📚'},{key:'clothes',name:'ملابس',icon:'👕'},
    {key:'electronics',name:'إلكترونيات',icon:'📱'},{key:'food',name:'طعام',icon:'🍔'},
    {key:'games',name:'ألعاب',icon:'🎮'},{key:'more',name:'المزيد',icon:'➕'}
  ];

  var DEFAULT_BANNERS = [
    {bg:'linear-gradient(135deg,#EC4899 0%,#A855F7 60%,#38BDF8 100%)',tag:'عرض محدود',title:'عروض الجمعة',sub:'خصم حتى 50%',btn:'تسوق الآن',img:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=60'},
    {bg:'linear-gradient(135deg,#FB923C 0%,#EC4899 100%)',tag:'جديد',title:'إلكترونيات 2025',sub:'أحدث الأجهزة',btn:'اكتشف',img:'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=60'},
    {bg:'linear-gradient(135deg,#8B5CF6 0%,#EC4899 100%)',tag:'حصري',title:'عالم الجمال',sub:'ماركات عالمية',btn:'تسوقي',img:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=60'}
  ];

  var DEFAULT_PAYMENTS = [
    {id:'kuraimi',name:'بنك الكريمي',account:'1234-567-890',color:'#0d47a1',icon:'🏦',type:'bank'},
    {id:'tadhamon',name:'بنك التضامن',account:'9876-543-210',color:'#1b5e20',icon:'🏦',type:'bank'},
    {id:'yemen',name:'البنك اليمني',account:'5555-444-333',color:'#b71c1c',icon:'🏦',type:'bank'},
    {id:'cash',name:'دفع نقدي',account:'',color:'#EF6C00',icon:'💵',type:'cash'}
  ];

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
          '<div id="tracking-w" style="padding:0 20px;margin-top:8px;"></div>' +
          '<div style="margin:16px 20px 0;padding:8px;background:var(--nav);border:1px dashed var(--bd);border-radius:14px;text-align:center;min-height:56px;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--mt);position:relative;">' +
            '<span style="position:absolute;top:4px;right:8px;font-size:9px;color:var(--mt2);">إعلان</span>' +
            'مساحة إعلانية' +
          '</div>' +
          '<div class="sec" style="display:none;" id="flash-sec">' +
            '<div class="sh"><div class="stl">⚡ عروض خاطفة</div></div>' +
            '<div style="display:flex;gap:10px;overflow-x:auto;" id="flash-c"></div>' +
          '</div>' +
          '<div class="sec" id="brands-sec" style="display:none;">' +
            '<div class="sh"><div class="stl">🏷️ العلامات التجارية</div></div>' +
            '<div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;" id="brands"></div>' +
          '</div>' +
          '<div style="margin:22px 20px 0;padding:20px;background:linear-gradient(135deg,#592cff,#a72bff,#ff20c6,#ff8b45);border-radius:18px;display:flex;justify-content:space-between;align-items:center;gap:12px;">' +
            '<div><div style="font-size:16px;font-weight:900;color:#fff;">خصم إضافي 20%</div><div style="font-size:11px;color:rgba(255,255,255,.92);margin-top:4px;">على طلبك الأول</div><div style="display:inline-block;margin-top:8px;padding:6px 14px;background:rgba(0,0,0,.32);border:1px dashed rgba(255,255,255,.65);border-radius:8px;color:#fff;font-size:12px;font-weight:900;letter-spacing:2px;font-family:monospace;">CHIZEN20</div></div>' +
            '<div style="font-size:48px;">🎁</div>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:20px;margin-top:10px;">' +
            '<div style="background:var(--nav);border:1.5px solid var(--bd);border-radius:12px;padding:12px 6px;text-align:center;"><div style="font-size:20px;">🔒</div><div style="font-size:9px;color:var(--cr);font-weight:700;margin-top:4px;">دفع آمن</div></div>' +
            '<div style="background:var(--nav);border:1.5px solid var(--bd);border-radius:12px;padding:12px 6px;text-align:center;"><div style="font-size:20px;">🚚</div><div style="font-size:9px;color:var(--cr);font-weight:700;margin-top:4px;">شحن سريع</div></div>' +
            '<div style="background:var(--nav);border:1.5px solid var(--bd);border-radius:12px;padding:12px 6px;text-align:center;"><div style="font-size:20px;">↩️</div><div style="font-size:9px;color:var(--cr);font-weight:700;margin-top:4px;">إرجاع</div></div>' +
            '<div style="background:var(--nav);border:1.5px solid var(--bd);border-radius:12px;padding:12px 6px;text-align:center;"><div style="font-size:20px;">💬</div><div style="font-size:9px;color:var(--cr);font-weight:700;margin-top:4px;">دعم 24/7</div></div>' +
          '</div>' +
          '<div style="padding:24px 20px 40px;text-align:center;">' +
            '<div style="font-family:Playfair Display,serif;font-size:28px;font-weight:900;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:3px;">CHIZEN</div>' +
            '<div style="font-size:11px;color:var(--mt2);margin-top:6px;">© 2025 CHIZEN</div>' +
          '</div>';
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

    console.log('✅ CHIZEN Extra Applied (16 fixes)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(patch, 300); });
  } else {
    setTimeout(patch, 300);
  }
})();
