import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface PostSliceState {
  postList: { id: number | string; text: string; completed: boolean }[];
}

const postSliceInitialState: PostSliceState = {
  postList: [],
};

export const postSlice = createSlice({
  name: 'post',
  initialState: postSliceInitialState,
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

declare module '../ReduxStoreManager' {
  export interface DynamicReduxStoreManagerStateBase {
    post: PostSliceState;
  }
}
