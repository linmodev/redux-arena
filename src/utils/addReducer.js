import {
  ARENA_SCENE_REPLACE_STATE,
  ARENA_SWITCH_REPLACE_STATE,
  ARENA_CURTAIN_REPLACE_STATE
} from "../core/actionTypes";

function addReducer(store, reducerKey, reducerFactory) {
  let newReducerKey = reducerKey;
  // 如果reducerKey传入了
  if (newReducerKey != null) {
    let flag = store.addReducer({
      reducerKey: newReducerKey,
      reducer: reducerFactory(newReducerKey)
    });
    if (flag === false) {
      throw new Error(`Reducer key [${newReducerKey}] already exsit.`);
    }
  } else {
    // 如果没有reducerKey自动生成
    do {
      newReducerKey = String(Math.random()).slice(2);
      let flag = store.addReducer({
        reducerKey: newReducerKey,
        reducer: reducerFactory(newReducerKey)
      });
      if (flag === false) newReducerKey = null;
    } while (newReducerKey == null);
  }
  // 返回成功添加reducer的reducerKey
  return newReducerKey;
}

export function switchAddReducer(store, reducerKey, reducerFactory, state) {
  let newReducerKey = addReducer(store, reducerKey, reducerFactory);
  if (state)
    store.dispatch({
      type: ARENA_SWITCH_REPLACE_STATE,
      _reducerKey: newReducerKey
    });
  return newReducerKey;
}

export function sceneAddReducer(store, reducerKey, reducerFactory, state) {
  let newReducerKey = addReducer(store, reducerKey, reducerFactory);
  if (state)
    store.dispatch({
      type: ARENA_SCENE_REPLACE_STATE,
      _sceneReducerKey: newReducerKey,
      state
    });
  return newReducerKey;
}

export function curtainAddReducer(store, reducerKey, reducerFactory, state) {
  let newReducerKey = addReducer(store, reducerKey, reducerFactory);
  if (state)
    store.dispatch({
      type: ARENA_CURTAIN_REPLACE_STATE,
      _reducerKey: newReducerKey,
      state
    });
  return newReducerKey;
}
