import logWriter from './logWriter';
import createForm from './createForm';
import fillArray from './fillArray';
import cacheStorageManager from './cacheStorageManager';
import config from '../config';

const createDummyContent = fileSize => {
  const size = fileSize / 4; // chunk will be repetition of 4B
  return (new Array(size + 1)).join('aあ');
};

const putDummyCaches = (shardId, urls, dummyContent) => {
  return cacheStorageManager.openCacheStorage(shardId)
    .then(cache => {
      const createTasks = urls.map(url => () => {
        const cacheKey = new URL(url).pathname;
        const dummyResponse = new Response(dummyContent, { status: 200, statusText: 'ok' });
        return cache.put(cacheKey, dummyResponse);
      });
      return createTasks.reduce((p, c) => p.then(c), Promise.resolve());
    });
};

const createDummyCaches = (length, cacheSize) => {
  logWriter.write(`dummy create start. ${length}`);

  const dummyContent = createDummyContent(parseInt(cacheSize, 10));

  const urls = fillArray(parseInt(length, 10))
    .map(v => `${window.location.origin}${config.DUMMY_RESOURCE_PREFIX}${v}.txt`);

  const dummyCacheGroups = {};
  urls.forEach(url => {
    const shardId = cacheStorageManager.getShardId(url);
    if (!dummyCacheGroups[shardId]) {
      dummyCacheGroups[shardId] = [];
    }
    dummyCacheGroups[shardId].push(url);
  });

  Object.keys(dummyCacheGroups).forEach(shardId => {
    putDummyCaches(shardId, dummyCacheGroups[shardId], dummyContent).then(() => {
      logWriter.write(`dummy created. shardId: ${shardId}. length: ${dummyCacheGroups[shardId].length}`);
    })
  });
};

const createDummyCacheForm = () => {
  const wrapDiv = document.createElement('div');

  const cacheSizeList = [
    100,        // 100 B
    100000,     // 100 KB
    1000000,    // 1 MB
    10000000,  // 100 MB
  ];
  const sizeRes = createForm('createDummyCache', cacheSizeList);
  wrapDiv.appendChild(sizeRes.wrapDiv);

  const cacheValues = [100, 500, 1000, 1500, 2000, 4000, 6000, 8000, 10000];
  const res = createForm('createDummyCache', cacheValues);
  wrapDiv.appendChild(res.wrapDiv);

  const button = document.createElement('button');
  button.innerText = 'createDummyCache';
  button.onclick = () => {
    const cacheSize = sizeRes.select[sizeRes.select.selectedIndex].value;
    const cacheLength = res.select[res.select.selectedIndex].value;
    createDummyCaches(cacheLength, cacheSize);
  };

  wrapDiv.appendChild(button);
  wrapDiv.appendChild(document.createElement('hr'));

  return wrapDiv;
};

export default createDummyCacheForm;
