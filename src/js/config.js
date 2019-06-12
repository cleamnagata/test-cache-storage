import fillArray from './util/fillArray';

export default {
  RESOURCE: '/assets/1000000byte.txt',
  VERSIONS: fillArray(100), // 最大数
  LOAD_QUE: 10, // 同時にRequest投げる上限
  MAX_SHARD: 1,
  STRESS_TEST_RESOURCE_LENGTH: 1000,
  STRESS_TEST_PER: 50,
};
