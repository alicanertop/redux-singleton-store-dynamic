/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ConfigureStoreOptions,
  Dispatch,
  ImmutableStateInvariantMiddlewareOptions,
  Middleware,
  MiddlewareAPI,
  SerializableStateInvariantMiddlewareOptions,
} from '@reduxjs/toolkit';

export type DynamicMiddleware = Middleware<{}, any, any>;

export interface ThunkOptions<E = any> {
  extraArgument: E;
}

export interface GetDefaultMiddlewareOptions {
  thunk?: boolean | ThunkOptions;
  immutableCheck?: boolean | ImmutableStateInvariantMiddlewareOptions;
  serializableCheck?: boolean | SerializableStateInvariantMiddlewareOptions;
}

export interface GlobalStoreParams extends ConfigureStoreOptions {}

export interface DynamicReduxStoreManagerStateBase {}
export interface DynamicReduxStoreManagerState
  extends Partial<DynamicReduxStoreManagerStateBase> {}

export interface DynamicReduxStoreMiddlewareAPI
  extends MiddlewareAPI<Dispatch, DynamicReduxStoreManagerState> {}
