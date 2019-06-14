import logWriter from './logWriter';
import performanceHelper from './performanceHelper';
import config from '../config';

const { MAX_SHARD } = config;
const SHARD_IDS = new Array(MAX_SHARD).fill(null).map((_, i) => i);
const { caches, navigator } = window;

const getShardId = url => {
  const encoded = (new TextEncoder()).encode(new URL(url).pathname).reduce((prev, current) => prev + current);
  return encoded % MAX_SHARD;
};

const openCacheStorage = (shardId) => {
  return caches.open(`cache-test-${shardId}`);
};

const _deleteCacheStorage = shardId => {
  return caches.delete(`cache-test-${shardId}`).then(res => {
    // logWriter.write(`caches.delete(cache-test-${shardId}). result: ${res}`);
    return res;
  });
};

const deleteCacheStorage = () => {
  const promises = SHARD_IDS.map(shardId => _deleteCacheStorage(shardId));
  return Promise.all(promises);
};

const deleteCache = (request) => {
  return openCacheStorage(getShardId(request.url)).then(cacheStorage => cacheStorage.delete(request)).then(res => {
    // logWriter.write(`cache.delete ${request.url}. result: ${res}`);
    return res;
  });
};

const getKeys = (shardId = 0) => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Cache/keys
  // keys という名前だが、Request オブジェクトが帰ってくる
  return openCacheStorage(shardId).then(cacheStorage => cacheStorage.keys()).then(keys => {
    // logWriter.write(`cache.keys(${shardId}). keys length: ${keys.length}`);
    return keys;
  });
};

const getAllKeys = () => {
  return Promise.all(SHARD_IDS.map(shardId => getKeys(shardId)))
    .then(responses => [].concat(...responses));
};

const _deleteAllCache = shardId => {
  return getKeys(shardId).then(requests => {
    return Promise.all(requests.map(request => deleteCache(request)));
  });
};

const deleteAllCache = () => {
  logWriter.write(`deleteAllCache. start`);
  performanceHelper.start();
  const promises = SHARD_IDS.map(shardId => _deleteAllCache(shardId));
  return Promise.all(promises)
    .then(() => {
      const diff = performanceHelper.stop();
      console.log(diff);
      logWriter.write(`deleteAllCache. complete duration: ${diff.duration}`);
    });
};

const match = (url, ignoreSearch = false) => {
  const shardId = getShardId(url);
  logWriter.write(`match. ignoreSearch: ${ignoreSearch}, shardId: ${shardId}  start`);
  performanceHelper.start();
  return openCacheStorage(shardId)
    .then(cacheStorage => cacheStorage.match(new URL(url).pathname, { ignoreSearch }))
    .then(resource => {
      const diff = performanceHelper.stop();
      logWriter.write(`cache.match(${url}). result: ${!!resource} \n duration: ${diff.duration}`);
      return resource;
    });
};

const matchAll = (url, ignoreSearch = false) => {
  logWriter.write(`matchAll. ignoreSearch: ${ignoreSearch}`);
  performanceHelper.start();
  return openCacheStorage(getShardId(url))
    .then(cacheStorage => cacheStorage.matchAll(new URL(url).pathname, { ignoreSearch }))
    .then(resource => {
      const diff = performanceHelper.stop();
      logWriter.write(`cache.matchAll(${url}). resultLength: ${resource.length}\n duration: ${diff.duration}`);
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
  getAllKeys,
  getShardId,
  deleteAllCache,
  match,
  matchAll,
  estimate
};

export default cacheStorageManager;
