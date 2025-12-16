import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface PostSliceState {
  post: { id: number | string; text: string; completed: boolean }[];
}

const initialState: PostSliceState = {
  post: [],
};

export const postSlice = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {
    added(state, action: PayloadAction<{ id: number | string; text: string }>) {
      state.post.push({
        id: action.payload.id,
        text: action.payload.text,
        completed: false,
      });
    },
  },
});
