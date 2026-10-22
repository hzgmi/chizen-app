/* CHIZEN — Web Push Client (Plan B) */
(function() {
  'use strict';
  var VAPID = 'BLdRrZ8k1oG70PhA_Yxc7QHMV27MDfE827UP8Yxttv5BU5iM3FHFoyQdBQkf5bOM9-9Kb5OIQ1nI5YBj_qNwF7Q';
  var state = { sub: null, registered: false };

  function urlB64ToUint8(b64) {
    var pad = '='.repeat((4 - b64.length % 4) % 4);
    var s = (b64 + pad).replace(/-/g, '+').replace(/_/g, '/');
    var raw = atob(s);
    var arr = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return arr;
  }

  async function saveSub(sub) {
    if (!window.firebase || !window.firebase.firestore) return;
    var user = window.firebase.auth().currentUser;
    if (!user) return;
    try {
      await window.firebase.firestore().collection('users').doc(user.uid).set({
        webPushSubscription: sub.toJSON(),
        webPushUpdatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
        webPushUA: navigator.userAgent.slice(0, 200)
      }, { merge: true });
      console.log('[WebPush] ✅ saved');
    } catch(e) { console.error('[WebPush] save failed:', e); }
  }

  async function register() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('[WebPush] not supported');
      return false;
    }
    try {
      var reg = await navigator.serviceWorker.register('sw.js');
      var perm = await Notification.requestPermission();
      if (perm !== 'granted') return false;
      var sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8(VAPID)
        });
      }
      state.sub = sub;
      state.registered = true;
      await saveSub(sub);
      return true;
    } catch(e) {
      console.error('[WebPush] register failed:', e);
      return false;
    }
  }

  async function ensure() {
    if (state.registered && state.sub) { await saveSub(state.sub); return true; }
    if (typeof Notification === 'undefined') return false;
    if (Notification.permission === 'granted') return register();
    return false;
  }

  async function unsubscribe() {
    if (state.sub) { try { await state.sub.unsubscribe(); } catch(e){} state.sub = null; state.registered = false; }
    if (window.firebase && window.firebase.auth().currentUser) {
      try {
        await window.firebase.firestore().collection('users').doc(window.firebase.auth().currentUser.uid).update({
          webPushSubscription: window.firebase.firestore.FieldValue.delete()
        });
      } catch(e) {}
    }
  }

  window.WebPush = { register: register, ensure: ensure, unsubscribe: unsubscribe, state: state };

  window.addEventListener('load', function() {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      setTimeout(ensure, 3000);
    }
  });
})();
