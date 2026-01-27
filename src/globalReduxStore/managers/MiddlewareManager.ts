/* eslint-disable no-plusplus */
import type { AnyAction, Dispatch, MiddlewareAPI } from '@reduxjs/toolkit';

import type {
  DynamicMiddleware,
  GetDefaultMiddlewareOptions,
} from '../@types/ReduxStoreTypes';

export class MiddlewareManager {
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
}
