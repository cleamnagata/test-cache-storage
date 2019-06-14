const path = require('path');
const fs = require('fs');

const ASSETS = path.resolve('./assets');

const dummyContent = fs.readFileSync(path.join(ASSETS, '100byte.txt')).toString();

function writeFile(file, contents) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, contents, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    })
  })
}

const promises = new Array(5000).fill(null).map((_, i) => writeFile(path.join(ASSETS, `dummy-100byte-${i}.txt`), dummyContent));
Promise.all(promises)
  .then(() => {
    console.log('dummy created');
  });