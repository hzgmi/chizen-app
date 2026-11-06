/* ═══════════════════════════════════════════════════════════════
   CHIZEN — My Bookings v1.0 (Clean Rebuild)
   قسم "حجوزاتي" — 7 مراحل — تحكم كامل من الأدمن
   التاريخ: 2026-11-07
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var WORKER_URL = 'https://chizen-uploader.hazimchat.workers.dev';

  var MyBookings = {
    state: { bookings: [], loading: true, error: null },
    _unsub: null,
    _booted: false,

    /* ═══ §1. التهيئة ═══ */
    init: function () {
      if (this._booted) return;
      this._booted = true;
      var self = this;
      if (!window.FB || !FB.db) { setTimeout(function () { self._booted = false; self.init(); }, 500); return; }
      if (!FB.currentUser) { this.renderGuest(); return; }
      this.attachListener();
    },

    /* ═══ §2. المستمع الحي ═══ */
    attachListener: function () {
      var self = this;
      if (this._unsub) { try { this._unsub(); } catch (e) {} }
      this._unsub = FB.db.collection('bookings')
        .where('userId', '==', FB.currentUser.uid)
        .limit(50)
        .onSnapshot(function (snap) {
          var arr = [];
          snap.forEach(function (doc) {
            var d = doc.data(); d.id = doc.id; arr.push(d);
          });
          arr.sort(function (a, b) {
            var ta = a.createdAt ? (a.createdAt.seconds || 0) : 0;
            var tb = b.createdAt ? (b.createdAt.seconds || 0) : 0;
            return tb - ta;
          });
          self.state.bookings = arr;
          self.state.loading = false;
          self.state.error = null;
          self.render();
        }, function (err) {
          self.state.loading = false;
          self.state.error = err.message;
          self.render();
        });
    },

    /* ═══ §3. تحديد المرحلة (من الأعلى للأسفل — أدمن يتحكم) ═══ */
    getStage: function (b) {
      var st = b.status || 'pending';
      var qs = (b.priceQuote && b.priceQuote.status) || '';
      if (st === 'completed') return 7;
      if (b.ticketUrl) return 6;
      if (b.paymentVerified || st === 'confirmed') return 5;
      if (b.paymentProof) return 4;
      if (qs === 'accepted' || st === 'price_approved') return 3;
      if (qs === 'quoted' || st === 'price_quoted') return 2;
      return 1;
    },

    /* ═══ §4. المراحل السبع ═══ */
    STAGES: [
      { n: 1, label: 'تم الطلب',     icon: '📋' },
      { n: 2, label: 'عرض السعر',     icon: '💰' },
      { n: 3, label: 'بانتظار الدفع',  icon: '💳' },
      { n: 4, label: 'سند مرفوع',     icon: '📎' },
      { n: 5, label: 'الدفع مؤكد',    icon: '✅' },
      { n: 6, label: 'التذكرة جاهزة',  icon: '🎫' },
      { n: 7, label: 'مكتمل',         icon: '🏁' }
    ],

    /* ═══ §5. التصيير ═══ */
    render: function () {
      var root = document.getElementById('tvl-my-bookings');
      if (!root) return;
      if (this.state.loading) { root.innerHTML = '<div class="mb-loading">⏳ جاري التحميل...</div>'; return; }
      if (this.state.error)   { root.innerHTML = '<div class="mb-error">❌ ' + this.esc(this.state.error) + '</div>'; return; }
      if (!this.state.bookings.length) {
        root.innerHTML = '<div class="mb-empty"><div class="mb-empty-icon">✈️</div><div class="mb-empty-title">لا حجوزات بعد</div><div class="mb-empty-sub">احجز رحلتك الأولى الآن</div></div>';
        return;
      }
      var self = this;
      root.innerHTML = this.state.bookings.map(function (b) { return self.htmlCard(b); }).join('');
    },

    /* ═══ §6. البطاقة ═══ */
    htmlCard: function (b) {
      var stage = this.getStage(b);
      var self = this;
      var typeMap = {
        flight: { icon: '✈️', name: 'طيران' },
        bus:    { icon: '🚌', name: 'باص' },
        hotel:  { icon: '🏨', name: 'فندق' },
        hajj:   { icon: '🕋', name: 'حج وعمرة' }
      };
      var ti = typeMap[b.type] || { icon: '📋', name: 'حجز' };

      /* الشريط الزمني */
      var tl = '';
      this.STAGES.forEach(function (s) {
        var cls = s.n < stage ? 'done' : (s.n === stage ? 'current' : 'pending');
        tl += '<div class="mb-tl-step ' + cls + '">' +
                '<div class="mb-tl-dot"></div>' +
                '<div class="mb-tl-label">' + s.icon + ' ' + s.label + '</div>' +
              '</div>';
      });

      /* بيانات الرحلة */
      var d = b.data || {};
      var trip = '';
      if (d.from || d.to) trip += '<div class="mb-trip-row">📍 ' + this.esc(d.from || '?') + ' → ' + this.esc(d.to || '?') + '</div>';
      if (d.date)         trip += '<div class="mb-trip-row">📅 ' + this.esc(d.date) + '</div>';
      if (d.passengers)   trip += '<div class="mb-trip-row">👥 ' + this.esc(String(d.passengers)) + ' مسافر</div>';
      if (d.class)        trip += '<div class="mb-trip-row">💺 ' + this.esc(d.class) + '</div>';
      if (d.airline)      trip += '<div class="mb-trip-row">✈️ ' + this.esc(d.airline) + '</div>';

      /* السعر */
      var amount = (b.priceQuote && b.priceQuote.amount) || Number(b.finalPrice) || Number(b.estimatedPrice) || 0;
      var priceLbl = (b.priceQuote && b.priceQuote.amount) ? 'السعر النهائي' : (Number(b.finalPrice) ? 'السعر النهائي' : 'السعر التقديري');
      var priceHtml = '';
      if (amount > 0) {
        priceHtml = '<div class="mb-price"><div class="mb-price-lbl">' + priceLbl + '</div><div class="mb-price-val">' + (window.formatPrice ? window.formatPrice(amount) : amount + ' ر.ي') + '</div></div>';
      }

      /* الإجراء (أدمن يتحكم) */
      var action = this.htmlAction(b, stage);

      return '<div class="mb-card" data-booking-id="' + b.id + '">' +
               '<div class="mb-card-head">' +
                 '<div class="mb-card-type">' + ti.icon + ' ' + ti.name + '</div>' +
                 '<div class="mb-card-status">' + stage + '/7</div>' +
               '</div>' +
               '<div class="mb-timeline">' + tl + '</div>' +
               (trip ? '<div class="mb-trip">' + trip + '</div>' : '') +
               priceHtml +
               '<div class="mb-actions">' + action + '</div>' +
             '</div>';
    },

    /* ═══ §7. الإجراء حسب المرحلة (تحكم كامل من الأدمن) + واتساب ═══ */
    htmlAction: function (b, stage) {
      var id = b.id;
      var main = '';
      if (stage === 1) main = '<div class="mb-note">⏳ بانتظار عرض السعر من الإدارة</div>';
      else if (stage === 2) main = '<button class="mb-btn mb-btn-primary" onclick="MyBookings.openQuote(\'' + id + '\')">💰 عرض السعر وتأكيده</button>';
      else if (stage === 3) main = '<button class="mb-btn mb-btn-proof" onclick="MyBookings.uploadProof(\'' + id + '\')">📤 رفع سند الإيداع</button><div class="mb-note">حوّل المبلغ ثم ارفع صورة السند</div>';
      else if (stage === 4) main = '<div class="mb-note">📎 سندك مرفوع — بانتظار تأكيد الإدارة</div><button class="mb-btn mb-btn-secondary" onclick="MyBookings.uploadProof(\'' + id + '\')">🔄 تغيير السند</button>';
      else if (stage === 5) main = '<div class="mb-note">✅ تم تأكيد دفعك — بانتظار التذكرة من الإدارة</div>';
      else if (stage === 6 && b.ticketUrl) main = '<button class="mb-btn mb-btn-success" onclick="MyBookings.viewTicket(\'' + id + '\')">🎫 عرض التذكرة</button><div class="mb-note">🏁 سيُكمل الحجز قريباً</div>';
      else if (stage === 7) main = '<div class="mb-note">🏁 تم إكمال الحجز — شكراً لثقتك</div>';
      var support = stage < 7 ? '<button class="mb-btn mb-btn-whatsapp" onclick="MyBookings.support(\'' + id + '\')">💬 دعم الحجز واتساب</button>' : '';
      return main + support;
    },

    /* ═══ §8. Modal السعر ═══ */
    openQuote: function (id) {
      var b = this.state.bookings.filter(function (x) { return x.id === id; })[0];
      if (!b) { MyBookings.safeToast('حجز غير موجود'); return; }
      var q = b.priceQuote || {};
      var amount = q.amount || b.finalPrice || 0;
      var note = q.note || '';
      var html = '<div class="mb-modal" id="mb-quote-modal" onclick="if(event.target===this)this.remove()">' +
                   '<div class="mb-modal-box">' +
                     '<div class="mb-modal-title">💰 عرض السعر النهائي</div>' +
                     '<div class="mb-modal-amount">' + (window.formatPrice ? window.formatPrice(amount) : amount + ' ر.ي') + '</div>' +
                     (note ? '<div class="mb-modal-note">📝 ' + this.esc(note) + '</div>' : '') +
                     '<div class="mb-modal-row">' +
                       '<button class="mb-btn mb-btn-success" onclick="MyBookings.acceptQuote(\'' + id + '\')">✅ قبول السعر</button>' +
                       '<button class="mb-btn mb-btn-danger" onclick="MyBookings.rejectQuote(\'' + id + '\')">❌ رفض</button>' +
                     '</div>' +
                     '<button class="mb-modal-close" onclick="document.getElementById(\'mb-quote-modal\').remove()">إغلاق</button>' +
                   '</div>' +
                 '</div>';
      var old = document.getElementById('mb-quote-modal');
      if (old) old.remove();
      document.body.insertAdjacentHTML('beforeend', html);
    },

    /* ═══ §9. قبول السعر → price_approved ═══ */
    acceptQuote: async function (id) {
      if (!confirm('هل تقبل هذا السعر؟')) return;
      try {
        await FB.db.collection('bookings').doc(id).update({
          'priceQuote.status': 'accepted',
          'priceQuote.acceptedAt': new Date(),
          'status': 'price_approved',
          'chat': firebase.firestore.FieldValue.arrayUnion({
            from: 'customer', text: '✅ قبلت السعر', at: new Date().toISOString()
          })
        });
        MyBookings.safeToast('✅ تم قبول السعر — ارفع سند الإيداع');
        var m = document.getElementById('mb-quote-modal'); if (m) m.remove();
        try {
          await FB.db.collection('push_queue').add({
            title: '✅ العميل قبل السعر',
            body: 'حجز #' + id.substring(0, 8) + ' — بانتظار الإيصال',
            type: 'booking', status: 'pending',
            data: { bookingId: id },
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        } catch (e) {}
      } catch (e) { alert('فشل: ' + e.message); }
    },

    /* ═══ §10. رفض السعر ═══ */
    rejectQuote: async function (id) {
      var reason = prompt('سبب رفض السعر؟');
      if (!reason) return;
      try {
        await FB.db.collection('bookings').doc(id).update({
          'priceQuote.status': 'rejected',
          'priceQuote.rejectedAt': new Date(),
          'priceQuote.rejectReason': reason,
          'status': 'cancelled',
          'cancelledAt': new Date(),
          'chat': firebase.firestore.FieldValue.arrayUnion({
            from: 'customer', text: '❌ رفضت السعر: ' + reason, at: new Date().toISOString()
          })
        });
        MyBookings.safeToast('تم رفض السعر — سيُلغى الحجز');
        var m = document.getElementById('mb-quote-modal'); if (m) m.remove();
      } catch (e) { alert('فشل: ' + e.message); }
    },

    /* ═══ §11. رفع الإيصال — modal مخصص مع معاينة ═══ */
    uploadProof: function (id) {
      var html = '<div class="mb-modal" id="mb-proof-modal" onclick="if(event.target===this)this.remove()">' +
        '<div class="mb-modal-box">' +
          '<div class="mb-modal-title">📤 رفع سند الإيداع</div>' +
          '<div class="mb-proof-preview" id="mb-proof-preview">' +
            '<div class="mb-proof-icon">📸</div>' +
            '<div class="mb-proof-text">اضغط لاختيار صورة السند</div>' +
          '</div>' +
          '<div id="mb-proof-status" style="font-size:11px;color:#6b7280;margin:8px 0;text-align:center;min-height:16px"></div>' +
          '<input type="file" id="mb-proof-input" accept="image/*" style="display:none">' +
          '<div class="mb-modal-row">' +
            '<button class="mb-btn mb-btn-primary" id="mb-proof-send" disabled>✅ رفع السند</button>' +
            '<button class="mb-btn mb-btn-secondary" onclick="document.getElementById(\'mb-proof-modal\').remove()">إلغاء</button>' +
          '</div>' +
        '</div>' +
      '</div>';
      var old = document.getElementById('mb-proof-modal');
      if (old) old.remove();
      document.body.insertAdjacentHTML('beforeend', html);
      var preview = document.getElementById('mb-proof-preview');
      var input = document.getElementById('mb-proof-input');
      var sendBtn = document.getElementById('mb-proof-send');
      var selectedFile = null;
      preview.onclick = function () { input.click(); };
      input.onchange = function (e) {
        var file = e.target.files[0];
        if (!file) return;
        selectedFile = file;
        var url = URL.createObjectURL(file);
        preview.innerHTML = '<img src="' + url + '" style="max-width:100%;max-height:280px;border-radius:12px">' +
          '<div class="mb-proof-size">' + (file.size / 1024).toFixed(0) + ' KB</div>';
        sendBtn.disabled = false;
      };
      sendBtn.onclick = async function () {
        if (!selectedFile) return;
        var statusEl = document.getElementById('mb-proof-status');
        function setStatus(s) { if (statusEl) statusEl.textContent = s; }
        sendBtn.disabled = true;
        sendBtn.textContent = '⏳ جاري الرفع...';
        try {
          setStatus('1. جاري ضغط الصورة...');
          var compressed = await MyBookings.compress(selectedFile);
          setStatus('2. الصورة جاهزة (' + Math.round(compressed.size/1024) + 'KB) — جاري الرفع...');
          var res = await fetch(WORKER_URL, { method: 'POST', headers: { 'Content-Type': 'image/jpeg' }, body: compressed });
          setStatus('3. استجابة Worker: HTTP ' + res.status);
          if (!res.ok) throw new Error('Worker أعاد HTTP ' + res.status);
          var data = await res.json();
          setStatus('4. الرابط: ' + (data.url ? data.url.substring(0, 50) + '...' : 'فارغ!'));
          if (!data.url) throw new Error('لا رابط عائد من الرفع');
          await FB.db.collection('bookings').doc(id).update({
            paymentProof: data.url,
            paymentProofUploadedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          setStatus('5. ✅ تم الحفظ في Firestore!');
          MyBookings.safeToast('✅ تم رفع السند — بانتظار تأكيد الإدارة');
          setTimeout(function() { document.getElementById('mb-proof-modal').remove(); }, 1500);
        } catch (err) {
          setStatus('❌ خطأ: ' + err.message);
          MyBookings.safeToast('❌ ' + err.message);
          sendBtn.disabled = false;
          sendBtn.textContent = '✅ رفع السند';
        }
      };
    },

    /* ═══ §12. ضغط الصورة ═══ */
    compress: function (file) {
      return new Promise(function (resolve, reject) {
        var img = new Image(), u = URL.createObjectURL(file);
        img.onload = function () {
          URL.revokeObjectURL(u);
          var w = img.width, h = img.height, md = 1400;
          if (w > md || h > md) {
            if (w > h) { h = Math.round(h * md / w); w = md; }
            else { w = Math.round(w * md / h); h = md; }
          }
          var c = document.createElement('canvas');
          c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          c.toBlob(function (blob) { blob ? resolve(blob) : reject(new Error('compress')); }, 'image/jpeg', 0.85);
        };
        img.onerror = function () { URL.revokeObjectURL(u); reject(new Error('load')); };
        img.src = u;
      });
    },

    /* ═══ §12b. دعم واتساب ═══ */
    support: function (id) {
      var phone = '967772311040';
      var text = encodeURIComponent('مرحباً، أستفسر عن حجزي رقم: ' + id.substring(0, 8) + ' في CHIZEN');
      window.open('https://wa.me/' + phone + '?text=' + text, '_blank');
    },

    /* ═══ §12c. عرض التذكرة (معاينة داخل التطبيق) ═══ */
    viewTicket: function (id) {
      var b = this.state.bookings.filter(function (x) { return x.id === id; })[0];
      if (!b || !b.ticketUrl) { MyBookings.safeToast('لا توجد تذكرة'); return; }
      var url = b.ticketUrl;
      var isPdf = /\.pdf(\?|$)/i.test(url);
      var preview;
      if (isPdf) {
        preview = '<iframe src="' + this.esc(url) + '" style="width:100%;height:60vh;border:none;border-radius:12px;background:#f3f4f6"></iframe>' +
                  '<div class="mb-note" style="margin-top:8px">📄 ملف PDF — يمكنك تنزيله أو إرساله</div>';
      } else {
        preview = '<img src="' + this.esc(url) + '" style="max-width:100%;max-height:60vh;border-radius:12px;object-fit:contain">';
      }
      var html = '<div class="mb-modal" id="mb-ticket-modal" onclick="if(event.target===this)this.remove()">' +
        '<div class="mb-modal-box" style="max-width:520px">' +
          '<div class="mb-modal-title">🎫 تذكرتك</div>' +
          '<div class="mb-ticket-preview">' + preview + '</div>' +
          '<div class="mb-modal-row">' +
            '<a href="' + this.esc(url) + '" download target="_blank" class="mb-btn mb-btn-success" style="text-decoration:none;text-align:center;display:block">📥 تنزيل PDF</a>' +
            '<button class="mb-btn mb-btn-whatsapp" onclick="MyBookings.sendTicketWhatsApp(\'' + id + '\')">💬 إرسال واتساب</button>' +
          '</div>' +
          '<button class="mb-modal-close" onclick="document.getElementById(\'mb-ticket-modal\').remove()">إغلاق</button>' +
        '</div>' +
      '</div>';
      var old = document.getElementById('mb-ticket-modal');
      if (old) old.remove();
      document.body.insertAdjacentHTML('beforeend', html);
    },

    /* ═══ §12d. إرسال التذكرة عبر واتساب ═══ */
    sendTicketWhatsApp: function (id) {
      var b = this.state.bookings.filter(function (x) { return x.id === id; })[0];
      if (!b || !b.ticketUrl) { MyBookings.safeToast('لا توجد تذكرة'); return; }
      var phone = '967772311040';
      var text = encodeURIComponent('مرحباً، تذكرتي لحجز رقم ' + id.substring(0, 8) + ':\n' + b.ticketUrl);
      window.open('https://wa.me/' + phone + '?text=' + text, '_blank');
    },


    /* ═══ §15. دالة إشعارات آمنة (تتجاوز أي كود قديم مكسور) ═══ */
    safeToast: function(msg) {
      try {
        if (typeof window.toast === 'function') {
          window.toast(msg);
        } else if (typeof toast === 'function') {
          toast(msg);
        }
      } catch (e) {
        console.warn('Toast error bypassed:', e);
      }
      // إشعار بديل مضمون
      var t = document.getElementById('mb-safe-toast');
      if (!t) {
        t = document.createElement('div');
        t.id = 'mb-safe-toast';
        t.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#1f2937;color:#fff;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:700;z-index:9999999;box-shadow:0 4px 12px rgba(0,0,0,0.3);text-align:center;width:max-content;max-width:90%;direction:rtl;transition:opacity 0.3s;';
        document.body.appendChild(t);
      }
      t.textContent = msg;
      t.style.opacity = '1';
      if (window.mbSafeToastTimer) clearTimeout(window.mbSafeToastTimer);
      window.mbSafeToastTimer = setTimeout(function() { 
        t.style.opacity = '0'; 
        setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 300);
      }, 3500);
    },

    /* ═══ §13. مساعدات ═══ */
    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },

    /* ═══ §14. نظام إشعارات مستقل (يمنع تعارض الدوال القديمة) ═══ */
    toast: function (msg) {
      var t = document.getElementById('mb-custom-toast');
      if (!t) {
        t = document.createElement('div');
        t.id = 'mb-custom-toast';
        t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1f2937;color:#fff;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:700;z-index:9999999;box-shadow:0 4px 12px rgba(0,0,0,0.3);transition:opacity 0.3s;text-align:center;width:max-content;max-width:90%;direction:rtl;';
        document.body.appendChild(t);
      }
      t.textContent = msg;
      t.style.opacity = '1';
      if (window.mbToastTimer) clearTimeout(window.mbToastTimer);
      window.mbToastTimer = setTimeout(function() { 
        t.style.opacity = '0'; 
        setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 300);
      }, 3500);
    },

    renderGuest: function () {
      var root = document.getElementById('tvl-my-bookings');
      if (root) root.innerHTML = '<div class="mb-guest">سجّل دخول لعرض حجوزاتك</div>';
    },

    refresh: function () {
      if (FB.currentUser) this.attachListener();
      else this.renderGuest();
    }
  };

  window.MyBookings = MyBookings;

  /* ═══ تشغيل تلقائي ═══ */
  function boot() {
    if (!window.FB || !FB.db) { setTimeout(boot, 500); return; }
    MyBookings.init();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  console.log('[MyBookings v1.0] loaded — admin-controlled');
})();
