import express, { type Request, type Response } from 'express';
import qs from 'qs';

import { ReduxStoreManager, type DynamicReduxStoreManagerState } from './ReduxStoreManager/index.ts';
import { counterSlice, postSlice, userSlice } from './slices/index.ts';

const app = express();
const PORT = 4000;

const reduxStoreManager = new ReduxStoreManager();

app.get('/state', (req: Request, res: Response) => {
  res.send(reduxStoreManager.store?.getState());
});

app.get('/addCounter', (req: Request, res: Response) => {
  const params = qs.parse(req.query as any) as { counter: string };
  const counter = Number(params.counter || 0);

  reduxStoreManager.addSlice(counterSlice, counterSlice);

  if (counter) {
    reduxStoreManager.store?.dispatch(counterSlice.actions.add(counter));
  }

  res.send(reduxStoreManager.store?.getState());
});

app.get('/deleteCounter', (req: Request, res: Response) => {
  reduxStoreManager.removeSlice(counterSlice);
  res.send(reduxStoreManager.store?.getState());
});

app.get('/hasReducer', (req: Request, res: Response) => {
  reduxStoreManager.hasSlice(counterSlice);
  res.send(reduxStoreManager.store?.getState());
});

app.get('/updateCounter', (req: Request, res: Response) => {
  const params = qs.parse(req.query as any) as { counter: string };
  const counter = Number(params.counter || 0);

  reduxStoreManager.addSlice(counterSlice);

  reduxStoreManager.store?.dispatch(counterSlice.actions.update(counter));
  res.send(reduxStoreManager.store?.getState());
});

app.get('/getCounterSelectors', (req: Request, res: Response) => {
  res.send(counterSlice.getSelectors());
});

app.get('/', (req: Request, res: Response) => {
  res.send(reduxStoreManager.store?.getState());
});

app.listen(PORT, (error?: Error) => {
  if (error) {
    console.error(error);
    return;
  }

  console.info(
    `Listening on port ${PORT}. Open up http://localhost:${PORT}/ in your browser.`
  );

  // reduxStoreManager.store?.subscribe((...res) => {
  //   console.log(
  //     res,
  //     reduxStoreManager?.store?.getState(),
  //     reduxStoreManager.getReducers()
  //   );
  // });

  // reduxStoreManager.toObservable().subscribe({ onNext: console.log });
  reduxStoreManager.observeStore((d: DynamicReduxStoreManagerState) => d?.counter?.counter, console.log);
  reduxStoreManager.addSlice(postSlice, userSlice);
});

console.log(reduxStoreManager.getReducers());
