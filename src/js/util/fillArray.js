/**
 * @param {number} length
 * @return {number[]}
 */
export default length => {
  return new Array(length).fill(null).map((_, i) => i);
}
