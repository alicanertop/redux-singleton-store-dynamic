import { createSelector } from '@reduxjs/toolkit';

import type { DynamicReduxStoreManagerState } from '../ReduxStoreManager/ReduxStoreManager.ts';

export const selectPost = ({ post }: DynamicReduxStoreManagerState) => post;

export const selectPostList = createSelector(
  selectPost,
  (data) => data?.postList
);

export const selectFirstPost = createSelector(
  selectPostList,
  (data) => data?.[0]
);
