import swManager from './swManager';
import cacheStorageManager from './cacheStorageManager';

const config = {
  RESOURCE: '/assets/test2.json',
  VERSIONS: new Array(1000).fill(null).map((_, i) => i), // 最大数
  LOAD_QUE: 6, // 同時に投げる上限
};

const chunk = (arr, size) => arr.reduce((chunks, el, i) => (i % size ? chunks[chunks.length - 1].push(el) : chunks.push([el])) && chunks, []);

const fetchResource = ver => fetch(`${config.RESOURCE}?v=${ver}`);

// VERSIONS 分リクエスト投げて cache に詰める
const fetchResources = () => {
  return chunk(config.VERSIONS, config.LOAD_QUE)
    .map(versions => () => {
      const promises = versions.map(version => fetchResource(version));
      return Promise.all(promises);
    })
    .reduce((prev, curr) => prev.then(() => curr && curr()), Promise.resolve());
};

// caches.delete(storageKey) 実行し、estimate の値がどのくらい変わるかを計測する
const deleteCacheStorageAndEstimate = () => {
  return Promise.resolve()
    .then(cacheStorageManager.estimate)
    .then(cacheStorageManager.deleteCacheStorage)
    .then(cacheStorageManager.estimate);
};

// cache.delete(url) 実行し、estimate の値がどのくらい変わるかを計測する
const deleteCacheAndEstimate = () => {
  return Promise.resolve()
    .then(cacheStorageManager.estimate)
    .then(cacheStorageManager.deleteAllCache)
    .then(cacheStorageManager.estimate);
};

// 実験
const test = () => {
  // 読み込んで、即座に消しても caches.delete() だと estimate で取れる値は変わらない
  // fetchResources().then(deleteCacheStorageAndEstimate)

  // 読み込んで、全ての key に対して削除を回せば、estimate で正確な値が取れる
  // fetchResources().then(deleteCacheAndEstimate);
};

swManager.register().then(register => {
  if (!register) {
    console.warn('register not completed');
    return;
  }
  return test();
});
