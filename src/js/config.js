export default {
  RESOURCE: '/assets/1000000byte.txt',
  VERSIONS: new Array(1000).fill(null).map((_, i) => i), // 最大数
  LOAD_QUE: 10, // 同時に投げる上限
};
