import {
  ARENA_SCENE_SET_STATE,
  ARENA_SCENE_REPLACE_STATE,
  ARENA_SCENE_SET_REND
} from "../actionTypes.js";
import getSceneInitState from "./getSceneInitState";

function sceneReducer(state = getSceneInitState(), action, sceneReducerKey) {
  if (action._sceneReducerKey !== sceneReducerKey) return state;
  switch (action.type) {
    case ARENA_SCENE_SET_STATE:
      return Object.assign({}, state, action.state);
    case ARENA_SCENE_REPLACE_STATE:
      return Object.assign({}, action.state);
    case ARENA_SCENE_SET_REND:
      return action.state;
    default:
      return state;
  }
}

// senceReducer生成器
// 可以传入一个扩展SenceReducer
// 调用形式
// let temp = {
//   type: ARENA_SCENE_SET_STATE,
//   _sceneReducerKey: "aaaaaaaaaaa",
//   state: {}
// }
export default function createSenceReducer(
  extendSenceReducer,
  sceneReducerKey,
  initState,
  arenaReducerDict
) {
  return function(state = initState, action) {
    //
    if (extendSenceReducer) {
      state = extendSenceReducer(state, action, sceneReducerKey);
    }
    return sceneReducer(state, action, sceneReducerKey);
  };
}
