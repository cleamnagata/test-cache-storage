import swManager from './swManager';
import cacheStorageManager from './cacheStorageManager';
import logWriter from './logWriter';
import performanceHelper from './performanceHelper';

const config = {
  RESOURCE: '/assets/test2.json',
  VERSIONS: new Array(10000).fill(null).map((_, i) => i), // 最大数
  LOAD_QUE: 10, // 同時に投げる上限
};

const chunk = (arr, size) => arr.reduce((chunks, el, i) => (i % size ? chunks[chunks.length - 1].push(el) : chunks.push([el])) && chunks, []);

const fetchResource = ver => fetch(`${config.RESOURCE}?v=${ver}`).then(res => {
  // logWriter.write(`loaded. ${config.RESOURCE}?v=${ver}`);
  return res;
});

// VERSIONS 分リクエスト投げて cache に詰める
const fetchResources = () => {
  logWriter.write(`start fetchResources. resourcesLength: ${config.VERSIONS.length}`);
  performanceHelper.start();
  return chunk(config.VERSIONS, config.LOAD_QUE)
    .map(versions => () => {
      const promises = versions.map(version => fetchResource(version));
      return Promise.all(promises);
    })
    .reduce((prev, curr) => prev.then(() => curr && curr()), Promise.resolve())
    .then(() => {
      const diff = performanceHelper.stop();
      console.log(diff);
      logWriter.write(`fetchResources complete. duration: ${diff.duration}`);
    })
};

// caches.delete(storageKey) 実行し、estimate の値がどのくらい変わるかを計測する
const deleteCacheStorageAndEstimate = () => {
  logWriter.clear();
  return Promise.resolve()
    .then(cacheStorageManager.estimate)
    .then(cacheStorageManager.deleteCacheStorage)
    .then(cacheStorageManager.estimate);
};

// cache.delete(url) 実行し、estimate の値がどのくらい変わるかを計測する
const deleteCacheAndEstimate = () => {
  logWriter.clear();
  return Promise.resolve()
    .then(cacheStorageManager.estimate)
    .then(cacheStorageManager.deleteAllCache)
    .then(cacheStorageManager.estimate);
};

const createButton = message => {
  const div = document.createElement('div');
  const button = document.createElement('button');
  const text = document.createTextNode(message);
  button.appendChild(text);
  div.appendChild(button);
  document.body.appendChild(div);
  return button;
};

const MATCH_URL = `${window.location.origin}${config.RESOURCE}?v=${config.VERSIONS[config.VERSIONS.length - 1]}`;

const matchResource = () => {
  return Promise.resolve()
    .then(() => cacheStorageManager.match(MATCH_URL));
};

const matchResourceWithOutQuery = () => {
  logWriter.clear();
  logWriter.write('start matchResourceWithOutQuery.');
  return Promise.resolve()
    .then(() => cacheStorageManager.match(MATCH_URL, true));
};

const matchAllResourceWithOutQuery = () => {
  logWriter.clear();
  logWriter.write('start matchAllResourceWithOutQuery.');
  return Promise.resolve()
    .then(() => cacheStorageManager.matchAll(MATCH_URL, true));
};

logWriter.setUpDom();

const setUpButtons = () => {
  const buttonClearLog = createButton('clearLog');
  buttonClearLog.onclick = () => {
    logWriter.clear();
  };

  // estimate
  const buttonEstimate = createButton('estimate');
  buttonEstimate.onclick = () => {
    logWriter.clear();
    cacheStorageManager.estimate();
  };

  // cache keys を取得する。低スペックなスマホで、大量にcacheがある状態だと、`DOMException` 発生する事がある。
  const buttonKeys = createButton('cache keys');
  buttonKeys.onclick = () => {
    logWriter.clear();
    logWriter.write('start getKeys');
    cacheStorageManager.getKeys().then(resources => {
      resources.forEach(resource => logWriter.write(`url: ${resource.url}`));
      logWriter.write('end getKeys');
    });
  };

  // resources 取得。query 毎にユニークにキャッシュされる事を利用し、大量に読み込む
  const buttonLoadResources = createButton('loadResources');
  buttonLoadResources.onclick = () => fetchResources();

  // クエリパラメータまで完全一致で検索する ( 一番初めに見つかったものを返却する )
  const buttonMatchResource = createButton('matchResource');
  buttonMatchResource.onclick = () => matchResource();

  // クエリパラメータを無視して検索する ( 一番初めに見つかったものを返却する )
  const buttonMatchResourceWithOutQuery = createButton('matchResourceWithOutQuery');
  buttonMatchResourceWithOutQuery.onclick = () => matchResourceWithOutQuery();

  // クエリパラメータを無視して検索する ( 別バージョンの同一リソース取得時等 )
  const buttonMatchAllResourceWithOutQuery = createButton('matchAllResourceWithOutQuery');
  buttonMatchAllResourceWithOutQuery.onclick = () => matchAllResourceWithOutQuery();

  // 読み込んで、即座に消しても caches.delete() だと estimate で取れる値は変わらない
  const buttonDeleteCacheStorageAndEstimate = createButton('deleteCacheStorageAndEstimate');
  buttonDeleteCacheStorageAndEstimate.onclick = () => deleteCacheStorageAndEstimate();

  // 読み込んで、全ての key に対して削除を回せば、estimate で正確な値が取れる
  const buttonDeleteCacheAndEstimate = createButton('deleteCacheAndEstimate');
  buttonDeleteCacheAndEstimate.onclick = () => deleteCacheAndEstimate();
};

swManager.register().then(register => {
  if (!register) {
    logWriter.write('register not completed');
    return;
  }
  setUpButtons();
});
