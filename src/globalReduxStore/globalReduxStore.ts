import {
  type GlobalStoreParams,
  ReduxStoreManager,
} from './ReduxStoreManager/ReduxStoreManager';
import { EmptySlice } from './slice/empty/empty';

export const getNesineGlobalStoreSync = (options?: GlobalStoreParams) => {
  if (window.GlobalReduxStore) return window.GlobalReduxStore;
  window.GlobalReduxStore = new ReduxStoreManager([EmptySlice], options);
  return window.GlobalReduxStore;
};

export const getNesineGlobalStoreAsync = (options?: GlobalStoreParams) =>
  new Promise((res, reject) => {
    const store = getNesineGlobalStoreSync(options);
    if (store) {
      res(store);
    } else {
      reject();
    }
  });
