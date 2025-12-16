import { createSlice } from '@reduxjs/toolkit'

interface CounterSliceState {
  counter: number
}

const initialState: CounterSliceState = {
  counter: 0
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState: initialState,
  reducers: {
    update: (state, action) => {
      state.counter = action.payload
    },
    add: (state, action) => {
      state.counter += action.payload
    }
  }
})
