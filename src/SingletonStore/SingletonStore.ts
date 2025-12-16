import { generateStoreWReducerManager } from "./helpers/generators.ts";
import { checkIsExist } from "./helpers/checkIsExist.ts";

export class SingletonStore {
	static $store = undefined;
	$options = undefined;

	configure(options) {
		this.$options = options;
		SingletonStore.$store = generateStoreWReducerManager(options);
		return SingletonStore.$store;
	}

	chainConfigure(options) {
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

	toObservable(store) {
		if (!store) {
			store = SingletonStore.$store;
		}
		return {
			subscribe({ onNext }) {
				let dispose = store.subscribe(() => onNext?.(store.getState()));
				onNext?.(store.getState());
				return { dispose };
			},
		};
	}

	observeStore(store, select, onChange?: (...arg: unknown[]) => void) {
		if (!store) {
			store = SingletonStore.$store;
		}

		let currentState;
		function handleChange() {
			if (
				checkIsExist(typeof select === "function", {
					message: "select was not set on SingletonStore.observeStore",
				})
			) {
				let nextState = select?.(store.getState());
				if (nextState !== currentState) {
					currentState = nextState;
					onChange?.(currentState);
				}
			}
		}

		let unsubscribe = store.subscribe(handleChange);
		handleChange();
		return unsubscribe;
	}
}
