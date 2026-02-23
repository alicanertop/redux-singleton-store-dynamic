/* eslint-disable no-plusplus */
import { createSlice, type Slice } from '@reduxjs/toolkit';

import type { GlobalReduxStoreAction } from '../@types/ReduxStoreTypes';
import { GLOBAL_REDUX_STORE_EVENTS } from '../helpers/eventTrigger';
import { StoreManager } from './StoreManager';

/** This added for prevent empty reducer map error */
const EmptySlice = createSlice({
  name: '@@Empty@@',
  initialState: {},
  reducers: {},
});

export class SliceManager extends StoreManager {
  #slices: Set<Slice> = new Set();

  constructor() {
    super();
    this.#addSliceReducer(EmptySlice);
  }

  #addSliceReducer(slice?: Slice) {
    if (!slice) return;

    if (this.#slices.size > 0 && this.hasSlice(slice)) {
      return;
    }

    this.#slices.add(slice);
    this.reducerMap.set(slice.name, slice.reducer);
    this.actionsMap.set(slice.name, slice.actions);

    if (slice.name !== EmptySlice.name) {
      GLOBAL_REDUX_STORE_EVENTS.sliceAdded(slice);
    }

    if (this.#slices.size > 1 && this.hasSlice(EmptySlice)) {
      this.#removeSliceReducer(EmptySlice);
    }
  }

  #removeSliceReducer(slice?: Slice) {
    if (!slice) return;
    if (!this.hasSlice(slice)) return;

    this.#slices.delete(slice);
    this.reducerMap.delete(slice.name);
    this.actionsMap.delete(slice.name);

    if (slice.name !== EmptySlice.name) {
      GLOBAL_REDUX_STORE_EVENTS.sliceRemoved(slice);
    }

    if (this.#slices.size <= 0) {
      this.#addSliceReducer(EmptySlice);
    }
  }

  public get slices() {
    return this.#slices;
  }

  public get sliceNameList() {
    return Array.from(this.reducerMap.keys());
  }

  getActionBySliceName<T extends keyof GlobalReduxStoreAction>(sliceName: T) {
    const action = this.actionsMap.get(sliceName) as GlobalReduxStoreAction[T];

    if (!action) {
      throw new Error(
        `SliceManager:getActionBySliceName, action cannot found from ${sliceName}, make sure slice are mounted`
      );
    }

    return action;
  }

  addSlice(...sliceList: Slice[]) {
    for (let i = 0; i < sliceList.length; i++) {
      this.#addSliceReducer(sliceList[i]);
    }

    this.storeReplaceReducer();
  }

  removeSlice(...sliceList: Slice[]) {
    for (let i = 0; i < sliceList.length; i++) {
      this.#removeSliceReducer(sliceList[i]);
    }

    this.storeReplaceReducer();
  }

  hasSlice(slice?: Slice) {
    if (!slice) return false;
    return Array.from(this.#slices.values()).some((s) => s.name === slice.name);
  }
}
