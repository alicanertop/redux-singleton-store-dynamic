import type { EnhancedStore } from "@reduxjs/toolkit";
import type { ReducerManager } from "./ReducerManager.ts";
import {
	type GenerateStoreOptions,
	generateStoreWReducerManager,
} from "./helpers/generators.ts";
import { checkIsExist } from "./helpers/checkIsExist.ts";

export type AugmentedStore = EnhancedStore & { reducerManager: ReducerManager };

export class SingletonStore {
	static $store: AugmentedStore | undefined = undefined;
	$options: GenerateStoreOptions | undefined = undefined;

	configure(options: GenerateStoreOptions) {
		this.$options = options;
		SingletonStore.$store = generateStoreWReducerManager(options);
		return SingletonStore.$store;
	}

	chainConfigure(options: GenerateStoreOptions) {
		this.configure(options);
		return this;
	}

	getStore() {
		if (
			checkIsExist(SingletonStore.$store, {
				message: "Store was not set on SingletonStore",
			})
		)
			return SingletonStore.$store;
	}

	toObservable(store?: AugmentedStore) {
		if (!store) {
			store = SingletonStore.$store;
		}

		if (!store) return;

		const targetStore = store; // capture for closure

		return {
			subscribe({ onNext }: { onNext?: (state: unknown) => void }) {
				const dispose = targetStore.subscribe(() =>
					onNext?.(targetStore.getState()),
				);
				onNext?.(targetStore.getState());
				return { dispose };
			},
		};
	}

	observeStore<S>(
		store: AugmentedStore | undefined,
		select: (state: any) => S,
		onChange?: (state: S) => void,
	) {
		if (!store) {
			store = SingletonStore.$store;
		}

		if (
			!checkIsExist(store, {
				message: "Store was not set on SingletonStore",
			})
		)
			return;

		let currentState: S | undefined;
		const targetStore = store;
		if (!targetStore) return;

		function handleChange() {
			if (
				checkIsExist(typeof select === "function", {
					message: "select was not set on SingletonStore.observeStore",
				}) && targetStore
			) {
				const nextState = select?.(targetStore.getState());
				if (nextState !== currentState) {
					currentState = nextState;
					onChange?.(currentState as S);
				}
			}
		}

		const unsubscribe = targetStore.subscribe(handleChange);
		handleChange();
		return unsubscribe;
	}
}
