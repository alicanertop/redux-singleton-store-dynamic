import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface CounterSliceState {
  value: number;
}

const counterSliceInitialState: CounterSliceState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState: counterSliceInitialState,
  reducers: {
    update: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
    add: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

declare module '../ReduxStoreManager' {
  export interface DynamicReduxStoreManagerStateBase {
    counter: CounterSliceState;
  }
}
