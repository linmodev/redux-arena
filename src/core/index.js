import { applyMiddleware, compose } from "redux";
import { ARENA_INIT_AUDIENCE_SAGA } from "./actionTypes";
import createSagaMiddleware, { END } from "redux-saga";
import { getArenaInitState, arenaReducer } from "./reducers";
import { createEnhancedStore } from "./enhancedRedux";
import rootSaga from "./sagas";

/**
 * This is an initialization function,
 * you can pass some of the initialization of some
 * initialization reducer, state, saga or some other redux middleware,
 * such as redux-thunk
 * If you pass in a custom saga, it will use fork to run once and
 * keep the running task information in the root of the arena
 * createStore方法
 *1 用于合并最顶层的arena state键，同时也合并了传入的应用顶层state
 *2 合并了最顶层的arena reducer，同时也合并了传的应用顶层reducer
 *3 使用高阶函数compose合并传的redux middleware
 *4 把saga的启动函数和close函数挂载到store上
 *5 
 * @export
 * @param {any} [reducers={}]  
 * @param {any} [initialStates={}] 
 * @param {any} saga 
 * @param {any} enhencers 
 * @returns
 */
export function createArenaStore(
  reducers = {},
  initialStates = {},
  saga,
  enhencers
) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createEnhancedStore(
    Object.assign(
      {
        arena: arenaReducer
      },
      reducers
    ),
    Object.assign(
      {
        arena: getArenaInitState()
      },
      initialStates
    ),
    enhencers
      ? compose(applyMiddleware(sagaMiddleware), ...enhencers)
      : applyMiddleware(sagaMiddleware)
  );
  store.runSaga = sagaMiddleware.run;
  store.close = () => store.dispatch(END);
  // {store} 传入rootSaga运行的参数
  store.runSaga(rootSaga, { store });
  // 如果有传入的应用顶层saga，则传入并运行
  if (saga)
    store.dispatch({
      type: ARENA_INIT_AUDIENCE_SAGA,
      saga
    });
  // 最后返回这个store
  return store;
}
