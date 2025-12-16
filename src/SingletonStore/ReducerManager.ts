import {
  type Reducer,
  type Store,
  type UnknownAction,
  combineReducers,
} from "redux";
import { type Slice } from "@reduxjs/toolkit";

import { checkIsExist } from "./helpers/checkIsExist.ts";

const errorMessages = {
  sliceNotFound: "Slice Not Found",
  keyNotFound: "Key Not Found",
  storeFound: "Store was already set on Reducer Manager",
  storeNotFound: "Store was not set on Reducer Manager",
  sliceWasFound: (key: string, action: string) =>
    `${key}: slice already added on store, ${action} canceled`,
  reducerWasFound: (key: string, action: string) =>
    `${key}: reducer already added on store, ${action} canceled`,
  reducerWasNotProvided: (key: string) => `${key}: reducer not provided`,
  reducerWasDeleted: (key: string, action: string) =>
    `${key}: reducer already deleted from store, ${action} canceled`,
};

export interface ReducerManagerOptions {
  reducer?: Record<string, Reducer>;
  slices?: Slice[];
  enableReducerManagerReducer?: boolean;
  reducerManagerSlice?: Slice;
}

export class ReducerManager {
  private $slices: Slice[] = [];
  private $options: ReducerManagerOptions = {};
  private $reducers: Record<string, Reducer> = {};
  private $store: Store | undefined = undefined;

  constructor(options: ReducerManagerOptions) {
    this.$options = options;
    const optionsReducerKeys = Object.keys(options?.reducer || {});
    this.$slices = options?.slices?.length ? [...options.slices] : [];
    if (optionsReducerKeys.length && options.reducer) {
      this.$reducers = { ...options.reducer };
    } else if (!optionsReducerKeys.length && this.getSlices().length) {
      for (let i = 0; i < this.getSlices().length; i++) {
        const slice = this.$slices[i];
        if (slice) {
          this.$reducers[slice.name] = slice.reducer;
        }
      }
    }

    if (options.enableReducerManagerReducer && options.reducerManagerSlice) {
      const slice = options.reducerManagerSlice;
      this.$reducers[slice.name] = slice.reducer;
    }
  }

  storeReplaceReducer(key: string, state: string | { key: string; state: string }) {
    if (!this.$store) return;
    this.$store.replaceReducer(combineReducers(this.getReducers()));
    if (
      this.getOptions().enableReducerManagerReducer &&
      this.getOptions().reducerManagerSlice
    ) {
      const slice = this.getOptions().reducerManagerSlice;
      if (slice?.actions?.update) {
        this.$store.dispatch(slice.actions.update({ key, state }));
      }
    }
  }

  addReducerViaSlice(slice: Slice) {
    if (!checkIsExist(this.$store, { message: errorMessages.storeNotFound }))
      return;
    if (!checkIsExist(slice, { message: errorMessages.sliceNotFound })) return;

    if (this.getSlices().length) {
      if (this.getSlices().findIndex((sli) => sli.name === slice.name) === -1) {
        this.$slices.push(slice);
      } else {
        return;
      }
    } else {
      this.$slices.push(slice);
    }

    this.$reducers[slice.name] = slice.reducer;
    this.storeReplaceReducer(slice.name, "add");
  }

  removeReducerViaSlice(slice: Slice) {
    if (!checkIsExist(this.$store, { message: errorMessages.storeNotFound }))
      return;

    if (this.getSlices().length && slice) {
      const index = this.getSlices().findIndex(
        (sli) => sli.name === slice.name,
      );
      if (index > -1) {
        this.getSlices().splice(index, 1);
        delete this.$reducers[slice.name];
        this.storeReplaceReducer(slice.name, "remove");
      }
    }
  }

  addReducer(key: string, reducer: Reducer, slice?: Slice) {
    if (slice) return this.addReducerViaSlice(slice);
    if (!checkIsExist(this.$store, { message: errorMessages.storeNotFound }))
      return;
    if (!checkIsExist(key, { message: errorMessages.keyNotFound })) return;
    if (
      !checkIsExist(reducer, {
        message: errorMessages.reducerWasNotProvided(key),
      })
    )
      return;

    if (
      checkIsExist(this.$reducers[key], {
        message: errorMessages.reducerWasFound(key, "adding"),
      })
    )
      return;

    this.$reducers[key] = reducer;
    this.storeReplaceReducer(key, "add");
  }

  removeReducer(key: string, slice?: Slice) {
    if (slice) return this.removeReducerViaSlice(slice);
    if (!checkIsExist(key, { message: errorMessages.keyNotFound })) return;
    if (!checkIsExist(this.$store, { message: errorMessages.storeNotFound }))
      return;

    if (
      !checkIsExist(this.$reducers[key], {
        message: errorMessages.reducerWasDeleted(key, "removing"),
      })
    ) {
      return;
    }

    delete this.$reducers[key];
    this.storeReplaceReducer(key, "remove");
  }

  setStore(store: Store) {
    if (checkIsExist(this.$store, { message: errorMessages.storeFound }))
      return this.$store;

    this.$store = store;
    return this.$store;
  }

  getStore() {
    return this.$store;
  }

  getOptions() {
    return this.$options;
  }

  getSlices() {
    return this.$slices;
  }

  getReducers() {
    return this.$reducers;
  }

  getCombinedReducers(state: any, action: UnknownAction) {
    return combineReducers(this.getReducers())(state, action);
  }
}
