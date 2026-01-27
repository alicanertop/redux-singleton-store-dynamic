/* eslint-disable @typescript-eslint/no-explicit-any */
import { enableMapSet } from 'immer';

import {
  type AnyAction,
  type CombinedState,
  type Reducer,
  type Store,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';

import type {
  DynamicReduxStoreManagerState,
  GlobalStoreParams,
} from '../@types/ReduxStoreTypes';
import { isDataValid } from '../helpers/isDataValid';
import { isFunction } from '../helpers/isFunction';
import { MiddlewareManager } from './MiddlewareManager';

export class StoreManager extends MiddlewareManager {
  #store?: Store<DynamicReduxStoreManagerState> = undefined;

  protected reducerMap: Map<string, Reducer> = new Map();

  #options: GlobalStoreParams = {
    reducer: {},
    devTools: process.env.NODE_ENV === 'development',
    middleware: (defaultMiddleware) =>
      defaultMiddleware(this.defaultMiddlewareOptions).concat(
        this.dynamicMiddlewareManager.bind(this)
      ),
  };

  #getCombinedReducers(state: CombinedState<unknown>, action: AnyAction) {
    return combineReducers(this.reducers)(state, action);
  }

  #getReducers() {
    return Array.from(this.reducerMap.entries()).reduce(
      (prev, [name, reducer]) => {
        prev[name] = reducer;
        return prev;
      },
      {} as Record<string, Reducer>
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

  protected storeReplaceReducer() {
    if (!isDataValid(this.#store)) return;
    this.#store.replaceReducer(combineReducers(this.reducers) as any);
  }

  constructor() {
    super();
    enableMapSet();

    this.#options.reducer = this.#getCombinedReducers.bind(this);
    this.#store = configureStore(this.#options);
  }

  public get store(): Store<DynamicReduxStoreManagerState> {
    return this.#store!;
  }

  public get options() {
    return this.#options;
  }

  public get reducers() {
    return this.#getReducers();
  }

  observeStore<S>(
    select: (state: DynamicReduxStoreManagerState) => S,
    onChange?: (state: S) => void
  ) {
    return this.#observeStoreWithGivenStore(this.store, select, onChange);
  }
}
