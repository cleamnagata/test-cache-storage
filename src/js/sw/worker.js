const ASSET_DIR_NAME = 'assets';
const MAX_SHARD = 1;

const useCache = request => {
  if (request.mode === 'navigate') {
    return false;
  }
  if (request.method !== 'GET') {
    return false;
  }
  return request.url.includes(ASSET_DIR_NAME);
};

self.addEventListener('install', event => {
  console.log('install');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('activate');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (!useCache(event.request)) return;
  const normalizedUrl = new URL(event.request.url);
  const pathname = normalizedUrl.pathname;

  const encoded = (new TextEncoder()).encode(pathname).reduce((prev, current) => prev + current);
  const storageKey = `cache-test-${encoded % MAX_SHARD}`;

  event.respondWith(
    caches.open(storageKey).then(cache => {
      return cache.match(pathname).then(responseCache => {
        // query も完全一致していたら返却する。
        if (responseCache && responseCache.url === event.request.url) {
          return responseCache;
        }
        return fetch(event.request.url).then(response => {
          if (!response.ok) {
            return response;
          }
          return cache.put(pathname, response.clone()).then(() => response);
        });
      });
    })
  );
});