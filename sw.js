const CACHE_NAME = 'libifit-v8';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './firebase-service.js',
  './data.js',
  './calendar.js',
  './views.js',
  './modals_core.js',
  './modals_extra.js',
  './app.js',
  './favicon.png',
  './icon-192.png',
  './icon-512.png',
  './app-logo.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Network first with cache fallback
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
