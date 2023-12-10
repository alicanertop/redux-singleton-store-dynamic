const generateReducerManager = (options) => {
  if (options.enableReducerManagerReducer) {
    const { createSlice } = require('@reduxjs/toolkit')
    const reducerManagerSlice = createSlice({
      name: '@@@reducerManager',
      initialState: {},
      reducers: {
        update: (state, action) => {
          state.key = action.payload.key
          state.state = action.payload.state
        }
      }
    })
    options.reducerManagerSlice = reducerManagerSlice
  }
  const { ReducerManager } = require('../ReducerManager')
  return new ReducerManager(options)
}
const generateStore = (options) => {
  const { configureStore } = require('@reduxjs/toolkit')
  return configureStore(options)
}

const generateStoreWReducerManager = (options) => {
  const reducerManager = generateReducerManager(options)
  const store = generateStore({ ...options, reducer: reducerManager.getCombinedReducers.bind(reducerManager) })
  reducerManager.setStore(store)
  store.reducerManager = reducerManager
  return store
}

module.exports = { generateReducerManager, generateStoreWReducerManager, generateStore }
exports.generateStore = generateStore
exports.generateReducerManager = generateReducerManager
exports.generateStoreWReducerManager = generateStoreWReducerManager
