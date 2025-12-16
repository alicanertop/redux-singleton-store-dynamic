import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

interface PostSliceState {
  postList: { id: number | string; text: string; completed: boolean }[];
}

const initialState: PostSliceState = {
  postList: [],
};

export const postSlice = createSlice({
  name: 'post',
  initialState: initialState,
  reducers: {
    added(state, action: PayloadAction<{ id: number | string; text: string }>) {
      state.postList.push({
        id: action.payload.id,
        text: action.payload.text,
        completed: false,
      });
    },
  },
});

declare module '../ReduxStoreManager/ReduxStoreManager.ts' {
  export interface DynamicReduxStoreManagerStateBase {
    post: PostSliceState;
  }
}
