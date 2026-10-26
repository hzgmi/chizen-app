// CHIZEN Service Worker — v58 Cache-First strategy
const CACHE_NAME = 'chizen-v60';
const PRECACHE = [
  '/chizen.html',
  '/firebase-config.js',
  '/firebase-service.js',
  '/notification-sound.js',
  '/web-push-client.js',
  '/chizen-extra.js',
  '/chat-widget.js',
  '/i18n/ar.json',
  '/i18n/en.json'
];

// Install — precache static files
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.all(
        PRECACHE.map(function(url) {
          return cache.add(url).catch(function(e){
            console.warn('[SW] precache fail:', url, e.message);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

// Activate — delete old caches
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

// Fetch — smart strategy
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // 1. Firestore / Firebase API — always network (never cache)
  if (url.hostname.includes('firestore') ||
      url.hostname.includes('firebaseio') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('identitytoolkit') ||
      url.hostname.includes('securetoken')) {
    return; // Let browser handle normally
  }

  // 2. Our own origin — cache-first for instant load
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        if (cached) {
          // Return cache instantly, update in background
          fetch(e.request).then(function(res) {
            if (res && res.ok) {
              caches.open(CACHE_NAME).then(function(c){ c.put(e.request, res); });
            }
          }).catch(function(){});
          return cached;
        }
        // Not in cache — fetch and store
        return fetch(e.request).then(function(res) {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(function(c){ c.put(e.request, clone); });
          }
          return res;
        }).catch(function() {
          // Offline — return cached or empty
          return caches.match(e.request);
        });
      })
    );
    return;
  }

  // 3. External CDN — cache with fallback
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) {
        fetch(e.request).then(function(res) {
          if (res && res.ok) {
            caches.open(CACHE_NAME).then(function(c){ c.put(e.request, res); });
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
      }).catch(function() {
        return caches.match(e.request);
      });
    })
  );
});

// Push notifications
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
