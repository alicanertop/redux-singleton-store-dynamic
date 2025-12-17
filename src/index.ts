import { ReduxStoreManager } from './ReduxStoreManager';
import { isDataValid } from './ReduxStoreManager/helpers';

if (isDataValid(window)) {
  window.AlicanTest = new ReduxStoreManager();
}
