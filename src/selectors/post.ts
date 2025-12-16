import { createSelector } from '@reduxjs/toolkit';

import type { DynamicReduxStoreManagerState } from '../ReduxStoreManager/ReduxStoreManager.ts';

export const selectPost = ({ post }: Partial<DynamicReduxStoreManagerState>) => post;

export const selectPostList = createSelector(
  selectPost,
  (data) => data?.postList
);
