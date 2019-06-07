const ASSET_DIR_NAME = 'assets';
const MAX_SHARD = 5;

self.addEventListener('install', event => {
  console.log('install');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('activate');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  if (!url.includes(ASSET_DIR_NAME)) return;

  const encoded = (new TextEncoder()).encode(url).reduce((prev, current) => prev + current);
  const storageKey = `cache-test-${encoded % MAX_SHARD}`;

  event.respondWith(
    caches.open(storageKey).then(cache => {
      return cache.match(event.request).then(responseCache => {
        if (responseCache) {
          return responseCache;
        }
        return fetch(url).then(response => {
          if (!response.ok) {
            return response;
          }
          return cache.put(url, response.clone()).then(() => response);
        });
      });
    })
  );
});