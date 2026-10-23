// سكربت لإجبار التطبيق على مسح الكاش القديم وتحديث نفسه
self.addEventListener('install', function(event) {
  self.skipWaiting(); // تفعيل فوري
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName); // مسح كل الكاش القديم
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// استراتيجية: جلب من الإنترنت دائماً، وإذا انقطع، استخدم الكاش
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});


// ═══ Web Push handlers (Plan B) ═══





// ═══ Web Push Handler (مع أيقونة الشعار) ═══
self.addEventListener('push', function(event) {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch(e) { data = { title: 'CHIZEN', body: event.data ? event.data.text() : 'لديك إشعار جديد' }; }
  const title = data.title || 'CHIZEN';
  const options = {
    body: data.body || '',
    icon: 'https://i.ibb.co/FkvCmDwy/logo.png', // أيقونة الشعار
    badge: 'https://i.ibb.co/FkvCmDwy/logo.png', // شارة الإشعار
    image: data.image || null,
    data: data.data || { url: data.url || 'chizen.html' },
    vibrate: [200, 100, 200],
    tag: 'chizen-notif',
    renotify: true,
    requireInteraction: false
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const d = event.notification.data || {};
  const url = d.url || 'chizen.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (let i = 0; i < list.length; i++) {
        const c = list[i];
        if (c.url.indexOf('chizen') !== -1 && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
