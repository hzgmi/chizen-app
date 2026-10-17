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
