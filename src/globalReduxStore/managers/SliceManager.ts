/* eslint-disable no-plusplus */
import { type Slice } from '@reduxjs/toolkit';

import { GLOBAL_REDUX_STORE_EVENTS } from '../helpers/eventTrigger';
import { EmptySlice } from '../slice/empty/empty';
import { StoreManager } from './StoreManager';

export class SliceManager extends StoreManager {
  #slices: Set<Slice> = new Set();

  constructor() {
    super();
    this.#slices.add(EmptySlice);
    this.reducerMap.set(EmptySlice.name, EmptySlice.reducer);
  }

  #addSliceReducer(slice?: Slice) {
    if (!slice) return;

    if (this.#slices.size > 0 && this.hasSlice(slice)) {
      return;
    }

    this.#slices.add(slice);
    this.reducerMap.set(slice.name, slice.reducer);

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
