import {
	type ConfigureStoreOptions,
	type Slice,
	configureStore,
	createSlice,
	type Reducer,
} from "@reduxjs/toolkit";
import { ReducerManager } from "../ReducerManager.ts";

export interface GenerateStoreOptions
	extends Omit<ConfigureStoreOptions, "reducer"> {
	reducer: Record<string, Reducer>;
	enableReducerManagerReducer?: boolean;
	reducerManagerSlice?: Slice;
	slices?: Slice[];
}

export const generateReducerManager = (options: GenerateStoreOptions) => {
	if (options.enableReducerManagerReducer) {
		const reducerManagerSlice = createSlice({
			name: "@@@reducerManager",
			initialState: {} as Record<string, unknown>,
			reducers: {
				update: (state, action) => {
					state.key = action.payload.key;
					state.state = action.payload.state;
				},
			},
		});
		options.reducerManagerSlice = reducerManagerSlice;
	}

	return new ReducerManager(options);
};
export const generateStore = (
	options: Omit<GenerateStoreOptions, "reducer"> & {
		reducer: Reducer | Record<string, Reducer>;
	},
) => {
	return configureStore(options as any);
};

export const generateStoreWReducerManager = (options: GenerateStoreOptions) => {
	const reducerManager = generateReducerManager(options);
	const store = generateStore({
		...options,
		reducer: reducerManager.getCombinedReducers.bind(reducerManager),
	}) as ReturnType<typeof generateStore> & { reducerManager: ReducerManager };
	reducerManager.setStore(store);
	store.reducerManager = reducerManager;
	return store;
};
