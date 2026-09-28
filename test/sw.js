const CACHE_NAME = 'libifit-test-v6';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // In test environment, ALWAYS fetch fresh from network for code and navigation
  if (
    e.request.url.endsWith('.js') || 
    e.request.url.includes('.js?') || 
    e.request.url.endsWith('.html') || 
    e.request.mode === 'navigate'
  ) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Network first for other assets (images, icons) with cache fallback
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
