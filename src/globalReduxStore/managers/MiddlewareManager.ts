/* eslint-disable no-plusplus */
import {
  type AnyAction,
  createListenerMiddleware,
  type Dispatch,
  type MiddlewareAPI,
  type TypedStartListening,
  type TypedStopListening,
} from '@reduxjs/toolkit';

import type {
  DynamicMiddleware,
  GetDefaultMiddlewareOptions,
  GlobalReduxStoreState,
} from '../@types/ReduxStoreTypes';

export class MiddlewareManager {
  protected actionListener = createListenerMiddleware<
    GlobalReduxStoreState,
    Dispatch<AnyAction>,
    unknown
  >();

  #middlewareList = new Set<DynamicMiddleware>();

  protected defaultMiddlewareOptions: GetDefaultMiddlewareOptions = {
    serializableCheck: false,
  };

  protected dynamicMiddlewareManager(store: MiddlewareAPI) {
    return (next: Dispatch<AnyAction>) => (action: AnyAction) => {
      const pipeline = Array.from(this.#middlewareList)
        .map((m) => m(store))
        .reduceRight((composed, f) => f(composed), next);

      return pipeline(action);
    };
  }

  addMiddleware(...middlewareList: DynamicMiddleware[]) {
    for (let i = 0; i < middlewareList.length; i++) {
      this.#middlewareList.add(middlewareList[i]);
    }
  }

  removeMiddleware(...middlewareList: DynamicMiddleware[]) {
    for (let i = 0; i < middlewareList.length; i++) {
      this.#middlewareList.delete(middlewareList[i]);
    }
  }

  public get actionListenerMiddleware() {
    return this.actionListener;
  }

  public get startMiddlewareListening() {
    return this.actionListener.startListening as TypedStartListening<
      GlobalReduxStoreState,
      Dispatch<AnyAction>
    >;
  }

  public get stopMiddlewareListening() {
    return this.actionListener.stopListening as TypedStopListening<
      GlobalReduxStoreState,
      Dispatch<AnyAction>
    >;
  }
}
