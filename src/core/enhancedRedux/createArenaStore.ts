import { Middleware, ReducersMapObject, StoreEnhancer } from "redux";
import { applyMiddleware, compose } from "redux";
import { arenaReducer, getArenaInitState } from "../reducers";
import createEnhancedStore, { EnhancedStore } from "./createEnhancedStore";
import createSagaMiddleware, { END, SagaMiddlewareOptions } from "redux-saga";

import ActionTypes from "../ActionTypes";
import rootSaga from "../sagas";

export type ArenaStoreOptions = {
  sagaOptions?: SagaMiddlewareOptions<{}>;
  initialStates?: any;
  enhencers?: StoreEnhancer[];
  middlewares?: Middleware[];
};

export default function createArenaStore(
  reducers: ReducersMapObject = {},
  options: ArenaStoreOptions = {}
) {
  let { enhencers, sagaOptions, initialStates, middlewares } = options;
  let sagaMiddleware = createSagaMiddleware(sagaOptions);
  let mergedMiddlewares: Middleware[] = [sagaMiddleware];
  if (middlewares) {
    mergedMiddlewares = mergedMiddlewares.concat(middlewares);
  }
  let store = createEnhancedStore(
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
      initialStates || {}
    ),
    enhencers
      ? compose(applyMiddleware(...mergedMiddlewares), ...enhencers)
      : applyMiddleware(...mergedMiddlewares)
  );
  sagaMiddleware.run(rootSaga, { store });
  store.close = () => store.dispatch(END);
  store.runSaga = saga => {
    store.dispatch({
      type: ActionTypes.ARENA_INIT_AUDIENCE_SAGA,
      saga
    });
  };

  return store;
}
