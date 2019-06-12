/**
 * @param {string} message
 * @return {HTMLButtonElement}
 */
export default function(message) {
  const div = document.createElement('div');
  const button = document.createElement('button');
  const text = document.createTextNode(message);
  button.appendChild(text);
  div.appendChild(button);
  document.body.appendChild(div);
  return button;
}
