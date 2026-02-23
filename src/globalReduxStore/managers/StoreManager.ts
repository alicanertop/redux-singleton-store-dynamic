/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type AnyAction,
  type CaseReducerActions,
  type CombinedState,
  combineReducers,
  configureStore,
  type Reducer,
  type SliceCaseReducers,
  type Store,
} from '@reduxjs/toolkit';

import { enableMapSet } from 'immer';

import { isDataValid } from '../helpers/isDataValid';
import { isFunction } from '../helpers/isFunction';

import type {
  GlobalReduxStoreState,
  GlobalStoreParams,
} from '../@types/ReduxStoreTypes';
import { MiddlewareManager } from './MiddlewareManager';

export class StoreManager extends MiddlewareManager {
  #store?: Store<GlobalReduxStoreState> = undefined;

  protected reducerMap: Map<string, Reducer> = new Map();

  protected actionsMap: Map<
    string,
    CaseReducerActions<SliceCaseReducers<unknown>, string>
  > = new Map();

  #options: GlobalStoreParams = {
    reducer: {},
    devTools: process.env.NODE_ENV === 'development',
    middleware: (defaultMiddleware) =>
      defaultMiddleware(this.defaultMiddlewareOptions).concat(
        this.dynamicMiddlewareManager.bind(this),
        this.actionListener.middleware.bind(this)
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
    store?: Store<GlobalReduxStoreState>,
    select?: (state: GlobalReduxStoreState) => S,
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

  public get store(): Store<GlobalReduxStoreState> {
    return this.#store!;
  }

  public get options() {
    return this.#options;
  }

  public get reducers() {
    return this.#getReducers();
  }

  observeStore<S>(
    select: (state: GlobalReduxStoreState) => S,
    onChange?: (state: S) => void
  ) {
    return this.#observeStoreWithGivenStore(this.store, select, onChange);
  }
}
