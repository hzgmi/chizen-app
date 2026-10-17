var CACHE_NAME = "chizen-v9";
var urlsToCache = [
  './', './index.html', './chizen.html', './settings.html',
  './firebase-config.js', './firebase-service.js', './bridge.js',
  './notifications.js', './notification-sound.js', './session-fix.js', './onboarding.js',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Playfair+Display:wght@700;900&display=swap'
];

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) { return cache.addAll(urlsToCache); }).then(function() { return self.skipWaiting(); }));
});

self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.map(function(key) { if (key !== CACHE_NAME) return caches.delete(key); }));
  }).then(function() { return self.clients.claim(); }));
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('firestore.googleapis.com') || event.request.url.includes('identitytoolkit')) return;
  
  // Cache First for everything else (Speed)
  event.respondWith(caches.match(event.request).then(function(response) {
    if (response) return response;
    return fetch(event.request).then(function(res) {
      if (!res || res.status !== 200 || res.type !== 'basic') return res;
      var responseToCache = res.clone();
      caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, responseToCache); });
      return res;
    });
  }));
});
