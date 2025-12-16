import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

interface CounterSliceState {
  value: number;
}

const initialState: CounterSliceState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState: initialState,
  reducers: {
    update: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
    add: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

declare module '../ReduxStoreManager/ReduxStoreManager.ts' {
  export interface DynamicReduxStoreManagerStateBase {
    counter: CounterSliceState;
  }
}
