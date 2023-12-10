const { createSlice } = require('@reduxjs/toolkit')

const slice = createSlice({
  name: 'counter',
  initialState: { counter: 0 },
  reducers: {
    update: (state, action) => {
      state.counter = action.payload
    }
  }
})

exports.slice = slice
module.exports = { slice }
