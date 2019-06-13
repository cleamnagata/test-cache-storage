import StressTestChart from './StressTestChart';
import logWriter from './logWriter';
import performanceHelper from './performanceHelper';
import cacheStorageManager from './cacheStorageManager';
import { fetchResources, getKeys } from './tests';
import config from './config';
import fillArray from './util/fillArray';

const { STRESS_TEST_PER, MATCH_URL } = config;

class Tester {
  constructor(maxResources) {
    if (maxResources % STRESS_TEST_PER !== 0) {
      throw new Error('invalidParam');
    }
    this._maxResourceLength = maxResources;
    this._versions = [];
    this._results = [];
  }

  start() {
    Promise.resolve()
      .then(() => cacheStorageManager.deleteAllCache())
      .then(() => cacheStorageManager.deleteCacheStorage())
      .then(() => {
        logWriter.clear();
        this._apply();
      })
  }

  _apply() {
    let isLast = false;
    let length = this._versions.length + STRESS_TEST_PER;
    if (length > this._maxResourceLength) {
      length = this._maxResourceLength;
      isLast = true;
    }
    this._applyTest(length).then(() => {
      if (isLast) {
        this._onComplete();
        return;
      }
      this._apply();
    });
  }

  _applyTest(length) {
    const loadedVersions = this._versions;
    this._versions = fillArray(length);
    logWriter.write(`\n\n+++resourcesLength: ${this._versions.length}+++`);
    return fetchResources(this._versions.filter(v => !loadedVersions.includes(v)))
      .then(() => getKeys())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource())
      .then(() => this._testMatchResource());
  }

  _testMatchResource() {
    return cacheStorageManager.matchAll(MATCH_URL, true)
      .then(() => {
        this._results.push({
          length: this._versions.length,
          duration: performanceHelper.lastDiff.duration,
          performanceMeasure: performanceHelper.lastDiff,
        });
      });
  }

  _onComplete() {
    const dataList = [];
    this._results.forEach(result => {
      let data = dataList.find(d => d.length === result.length);
      if (!data) {
        data = { length: result.length, durations: [] };
        dataList.push(data);
      }
      data.durations.push(result.duration);
    });
    dataList.sort((a, b) => (a.length > b.length ? 1 : -1));

    const labels = [];
    const averages = [];
    const maxList = [];
    const minList = [];
    dataList.forEach(data => {
      labels.push(data.length);
      averages.push(data.durations.reduce((a, b) => a + b, 0) / data.durations.length);
      maxList.push(Math.max(...data.durations));
      minList.push(Math.min(...data.durations));
    });
    new StressTestChart({ averages, labels, maxList, minList }).draw();
  }
}

const stressTest = maxLength => {
  const tester = new Tester(maxLength);
  tester.start();
};

export default stressTest;
