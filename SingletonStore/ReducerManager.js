const { combineReducers } = require('redux')

const { checkIsExist } = require('./helpers/checkIsExist')

const errorMessages = {
  sliceNotFound: 'Slice Not Found',
  keyNotFound: 'Key Not Found',
  storeFound: 'Store was already set on Reducer Manager',
  storeNotFound: 'Store was not set on Reducer Manager',
  sliceWasFound: (key, action) => `${key}: slice already added on store, ${action} canceled`,
  reducerWasFound: (key, action) => `${key}: reducer already added on store, ${action} canceled`,
  reducerWasNotProvided: (key) => `${key}: reducer not provided`,
  reducerWasDeleted: (key, action) =>
    `${key}: reducer already deleted from store, ${action} canceled`
}
class ReducerManager {
  $slices = []
  $options = {}
  $reducers = {}
  $store = undefined

  constructor(options) {
    this.$options = options
    const optionsReducerKeys = Object.keys(options?.reducer || {})
    this.$slices = options?.slices?.length ? [...options.slices] : []
    if (optionsReducerKeys.length) {
      this.$reducers = { ...options.reducer }
    } else if (!optionsReducerKeys.length && this.getSlices().length) {
      for (let i = 0; i < this.getSlices().length; i++) {
        const slice = this.$slices[i]
        this.$reducers[slice.name] = slice.reducer
      }
    }

    if (options.enableReducerManagerReducer) {
      const slice = options.reducerManagerSlice
      this.$reducers[slice.name] = slice.reducer
    }
  }

  storeReplaceReducer(key, state) {
    this.$store.replaceReducer(combineReducers(this.getReducers()))
    if (this.getOptions().enableReducerManagerReducer) {
      const slice = this.getOptions().reducerManagerSlice
      this.$store.dispatch(slice.actions.update({ key, state }))
    }
  }

  addReducerViaSlice(slice) {
    if (!checkIsExist({ data: this.$store, message: errorMessages.storeNotFound })) return
    if (!checkIsExist({ data: slice, message: errorMessages.sliceNotFound })) return

    if (this.getSlices().length) {
      if (this.getSlices().findIndex((sli) => sli.name === slice.name) === -1) {
        this.$slices.push(slice)
      } else {
        return
      }
    } else {
      this.$slices.push(slice)
    }

    this.$reducers[slice.name] = slice.reducer
    this.storeReplaceReducer(slice.name, 'add')
  }

  removeReducerViaSlice(slice) {
    if (!checkIsExist({ data: this.$store, message: errorMessages.storeNotFound })) return
    if (this.getSlices().length && slice) {
      const index = this.getSlices().findIndex((sli) => sli.name === slice.name)
      if (index > -1) {
        this.getSlices().splice(index, 1)
        delete this.$reducers[slice.name]
        this.storeReplaceReducer(slice.name, 'remove')
      }
    }
  }

  addReducer(key, reducer, slice) {
    if (slice) return this.addReducerViaSlice(slice)
    if (!checkIsExist({ data: this.$store, message: errorMessages.storeNotFound })) return
    if (!checkIsExist({ data: key, message: errorMessages.keyNotFound })) return
    if (!checkIsExist({ data: reducer, message: errorMessages.reducerWasNotProvided(key) })) return

    if (
      checkIsExist({
        data: this.$reducers[key],
        message: errorMessages.reducerWasFound(key, 'adding')
      })
    )
      return

    this.$reducers[key] = reducer
    this.storeReplaceReducer(key, 'add')
  }

  removeReducer(key, slice) {
    if (slice) return this.removeReducerViaSlice(slice)
    if (!checkIsExist({ data: key, message: errorMessages.keyNotFound })) return
    if (!checkIsExist({ data: this.$store, message: errorMessages.storeNotFound })) return

    if (
      !checkIsExist({
        data: this.$reducers[key],
        message: errorMessages.reducerWasDeleted(key, 'removing')
      })
    ) {
      return
    }

    delete this.$reducers[key]
    this.storeReplaceReducer(key, 'remove')
  }

  setStore(store) {
    if (checkIsExist({ data: this.$store, message: errorMessages.storeFound })) return this.$store

    this.$store = store
    return this.$store
  }

  getStore() {
    return this.$store
  }
  getOptions() {
    return this.$options
  }
  getSlices() {
    return this.$slices
  }
  getReducers() {
    return this.$reducers
  }
  getCombinedReducers(state, action) {
    return combineReducers(this.getReducers())(state, action)
  }
}

exports.ReducerManager = ReducerManager
module.exports = { ReducerManager }
