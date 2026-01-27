import { SliceManager } from './managers/SliceManager';

export const getNesineGlobalStoreSync = (): SliceManager => {
  if (window.GlobalReduxStore) return window.GlobalReduxStore;
  window.GlobalReduxStore = new SliceManager();
  return window.GlobalReduxStore;
};

export const getNesineGlobalStoreAsync = () =>
  new Promise((res, reject) => {
    const store = getNesineGlobalStoreSync();
    if (store) {
      res(store);
    } else {
      reject();
    }
  });

export type NesineGlobalStore = ReturnType<typeof getNesineGlobalStoreSync>;
