import fillArray from './util/fillArray';

const config = {
  RESOURCE: '/assets/1000000byte.txt',
  DUMMY_RESOURCE_PREFIX: '/assets/dummy-100byte-',
  VERSIONS: fillArray(100), // 最大数
  LOAD_QUE: 10, // 同時にRequest投げる上限
  MAX_SHARD: 1,
  STRESS_TEST_RESOURCE_LENGTH: 2000,
  STRESS_TEST_PER: 50,
};

// config.MATCH_URL = `${window.location.origin}${config.RESOURCE}?v=${config.VERSIONS[config.VERSIONS.length - 1]}`;
config.MATCH_URL = `${window.location.origin}${config.DUMMY_RESOURCE_PREFIX}0.txt`;

export default config;