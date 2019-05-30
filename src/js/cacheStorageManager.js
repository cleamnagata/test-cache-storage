const CACHE_STORAGE_NAME = 'cache-test';
const { caches, navigator } = window;

const openCacheStorage = () => {
  return caches.open(CACHE_STORAGE_NAME);
};

const deleteCacheStorage = () => {
  return caches.delete(CACHE_STORAGE_NAME).then(res => {
    console.log(`caches.delete(${CACHE_STORAGE_NAME}). result: ${res}`);
    return res;
  });
};

const deleteCache = (request) => {
  return openCacheStorage().then(cacheStorage => cacheStorage.delete(request)).then(res => {
    console.log(`cache.delete ${request.url}. result: ${res}`);
    return res;
  });
};

const getKeys = () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Cache/keys
  // keys という名前だが、Request オブジェクトが帰ってくる
  return openCacheStorage().then(cacheStorage => cacheStorage.keys()).then(keys => {
    console.log(`cache.keys(). keys length: ${keys.length}`);
    return keys;
  });
};

const deleteAllCache = () => {
  return getKeys().then(requests => {
    return Promise.all(requests.map(request => deleteCache(request)));
  });
};

const match = (url) => {
  return this.openCacheStorage().then(cacheStorage => cacheStorage.match(url));
};

const estimate = () => {
  return navigator.storage.estimate().then(res => {
    const { usage, quota } = res;
    const percentUsed = Math.round(usage / quota * 100);
    const usageInMib = Math.round(usage / (1024 * 1024));
    const quotaInMib = Math.round(quota / (1024 * 1024));
    console.log(`${usageInMib} out of ${quotaInMib} MiB used (${percentUsed}%)`);
    return res;
  });
};

const cacheStorageManager = {
  openCacheStorage,
  deleteCacheStorage,
  deleteCache,
  getKeys,
  deleteAllCache,
  match,
  estimate
};

window.cacheStorageManager = cacheStorageManager;

export default cacheStorageManager;
