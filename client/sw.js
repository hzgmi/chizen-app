// CHIZEN Service Worker v77 — Smart caching
const CACHE_NAME = 'chizen-v321';
const PRECACHE = [
  '/chizen.html',
  '/firebase-config.js',
  '/firebase-service.js',
  '/notification-sound.js',
  '/sound-haptic.js',
  '/notif-refresh.js',
  '/web-push-client.js',
  '/chizen-extra.js',
  '/chat-widget.js',
  '/i18n/ar.json',
  '/i18n/en.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.all(
        PRECACHE.map(function(url) {
          return cache.add(url).catch(function(e){ console.warn('[SW] precache fail:', url); });
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
          .map(function(k){ return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;

  // ═══ ADMIN BYPASS — never touch admin panel ═══
  if (url.pathname.indexOf('chizen-admin-panel') > -1 ||
      url.pathname.indexOf('/admin') > -1) {
    return; // Let browser handle normally — no caching, no SW interference
  }
  const url = new URL(e.request.url);

  // 1. Firebase — always network
  if (url.hostname.includes('firestore') ||
      url.hostname.includes('firebaseio') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('identitytoolkit') ||
      url.hostname.includes('securetoken')) {
    return;
  }

  // 2. HTML files — NETWORK FIRST (always get latest)
  if (url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname === '') {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .then(function(res) {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(function(c){ c.put(e.request, clone); });
          }
          return res;
        })
        .catch(function() {
          // Offline fallback
          return caches.match(e.request);
        })
    );
    return;
  }

  // 3. SW itself — always network
  if (url.pathname.endsWith('sw.js')) {
    return;
  }

  // 4. Assets (JS, CSS, images) — cache-first with background update
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) {
        fetch(e.request).then(function(res) {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(function(c){ c.put(e.request, clone); });
          }
        }).catch(function(){});
        return cached;
      }
      return fetch(e.request).then(function(res) {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(function(c){ c.put(e.request, clone); });
        }
        return res;
      });
    })
  );
});

self.addEventListener('push', function(e) {
  if (!e.data) return;
  try {
    const data = e.data.json();
    e.waitUntil(
      self.registration.showNotification(data.title || 'شيزن', {
        body: data.body || '',
        icon: '/logo.png',
        badge: '/logo.png',
        data: data.data || {}
      })
    );
  } catch(err) {}
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if ('focus' in list[i]) return list[i].focus();
      }
      if (clients.openWindow) return clients.openWindow('/chizen.html');
    })
  );
});
