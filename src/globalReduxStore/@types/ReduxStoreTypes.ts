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

export interface GlobalReduxStoreState {}
export interface GlobalReduxStoreAction {}
export interface GlobalReduxStoreReducer {}
export interface GlobalReduxStoreMiddlewareAPI
  extends MiddlewareAPI<Dispatch, GlobalReduxStoreState> {}

export interface GlobalReduxStoreMountedState
  extends Record<keyof GlobalReduxStoreState, boolean> {
  auto: boolean;
}
