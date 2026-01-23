import type { Slice } from '@reduxjs/toolkit';

import { fireGlobalEvent } from '@nsn-root/nsn-global/utils/helpers/fireCustomEvent';

import { GLOBAL_REDUX_STORE_EVENT_KEYS } from '../constants';

export const GLOBAL_REDUX_STORE_EVENTS = {
  created: () => fireGlobalEvent(GLOBAL_REDUX_STORE_EVENT_KEYS.created),
  loading: () => fireGlobalEvent(GLOBAL_REDUX_STORE_EVENT_KEYS.loading),
  initialized: () => fireGlobalEvent(GLOBAL_REDUX_STORE_EVENT_KEYS.initialized),
  sliceAdded: (slice: Slice) =>
    fireGlobalEvent(GLOBAL_REDUX_STORE_EVENT_KEYS.sliceAdded, {
      detail: slice,
    }),
  sliceRemoved: (slice: Slice) =>
    fireGlobalEvent(GLOBAL_REDUX_STORE_EVENT_KEYS.sliceRemoved, {
      detail: slice,
    }),
};
