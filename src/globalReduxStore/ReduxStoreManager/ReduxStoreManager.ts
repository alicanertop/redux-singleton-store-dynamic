/* eslint-disable no-plusplus */
import { enableMapSet } from 'immer';

import {
  type AnyAction,
  type CombinedState,
  type ConfigureStoreOptions,
  type ListenerMiddleware,
  type Reducer,
  type Slice,
  type Store,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';

import { GLOBAL_REDUX_STORE_EVENTS } from '../helpers/eventTrigger';
import { isDataValid } from '../helpers/isDataValid';
import { isFunction } from '../helpers/isFunction';

export interface GlobalStoreParams extends ConfigureStoreOptions {}

export interface DynamicReduxStoreManagerStateBase {}
export interface DynamicReduxStoreManagerState extends Partial<DynamicReduxStoreManagerStateBase> {}

export class ReduxStoreManager {
  #slices: Set<Slice> = new Set();

  #reducers: Map<string, Reducer> = new Map();

  #options: GlobalStoreParams = {
    devTools: process.env.NODE_ENV === 'development',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
    reducer: {},
  };

  #store?: Store<DynamicReduxStoreManagerState> = undefined;

  #addSliceReducer(slice?: Slice) {
    if (!slice) return;
    if (this.#slices.has(slice)) return;

    this.#slices.add(slice);
    this.#reducers.set(slice.name, slice.reducer);

    GLOBAL_REDUX_STORE_EVENTS.sliceAdded(slice);
  }

  #removeSliceReducer(slice?: Slice) {
    if (!slice) return;
    if (this.#slices.has(slice)) return;

    this.#slices.delete(slice);
    this.#reducers.delete(slice.name);

    GLOBAL_REDUX_STORE_EVENTS.sliceRemoved(slice);
  }

  #getReducers() {
    return Array.from(this.#reducers.entries()).reduce(
      (prev, [name, reducer]) => {
        prev[name] = reducer;
        return prev;
      },
      {} as Record<string, Reducer>
    );
  }

  #getCombinedReducers(state: CombinedState<unknown>, action: AnyAction) {
    return combineReducers(this.#getReducers())(state, action);
  }

  #storeReplaceReducer() {
    if (!isDataValid(this.#store)) return;
    this.#store.replaceReducer(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      combineReducers(this.#getReducers()) as unknown as any
    );
  }

  #observeStoreWithGivenStore<S>(
    store?: Store<DynamicReduxStoreManagerState>,
    select?: (state: DynamicReduxStoreManagerState) => S,
    onChange?: (state: S) => void
  ) {
    if (!store) {
      store = this.#store;
    }
    let unsubscribe = () => {};

    if (!isDataValid(store)) return unsubscribe;

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

    unsubscribe = store.subscribe(handleChange);
    handleChange();
    return unsubscribe;
  }

  constructor(slices?: Slice[], options?: GlobalStoreParams) {
    this.#options = { ...this.#options, ...options };

    if (slices?.length) {
      for (let i = 0; i < slices.length; i++) {
        this.#addSliceReducer(slices[i]);
      }
    }

    enableMapSet();

    this.#options.reducer = this.#getCombinedReducers.bind(this);
    this.store = configureStore(this.#options);
  }

  public get store(): Store<DynamicReduxStoreManagerState> {
    return this.#store!;
  }

  public set store(_store: Store<DynamicReduxStoreManagerState> | undefined) {
    this.#store = _store;
  }

  public get options() {
    return this.#options;
  }

  public get slices() {
    return this.#slices;
  }

  public get reducers() {
    return this.#getReducers();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addMiddleware(...middlewareList: ListenerMiddleware<any, any, any>[]) {
    for (let i = 0; i < middlewareList.length; i++) {
      console.log(middlewareList);
    }
  }

  addSlice(...sliceList: Slice[]) {
    for (let i = 0; i < sliceList.length; i++) {
      this.#addSliceReducer(sliceList[i]);
    }

    this.#storeReplaceReducer();
  }

  removeSlice(...sliceList: Slice[]) {
    for (let i = 0; i < sliceList.length; i++) {
      this.#removeSliceReducer(sliceList[i]);
    }

    this.#storeReplaceReducer();
  }

  hasSlice(slice: Slice) {
    return this.#slices.has(slice);
  }

  toObservable() {
    return {
      subscribe: ({ onNext }: { onNext?: (state: unknown) => void }) => {
        if (!this.#store) return;
        const dispose = this.#store.subscribe(() => {
          if (!this.#store) return;

          return onNext?.(this.#store.getState());
        });
        onNext?.(this.#store.getState());
        return { dispose };
      },
    };
  }

  observeStore<S>(
    select: (state: DynamicReduxStoreManagerState) => S,
    onChange?: (state: S) => void
  ) {
    return this.#observeStoreWithGivenStore(this.store, select, onChange);
  }
}
