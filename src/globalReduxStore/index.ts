import type { GlobalStoreParams } from '@nsn-root/nsn-globalReduxStore/ReduxStoreManager/ReduxStoreManager';

import { GLOBAL_REDUX_STORE_EVENTS } from './helpers/eventTrigger';
import { GLOBAL_REDUX_STORE_ID } from './constants';
import { getNesineGlobalStoreAsync } from './globalReduxStore';

const attachNesineGlobalStore = (options?: GlobalStoreParams) => {
  const elem = document.getElementById(GLOBAL_REDUX_STORE_ID);
  if (!elem) return;

  elem.setAttribute('data-test-state', 'loading');
  GLOBAL_REDUX_STORE_EVENTS.loading();
  getNesineGlobalStoreAsync(options).then(() => {
    elem.setAttribute('data-test-state', 'initialized');
    GLOBAL_REDUX_STORE_EVENTS.initialized();
  });
};

const renderToApp = () => {
  const elem = document.getElementById(GLOBAL_REDUX_STORE_ID);
  if (!elem) {
    const div = document.createElement('div');
    div.id = GLOBAL_REDUX_STORE_ID;
    div.setAttribute('data-test-state', 'created');
    GLOBAL_REDUX_STORE_EVENTS.created();
    document.body.appendChild(div);

    attachNesineGlobalStore();
  } else {
    attachNesineGlobalStore();
  }

  return null;
};

renderToApp();

export default renderToApp;
