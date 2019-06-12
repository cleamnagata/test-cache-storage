export default {
  RESOURCE: '/assets/test2.json',
  VERSIONS: new Array(100).fill(null).map((_, i) => i), // 最大数
  LOAD_QUE: 10, // 同時に投げる上限
};
