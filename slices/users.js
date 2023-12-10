const { createSlice } = require('@reduxjs/toolkit')
const slice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    added(state, action) {
      state.push({
        id: action.payload.id,
        text: action.payload.text,
        completed: false
      })
    }
  }
})

exports.slice = slice
module.exports = { slice }
