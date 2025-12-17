import { ReduxStoreManager } from './ReduxStoreManager';

declare global {
  interface Window {
    AlicanTest: ReduxStoreManager;
  }
}
