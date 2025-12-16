import { configureStore, createSlice } from "@reduxjs/toolkit";
import { ReducerManager } from "../ReducerManager.ts";

export const generateReducerManager = (options) => {
	if (options.enableReducerManagerReducer) {
		const reducerManagerSlice = createSlice({
			name: "@@@reducerManager",
			initialState: {},
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
export const generateStore = (options) => {
	return configureStore(options);
};

export const generateStoreWReducerManager = (options) => {
	const reducerManager = generateReducerManager(options);
	const store = generateStore({
		...options,
		reducer: reducerManager.getCombinedReducers.bind(reducerManager),
	});
	reducerManager.setStore(store);
	store.reducerManager = reducerManager;
	return store;
};
