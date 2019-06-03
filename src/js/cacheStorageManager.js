import logWriter from './logWriter';

const CACHE_STORAGE_NAME = 'cache-test';
const { caches, navigator } = window;

const openCacheStorage = () => {
  return caches.open(CACHE_STORAGE_NAME);
};

const deleteCacheStorage = () => {
  return caches.delete(CACHE_STORAGE_NAME).then(res => {
    logWriter.write(`caches.delete(${CACHE_STORAGE_NAME}). result: ${res}`);
    return res;
  });
};

const deleteCache = (request) => {
  return openCacheStorage().then(cacheStorage => cacheStorage.delete(request)).then(res => {
    logWriter.write(`cache.delete ${request.url}. result: ${res}`);
    return res;
  });
};

const getKeys = () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Cache/keys
  // keys という名前だが、Request オブジェクトが帰ってくる
  return openCacheStorage().then(cacheStorage => cacheStorage.keys()).then(keys => {
    logWriter.write(`cache.keys(). keys length: ${keys.length}`);
    return keys;
  });
};

const deleteAllCache = () => {
  return getKeys().then(requests => {
    return Promise.all(requests.map(request => deleteCache(request)));
  });
};

const match = (url, ignoreSearch = false) => {
  return openCacheStorage()
    .then(cacheStorage => cacheStorage.match(url, { ignoreSearch }))
    .then(resource => {
      logWriter.write(`cache.match(${url}). result: ${!!resource}`);
      return resource;
    });
};

const matchAll = (url, ignoreSearch = false) => {
  return openCacheStorage()
    .then(cacheStorage => cacheStorage.matchAll(url, { ignoreSearch }))
    .then(resource => {
      logWriter.write(`cache.matchAll(${url}). result: ${resource.length}`);
      return resource;
    });
};

const estimate = () => {
  return navigator.storage.estimate().then(res => {
    const { usage, quota } = res;
    const percentUsed = Math.round(usage / quota * 100);
    const usageInMib = Math.round(usage / (1024 * 1024));
    const quotaInMib = Math.round(quota / (1024 * 1024));
    logWriter.write(`estimate: ${usageInMib} out of ${quotaInMib} MiB used (${percentUsed}%)`);
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
  matchAll,
  estimate
};

export default cacheStorageManager;
