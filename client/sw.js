/* ═══════════════════════════════════════════
   CHIZEN Service Worker v4
   ═══════════════════════════════════════════ */

var CACHE_NAME = 'chizen-v4';

var PRECACHE_URLS = [
  './index.html',
  './chizen.html',
  './settings.html',
  './about.html',
  './privacy.html',
  './terms.html',
  './firebase-config.js',
  './firebase-service.js',
  './notifications.js',
  './notification-sound.js',
  './bridge.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.all(PRECACHE_URLS.map(function(url) {
        return cache.add(url).catch(function() { console.log('[SW] Failed:', url); });
      }));
    }).then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event) {
  var url = event.request.url;
  if (event.request.method !== 'GET') return;
  
  /* تجاهل Firebase live */
  if (url.indexOf('firestore.googleapis.com') > -1 ||
    url.indexOf('identitytoolkit.googleapis.com') > -1 ||
    url.indexOf('securetoken.googleapis.com') > -1 ||
    url.indexOf('firebaseinstallations.googleapis.com') > -1 ||
    url.indexOf('fcmregistrations.googleapis.com') > -1) {
    return;
  }
  
  /* الخطوط */
  if (url.indexOf('fonts.googleapis.com') > -1 || url.indexOf('fonts.gstatic.com') > -1) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        return fetch(event.request).then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clone); });
          }
          return response;
        }).catch(function() { return caches.match(event.request); });
      })
    );
    return;
  }
  
  /* محلي + Unsplash */
  if (url.indexOf(self.location.origin) === 0 || url.indexOf('images.unsplash.com') > -1) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) {
          fetch(event.request).then(function(response) {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, response); });
            }
          }).catch(function() {});
          return cached;
        }
        return fetch(event.request).then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clone); });
          }
          return response;
        }).catch(function() {
          if (event.request.headers.get('accept') &&
            event.request.headers.get('accept').indexOf('text/html') > -1) {
            return caches.match('./index.html');
          }
        });
      })
    );
    return;
  }
  
  event.respondWith(fetch(event.request).catch(function() { return caches.match(event.request); }));
});

/* ═══ Push من FCM ═══ */
self.addEventListener('push', function(event) {
  var data = {};
  if (event.data) {
    try { data = event.data.json(); } catch (e) {
      data = { notification: { title: 'CHIZEN', body: event.data.text() } };
    }
  }
  var n = data.notification || {};
  var d = data.data || {};
  var title = n.title || d.title || 'CHIZEN';
  var body = n.body || d.body || '';
  
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      tag: d.tag || 'chizen-' + Date.now(),
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      vibrate: [200, 100, 200],
      data: d,
      silent: false,
      requireInteraction: false
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var data = event.notification.data || {};
  var targetUrl = '/chizen.html';
  if (data.type === 'order') targetUrl = '/chizen.html#orders';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.indexOf('/chizen.html') > -1 && 'focus' in client) {
          client.postMessage({ action: 'openFromNotif', data: data });
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data && event.data.action === 'skipWaiting') self.skipWaiting();
  if (event.data && event.data.action === 'clearCache') {
    caches.keys().then(function(keys) { keys.forEach(function(key) { caches.delete(key); }); });
  }
});