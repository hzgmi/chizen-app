/* ═══════════════════════════════════════════
   CHIZEN NOTIFICATIONS v3
   Push حقيقي + محلي + Capacitor Native
   ═══════════════════════════════════════════ */

window.ChizenNotif = {
  platform: 'web',
  fcmToken: null,
  messaging: null,

  init: function() {
    /* كشف المنصة */
    if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
      this.platform = 'native';
      this.initNative();
    } else if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.PushNotifications) {
      this.platform = 'native';
      this.initNative();
    } else if ('Notification' in window && 'serviceWorker' in navigator) {
      this.platform = 'web';
      this.initWebFCM();
    }
  },

  /* ═══ Native (Capacitor APK) — إشعارات حقيقية خارجية ═══ */
  initNative: async function() {
    try {
      var P = window.Capacitor.Plugins.PushNotifications;
      if (!P) { this.platform = 'web'; this.initWebFCM(); return; }

      /* 1. طلب الإذن */
      var perm = await P.requestPermissions();
      if (perm.receive !== 'granted') {
        console.log('[Notif] الإذن مرفوض');
        return;
      }

      /* 2. تسجيل مع FCM */
      await P.register();

      /* 3. استقبال التوكن */
      P.addListener('registration', function(token) {
        console.log('[Notif] FCM Token:', token.value);
        ChizenNotif.fcmToken = token.value;
        try { localStorage.setItem('chizen_fcm_token', token.value); } catch(e) {}

        /* حفظ في Firestore */
        if (window.FB && FB.ready && FB.currentUser) {
          FB.saveUserProfile({ fcmToken: token.value }).catch(function(){});
        }

        /* حفظ بعد تسجيل الدخول إن لم يكن مسجلاً بعد */
        if (!FB.currentUser) {
          setTimeout(function() {
            if (window.FB && FB.ready && FB.currentUser) {
              FB.saveUserProfile({ fcmToken: token.value }).catch(function(){});
            }
          }, 3000);
        }
      });

      P.addListener('registrationError', function(err) {
        console.error('[Notif] Registration error:', err);
      });

      /* 4. استقبال إشعار والتطبيق مفتوح (Foreground) */
      P.addListener('pushNotificationReceived', function(notification) {
        console.log('[Notif] Foreground:', notification);
        var title = notification.title || 'CHIZEN';
        var body  = notification.body || '';
        var data  = notification.data || {};
        ChizenNotif.send(title, body, { type: data.type || 'push' });
      });

      /* 5. عند نقر الإشعار (خلفية/مغلق) */
      P.addListener('pushNotificationActionPerformed', function(action) {
        console.log('[Notif] Action:', action);
        var data = action.notification.data || {};
        try {
          if (data.type === 'order') {
            window.location.href = 'chizen.html#orders';
          } else if (data.type === 'product' && data.productId) {
            localStorage.setItem('chizen_open_product', data.productId);
            window.location.href = 'chizen.html';
          } else {
            window.location.href = 'chizen.html';
          }
        } catch(e) {}
      });

      console.log('[Notif] Native initialized ✓');

    } catch(e) {
      console.error('[Notif] Native init failed:', e);
      this.platform = 'web';
      this.initWebFCM();
    }
  },

  /* ═══ Web + FCM ═══ */
  initWebFCM: async function() {
    try {
      if (!window.firebase || !window.firebase.messaging) {
        console.log('[Notif] FCM SDK غير محمّل — إشعارات محلية فقط');
        return;
      }
      if (Notification.permission !== 'granted') return;

      var reg = await navigator.serviceWorker.ready;
      this.messaging = firebase.messaging();

      try { await this.messaging.useServiceWorker(reg); } catch(e) {}

      var vapidKey = window.FCM_VAPID_KEY || '';
      if (!vapidKey) { console.log('[Notif] VAPID key ناقص'); return; }

      this.fcmToken = await this.messaging.getToken({ vapidKey: vapidKey });
      if (this.fcmToken) {
        try { localStorage.setItem('chizen_fcm_token', this.fcmToken); } catch(e) {}
        if (window.FB && FB.ready && FB.currentUser) {
          FB.saveUserProfile({ fcmToken: this.fcmToken }).catch(function(){});
        }
      }

      this.messaging.onMessage(function(payload) {
        var n = payload.notification || {};
        var d = payload.data || {};
        ChizenNotif.send(n.title || d.title || 'CHIZEN', n.body || d.body || '', {
          type: d.type || 'push', productId: d.productId, orderId: d.orderId
        });
      });

      this.messaging.onTokenRefresh(async function() {
        try {
          var newToken = await ChizenNotif.messaging.getToken();
          ChizenNotif.fcmToken = newToken;
          try { localStorage.setItem('chizen_fcm_token', newToken); } catch(e) {}
          if (window.FB && FB.ready && FB.currentUser) {
            FB.saveUserProfile({ fcmToken: newToken }).catch(function(){});
          }
        } catch(e){}
      });

    } catch(e) {
      console.log('[Notif] FCM init failed:', e.message);
    }
  },

  /* ═══ طلب الإذن ═══ */
  requestPermission: async function() {
    if (this.platform === 'native') {
      try {
        var P = window.Capacitor.Plugins.PushNotifications;
        var p = await P.requestPermissions();
        return p.receive === 'granted';
      } catch(e) { return false; }
    } else if ('Notification' in window) {
      if (Notification.permission === 'granted') { this.initWebFCM(); return true; }
      if (Notification.permission === 'denied') return false;
      var r = await Notification.requestPermission();
      if (r === 'granted') { this.initWebFCM(); return true; }
      return false;
    }
    return false;
  },

  /* ═══ إرسال إشعار محلي ═══ */
  send: function(title, body, options) {
    options = options || {};

    /* احترم إعدادات المستخدم */
    try {
      var st = JSON.parse(localStorage.getItem('chizen_state') || '{}');
      if (st.notifications === false) return;
      var t0 = options.type || 'general';
      if (t0 === 'offer' && st.offers === false) return;
      if (t0 === 'order' && st.orderNotifs === false) return;
    } catch(e) {}

    this.saveLocal(title, body, options);

    /* صوت */
    if (window.ChizenSound) {
      var t = options.type || 'general';
      if (t === 'order') ChizenSound.playOrder();
      else if (t === 'offer' || t === 'deal') ChizenSound.playOffer();
      else if (t === 'points') ChizenSound.playPoints();
      else ChizenSound.play();
    }

    /* إشعار نظام للويب فقط */
    if (this.platform === 'web' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        var notifOptions = {
          body: body,
          tag: options.tag || 'chizen-' + Date.now(),
          requireInteraction: false,
          silent: true,
          vibrate: options.vibrate !== false ? [200, 100, 200] : undefined
        };
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then(function(reg) {
            reg.showNotification(title, notifOptions);
          });
        } else {
          new Notification(title, notifOptions);
        }
      } catch(e) {}
    }

    /* Toast داخل التطبيق */
    if (window.APP && APP.toast) APP.toast(body);
  },

  saveLocal: function(title, body, options) {
    try {
      var list = JSON.parse(localStorage.getItem('chizen_notifications') || '[]');
      list.push({
        title: title, body: body,
        date: new Date().toISOString(),
        type: options.type || 'general',
        read: false
      });
      if (list.length > 100) list.shift();
      localStorage.setItem('chizen_notifications', JSON.stringify(list));
      if (window.APP) {
        APP.notifications = list;
        if (APP.updateNotifBadge) APP.updateNotifBadge();
      }
    } catch(e) {}
  },

  /* ═══ إشعارات جاهزة ═══ */
  orderPlaced: function(orderId, total) {
    this.send('تم استلام طلبك ✓', 'طلب #' + orderId + ' بقيمة ' + total + ' ر.س',
      { type: 'order', tag: 'order-' + orderId });
  },
  orderConfirmed: function(orderId) {
    this.send('تم تأكيد طلبك', 'طلب #' + orderId + ' قيد التجهيز الآن',
      { type: 'order', tag: 'confirm-' + orderId });
  },
  orderShipped: function(orderId) {
    this.send('طلبك في الطريق 🚚', 'طلب #' + orderId + ' خرج من المستودع',
      { type: 'order', tag: 'ship-' + orderId, vibrate: [300,100,300,100,300] });
  },
  orderDelivered: function(orderId) {
    this.send('وصل طلبك 🎉', 'طلب #' + orderId + ' جاهز للاستلام',
      { type: 'order', tag: 'deliver-' + orderId });
  },
  offer: function(title, body, productId) {
    this.send('🔥 ' + title, body,
      { type: 'offer', tag: 'offer-' + Date.now(), productId: productId });
  },
  pointsEarned: function(points) {
    this.send('💎 نقاط جديدة!', 'حصلت على ' + points + ' نقطة',
      { type: 'points', tag: 'points-' + Date.now() });
  },
  welcome: function(name) {
    this.send('أهلاً ' + name + ' 👋', 'مرحباً بك في CHIZEN',
      { type: 'welcome', tag: 'welcome-' + Date.now() });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function(){ ChizenNotif.init(); });
} else {
  ChizenNotif.init();
}