function bindArenaActionCreator(actionCreator, dispatch, sceneReducerKey) {
  // 劫持bindActionCreator，为每一个actionCreator生成的action添加sceneReducerKey
  // 且不预算多允许自己添加_sceneReducerKey
  return (...args) => {
    let action = actionCreator(...args);
    if (action && action._sceneReducerKey) {
      console.warn(
        '"Action with redux-arena should not contain an user specified "_sceneReducerKey" property.\n' +
          `Occurred in type: ${action.type}, _sceneReducerKey: ${_sceneReducerKey}.`
      );
    }
    typeof action === "object"
      ? dispatch(
          Object.assign({}, { _sceneReducerKey: sceneReducerKey }, action)
        )
      : dispatch(action);
  };
}

/**
 * Copy from redux/src/bindActionCreators.js, for binding scene pointer.
 * 
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */

//  生成一个actionCreators对象集合
export default function bindArenaActionCreators(
  actionCreators,
  dispatch,
  sceneReducerKey
) {
  if (typeof actionCreators === "function") {
    return bindArenaActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== "object" || actionCreators === null) {
    throw new Error(
      `bindArenaActionCreators expected an object or a function, instead received ${actionCreators ===
      null
        ? "null"
        : typeof actionCreators}. ` +
        `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    );
  }

  const keys = Object.keys(actionCreators);
  const boundActionCreators = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === "function") {
      boundActionCreators[key] = bindArenaActionCreator(
        actionCreator,
        dispatch,
        sceneReducerKey
      );
    }
  }
  return boundActionCreators;
}
