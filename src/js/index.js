import swManager from './util/swManager';
import config from './config';
import logWriter from './util/logWriter';
import persistHelper from './util/persistHelper';
import stressTest from './stressTest';
import createButton from './util/createButton';
import createPersistMessage from './util/createPersistMessage';
import createDummyCacheForm from './util/createDummyCacheForm';
import {
  estimate,
  getKeys,
  fetchResources,
  matchResource,
  matchResourceWithOutQuery,
  matchAllResourceWithOutQuery,
  deleteCacheAndEstimate,
  deleteCacheStorageAndEstimate,
} from './tests';

const setUpButtons = persisted => {
  createPersistMessage(persisted);

  logWriter.setUpDom();

  createButton('clearLog').onclick = () => logWriter.clear();

  // estimate
  createButton('estimate').onclick = estimate;

  // cache keys を取得する。低スペックなスマホで、大量にcacheがある状態だと、`DOMException` 発生する事がある。
  createButton('get keys').onclick = getKeys;

  // resources 取得。query 毎にユニークにキャッシュされる事を利用し、大量に読み込む
  createButton('loadResources').onclick = fetchResources;

  // クエリパラメータまで完全一致で検索する ( 一番初めに見つかったものを返却する )
  createButton('matchResource').onclick = matchResource;

  // クエリパラメータを無視して検索する ( 一番初めに見つかったものを返却する )
  createButton('matchResourceWithOutQuery').onclick = matchResourceWithOutQuery;

  // クエリパラメータを無視して検索する ( 別バージョンの同一リソース取得時等 )
  createButton('matchAllResourceWithOutQuery').onclick = matchAllResourceWithOutQuery;

  // 読み込んで、即座に消しても caches.delete() だと estimate で取れる値は変わらない
  createButton('deleteCacheStorageAndEstimate').onclick = deleteCacheStorageAndEstimate;

  // 読み込んで、全ての key に対して削除を回せば、estimate で正確な値が取れる
  createButton('deleteCacheAndEstimate').onclick = deleteCacheAndEstimate;

  document.body.appendChild(document.createElement('hr'));

  // 大量のリソースを cacheStorageに詰め、cache match のパフォーマンスを測定する
  createButton('stressTest. useMatch').onclick = () => stressTest.useMatch(config.STRESS_TEST_RESOURCE_LENGTH);

  // 大量のリソースを cacheStorageに詰め、cache matchAll のパフォーマンスを測定する
  createButton('stressTest. useMatchALl').onclick = () => stressTest.useMatchAll(config.STRESS_TEST_RESOURCE_LENGTH);

  const canvasWrapDiv = document.createElement('div');
  canvasWrapDiv.id = 'canvasWrap';
  document.body.appendChild(canvasWrapDiv);

  document.body.appendChild(document.createElement('hr'));

  document.body.appendChild(createDummyCacheForm());
};


swManager.register().then(register => {
  if (!register) {
    logWriter.write('register not completed');
    return;
  }
  persistHelper.persist().then(setUpButtons);
});
