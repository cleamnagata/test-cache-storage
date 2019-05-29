const { serviceWorker } = window.navigator;

let registration;

const swManager = {
  register: () => serviceWorker.register('/worker.js')
    .then(res => res.update())
    .then(res => {
      registration = res;
      if (!navigator.serviceWorker.controller) {
        return Promise.resolve(registration);
      }
      registration.addEventListener('updatefound', function() {
        const installingWorker = registration.installing;
        installingWorker.addEventListener('statechange', function() {
          if (installingWorker.state !== 'installed') {
            return;
          }
          if (navigator.serviceWorker.controller) {
            window.location.reload();
          }
        });
      });
      return Promise.resolve(registration);
    })

};

export default swManager;
