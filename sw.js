const cacheName = 'hsc26-v2'; // Version change kora hoyeche jate update hoy
const staticAssets = [
  '/hsc26masterplannar/',
  '/hsc26masterplannar/index.html',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(staticAssets);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key)));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request).then(networkResponse => {
        return caches.open(cacheName).then(cache => {
          // Network theke data asle cache-e update kore rakha
          if (e.request.url.startsWith('http')) {
             cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    }).catch(() => caches.match('/hsc26masterplannar/index.html'))
  );
});
