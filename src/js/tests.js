import logWriter from './logWriter';
import performanceHelper from './performanceHelper';
import cacheStorageManager from './cacheStorageManager';
import config from './config';

const chunk = (arr, size) => arr.reduce((chunks, el, i) => (i % size ? chunks[chunks.length - 1].push(el) : chunks.push([el])) && chunks, []);

const fetchResource = ver => fetch(`${config.RESOURCE}?v=${ver}`);

// VERSIONS 分リクエスト投げて cache に詰める
export const fetchResources = (versions = config.VERSIONS) => {
  logWriter.write(`start fetchResources. resourcesLength: ${versions.length}`);
  performanceHelper.start();
  return chunk(versions, config.LOAD_QUE)
    .map(versions => () => {
      const promises = versions.map(version => fetchResource(version));
      return Promise.all(promises);
    })
    .reduce((prev, curr) => prev.then(() => curr && curr()), Promise.resolve())
    .then(() => {
      const diff = performanceHelper.stop();
      logWriter.write(`fetchResources complete. duration: ${diff.duration}`);
    })
};

// caches.delete(storageKey) 実行し、estimate の値がどのくらい変わるかを計測する
export const deleteCacheStorageAndEstimate = () => {
  return Promise.resolve()
    .then(cacheStorageManager.estimate)
    .then(cacheStorageManager.deleteCacheStorage)
    .then(cacheStorageManager.estimate);
};

// cache.delete(url) 実行し、estimate の値がどのくらい変わるかを計測する
export const deleteCacheAndEstimate = () => {
  return Promise.resolve()
    .then(cacheStorageManager.estimate)
    .then(cacheStorageManager.deleteAllCache)
    .then(cacheStorageManager.estimate);
};

const MATCH_URL = `${window.location.origin}${config.RESOURCE}?v=${config.VERSIONS[config.VERSIONS.length - 1]}`;

export const matchResource = () => {
  return Promise.resolve()
    .then(() => cacheStorageManager.match(MATCH_URL));
};

export const matchResourceWithOutQuery = () => {
  logWriter.write('start matchResourceWithOutQuery.');
  return Promise.resolve()
    .then(() => cacheStorageManager.match(MATCH_URL, true));
};

export const matchAllResourceWithOutQuery = () => {
  logWriter.write('start matchAllResourceWithOutQuery.');
  return Promise.resolve()
    .then(() => cacheStorageManager.matchAll(MATCH_URL, true));
};

export const getKeys = () => {
  logWriter.write('start getKeys');
  return cacheStorageManager.getAllKeys().then(resources => {
    logWriter.write(`keys.length ${resources.length}`);
    logWriter.write('end getKeys');
  });
};

export const estimate = () => {
  logWriter.clear();
  cacheStorageManager.estimate();
};

export default {}
