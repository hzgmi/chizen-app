/* CHIZEN — Notification Health & Refresh */
(function(){
  'use strict';
  
  var VAPID = 'BLdRrZ8k1oG70PhA_Yxc7QHMV27MDfE827UP8Yxttv5BU5iM3FHFoyQdBQkf5bOM9-9Kb5OIQ1nI5YBj_qNwF7Q';
  
  function urlB64ToUint8(b64) {
    var pad = '='.repeat((4 - b64.length % 4) % 4);
    var s = (b64 + pad).replace(/-/g, '+').replace(/_/g, '/');
    var raw = atob(s);
    var arr = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return arr;
  }
  
  function isAPK(){
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  }
  
  async function getStatus(){
    var status = {
      platform: isAPK() ? 'apk' : 'web',
      permission: 'unknown',
      hasSubscription: false,
      saved: false,
      health: 'unknown',
      detail: ''
    };
    
    if (isAPK()) {
      // APK: check PushNotifications plugin
      try {
        var P = window.Capacitor.Plugins.PushNotifications;
        if (!P) { status.health = 'error'; status.detail = 'الإضافة غير مثبتة'; return status; }
        var perm = await P.checkPermissions();
        status.permission = perm.receive || 'prompt';
        // Check if FCM_TOKEN exists
        status.hasSubscription = !!window.FCM_TOKEN;
        // Check Firestore
        if (window.FB && FB.currentUser && FB.db) {
          try {
            var doc = await FB.db.collection('users').doc(FB.currentUser.uid).get();
            var data = doc.data() || {};
            status.saved = !!data.fcmToken;
            if (status.saved && status.hasSubscription && data.fcmToken === window.FCM_TOKEN) {
              status.health = 'ok';
            } else if (data.fcmToken) {
              status.health = 'ok'; // token saved but may be stale
            } else {
              status.health = 'needs_refresh';
            }
          } catch(e) { status.saved = false; }
        }
      } catch(e) {
        status.health = 'error';
        status.detail = e.message;
      }
    } else {
      // Web: check Notification API + PushManager
      if (typeof Notification === 'undefined') {
        status.health = 'unsupported';
        status.detail = 'المتصفح لا يدعم الإشعارات';
        return status;
      }
      status.permission = Notification.permission;
      try {
        var reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          var sub = await reg.pushManager.getSubscription();
          status.hasSubscription = !!sub;
        }
      } catch(e) {}
      // Check Firestore
      if (window.FB && FB.currentUser && FB.db) {
        try {
          var doc2 = await FB.db.collection('users').doc(FB.currentUser.uid).get();
          var data2 = doc2.data() || {};
          status.saved = !!data2.webPushSubscription;
        } catch(e) {}
      }
      if (status.permission === 'denied') {
        status.health = 'blocked';
        status.detail = 'الإذن مرفوض من المتصفح';
      } else if (status.permission === 'granted' && status.hasSubscription && status.saved) {
        status.health = 'ok';
      } else if (status.permission === 'granted') {
        status.health = 'needs_refresh';
        status.detail = 'الإذن موجود لكن الاشتراك لم يُحفظ';
      } else {
        status.health = 'needs_permission';
        status.detail = 'الإذن لم يُطلب بعد';
      }
    }
    
    return status;
  }
  
  async function refresh(){
    if (isAPK()) {
      return await refreshAPK();
    } else {
      return await refreshWeb();
    }
  }
  
  async function refreshAPK(){
    var P = window.Capacitor.Plugins.PushNotifications;
    if (!P) throw new Error('PushNotifications غير مثبتة');
    
    // 1. Permission
    var perm = await P.checkPermissions();
    if (perm.receive !== 'granted') {
      perm = await P.requestPermissions();
    }
    if (perm.receive !== 'granted') {
      throw new Error('الإذن مرفوض — افتح إعدادات النظام واسمح بالإشعارات');
    }
    
    // 2. Register — this triggers 'registration' listener which saves token
    await P.register();
    
    // 3. Wait for token (max 5s)
    var waited = 0;
    return new Promise(function(resolve, reject){
      var iv = setInterval(function(){
        waited += 200;
        if (window.FCM_TOKEN) {
          clearInterval(iv);
          // Force save
          if (window.saveFcmToken) window.saveFcmToken();
          resolve({ ok: true, token: window.FCM_TOKEN.slice(0, 20) + '...' });
        } else if (waited > 5000) {
          clearInterval(iv);
          reject(new Error('لم يُستلم توكن FCM — حاول مرة أخرى'));
        }
      }, 200);
    });
  }
  
  async function refreshWeb(){
    if (typeof Notification === 'undefined') throw new Error('المتصفح لا يدعم الإشعارات');
    
    // 1. Permission
    var perm = Notification.permission;
    if (perm !== 'granted') {
      perm = await Notification.requestPermission();
    }
    if (perm !== 'granted') {
      throw new Error(perm === 'denied' ? 'الإذن مرفوض — افتح إعدادات المتصفح' : 'الإذن لم يُمنح');
    }
    
    // 2. Register SW
    var reg = await navigator.serviceWorker.register('sw.js');
    await navigator.serviceWorker.ready;
    
    // 3. Get or create subscription
    var sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8(VAPID)
      });
    }
    
    // 4. Save to Firestore
    if (!window.FB || !FB.currentUser || !FB.db) throw new Error('سجل دخول أولاً');
    await FB.db.collection('users').doc(FB.currentUser.uid).set({
      webPushSubscription: sub.toJSON(),
      webPushUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      webPushUA: navigator.userAgent.slice(0, 200)
    }, { merge: true });
    
    return { ok: true, endpoint: sub.endpoint.slice(0, 40) + '...' };
  }
  
  window.ChizenNotifications = {
    status: getStatus,
    refresh: refresh,
    isAPK: isAPK
  };
  
  console.log('[notif-refresh] ready');
})();
