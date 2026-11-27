// Service Worker — CHIZEN (web)
// Stops 404 on registration and enables network-first fetch + web push.

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Network-first: never serve stale HTML/JS; fall back to cache only on network failure.
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});

// Web Push handlers
self.addEventListener('push', function(event) {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (e) { data = { title: 'CHIZEN', body: event.data ? event.data.text() : 'إشعار جديد' }; }
  const title = data.title || 'CHIZEN';
  const options = {
    body: data.body || '',
    icon: 'https://i.ibb.co/FkvCmDwy/logo.png',
    badge: 'https://i.ibb.co/FkvCmDwy/logo.png',
    image: data.image || null,
    data: data.data || { url: data.url || 'chizen.html' },
    vibrate: [200, 100, 200],
    tag: 'chizen-notif',
    renotify: true,
    requireInteraction: false
  };
  event.waitUntil(
    self.registration.showNotification(title, options).then(function() {
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        clientList.forEach(function(client) {
          if ('postMessage' in client) client.postMessage({ type: 'PUSH_RECEIVED' });
        });
      });
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const d = event.notification.data || {};
  const url = d.url || 'chizen.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (let i = 0; i < list.length; i++) {
        const c = list[i];
        if (c.url.indexOf('chizen') !== -1 && 'focus' in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
"