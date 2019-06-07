/**
 * FYI:
 * - https://triple-underscore.github.io/storage-ja.html#ui-guidelines
 * - https://developers.google.com/web/updates/2016/06/persistent-storage
 */

const { navigator } = window;
const { storage, permissions } = navigator;

const supportAPI = () => storage && storage.persisted && permissions;

/**
 * @return {Promise<boolean>}
 */
const persist = () => {
  if (!supportAPI()) {
    return Promise.resolve(false);
  }
  return Promise.all([
    storage.persisted(),
    permissions.query({ name: 'persistent-storage' })
  ]).then(([persisted, permission]) => {
    if (!!persisted) {
      return Promise.resolve(true);
    }
    // 永続化条件を満たしている場合、persist 実行し永続化スタート
    if (permission.status === 'granted') {
      return navigator.storage.persist();
    }
    console.error('should showPersistentStorageExplanation');
    return Promise.resolve(false);
  })
};

export default {
  persist,
}
