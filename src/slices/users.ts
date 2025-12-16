import { createSlice } from '@reduxjs/toolkit'

interface UserSliceState {
  user: { id: number | string; text: string; completed: boolean }[]
}

const initialState: UserSliceState = {
  user: []
}

export const userSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {
    added(state, action) {
      state.user.push({
        id: action.payload.id,
        text: action.payload.text,
        completed: false
      })
    }
  }
})
