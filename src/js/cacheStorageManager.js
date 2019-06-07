import logWriter from './logWriter';

const MAX_SHARD = 5;
const { caches, navigator } = window;

const getShardId = url => {
  const encoded = (new TextEncoder()).encode(url).reduce((prev, current) => prev + current);
  return encoded % MAX_SHARD;
};

const openCacheStorage = (shardId) => {
  return caches.open(`cache-test-${shardId}`);
};

const _deleteCacheStorage = shardId => {
  return caches.delete(`cache-test-${shardId}`).then(res => {
    logWriter.write(`caches.delete(cache-test-${shardId}). result: ${res}`);
    return res;
  });
};

const deleteCacheStorage = () => {
  const promises = new Array(MAX_SHARD).fill(null).map((_, i) => i).map(shardId => _deleteCacheStorage(shardId));
  return Promise.all(promises);
};

const deleteCache = (request) => {
  return openCacheStorage(getShardId(request.url)).then(cacheStorage => cacheStorage.delete(request)).then(res => {
    logWriter.write(`cache.delete ${request.url}. result: ${res}`);
    return res;
  });
};

const getKeys = (shardId = 0) => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Cache/keys
  // keys という名前だが、Request オブジェクトが帰ってくる
  return openCacheStorage(shardId).then(cacheStorage => cacheStorage.keys()).then(keys => {
    logWriter.write(`cache.keys(${shardId}). keys length: ${keys.length}`);
    return keys;
  });
};

const _deleteAllCache = shardId => {
  return getKeys(shardId).then(requests => {
    return Promise.all(requests.map(request => deleteCache(request)));
  });
};

const deleteAllCache = () => {
  const promises = new Array(MAX_SHARD).fill(null).map((_, i) => i).map(shardId => _deleteAllCache(shardId));
  return Promise.all(promises);
};

const match = (url, ignoreSearch = false) => {
  return openCacheStorage(getShardId(url))
    .then(cacheStorage => cacheStorage.match(url, { ignoreSearch }))
    .then(resource => {
      logWriter.write(`cache.match(${url}). result: ${!!resource}`);
      return resource;
    });
};

const matchAll = (url, ignoreSearch = false) => {
  return openCacheStorage(getShardId(url))
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
