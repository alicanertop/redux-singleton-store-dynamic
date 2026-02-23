import { GLOBAL_REDUX_STORE_EVENTS } from './helpers/eventTrigger';
import { GLOBAL_REDUX_MANAGER_ID } from './constants';
import { getNesineGlobalManagerAsync } from './globalReduxManager';

const attachNesineGlobalStore = () => {
  const elem = document.getElementById(GLOBAL_REDUX_MANAGER_ID);
  if (!elem) return;

  elem.setAttribute('data-test-state', 'loading');
  GLOBAL_REDUX_STORE_EVENTS.loading();
  getNesineGlobalManagerAsync().then(() => {
    elem.setAttribute('data-test-state', 'initialized');
    GLOBAL_REDUX_STORE_EVENTS.initialized();
  });
};

const renderToApp = () => {
  const elem = document.getElementById(GLOBAL_REDUX_MANAGER_ID);
  if (!elem) {
    const div = document.createElement('div');
    div.id = GLOBAL_REDUX_MANAGER_ID;
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
