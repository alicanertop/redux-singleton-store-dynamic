import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UserSliceState {
  user: { id: number | string; text: string; completed: boolean }[];
}

const initialState: UserSliceState = {
  user: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    added(state, action: PayloadAction<{ id: number | string; text: string }>) {
      state.user.push({
        id: action.payload.id,
        text: action.payload.text,
        completed: false,
      });
    },
  },
});

declare module '../ReduxStoreManager/ReduxStoreManager.ts' {
  export interface DynamicReduxStoreManagerStateBase {
    user: UserSliceState;
  }
}
