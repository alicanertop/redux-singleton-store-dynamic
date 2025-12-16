import {
  type ConfigureStoreOptions,
  type Reducer,
  type Slice,
  type Store,
  type UnknownAction,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';

import { isDataExist, isFunction } from './helpers/index.ts';

export interface DynamicReduxStoreManagerState { }

export class ReduxStoreManager {
  private $store?: Store<Partial<DynamicReduxStoreManagerState> & Record<string, any>> = undefined;
  private $slices: Set<Slice> = new Set();
  private $reducers: Map<string, Reducer> = new Map();
  private $options: ConfigureStoreOptions = { reducer: {} };

  private addSliceReducer(slice?: Slice) {
    if (!slice) return;
    if (this.$slices.has(slice)) return;

    this.$slices.add(slice);
    this.$reducers.set(slice.name, slice.reducer);
  }

  private removeSliceReducer(slice?: Slice) {
    if (!slice) return;
    if (this.$slices.has(slice)) return;

    this.$slices.delete(slice);
    this.$reducers.delete(slice.name);
  }

  private getCombinedReducers(state: any, action: UnknownAction) {
    return combineReducers(this.getReducers())(state, action);
  }

  private storeReplaceReducer() {
    if (!isDataExist(this.$store, 'Store not found')) return;
    this.$store.replaceReducer(combineReducers(this.getReducers()));
  }

  constructor(slices?: Slice[], options?: ConfigureStoreOptions) {
    this.$options = options || this.$options;

    if (slices?.length) {
      for (let i = 0; i < slices.length; i++) {
        this.addSliceReducer(slices[i]);
      }
    }

    this.$options.reducer = this.getCombinedReducers.bind(this);
    this.store = configureStore(this.$options);
  }

  public get store() {
    return this.$store;
  }

  public set store(_store: typeof this.$store) {
    this.$store = _store;
  }

  addSlice(...sliceList: Slice[]) {
    for (let i = 0; i < sliceList.length; i++) {
      this.addSliceReducer(sliceList[i]);
    }

    this.storeReplaceReducer();
  }

  removeSlice(...sliceList: Slice[]) {
    for (let i = 0; i < sliceList.length; i++) {
      this.removeSliceReducer(sliceList[i]);
    }

    this.storeReplaceReducer();
  }

  hasSlice(slice: Slice) {
    return this.$slices.has(slice);
  }

  getOptions() {
    return this.$options;
  }

  getSlices() {
    return this.$slices;
  }

  getReducers() {
    return this.$reducers.entries().reduce(
      (prev, [name, reducer]) => {
        prev[name] = reducer;
        return prev;
      },
      {} as Record<string, Reducer>
    );
  }

  toObservable() {
    return {
      subscribe: ({ onNext }: { onNext?: (state: unknown) => void }) => {
        if (!this.$store) return;
        const dispose = this.$store.subscribe(() => {
          if (!this.$store) return;

          return onNext?.(this.$store.getState());
        });
        onNext?.(this.$store.getState());
        return { dispose };
      },
    };
  }

  observeStoreWithGivenStore<S>(
    store: typeof this.$store,
    select: (state: any) => S,
    onChange?: (state: S) => void
  ) {
    if (!store) {
      store = this.$store;
    }

    if (!isDataExist(store, 'Store was not set on SingletonStore')) return;

    let currentState: S | undefined;

    function handleChange() {
      if (!store) return;
      if (isFunction(select)) {
        const nextState = select(store.getState());
        if (nextState !== currentState) {
          currentState = nextState;
          if (isFunction(onChange)) {
            onChange(currentState as S);
          }
        }
      }
    }

    const unsubscribe = store.subscribe(handleChange);
    handleChange();
    return unsubscribe;
  }

  observeStore<S>(select: (state: any) => S, onChange?: (state: S) => void) {
    return this.observeStoreWithGivenStore(this.store, select, onChange);
  }
}
