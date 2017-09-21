import {
  ARENA_CURTAIN_SET_STATE,
  ARENA_CURTAIN_REPLACE_STATE
} from "../actionTypes.js";
import getCurtainInitState from "./getCurtainInitState";

function curtainReducer(state, action, boundReducerKey) {
  switch (action.type) {
    case ARENA_CURTAIN_SET_STATE:
      return Object.assign({}, state, action.state);
    case ARENA_CURTAIN_REPLACE_STATE:
      return Object.assign({}, action.state);
    default:
      return state;
  }
}
// curtainReducer生成器
// curtainReducer调用形式
// let temp = {
//   type: ARENA_CURTAIN_SET_STATE,
//   _reducerKey: "aaaaaaaaaaa",
//   state: {}
// }
export default function createCurtainReducer(boundReducerKey) {
  return function(state = getCurtainInitState(), action) {
    if (boundReducerKey === action._reducerKey) {
      state = curtainReducer(state, action, boundReducerKey);
    }
    return state;
  };
}
