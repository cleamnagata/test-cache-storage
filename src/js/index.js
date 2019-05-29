import swManager from './swManager';

const createTestButtons = () => {
  fetch('/assets/test.json?v=5').then(res => {
    console.log(res);
  })
};

Promise.resolve()
  .then(swManager.register)
  .then(register => {
    if (!register) {
      console.warn('register not completed');
      return;
    }
    createTestButtons();
  });
