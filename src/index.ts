import qs from "qs";
import express, { type Request, type Response } from "express";
import { SingletonStore } from "./SingletonStore/index.ts";
import { counterSlice, postSlice, userSlice } from "./slices/index.ts";

const app = express();
const PORT = 4000;

const singletonStore = new SingletonStore().chainConfigure({
	reducer: { users: userSlice.reducer, posts: postSlice.reducer },
	slices: [userSlice, postSlice],
	// enableReducerManagerReducer: true,
});

app.get("/state", (req: Request, res: Response) => {
	res.send(singletonStore.getStore()?.getState());
});

app.get("/addCounter", (req: Request, res: Response) => {
	const params = qs.parse(req.query as any) as { counter: string };
	const counter = Number.parseInt(params.counter, 10) || 0;

	singletonStore
		.getStore()
		?.reducerManager.addReducer(counterSlice.name, counterSlice.reducer);

	if (counter) {
		singletonStore.getStore()?.dispatch(counterSlice.actions.add(counter));
	}

	res.send(singletonStore.getStore()?.getState());
});

app.get("/deleteCounter", (req: Request, res: Response) => {
	singletonStore.getStore()?.reducerManager.removeReducer(counterSlice.name);
	res.send(singletonStore.getStore()?.getState());
});

app.get("/updateCounter", (req: Request, res: Response) => {
	const params = qs.parse(req.query as any) as { counter: string };
	const counter = Number.parseInt(params.counter, 10) || 0;

	singletonStore
		.getStore()
		?.reducerManager.addReducer(counterSlice.name, counterSlice.reducer);

	singletonStore.getStore()?.dispatch(counterSlice.actions.update(counter));
	res.send(singletonStore.getStore()?.getState());
});

app.get("/getCounterSelectors", (req: Request, res: Response) => {
	res.send(counterSlice.getSelectors());
});

app.get("/", (req: Request, res: Response) => {
	res.send(singletonStore.getStore()?.getState());
});

app.listen(PORT, (error?: Error) => {
	if (error) {
		console.error(error);
		return;
	}
	console.info(
		`Listening on port ${PORT}. Open up http://localhost:${PORT}/ in your browser.`,
	);
	// singletonStore.getStore().subscribe((...res) => {
	//   console.log(res,singletonStore.getStore().getState())
	// })

	// singletonStore.toObservable().subscribe({ onNext: console.log })
	// singletonStore.observeStore(undefined, (d) => d, console.log)
	singletonStore.observeStore(undefined, console.log);
});
