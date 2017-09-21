/**
 * Create redux-arena proxy store
 */
import { createStore, combineReducers } from "redux";

function storeEnhancer(store, reducers) {
  // 保存当前reducers
  let _currentReducers = reducers;
  const handler = {
    get: function(target, name) {
      if (name === "addReducer") {
        return ({ reducerKey, reducer }) => {
          let allStates = target.getState();
          // 如果已经存在该reducerKey的state则返回false
          if (allStates[reducerKey] != null) return false;
          // 合并新的reducer
          _currentReducers = Object.assign({}, _currentReducers, {
            [reducerKey]: reducer
          });
          // store原生方法替换原来的reducer
          target.replaceReducer(combineReducers(_currentReducers));
          return true;
        };
      }
      if (name === "removeReducer") {
        return reducerKey => {
          // 如果传入的reducerKey为null直接返回
          if (reducerKey == null) return false;
          // 拷贝一份当前的reducer
          let newReducers = Object.assign({}, _currentReducers);
          // 然后删除reducerKey相对应的reducer
          // 然后删除reducerKey相对应的state
          let allStates = target.getState();
          delete newReducers[reducerKey];
          _currentReducers = newReducers;
          delete allStates[reducerKey];
          // 使用原生函数替换旧的reducer
          target.replaceReducer(combineReducers(newReducers));
          return true;
        };
      }
      if (name === "replaceReducer") {
        return ({ reducerKey, reducer }) => {
          if (reducerKey == null)
            throw new Error(`reducerKey can not be null.`);
          let allStates = target.getState();
          if (_currentReducers[reducerKey] == null)
            throw new Error(`reducer for key [${reducerKey}] doesn't exsit.`);
          _currentReducers = Object.assign({}, _currentReducers, {
            [reducerKey]: reducer
          });
          target.replaceReducer(combineReducers(_currentReducers));
          return reducerKey;
        };
      }
      if (name === "removeAndAddReducer") {
        return ({ reducerKeyRemoved, reducerKeyAdded, reducer }) => {
          // 必须传入的两个参数
          if (reducerKeyRemoved == null || reducerKeyAdded == null)
            throw new Error(
              `reducerKeyRemoved or reducerKeyAdded can not be null.`
            );
          // 如果要删除的reducer不存在
          if (_currentReducers[reducerKeyRemoved] == null)
            throw new Error(
              `reducer of key [${reducerKeyRemoved}] doesn't exsit.`
            );
          let newReducers = Object.assign({}, _currentReducers);
          let allStates = target.getState();
          // 删除原来的reducer和原来的state
          delete allStates[reducerKeyRemoved];
          delete newReducers[reducerKeyRemoved];
          // 如果已经存在将要增加的key
          if (newReducers[reducerKeyAdded] != null)
            throw new Error(
              `reducer of key [${reducerKeyAdded}] already exsit.`
            );
          // 增加新reducer
          newReducers[reducerKeyAdded] = reducer;
          _currentReducers = newReducers;
          // 进行替换
          target.replaceReducer(combineReducers(newReducers));
          return reducerKeyAdded;
        };
      }
      return target[name];
    }
  };
  return new Proxy(store, handler);
}

export default function createEnhancedStore(reducers, initialState, enhencer) {
  // 利用原生方法先把 reducers, states, middleware传入
  let store = createStore(combineReducers(reducers), initialState, enhencer);
  // 再利用增加方法为store添加四种方法
  // 增加reducer
  // 移除reducer
  // 替换reducer
  // 同时移除和增加reducer
  return storeEnhancer(store, reducers);
}
