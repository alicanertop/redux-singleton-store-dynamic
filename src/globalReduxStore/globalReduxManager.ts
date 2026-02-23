import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';

import type {
  GlobalReduxStoreMountedState,
  GlobalReduxStoreState,
} from './@types/ReduxStoreTypes';
import { ReduxManager } from './managers/ReduxManager';

export const getNesineGlobalManagerSync = (): ReduxManager => {
  if (window.NesineGlobalReduxManager) return window.NesineGlobalReduxManager;
  window.NesineGlobalReduxMounted = {} as GlobalReduxStoreMountedState;
  window.NesineGlobalReduxManager = new ReduxManager();
  return window.NesineGlobalReduxManager;
};

export const getNesineGlobalManagerAsync = () =>
  new Promise((res, reject) => {
    const manager = getNesineGlobalManagerSync();
    if (manager) {
      res(manager);
    } else {
      reject();
    }
  });

export const nesineGlobalReduxManager = getNesineGlobalManagerSync()!;

Object.defineProperty(window, 'NesineGlobalReduxManager', {
  get() {
    return nesineGlobalReduxManager;
  },
});

const autoMount = () => {
  if (window.NesineGlobalReduxMounted?.auto) return;
  window.NesineGlobalReduxMounted!.auto = true;
};

autoMount();

export type NesineGlobalReduxManager = typeof nesineGlobalReduxManager;

export const useGlobalReduxDispatch: () => typeof nesineGlobalReduxManager.store.dispatch =
  useDispatch;

export const useGlobalReduxSelector: TypedUseSelectorHook<GlobalReduxStoreState> =
  useSelector;
