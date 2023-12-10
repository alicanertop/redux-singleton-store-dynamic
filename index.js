const qs = require('qs')
const { SingletonStore } = require('./SingletonStore')
const slices = require('./slices')
const express = require('express')
const app = express()
const PORT = 4000

let counterSlice = slices.counter.slice
const singletonStore = new SingletonStore().chainConfigure({
  // reducer: { users: slices.user.slice.reducer, posts: slices.post.slice.reducer },
  // slices: [slices.user.slice, slices.post.slice],
  // enableReducerManagerReducer: true,
})

app.get('/state', function (req, res) {
  res.send(singletonStore.getStore().getState())
})

app.get('/addCounter', function (req, res) {
  const params = qs.parse(req.query)
  const counter = parseInt(params.counter, 10) || 0

  singletonStore.getStore().reducerManager.addReducer(counterSlice.name, counterSlice.reducer)

  if (counter) {
    singletonStore.getStore().dispatch(counterSlice.actions.update(counter))
  }

  res.send(singletonStore.getStore().getState())
})

app.get('/deleteCounter', function (req, res) {
  singletonStore.getStore().reducerManager.removeReducer(counterSlice.name)
  res.send(singletonStore.getStore().getState())
})

app.get('/updateCounter', function (req, res) {
  const params = qs.parse(req.query)
  const counter = parseInt(params.counter, 10) || 0
  singletonStore.getStore().dispatch(counterSlice.actions.update(counter))
  res.send(singletonStore.getStore().getState())
})

app.get('/getCounterSelectors', function (req, res) {
  // res.send(counterSlice.getSelectors())
  res.send(counterSlice.getSelectors())
})

app.get('/', function (req, res) {
  res.send(singletonStore.getStore().getState())
})

app.listen(PORT, (error) => {
  if (error) {
    console.error(error)
    return
  }
  console.info(`Listening on port ${PORT}. Open up http://localhost:${PORT}/ in your browser.`)
  // singletonStore.toObservable().subscribe({ onNext: console.log })
  // singletonStore.observeStore(undefined, (d) => d, console.log)
  // singletonStore.observeStore(undefined, console.log)
})
