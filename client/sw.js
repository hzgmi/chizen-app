// CHIZEN Service Worker v350 — Force Update
const CACHE_NAME = 'chizen-v352';

// تفعيل فوري (لا انتظار)
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

// مسح كل الكاش القديم + السيطرة الفورية
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Network First للـ HTML (دائماً يحمّل الجديد)
self.addEventListener('fetch', function(event) {
  var req = event.request;
  
  // HTML / Navigation → network first
  if (req.mode === 'navigate' || 
      (req.method === 'GET' && req.headers.get('accept') && req.headers.get('accept').indexOf('text/html') !== -1)) {
    event.respondWith(
      fetch(req).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(req, clone);
        });
        return response;
      }).catch(function() {
        return caches.match(req);
      })
    );
    return;
  }
  
  // Assets → cache first
  event.respondWith(
    caches.match(req).then(function(cached) {
      return cached || fetch(req).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(req, clone);
        });
        return response;
      });
    })
  );
});
