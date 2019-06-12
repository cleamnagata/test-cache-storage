/**
 * @param {boolean} persisted
 */
export default persisted => {
  const persistMessage = persisted
    ? 'Storage will not be cleared except by explicit user action. success persist'
    : 'Storage may be cleared by the UA under storage pressure.';
  const div = document.createElement('div');
  div.style.color = persisted
    ? '#0500ff'
    : '#ff0000';
  const text = document.createTextNode(persistMessage);
  div.appendChild(text);
  document.body.appendChild(div);
}
