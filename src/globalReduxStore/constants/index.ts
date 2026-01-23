export const GLOBAL_REDUX_STORE_ID = 'nsnGlobalReduxStore' as const;

export const STATUS = {
  created: 'created',
  loading: 'loading',
  initialized: 'initialized',
  sliceAdded: 'sliceAdded',
  sliceRemoved: 'sliceRemoved',
} as const;

export const GLOBAL_REDUX_STORE_EVENT_KEYS = {
  created: `${GLOBAL_REDUX_STORE_ID}_${STATUS.created}`,
  loading: `${GLOBAL_REDUX_STORE_ID}_${STATUS.loading}`,
  initialized: `${GLOBAL_REDUX_STORE_ID}_${STATUS.initialized}`,
  sliceAdded: `${GLOBAL_REDUX_STORE_ID}_${STATUS.sliceAdded}`,
  sliceRemoved: `${GLOBAL_REDUX_STORE_ID}_${STATUS.sliceRemoved}`,
} as const;
