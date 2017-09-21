import {
  ARENA_SWITCH_SET_STATE,
  ARENA_SWITCH_REPLACE_STATE
} from "../actionTypes.js";
import getSwitchInitState from "./getSwitchInitState";

function switchReducer(state, action, boundReducerKey) {
  switch (action.type) {
    case ARENA_SWITCH_SET_STATE:
      return Object.assign({}, state, action.state);
    case ARENA_SWITCH_REPLACE_STATE:
      return Object.assign({}, action.state);
    default:
      return state;
  }
}
// switchReducer生成器
export default function createSwitchReducer(boundReducerKey) {
  // 生成相应key的reducer
  // 当调用相应switchReducer时传入的action形式为
  // let temp = {
  //   type: ARENA_SWITCH_SET_STATE,
  //   _reducerKey: "aaaaaaaaaaa",
  //   state: {}
  // }
  return function(state = getSwitchInitState(), action) {
    if (boundReducerKey === action._reducerKey) {
      state = switchReducer(state, action, boundReducerKey);
    }
    return state;
  };
}
