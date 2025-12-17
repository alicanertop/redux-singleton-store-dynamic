import { createSelector } from '@reduxjs/toolkit';

import type { DynamicReduxStoreManagerState } from '../ReduxStoreManager';

export const selectCounter = ({ counter }: DynamicReduxStoreManagerState) =>
  counter;

export const selectCounterValue = createSelector(
  selectCounter,
  (data) => data?.value
);
