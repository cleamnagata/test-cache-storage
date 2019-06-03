class LogWriter {
  constructor() {
    this._dom = null;
  }

  setUpDom() {
    this._dom = document.createElement('textarea');
    this._dom.setAttribute('disabled', '');
    this._dom.style.width = '80%';
    this._dom.style.height = '500px';
    const div = document.createElement('div');
    div.appendChild(this._dom);
    document.body.appendChild(div);
  }

  write(string) {
    this._dom.innerHTML += `${string}\n`;
  }

  clear() {
    this._dom.innerHTML = '';
  }
}

const logWriter = new LogWriter();

export default logWriter;
